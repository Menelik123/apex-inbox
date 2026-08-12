import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const followUps = await prisma.followUp.findMany({
    where: { userId: session.user.id, completedAt: null },
    orderBy: { dueAt: "asc" },
    take: 50,
    select: {
      id: true,
      contactEmail: true,
      contactName: true,
      subject: true,
      notes: true,
      dueAt: true,
      state: true,
    },
  });

  return NextResponse.json({ followUps });
}
