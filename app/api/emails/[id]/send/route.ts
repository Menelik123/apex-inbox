import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { getGmailClient } from "@/lib/gmail";

function buildRawEmail(opts: {
  from: string;
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}) {
  const subject = opts.subject.toLowerCase().startsWith("re:")
    ? opts.subject
    : `Re: ${opts.subject}`;

  const lines = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    opts.body,
  ];

  return Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { draftId, body } = await req.json();

  const email = await prisma.email.findFirst({
    where: { id: params.id, emailAccount: { userId: session.user.id } },
    include: { emailAccount: true },
  });
  if (!email)
    return NextResponse.json({ error: "Email not found" }, { status: 404 });

  const draft = await prisma.draft.findFirst({
    where: { id: draftId, emailId: email.id },
  });
  if (!draft)
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });

  if (draft.sentAt)
    return NextResponse.json({ error: "Already sent" }, { status: 400 });

  const gmail = await getGmailClient(
    email.emailAccount.accessToken,
    email.emailAccount.refreshToken,
  );

  const raw = buildRawEmail({
    from: email.emailAccount.email,
    to: email.fromEmail,
    subject: email.subject,
    body: body ?? draft.body,
    threadId: email.threadId,
  });

  const sent = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw,
      threadId: email.threadId,
    },
  });

  await prisma.draft.update({
    where: { id: draft.id },
    data: { sentAt: new Date(), approved: true },
  });

  return NextResponse.json({ ok: true, gmailMessageId: sent.data.id });
}
