import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGmailAuthUrl } from "@/lib/gmail";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = getGmailAuthUrl();
  return NextResponse.redirect(url);
}
