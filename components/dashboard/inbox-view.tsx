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
    preview: "Hi Greg, I came across your coaching program and I'm very interested in getting started in life insurance sales. I've been in direct sales for 3 years and feel ready to make the move.",
    summary: "New prospect wants to join as an agent. Has prior sales experience. Ready to start immediately.",
    action: "Reply to schedule a call",
    why: "Sender used intent phrases ('interested in joining', 'ready to make the move') and has no prior email history — classic inbound lead signal.",
    category: "hot-leads",
    time: "9:14 AM",
    read: false,
  },
  {
    id: "2",
    from: "Denise Carter",
    email: "denise.carter@outlook.com",
    subject: "Quick question about my policy renewal",
    preview: "Greg, hope you're doing well. I wanted to ask about my renewal coming up next month and whether I should consider upgrading my coverage given my recent life changes.",
    summary: "Existing client asking about upcoming policy renewal. Decision pending. Needs guidance soon.",
    action: "Respond with renewal options",
    why: "Existing client relationship detected. Renewal urgency + life event mentioned = time-sensitive opportunity.",
    category: "client-followups",
    time: "8:47 AM",
    read: false,
  },
  {
    id: "3",
    from: "Jason Patel",
    email: "jason.p@salesteam.io",
    subject: "Re: Your coaching program — ready to move forward",
    preview: "Greg, after our call last week I've talked it over and I'm ready to commit. What are the next steps to get enrolled?",
    summary: "Warm lead from last week's call. Ready to commit. Needs next steps sent immediately.",
    action: "Send onboarding info and invoice",
    why: "Follow-up thread detected. Commitment language present ('ready to commit'). Previous call context found.",
    category: "hot-leads",
    time: "Yesterday",
    read: true,
  },
  {
    id: "4",
    from: "American Fidelity",
    email: "noreply@americanfidelity.com",
    subject: "Your monthly commission statement is ready",
    preview: "Your commission statement for July 2026 is now available in your agent portal. Log in to view your earnings breakdown.",
    summary: "Monthly commission statement available in portal. No action required.",
    action: "No action needed",
    why: "Automated send from known provider domain. No-reply address. Routine administrative pattern.",
    category: "admin",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    from: "LinkedIn",
    email: "messages@linkedin.com",
    subject: "You have 3 new connection requests",
    preview: "Greg, you have new connection requests waiting for you on LinkedIn. Log in to review and respond.",
    summary: "LinkedIn notification. Low priority.",
    action: "Ignore",
    why: "Mass notification sender. No direct business intent. List-Unsubscribe header detected.",
    category: "noise",
    time: "Mon",
    read: true,
  },
  {
    id: "6",
    from: "Tanya Robinson",
    email: "tanya.r@yahoo.com",
    subject: "Following up on our conversation",
    preview: "Hi Greg, I reached out two weeks ago about your coaching program. I wanted to follow up and see if spots are still available. I'm serious about making a change.",
    summary: "Lead following up after 2 weeks of silence. High interest. Spots urgency could close this.",
    action: "Reply today — mention limited availability",
    why: "Self-identified follow-up. No reply detected from your side in 14 days. Urgency language present.",
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
    why: "Active client. Calendar event referenced. Direct question asked — requires response.",
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
  const [agentQuery, setAgentQuery] = useState("");

  const filtered = activeCategory === "all"
    ? SAMPLE_EMAILS
    : SAMPLE_EMAILS.filter((e) => e.category === activeCategory);

  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = cat.key === "all"
      ? SAMPLE_EMAILS.length
      : SAMPLE_EMAILS.filter((e) => e.category === cat.key).length;
    return acc;
  }, {} as Record<string, number>);

  const hotCount = SAMPLE_EMAILS.filter((e) => e.category === "hot-leads").length;
  const needsCount = SAMPLE_EMAILS.filter((e) => !e.read).length;

  return (
    <div className="flex h-[calc(100vh-68px)] w-full overflow-hidden rounded-lg border bg-background">

      {/* Category sidebar */}
      <div className="flex w-48 shrink-0 flex-col border-r bg-muted/30">
        {/* Today summary */}
        <div className="border-b p-3 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Today</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Hot leads</span>
            <span className="font-semibold text-emerald-400">{hotCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Need reply</span>
            <span className="font-semibold text-amber-400">{needsCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Est. pipeline</span>
            <span className="font-semibold text-primary">$18K+</span>
          </div>
        </div>

        {/* Categories */}
        <div className="border-b px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-2 flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setActiveCategory(cat.key); setSelectedEmail(null); }}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                activeCategory === cat.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
              )}
            >
              <span className="truncate">{cat.label}</span>
              <span className={cn(
                "ml-2 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                activeCategory === cat.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {counts[cat.key]}
              </span>
            </button>
          ))}
        </nav>

        {/* 7AM Digest */}
        <div className="border-t p-3">
          <div className="rounded-md bg-muted p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">7AM Digest</p>
              <span className="text-[10px] text-emerald-400">Active</span>
            </div>
            <p className="mt-0.5 text-muted-foreground">Daily priority briefing</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Last sent: Today 7:00 AM</p>
          </div>
        </div>
      </div>

      {/* Email list */}
      <div className={cn(
        "flex min-w-0 flex-col border-r",
        selectedEmail ? "w-72 shrink-0" : "flex-1"
      )}>
        {/* List header */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">
              {CATEGORIES.find((c) => c.key === activeCategory)?.label}
            </h2>
            <p className="text-xs text-muted-foreground">{filtered.length} emails · Demo data</p>
          </div>
          <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30 bg-amber-400/10">
            Connect email to go live
          </Badge>
        </div>

        {/* Email rows */}
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
                <div className="flex min-w-0 items-start gap-2">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className={cn("truncate text-sm", !email.read ? "font-semibold" : "font-medium")}>
                        {email.from}
                      </p>
                      {!email.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                    </div>
                    <p className="truncate text-xs font-medium text-foreground/80">{email.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{email.preview}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="whitespace-nowrap text-xs text-muted-foreground">{email.time}</span>
                    <Badge
                      variant="outline"
                      className={cn("whitespace-nowrap text-[10px] px-1.5 py-0", CATEGORY_STYLES[email.category])}
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

      {/* Email detail panel */}
      {selectedEmail && (
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between border-b px-6 py-3">
            <div className="min-w-0 flex-1 pr-4">
              <h3 className="truncate font-semibold">{selectedEmail.subject}</h3>
              <p className="truncate text-xs text-muted-foreground">
                From: {selectedEmail.from} · {selectedEmail.email}
              </p>
            </div>
            <button
              onClick={() => setSelectedEmail(null)}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* AI Intelligence Panel */}
            <div className="mx-6 mt-4 rounded-lg border bg-muted/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="size-2 shrink-0 rounded-full bg-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Analysis</p>
                <Badge variant="outline" className={cn("ml-auto shrink-0 text-[10px] px-1.5", CATEGORY_STYLES[selectedEmail.category])}>
                  {CATEGORY_LABELS[selectedEmail.category]}
                </Badge>
              </div>

              <p className="text-sm text-foreground">{selectedEmail.summary}</p>

              {/* Why classified */}
              <div className="mt-3 rounded-md bg-background/60 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Why this category</p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedEmail.why}</p>
              </div>

              {/* Suggested action */}
              <div className="mt-3 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground">Suggested action</p>
                <p className="mt-0.5 text-sm font-semibold text-primary">{selectedEmail.action}</p>
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" className="h-7 text-xs">Draft Reply</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">Schedule Follow-Up</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">Create Task</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">Archive</Button>
              </div>
            </div>

            {/* Email body */}
            <div className="px-6 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{selectedEmail.preview}</p>
            </div>
          </div>

          {/* AI Agent prompt */}
          <div className="shrink-0 border-t px-6 py-3">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
              <input
                type="text"
                placeholder="Ask AI about this email..."
                value={agentQuery}
                onChange={(e) => setAgentQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
              <div className="size-2 shrink-0 rounded-full bg-emerald-400" title="Agent online" />
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!selectedEmail && (
        <div className="hidden flex-1 items-center justify-center text-sm text-muted-foreground md:flex">
          Select an email to see AI analysis
        </div>
      )}
    </div>
  );
}
