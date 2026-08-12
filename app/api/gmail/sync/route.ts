import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getGmailClient, parseEmailBody, extractHeader } from "@/lib/gmail";
import { categorizeEmail } from "@/lib/ai-categorize";

const MAX_EMAILS_PER_SYNC = 50;

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

  const results = [];

  for (const account of emailAccounts) {
    try {
      const gmail = await getGmailClient(account.accessToken, account.refreshToken);

      // Fetch messages since last sync (or last 7 days if first sync)
      const after = account.lastSyncAt
        ? Math.floor(account.lastSyncAt.getTime() / 1000)
        : Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);

      const listRes = await gmail.users.messages.list({
        userId: "me",
        q: `after:${after} in:inbox`,
        maxResults: MAX_EMAILS_PER_SYNC,
      });

      const messages = listRes.data.messages ?? [];
      let synced = 0;
      let skipped = 0;

      for (const msg of messages) {
        if (!msg.id) continue;

        // Skip if already in DB
        const existing = await prisma.email.findUnique({
          where: { emailAccountId_messageId: { emailAccountId: account.id, messageId: msg.id } },
        });
        if (existing) { skipped++; continue; }

        const full = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "full",
        });

        const payload = full.data.payload;
        const headers = payload?.headers ?? [];

        const fromRaw = extractHeader(headers, "from");
        const subject = extractHeader(headers, "subject") || "(no subject)";
        const dateStr = extractHeader(headers, "date");
        const receivedAt = dateStr ? new Date(dateStr) : new Date();

        // Parse from name + email
        const fromMatch = fromRaw.match(/^(.*?)\s*<(.+?)>$/) ?? [null, null, fromRaw];
        const fromName = fromMatch[1]?.trim() || null;
        const fromEmail = fromMatch[2]?.trim() || fromRaw;

        const { text: bodyText, html: bodyHtml } = parseEmailBody(payload ?? {});
        const snippet = full.data.snippet ?? "";

        // AI categorization
        const bodySnippet = bodyText || snippet;
        let aiResult;
        try {
          aiResult = await categorizeEmail(fromRaw, subject, bodySnippet);
        } catch (aiErr) {
          console.error("AI categorization failed for message", msg.id, aiErr);
          aiResult = {
            category: "ADMIN" as const,
            summary: snippet,
            action: "Review manually",
            why: "AI categorization unavailable",
            confidence: 0,
          };
        }

        const labelIds = full.data.labelIds ?? [];
        const isRead = !labelIds.includes("UNREAD");

        await prisma.email.create({
          data: {
            emailAccountId: account.id,
            messageId: msg.id,
            threadId: full.data.threadId ?? msg.id,
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

      results.push({ email: account.email, synced, skipped });
    } catch (err) {
      console.error(`Sync failed for account ${account.email}:`, err);
      results.push({ email: account.email, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, results });
}
