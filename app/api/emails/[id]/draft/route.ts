import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = await prisma.email.findFirst({
    where: {
      id: params.id,
      emailAccount: { userId: session.user.id },
    },
    include: { emailAccount: true },
  });

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const body = email.bodyText || email.snippet || "";
  const accountEmail = email.emailAccount.email;

  const prompt = `You are a professional email assistant for ${accountEmail}. Write a reply to the email below.

From: ${email.fromName || email.fromEmail} <${email.fromEmail}>
Subject: ${email.subject}
Body:
${body.slice(0, 1200)}

Write a concise, professional reply. Match the tone of the original email. Do not include a subject line or "Re:" prefix. Do not include any preamble like "Here is a draft" — output only the email body text itself. Sign off with the account holder's first name only.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const draftBody = (message.content[0] as any).text;

  const draft = await prisma.draft.create({
    data: {
      emailId: email.id,
      body: draftBody,
    },
  });

  return NextResponse.json({ draftId: draft.id, body: draftBody });
}
