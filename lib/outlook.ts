const TENANT = "common";
const GRAPH = "https://graph.microsoft.com/v1.0";

export function getOutlookAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/outlook/callback`,
    scope:
      "openid email profile offline_access Mail.ReadWrite Mail.Send User.Read",
    response_mode: "query",
    prompt: "select_account",
  });
  return `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize?${params}`;
}

export async function exchangeOutlookCode(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}> {
  const body = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    code,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/outlook/callback`,
    grant_type: "authorization_code",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Outlook token exchange failed: ${err}`);
  }

  return res.json();
}

export async function refreshOutlookToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const body = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: "Mail.ReadWrite Mail.Send User.Read offline_access",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Outlook token refresh failed: ${err}`);
  }

  return res.json();
}

export async function getOutlookUserInfo(accessToken: string): Promise<{
  mail: string;
  displayName: string;
}> {
  const res = await fetch(
    `${GRAPH}/me?$select=mail,displayName,userPrincipalName`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch Outlook user info");
  const data = await res.json();
  return {
    mail: data.mail ?? data.userPrincipalName ?? "",
    displayName: data.displayName ?? "",
  };
}

export interface OutlookMessage {
  id: string;
  conversationId: string;
  subject: string;
  from: { emailAddress: { name: string; address: string } };
  receivedDateTime: string;
  isRead: boolean;
  bodyPreview: string;
  body: { contentType: "html" | "text"; content: string };
}

export async function listOutlookInboxMessages(
  accessToken: string,
  afterDate: Date,
  top = 50,
  skipToken?: string,
): Promise<{ messages: OutlookMessage[]; nextSkipToken?: string }> {
  const filter = `receivedDateTime ge ${afterDate.toISOString()}`;
  const select =
    "id,conversationId,subject,from,receivedDateTime,isRead,bodyPreview,body";
  const orderby = "receivedDateTime desc";

  let url = `${GRAPH}/me/mailFolders/inbox/messages?$filter=${encodeURIComponent(filter)}&$select=${select}&$orderby=${encodeURIComponent(orderby)}&$top=${top}`;
  if (skipToken) url += `&$skiptoken=${encodeURIComponent(skipToken)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'outlook.body-content-type="text"',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Outlook messages list failed: ${err}`);
  }

  const data = await res.json();
  const messages: OutlookMessage[] = data.value ?? [];

  // Extract skip token from @odata.nextLink if present
  const nextLink: string | undefined = data["@odata.nextLink"];
  let nextSkipToken: string | undefined;
  if (nextLink) {
    const match = nextLink.match(/\$skiptoken=([^&]+)/);
    nextSkipToken = match ? decodeURIComponent(match[1]) : undefined;
  }

  return { messages, nextSkipToken };
}

export function extractOutlookBody(msg: OutlookMessage): string {
  if (!msg.body?.content) return msg.bodyPreview ?? "";
  if (msg.body.contentType === "text") return msg.body.content;
  // Strip HTML tags for plain text
  return msg.body.content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{3,}/g, "  ")
    .trim();
}
