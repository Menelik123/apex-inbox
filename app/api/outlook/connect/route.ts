import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { getOutlookAuthUrl } from "@/lib/outlook";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = getOutlookAuthUrl();
  return NextResponse.redirect(url);
}
