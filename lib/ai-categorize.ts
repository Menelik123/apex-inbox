import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type CategoryResult = {
  category: "HOT_LEAD" | "NEEDS_RESPONSE" | "CLIENT_FOLLOWUP" | "ADMIN" | "NOISE";
  summary: string;
  action: string;
  why: string;
  confidence: number;
};

export async function categorizeEmail(
  from: string,
  subject: string,
  bodySnippet: string,
  businessContext = "life insurance coaching and sales training"
): Promise<CategoryResult> {
  const prompt = `You are an AI email assistant for a ${businessContext} business. Analyze this email and respond with a JSON object only.

From: ${from}
Subject: ${subject}
Body (first 800 chars): ${bodySnippet.slice(0, 800)}

Categorize into exactly one category:
- HOT_LEAD: New prospect interested in becoming a client or agent
- NEEDS_RESPONSE: Email requiring a reply that has not been answered
- CLIENT_FOLLOWUP: Existing client or agent checking in, asking questions, or updating you
- ADMIN: Automated notifications, billing, statements, scheduling, logistics
- NOISE: Newsletters, promotions, social media alerts, mass marketing

Respond with this exact JSON structure:
{
  "category": "HOT_LEAD" | "NEEDS_RESPONSE" | "CLIENT_FOLLOWUP" | "ADMIN" | "NOISE",
  "summary": "One or two sentences explaining what this email is about and why it matters.",
  "action": "One clear recommended action for the recipient.",
  "why": "One sentence explaining the specific signals that led to this category classification.",
  "confidence": 0.0 to 1.0
}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as any).text;
  const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? text);
  return json as CategoryResult;
}
