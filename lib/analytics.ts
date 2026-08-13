/**
 * Analytics abstraction layer.
 * Becomes a no-op when no provider is configured.
 * Never include email bodies, subjects, sender addresses,
 * OAuth tokens, or AI prompt content as event properties.
 */

export type AnalyticsEvent =
  | "homepage_primary_cta_clicked"
  | "pricing_cta_clicked"
  | "gmail_connection_started"
  | "gmail_connection_completed"
  | "first_sync_completed"
  | "sync_completed"
  | "email_opened"
  | "category_changed"
  | "draft_generated"
  | "draft_copied"
  | "draft_discarded"
  | "gmail_send_completed"
  | "gmail_send_failed"
  | "follow_up_scheduled"
  | "ask_ai_completed"
  | "ask_ai_failed"
  | "email_archived"
  | "email_marked_read"
  | "search_performed"
  | "action_failed";

type SafeProperties = Record<string, string | number | boolean | undefined>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function track(
  event: AnalyticsEvent,
  properties?: SafeProperties,
): void {
  if (!isBrowser()) return;

  try {
    // Plausible
    if (typeof (window as any).plausible === "function") {
      (window as any).plausible(event, { props: properties });
      return;
    }

    // PostHog
    if (typeof (window as any).posthog?.capture === "function") {
      (window as any).posthog.capture(event, properties);
      return;
    }

    // Dev: log to console only in development
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, properties);
    }
  } catch {
    // Never block product functionality due to analytics failure
  }
}
