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

  const { question } = await req.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: "No question provided" }, { status: 400 });
  }

  const email = await prisma.email.findFirst({
    where: {
      id: params.id,
      emailAccount: { userId: session.user.id },
    },
  });

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const body = email.bodyText || email.snippet || "";

  const prompt = `You are an email assistant. The user is asking a question about the following email.

From: ${email.fromName || email.fromEmail} <${email.fromEmail}>
Subject: ${email.subject}
Body:
${body.slice(0, 1200)}

AI Summary: ${email.aiSummary || ""}
Category: ${email.category || ""}

User question: ${question}

Answer based only on what is actually in the email. If something is not stated in the email, say so clearly. Be concise — 2-4 sentences max.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const answer = (message.content[0] as any).text;

  return NextResponse.json({ answer });
}
