import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { categorizeEmail } from "@/lib/ai-categorize";
import { prisma } from "@/lib/db";
import {
  extractOutlookBody,
  listOutlookInboxMessages,
  refreshOutlookToken,
} from "@/lib/outlook";

export const maxDuration = 300;

const INITIAL_LOOKBACK_DAYS = 14;
const MAX_INITIAL = 50;
const MAX_INCREMENTAL = 25;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const emailAccounts = await prisma.emailAccount.findMany({
    where: { userId, isActive: true, provider: "outlook" },
  });

  if (emailAccounts.length === 0) {
    return NextResponse.json({ success: true, results: [] });
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
      const isInitialSync = !account.lastSyncAt;
      const maxToProcess = isInitialSync ? MAX_INITIAL : MAX_INCREMENTAL;

      // Refresh token if close to expiry
      let accessToken = account.accessToken;
      if (new Date(account.expiresAt).getTime() - Date.now() < 5 * 60 * 1000) {
        const refreshed = await refreshOutlookToken(account.refreshToken);
        accessToken = refreshed.access_token;
        await prisma.emailAccount.update({
          where: { id: account.id },
          data: {
            accessToken: refreshed.access_token,
            refreshToken: refreshed.refresh_token ?? account.refreshToken,
            expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
          },
        });
      }

      const afterDate = new Date();
      afterDate.setDate(
        afterDate.getDate() - (isInitialSync ? INITIAL_LOOKBACK_DAYS : 2),
      );

      // Collect message IDs until we have enough candidates
      const allMessages: Array<{
        id: string;
        conversationId: string;
        subject: string;
        from: any;
        receivedDateTime: string;
        isRead: boolean;
        bodyPreview: string;
        body: any;
      }> = [];
      let skipToken: string | undefined;
      const idCap = isInitialSync ? 400 : 150;

      do {
        const { messages, nextSkipToken } = await listOutlookInboxMessages(
          accessToken,
          afterDate,
          50,
          skipToken,
        );
        allMessages.push(...messages);
        skipToken = nextSkipToken;
      } while (skipToken && allMessages.length < idCap);

      // Bulk check which message IDs are already in DB
      const allIds = allMessages.map((m) => m.id);
      const existingSet = new Set(
        (
          await prisma.email.findMany({
            where: { emailAccountId: account.id, messageId: { in: allIds } },
            select: { messageId: true },
          })
        ).map((e) => e.messageId),
      );

      const unseen = allMessages.filter((m) => !existingSet.has(m.id));
      const toProcess = unseen.slice(0, maxToProcess);
      const hasMore = unseen.length > maxToProcess;

      let synced = 0;
      const skipped = existingSet.size;

      for (const msg of toProcess) {
        const fromName = msg.from?.emailAddress?.name ?? null;
        const fromEmail = msg.from?.emailAddress?.address ?? "";
        const fromRaw = fromName ? `${fromName} <${fromEmail}>` : fromEmail;
        const subject = msg.subject || "(no subject)";
        const receivedAt = new Date(msg.receivedDateTime);
        const bodyText = extractOutlookBody(msg);
        const snippet = msg.bodyPreview ?? bodyText.slice(0, 200);

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

        await prisma.email.create({
          data: {
            emailAccountId: account.id,
            messageId: msg.id,
            threadId: msg.conversationId ?? msg.id,
            fromName,
            fromEmail,
            subject,
            bodyText: bodyText || null,
            bodyHtml: null,
            snippet,
            receivedAt,
            isRead: msg.isRead,
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
      console.error(`Outlook sync failed for ${account.email}:`, err);
      results.push({ email: account.email, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}
