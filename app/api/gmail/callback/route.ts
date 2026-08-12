import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getGmailOAuthClient } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=no_code", req.url));
  }

  try {
    const oauth2Client = getGmailOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      return NextResponse.redirect(new URL("/dashboard/settings?error=no_email", req.url));
    }

    await prisma.emailAccount.upsert({
      where: {
        userId_email: {
          userId: session.user.id,
          email: userInfo.email,
        },
      },
      create: {
        userId: session.user.id,
        provider: "gmail",
        email: userInfo.email,
        displayName: userInfo.name ?? userInfo.email,
        accessToken: tokens.access_token ?? "",
        refreshToken: tokens.refresh_token ?? "",
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
        scope: tokens.scope ?? "",
        isActive: true,
      },
      update: {
        accessToken: tokens.access_token ?? "",
        refreshToken: tokens.refresh_token ?? "",
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
        isActive: true,
      },
    });

    return NextResponse.redirect(new URL("/dashboard/settings?connected=gmail", req.url));
  } catch (error) {
    console.error("Gmail OAuth callback error:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=auth_failed", req.url));
  }
}
