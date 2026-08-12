import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getGmailClient, parseEmailBody, extractHeader } from "@/lib/gmail";
import { categorizeEmail } from "@/lib/ai-categorize";

export const maxDuration = 60;

const BATCH_SIZE = 25;        // per page from Gmail
const MAX_TO_PROCESS = 25;    // AI categorization limit per sync call (keep under timeout)
const LOOKBACK_DAYS = 30;     // first-sync window

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
    return NextResponse.json({ error: "No connected email accounts" }, { status: 400 });
  }

  const results: Array<{ email: string; synced?: number; skipped?: number; error?: string }> = [];

  for (const account of emailAccounts) {
    try {
      const gmail = await getGmailClient(account.accessToken, account.refreshToken);

      const after = account.lastSyncAt
        ? Math.floor(account.lastSyncAt.getTime() / 1000)
        : Math.floor((Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000) / 1000);

      // Collect all message IDs across pages first
      const allMessageIds: string[] = [];
      let pageToken: string | undefined = undefined;

      do {
        const listRes = await gmail.users.messages.list({
          userId: "me",
          q: `after:${after} in:inbox`,
          maxResults: BATCH_SIZE,
          ...(pageToken ? { pageToken } : {}),
        });

        const msgs = listRes.data.messages ?? [];
        for (const m of msgs) {
          if (m.id) allMessageIds.push(m.id);
        }

        pageToken = listRes.data.nextPageToken ?? undefined;

        // Stop collecting IDs once we have enough to process this call
        if (allMessageIds.length >= MAX_TO_PROCESS * 2) break;
      } while (pageToken);

      // Filter out already-synced messages
      const existingIds = new Set(
        (await prisma.email.findMany({
          where: { emailAccountId: account.id, messageId: { in: allMessageIds } },
          select: { messageId: true },
        })).map((e) => e.messageId)
      );

      const toFetch = allMessageIds.filter((id) => !existingIds.has(id)).slice(0, MAX_TO_PROCESS);

      let synced = 0;
      const skipped = allMessageIds.length - toFetch.length;

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

        const fromMatch = fromRaw.match(/^(.*?)\s*<(.+?)>$/) ?? [null, null, fromRaw];
        const fromName = fromMatch[1]?.trim() || null;
        const fromEmail = fromMatch[2]?.trim() || fromRaw;

        const { text: bodyText, html: bodyHtml } = parseEmailBody(payload ?? {});
        const snippet = full.data.snippet ?? "";

        let aiResult;
        try {
          aiResult = await categorizeEmail(fromRaw, subject, bodyText || snippet);
        } catch {
          aiResult = {
            category: "ADMIN" as const,
            summary: snippet,
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

      // Only advance lastSyncAt if we've caught up (no more new messages to pull)
      const hasMore = toFetch.length === MAX_TO_PROCESS && allMessageIds.filter((id) => !existingIds.has(id)).length > MAX_TO_PROCESS;
      if (!hasMore) {
        await prisma.emailAccount.update({
          where: { id: account.id },
          data: { lastSyncAt: new Date() },
        });
      }

      results.push({ email: account.email, synced, skipped });
    } catch (err) {
      console.error(`Sync failed for account ${account.email}:`, err);
      results.push({ email: account.email, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}
