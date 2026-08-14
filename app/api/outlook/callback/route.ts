import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { exchangeOutlookCode, getOutlookUserInfo } from "@/lib/outlook";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=outlook_denied", req.url),
    );
  }

  try {
    const tokens = await exchangeOutlookCode(code);
    const userInfo = await getOutlookUserInfo(tokens.access_token);

    if (!userInfo.mail) {
      return NextResponse.redirect(
        new URL("/dashboard/settings?error=no_email", req.url),
      );
    }

    await prisma.emailAccount.upsert({
      where: {
        userId_email: {
          userId: session.user.id,
          email: userInfo.mail,
        },
      },
      create: {
        userId: session.user.id,
        provider: "outlook",
        email: userInfo.mail,
        displayName: userInfo.displayName || userInfo.mail,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
        isActive: true,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        isActive: true,
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard/settings?connected=outlook", req.url),
    );
  } catch (error) {
    console.error("Outlook OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=auth_failed", req.url),
    );
  }
}
