import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

const CATEGORY_MAP: Record<string, string> = {
  HOT_LEAD: "hot-leads",
  NEEDS_RESPONSE: "needs-response",
  CLIENT_FOLLOWUP: "client-followups",
  ADMIN: "admin",
  NOISE: "noise",
};

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const category = req.nextUrl.searchParams.get("category") ?? "all";
  const q = req.nextUrl.searchParams.get("q") ?? "";

  const emailAccounts = await prisma.emailAccount.findMany({
    where: { userId: session.user.id, isActive: true },
    select: { id: true },
  });

  if (emailAccounts.length === 0) {
    return NextResponse.json({ emails: [], hasAccounts: false });
  }

  const accountIds = emailAccounts.map((a) => a.id);

  // Map URL category slug back to DB enum
  const dbCategory = Object.entries(CATEGORY_MAP).find(
    ([, v]) => v === category,
  )?.[0];

  const PRIORITY_ORDER = [
    "HOT_LEAD",
    "NEEDS_RESPONSE",
    "CLIENT_FOLLOWUP",
    "ADMIN",
    "NOISE",
  ];

  const baseWhere = {
    emailAccountId: { in: accountIds },
    isArchived: false,
    ...(dbCategory ? { category: dbCategory as any } : {}),
  };

  let emails;
  if (q) {
    // Run two passes: header matches (sender + subject) first, then body matches
    const [headerMatches, bodyMatches] = await Promise.all([
      prisma.email.findMany({
        where: {
          ...baseWhere,
          OR: [
            { fromEmail: { contains: q, mode: "insensitive" } },
            { fromName: { contains: q, mode: "insensitive" } },
            { subject: { contains: q, mode: "insensitive" } },
          ],
        },
        orderBy: { receivedAt: "desc" },
        take: 50,
        select: {
          id: true,
          messageId: true,
          fromName: true,
          fromEmail: true,
          subject: true,
          snippet: true,
          bodyText: true,
          receivedAt: true,
          isRead: true,
          category: true,
          aiSummary: true,
          aiAction: true,
          aiWhy: true,
          aiConfidence: true,
        },
      }),
      prisma.email.findMany({
        where: {
          ...baseWhere,
          OR: [
            { snippet: { contains: q, mode: "insensitive" } },
            { bodyText: { contains: q, mode: "insensitive" } },
          ],
        },
        orderBy: { receivedAt: "desc" },
        take: 50,
        select: {
          id: true,
          messageId: true,
          fromName: true,
          fromEmail: true,
          subject: true,
          snippet: true,
          bodyText: true,
          receivedAt: true,
          isRead: true,
          category: true,
          aiSummary: true,
          aiAction: true,
          aiWhy: true,
          aiConfidence: true,
        },
      }),
    ]);
    // Merge: header matches first, then body-only matches (deduplicated)
    const seen = new Set(headerMatches.map((e) => e.id));
    emails = [
      ...headerMatches,
      ...bodyMatches.filter((e) => !seen.has(e.id)),
    ].slice(0, 100);
  } else {
    emails = await prisma.email.findMany({
      where: baseWhere,
      orderBy: { receivedAt: "desc" },
      take: 100,
      select: {
        id: true,
        messageId: true,
        fromName: true,
        fromEmail: true,
        subject: true,
        snippet: true,
        bodyText: true,
        receivedAt: true,
        isRead: true,
        category: true,
        aiSummary: true,
        aiAction: true,
        aiWhy: true,
        aiConfidence: true,
      },
    });
  }

  // When showing all emails, sort by priority category first, then date
  if (!dbCategory && !q) {
    emails.sort((a, b) => {
      const aPriority = PRIORITY_ORDER.indexOf(a.category ?? "ADMIN");
      const bPriority = PRIORITY_ORDER.indexOf(b.category ?? "ADMIN");
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.receivedAt.getTime() - a.receivedAt.getTime();
    });
  }

  const formatted = emails.map((e) => ({
    id: e.id,
    messageId: e.messageId,
    from: e.fromName || e.fromEmail,
    email: e.fromEmail,
    subject: e.subject,
    preview: decodeEntities(e.snippet || e.bodyText?.slice(0, 200) || ""),
    body: e.bodyText ? decodeEntities(e.bodyText) : null,
    summary: e.aiSummary || "",
    action: e.aiAction || "Review manually",
    why: e.aiWhy || "",
    category: CATEGORY_MAP[e.category ?? "ADMIN"] ?? "admin",
    confidence: e.aiConfidence ?? 0,
    time: formatTime(e.receivedAt),
    read: e.isRead,
  }));

  return NextResponse.json({ emails: formatted, hasAccounts: true });
}

function decodeEntities(str: string): string {
  return (
    str
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&hellip;/g, "...")
      .replace(/&mdash;/g, "-")
      .replace(/&ndash;/g, "-")
      .replace(/&#\d+;/g, "") // remaining numeric entities
      // Zero-width and invisible Unicode used by newsletter trackers
      .replace(
        /[\u034F\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g,
        "",
      )
      .replace(/\s{3,}/g, "  ") // collapse excessive whitespace
      .trim()
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (days === 1) return "Yesterday";
  if (days < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
