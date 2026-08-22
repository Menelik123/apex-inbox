import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const followUp = await prisma.followUp.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!followUp)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.followUp.update({
    where: { id: params.id },
    data: {
      ...(body.dueAt !== undefined ? { dueAt: new Date(body.dueAt) } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      ...(body.complete === true ? { completedAt: new Date() } : {}),
      ...(body.complete === false ? { completedAt: null } : {}),
    },
  });

  return NextResponse.json({ ok: true, followUp: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const followUp = await prisma.followUp.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!followUp)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.followUp.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
