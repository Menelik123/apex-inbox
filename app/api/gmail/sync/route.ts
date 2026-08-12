import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getGmailClient, parseEmailBody, extractHeader } from "@/lib/gmail";
import { categorizeEmail } from "@/lib/ai-categorize";

export const maxDuration = 60;

const MAX_TO_PROCESS = 20; // AI calls per sync run

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

  const results: Array<{ email: string; synced?: number; skipped?: number; hasMore?: boolean; error?: string }> = [];

  for (const account of emailAccounts) {
    try {
      const gmail = await getGmailClient(account.accessToken, account.refreshToken);

      // Collect message IDs from Gmail inbox — no time filter, DB handles dedup
      const allMessageIds: string[] = [];
      let pageToken: string | undefined = undefined;

      // Collect enough IDs to find MAX_TO_PROCESS unseen ones
      do {
        const listRes = await gmail.users.messages.list({
          userId: "me",
          q: "in:inbox",
          maxResults: 50,
          ...(pageToken ? { pageToken } : {}),
        });

        for (const m of listRes.data.messages ?? []) {
          if (m.id) allMessageIds.push(m.id);
        }

        pageToken = listRes.data.nextPageToken ?? undefined;

        // Check how many we already have vs how many we've collected
        if (allMessageIds.length >= 200) break; // safety cap per run
      } while (pageToken && allMessageIds.length < 100);

      // Bulk check which ones are already in DB
      const existingSet = new Set(
        (await prisma.email.findMany({
          where: { emailAccountId: account.id, messageId: { in: allMessageIds } },
          select: { messageId: true },
        })).map((e) => e.messageId)
      );

      const toFetch = allMessageIds.filter((id) => !existingSet.has(id)).slice(0, MAX_TO_PROCESS);
      const hasMore = allMessageIds.filter((id) => !existingSet.has(id)).length > MAX_TO_PROCESS;

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

      await prisma.emailAccount.update({
        where: { id: account.id },
        data: { lastSyncAt: new Date() },
      });

      results.push({ email: account.email, synced, skipped, hasMore });
    } catch (err) {
      console.error(`Sync failed for account ${account.email}:`, err);
      results.push({ email: account.email, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}
