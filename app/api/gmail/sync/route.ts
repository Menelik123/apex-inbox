import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { categorizeEmail } from "@/lib/ai-categorize";
import { prisma } from "@/lib/db";
import { extractHeader, getGmailClient, parseEmailBody } from "@/lib/gmail";

export const maxDuration = 300;

// Initial sync: reach back 14 days, process more emails
const INITIAL_LOOKBACK_DAYS = 14;
const MAX_INITIAL = 50;
const MAX_INCREMENTAL = 25;

function gmailDateFilter(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const emailAccounts = await prisma.emailAccount.findMany({
    where: { userId, isActive: true },
  });

  if (emailAccounts.length === 0) {
    return NextResponse.json(
      { error: "No connected email accounts" },
      { status: 400 },
    );
  }

  const results: Array<{
    email: string;
    synced?: number;
    skipped?: number;
    hasMore?: boolean;
    isInitialSync?: boolean;
    error?: string;
  }> = [];

  for (const account of emailAccounts) {
    try {
      const gmail = await getGmailClient(
        account.accessToken,
        account.refreshToken,
      );

      const isInitialSync = !account.lastSyncAt;
      const maxToProcess = isInitialSync ? MAX_INITIAL : MAX_INCREMENTAL;

      // For initial sync, use a date filter so we reach back 14 days.
      // For incremental syncs, no date filter — DB dedup handles the rest.
      const queryBase = isInitialSync
        ? `in:inbox after:${gmailDateFilter(INITIAL_LOOKBACK_DAYS)}`
        : "in:inbox";

      // Collect message IDs — paginate until we have enough candidates
      const allMessageIds: string[] = [];
      let pageToken: string | undefined = undefined;
      const idCap = isInitialSync ? 400 : 150;

      do {
        const listRes = await gmail.users.messages.list({
          userId: "me",
          q: queryBase,
          maxResults: 50,
          ...(pageToken ? { pageToken } : {}),
        });

        for (const m of listRes.data.messages ?? []) {
          if (m.id) allMessageIds.push(m.id);
        }

        pageToken = listRes.data.nextPageToken ?? undefined;
      } while (pageToken && allMessageIds.length < idCap);

      // Bulk check which IDs are already in DB
      const existingSet = new Set(
        (
          await prisma.email.findMany({
            where: {
              emailAccountId: account.id,
              messageId: { in: allMessageIds },
            },
            select: { messageId: true },
          })
        ).map((e) => e.messageId),
      );

      const unseen = allMessageIds.filter((id) => !existingSet.has(id));
      const toFetch = unseen.slice(0, maxToProcess);
      const hasMore = unseen.length > maxToProcess;

      let synced = 0;
      const skipped = existingSet.size;

      for (const msgId of toFetch) {
        const full = await gmail.users.messages.get({
          userId: "me",
          id: msgId,
          format: "full",
        });

        const payload = full.data.payload;
        const headers = payload?.headers ?? [];

        const fromRaw = extractHeader(headers, "from");
        const subject = extractHeader(headers, "subject") || "(no subject)";
        const dateStr = extractHeader(headers, "date");
        const receivedAt = dateStr ? new Date(dateStr) : new Date();

        const fromMatch = fromRaw.match(/^(.*?)\s*<(.+?)>$/) ?? [
          null,
          null,
          fromRaw,
        ];
        const fromName = fromMatch[1]?.trim() || null;
        const fromEmail = fromMatch[2]?.trim() || fromRaw;

        const { text: bodyText, html: bodyHtml } = parseEmailBody(
          payload ?? {},
        );
        const snippet = full.data.snippet ?? "";

        let aiResult;
        try {
          aiResult = await categorizeEmail(
            fromRaw,
            subject,
            bodyText || snippet,
          );
        } catch {
          aiResult = {
            category: "ADMIN" as const,
            summary: snippet.slice(0, 500),
            action: "Review manually",
            why: "AI categorization unavailable",
            confidence: 0,
          };
        }

        const isRead = !(full.data.labelIds ?? []).includes("UNREAD");

        await prisma.email.create({
          data: {
            emailAccountId: account.id,
            messageId: msgId,
            threadId: full.data.threadId ?? msgId,
            fromName,
            fromEmail,
            subject,
            bodyText: bodyText || null,
            bodyHtml: bodyHtml || null,
            snippet,
            receivedAt,
            isRead,
            category: aiResult.category,
            aiSummary: aiResult.summary,
            aiAction: aiResult.action,
            aiWhy: aiResult.why,
            aiConfidence: aiResult.confidence,
          },
        });

        synced++;
      }

      await prisma.emailAccount.update({
        where: { id: account.id },
        data: { lastSyncAt: new Date() },
      });

      results.push({
        email: account.email,
        synced,
        skipped,
        hasMore,
        isInitialSync,
      });
    } catch (err) {
      console.error(`Sync failed for account ${account.email}:`, err);
      results.push({ email: account.email, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}
