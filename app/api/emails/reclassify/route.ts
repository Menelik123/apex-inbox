import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { categorizeEmail } from "@/lib/ai-categorize";
import { prisma } from "@/lib/db";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accountIds = (
    await prisma.emailAccount.findMany({
      where: { userId: session.user.id, isActive: true },
      select: { id: true },
    })
  ).map((a) => a.id);

  // Find emails that failed AI categorization (confidence = 0)
  const toReclassify = await prisma.email.findMany({
    where: {
      emailAccountId: { in: accountIds },
      aiConfidence: 0,
    },
    take: 10,
    select: {
      id: true,
      fromEmail: true,
      fromName: true,
      subject: true,
      bodyText: true,
      snippet: true,
    },
  });

  const remaining = await prisma.email.count({
    where: { emailAccountId: { in: accountIds }, aiConfidence: 0 },
  });

  let processed = 0;
  for (const email of toReclassify) {
    try {
      const bodySnippet = email.bodyText?.slice(0, 800) || email.snippet || "";
      const fromRaw = email.fromName
        ? `${email.fromName} <${email.fromEmail}>`
        : email.fromEmail;
      const result = await categorizeEmail(fromRaw, email.subject, bodySnippet);
      await prisma.email.update({
        where: { id: email.id },
        data: {
          category: result.category,
          aiSummary: result.summary,
          aiAction: result.action,
          aiWhy: result.why,
          aiConfidence: result.confidence,
        },
      });
      processed++;
    } catch {
      // skip this one
    }
  }

  return NextResponse.json({ processed, remaining: remaining - processed });
}
