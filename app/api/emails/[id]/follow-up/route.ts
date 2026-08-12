import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { dueAt, notes } = await req.json();
  if (!dueAt)
    return NextResponse.json({ error: "dueAt required" }, { status: 400 });

  const email = await prisma.email.findFirst({
    where: { id: params.id, emailAccount: { userId: session.user.id } },
  });
  if (!email)
    return NextResponse.json({ error: "Email not found" }, { status: 404 });

  const followUp = await prisma.followUp.create({
    data: {
      userId: session.user.id,
      contactEmail: email.fromEmail,
      contactName: email.fromName ?? null,
      subject: email.subject,
      notes: notes || null,
      dueAt: new Date(dueAt),
      state: "AWAITING_OUR_RESPONSE",
    },
  });

  // Link the email to this follow-up
  await prisma.email.update({
    where: { id: email.id },
    data: { followUpId: followUp.id },
  });

  return NextResponse.json({ ok: true, followUpId: followUp.id });
}
