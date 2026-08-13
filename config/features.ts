export type FeatureStatus = "shipped" | "beta" | "coming_soon";

export interface Feature {
  label: string;
  status: FeatureStatus;
  note?: string;
}

export const FEATURES = {
  // Core AI
  aiCategorization: {
    label: "AI Email Categorization",
    status: "shipped",
  } as Feature,
  aiSummary: {
    label: "AI Email Summaries",
    status: "shipped",
  } as Feature,
  askAi: {
    label: "Ask AI on Any Email",
    status: "shipped",
  } as Feature,
  draftReply: {
    label: "AI Draft Reply Generation",
    status: "shipped",
  } as Feature,
  sendViaGmail: {
    label: "Send Reply via Gmail",
    status: "shipped",
  } as Feature,

  // Inbox actions (Apex-local)
  archiveLocal: {
    label: "Archive Emails (Apex view)",
    status: "shipped",
    note: "Removes from Apex view. Email remains in Gmail inbox.",
  } as Feature,
  markReadLocal: {
    label: "Mark Read/Unread (Apex view)",
    status: "shipped",
    note: "Tracked locally in Apex. Not synced back to Gmail.",
  } as Feature,
  categoryCorrection: {
    label: "Manual Category Correction",
    status: "shipped",
  } as Feature,
  smartSync: {
    label: "Smart Sync (manual trigger)",
    status: "shipped",
    note: "Triggered manually. Auto-paginates through Gmail inbox.",
  } as Feature,
  search: {
    label: "Full-Text Search",
    status: "shipped",
    note: "Searches sender, subject, and stored body text.",
  } as Feature,
  scheduleFollowUp: {
    label: "Schedule Follow-Up Reminders",
    status: "shipped",
    note: "Persisted in Apex database. No email or calendar delivery yet.",
  } as Feature,

  // Coming soon
  followUpDelivery: {
    label: "Follow-Up Email/Calendar Delivery",
    status: "coming_soon",
  } as Feature,
  followUpPipeline: {
    label: "Follow-Up Pipeline View",
    status: "coming_soon",
  } as Feature,
  createTask: {
    label: "Create Task",
    status: "coming_soon",
  } as Feature,
  categoryAnalytics: {
    label: "Category Analytics Dashboard",
    status: "coming_soon",
  } as Feature,
  continuousSync: {
    label: "Continuous Background Sync",
    status: "coming_soon",
  } as Feature,
  gmailArchiveSync: {
    label: "Archive Synced to Gmail",
    status: "coming_soon",
  } as Feature,
  gmailReadSync: {
    label: "Read/Unread Synced to Gmail",
    status: "coming_soon",
  } as Feature,
  multiInbox: {
    label: "Multiple Inboxes",
    status: "coming_soon",
  } as Feature,
  whiteLabelOption: {
    label: "White-Label Option",
    status: "coming_soon",
  } as Feature,
  multiUser: {
    label: "Multi-User Access",
    status: "coming_soon",
  } as Feature,
} as const;

export const SOLO_SHIPPED_FEATURES: Feature[] = [
  FEATURES.aiCategorization,
  FEATURES.aiSummary,
  FEATURES.askAi,
  FEATURES.draftReply,
  FEATURES.sendViaGmail,
  FEATURES.scheduleFollowUp,
  FEATURES.smartSync,
  FEATURES.search,
  FEATURES.archiveLocal,
  FEATURES.markReadLocal,
  FEATURES.categoryCorrection,
];
