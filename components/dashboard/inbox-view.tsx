"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "All Emails" },
  { key: "hot-leads", label: "Hot Leads" },
  { key: "needs-response", label: "Needs Response" },
  { key: "client-followups", label: "Client Follow-Ups" },
  { key: "admin", label: "Admin & Logistics" },
  { key: "noise", label: "Noise" },
] as const;

const CATEGORY_STYLES: Record<string, string> = {
  "hot-leads": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "needs-response": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "client-followups": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "admin": "bg-slate-500/15 text-slate-400 border-slate-500/30",
  "noise": "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
};

const CATEGORY_LABELS: Record<string, string> = {
  "hot-leads": "Hot Lead",
  "needs-response": "Needs Response",
  "client-followups": "Client Follow-Up",
  "admin": "Admin",
  "noise": "Noise",
};

const SAMPLE_EMAILS = [
  {
    id: "1",
    from: "Marcus Williams",
    email: "marcus.w@gmail.com",
    subject: "Interested in joining your team as an agent",
    preview: "Hi Greg, I came across your coaching program and I'm very interested in getting started in life insurance sales...",
    summary: "New prospect wants to join as an agent. Has prior sales experience. Ready to start immediately.",
    action: "Reply to schedule a call",
    category: "hot-leads",
    time: "9:14 AM",
    read: false,
  },
  {
    id: "2",
    from: "Denise Carter",
    email: "denise.carter@outlook.com",
    subject: "Quick question about my policy renewal",
    preview: "Greg, hope you're doing well. I wanted to ask about my renewal coming up next month and whether I should...",
    summary: "Existing client asking about upcoming policy renewal. Decision pending. Needs guidance soon.",
    action: "Respond with renewal options",
    category: "client-followups",
    time: "8:47 AM",
    read: false,
  },
  {
    id: "3",
    from: "Jason Patel",
    email: "jason.p@salesteam.io",
    subject: "Re: Your coaching program — ready to move forward",
    preview: "Greg, after our call last week I've talked it over and I'm ready to commit. What are the next steps?",
    summary: "Warm lead from last week's call. Ready to commit. Needs next steps sent immediately.",
    action: "Send onboarding info and invoice",
    category: "hot-leads",
    time: "Yesterday",
    read: true,
  },
  {
    id: "4",
    from: "American Fidelity",
    email: "noreply@americanfidelity.com",
    subject: "Your monthly commission statement is ready",
    preview: "Your commission statement for July 2026 is now available in your agent portal...",
    summary: "Monthly commission statement available in portal. No action required.",
    action: "No action needed",
    category: "admin",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    from: "LinkedIn",
    email: "messages@linkedin.com",
    subject: "You have 3 new connection requests",
    preview: "Greg, you have new connection requests waiting for you on LinkedIn...",
    summary: "LinkedIn notification. Low priority.",
    action: "Ignore",
    category: "noise",
    time: "Mon",
    read: true,
  },
  {
    id: "6",
    from: "Tanya Robinson",
    email: "tanya.r@yahoo.com",
    subject: "Following up on our conversation",
    preview: "Hi Greg, I reached out two weeks ago about your coaching program. I wanted to follow up and see if spots are still available...",
    summary: "Lead following up after 2 weeks of silence. High interest. Spots urgency could close this.",
    action: "Reply today — mention limited availability",
    category: "needs-response",
    time: "Mon",
    read: true,
  },
  {
    id: "7",
    from: "Kevin Moss",
    email: "k.moss@gmail.com",
    subject: "Can we reschedule our call?",
    preview: "Hey Greg, something came up and I need to move our Thursday call. Are you available Friday afternoon?",
    summary: "Client needs to reschedule Thursday's call to Friday afternoon.",
    action: "Confirm Friday availability",
    category: "needs-response",
    time: "Sun",
    read: true,
  },
];

interface InboxViewProps {
  user: any;
}

export function InboxView({ user }: InboxViewProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState<typeof SAMPLE_EMAILS[0] | null>(null);

  const filtered = activeCategory === "all"
    ? SAMPLE_EMAILS
    : SAMPLE_EMAILS.filter((e) => e.category === activeCategory);

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.key === "all"
      ? SAMPLE_EMAILS.length
      : SAMPLE_EMAILS.filter((e) => e.category === cat.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden rounded-lg border bg-background">
      {/* Category sidebar */}
      <div className="flex w-52 shrink-0 flex-col border-r bg-muted/30">
        <div className="border-b px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSelectedEmail(null); }}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeCategory === cat.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              )}
            >
              <span>{cat.label}</span>
              <span className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                activeCategory === cat.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {counts[cat.key]}
              </span>
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t p-3">
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">7AM Digest</p>
            <p className="mt-0.5">Sent daily to your inbox</p>
          </div>
        </div>
      </div>

      {/* Email list */}
      <div className={cn("flex flex-col border-r", selectedEmail ? "w-72 shrink-0" : "flex-1")}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">
              {CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </h2>
            <p className="text-xs text-muted-foreground">{filtered.length} emails</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">Connect Email</Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No emails in this category
            </div>
          ) : (
            filtered.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={cn(
                  "w-full border-b px-4 py-3 text-left transition-colors hover:bg-muted/50",
                  selectedEmail?.id === email.id && "bg-muted",
                  !email.read && "border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("truncate text-sm", !email.read ? "font-semibold" : "font-medium")}>
                        {email.from}
                      </p>
                      {!email.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="truncate text-xs font-medium text-foreground/80">{email.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{email.preview}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{email.time}</span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-1.5 py-0", CATEGORY_STYLES[email.category])}
                    >
                      {CATEGORY_LABELS[email.category]}
                    </Badge>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Email detail */}
      {selectedEmail && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b px-6 py-3">
            <div>
              <h3 className="font-semibold">{selectedEmail.subject}</h3>
              <p className="text-xs text-muted-foreground">
                From: {selectedEmail.from} &lt;{selectedEmail.email}&gt;
              </p>
            </div>
            <button
              onClick={() => setSelectedEmail(null)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            >
              ✕
            </button>
          </div>

          {/* AI Summary card */}
          <div className="mx-6 mt-4 rounded-lg border bg-muted/40 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Summary</p>
              <Badge variant="outline" className={cn("ml-auto text-[10px] px-1.5", CATEGORY_STYLES[selectedEmail.category])}>
                {CATEGORY_LABELS[selectedEmail.category]}
              </Badge>
            </div>
            <p className="text-sm text-foreground">{selectedEmail.summary}</p>
            <div className="mt-3 border-t pt-3">
              <p className="text-xs font-medium text-muted-foreground">Suggested action</p>
              <p className="mt-0.5 text-sm font-medium text-primary">{selectedEmail.action}</p>
            </div>
          </div>

          {/* Email body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{selectedEmail.preview}</p>
          </div>

          {/* AI Agent chat */}
          <div className="border-t px-6 py-3">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
              <span className="text-xs text-muted-foreground">Ask AI about this email...</span>
              <div className="ml-auto size-2 rounded-full bg-emerald-400" title="Agent online" />
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no email selected */}
      {!selectedEmail && (
        <div className="hidden" />
      )}
    </div>
  );
}
