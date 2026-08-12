import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

const VALID_CATEGORIES = [
  "HOT_LEAD",
  "NEEDS_RESPONSE",
  "CLIENT_FOLLOWUP",
  "ADMIN",
  "NOISE",
];

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category } = await req.json();
  if (!VALID_CATEGORIES.includes(category))
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });

  const email = await prisma.email.findFirst({
    where: { id: params.id, emailAccount: { userId: session.user.id } },
  });
  if (!email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.email.update({
    where: { id: params.id },
    data: { category: category as any, aiConfidence: 1 },
  });

  return NextResponse.json({ ok: true });
}
