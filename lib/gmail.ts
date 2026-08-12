import { google } from "googleapis";

export function getGmailOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`
  );
}

export function getGmailAuthUrl() {
  const oauth2Client = getGmailOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
}

export async function getGmailClient(accessToken: string, refreshToken: string) {
  const oauth2Client = getGmailOAuthClient();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return google.gmail({ version: "v1", auth: oauth2Client });
}

export function parseEmailBody(payload: any): { text: string; html: string } {
  let text = "";
  let html = "";

  function decode(data: string) {
    return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  }

  function walkParts(parts: any[]) {
    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        text = decode(part.body.data);
      } else if (part.mimeType === "text/html" && part.body?.data) {
        html = decode(part.body.data);
      } else if (part.parts) {
        walkParts(part.parts);
      }
    }
  }

  if (payload.body?.data) {
    text = decode(payload.body.data);
  } else if (payload.parts) {
    walkParts(payload.parts);
  }

  return { text, html };
}

export function extractHeader(headers: any[], name: string): string {
  return headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}
