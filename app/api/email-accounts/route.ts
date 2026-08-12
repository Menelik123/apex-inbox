import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.emailAccount.findMany({
    where: { userId: session.user.id, isActive: true },
    select: {
      id: true,
      email: true,
      displayName: true,
      provider: true,
      lastSyncAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ accounts });
}
