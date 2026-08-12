"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DraftModal } from "@/components/dashboard/draft-modal";

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

const CATEGORY_DISPLAY: Record<string, string> = {
  "all": "All Emails",
  "hot-leads": "Hot Leads",
  "needs-response": "Needs Response",
  "client-followups": "Client Follow-Ups",
  "admin": "Admin & Logistics",
  "noise": "Noise",
};

type Email = {
  id: string;
  messageId: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  summary: string;
  action: string;
  why: string;
  category: string;
  confidence: number;
  time: string;
  read: boolean;
};

interface InboxViewProps {
  user: any;
  activeCategory: string;
}

export function InboxView({ user, activeCategory }: InboxViewProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [hasAccounts, setHasAccounts] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showDraft, setShowDraft] = useState(false);
  const [agentQuery, setAgentQuery] = useState("");
  const [agentAnswer, setAgentAnswer] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [comingSoonMsg, setComingSoonMsg] = useState("");

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emails?category=${activeCategory}`);
      const data = await res.json();
      setEmails(data.emails ?? []);
      setHasAccounts(data.hasAccounts ?? false);
    } catch {
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/gmail/sync", { method: "POST" });
      await fetchEmails();
    } finally {
      setSyncing(false);
    }
  };

  const showComingSoon = (feature: string) => {
    setComingSoonMsg(`${feature} is coming in the next update.`);
    setTimeout(() => setComingSoonMsg(""), 3000);
  };

  const handleAskAI = async () => {
    if (!agentQuery.trim() || !selectedEmail) return;
    setAgentLoading(true);
    setAgentAnswer("");
    try {
      const res = await fetch(`/api/emails/${selectedEmail.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: agentQuery }),
      });
      const data = await res.json();
      setAgentAnswer(data.answer || "No answer returned.");
    } catch {
      setAgentAnswer("Something went wrong. Try again.");
    } finally {
      setAgentLoading(false);
      setAgentQuery("");
    }
  };

  const hotCount = emails.filter((e) => e.category === "hot-leads").length;
  const unreadCount = emails.filter((e) => !e.read).length;

  return (
    <>
    {showDraft && selectedEmail && (
      <DraftModal
        emailId={selectedEmail.id}
        emailSubject={selectedEmail.subject}
        fromEmail={selectedEmail.email}
        onClose={() => setShowDraft(false)}
      />
    )}
    <div className="flex h-[calc(100vh-68px)] w-full overflow-hidden rounded-lg border bg-background">

      {/* Email list */}
      <div className={cn(
        "flex min-w-0 flex-col border-r transition-all duration-200",
        selectedEmail ? "w-80 shrink-0" : "flex-1"
      )}>
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-2 border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {CATEGORY_DISPLAY[activeCategory] ?? "All Emails"}
            </h2>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleSync}
              disabled={syncing || hasAccounts === false}
            >
              {syncing ? "Syncing..." : "Sync"}
            </Button>
          </div>

          {/* Today summary — only on all emails view */}
          {activeCategory === "all" && !loading && hasAccounts && emails.length > 0 && (
            <div className="flex gap-4 text-xs">
              <span className="text-muted-foreground">
                Hot leads: <span className="font-semibold text-emerald-400">{hotCount}</span>
              </span>
              <span className="text-muted-foreground">
                Unread: <span className="font-semibold text-amber-400">{unreadCount}</span>
              </span>
            </div>
          )}

          {!loading && (
            <p className="text-xs text-muted-foreground">{emails.length} emails</p>
          )}
        </div>

        {/* Email rows */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : hasAccounts === false ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="text-sm font-medium">No inbox connected</p>
              <p className="text-xs text-muted-foreground">
                Connect your Gmail account in Settings to start categorizing emails.
              </p>
              <a href="/dashboard/settings" className="mt-1 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                Go to Settings
              </a>
            </div>
          ) : emails.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
              <p className="text-sm text-muted-foreground">No emails yet</p>
              <p className="text-xs text-muted-foreground">Hit Sync to pull your latest inbox.</p>
            </div>
          ) : (
            emails.map((email) => (
              <button
                key={email.id}
                onClick={() => { setSelectedEmail(email); setAgentAnswer(""); setShowDraft(false); setComingSoonMsg(""); }}
                className={cn(
                  "w-full border-b px-5 py-3.5 text-left transition-colors hover:bg-muted/50",
                  selectedEmail?.id === email.id && "bg-muted",
                  !email.read && "border-l-2 border-l-primary"
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className={cn("truncate text-sm", !email.read ? "font-semibold" : "font-medium")}>
                        {email.from}
                      </p>
                      {!email.read && (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium text-foreground/80">{email.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{email.preview}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="whitespace-nowrap text-xs text-muted-foreground">{email.time}</span>
                    {email.category && (
                      <Badge
                        variant="outline"
                        className={cn("whitespace-nowrap px-1.5 py-0 text-[10px]", CATEGORY_STYLES[email.category])}
                      >
                        {CATEGORY_LABELS[email.category]}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* AI detail panel */}
      {selectedEmail && (
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between border-b px-6 py-4">
            <div className="min-w-0 flex-1 pr-4">
              <h3 className="text-base font-semibold leading-tight">{selectedEmail.subject}</h3>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                From: {selectedEmail.from} · {selectedEmail.email}
              </p>
            </div>
            <button
              onClick={() => setSelectedEmail(null)}
              className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* AI Intelligence Panel */}
            <div className="mx-6 mt-5 rounded-lg border bg-muted/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="size-2 shrink-0 rounded-full bg-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Analysis</p>
                <Badge variant="outline" className={cn("ml-auto shrink-0 px-1.5 text-[10px]", CATEGORY_STYLES[selectedEmail.category])}>
                  {CATEGORY_LABELS[selectedEmail.category]}
                </Badge>
              </div>

              <p className="text-sm text-foreground">{selectedEmail.summary}</p>

              {selectedEmail.why && (
                <div className="mt-3 rounded-md bg-background/60 px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Why this category</p>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedEmail.why}</p>
                </div>
              )}

              <div className="mt-3 border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground">Suggested action</p>
                <p className="mt-0.5 text-sm font-semibold text-primary">{selectedEmail.action}</p>
              </div>

              {comingSoonMsg && (
                <p className="mt-2 text-xs text-amber-400">{comingSoonMsg}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" className="h-7 text-xs" onClick={() => setShowDraft(true)}>
                  Draft Reply
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => showComingSoon("Schedule Follow-Up")}>
                  Schedule Follow-Up
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => showComingSoon("Create Task")}>
                  Create Task
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => showComingSoon("Archive")}>
                  Archive
                </Button>
              </div>
            </div>

            {/* Email body */}
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-muted-foreground">{selectedEmail.preview}</p>
            </div>
          </div>

          {/* AI Agent prompt */}
          <div className="shrink-0 border-t px-6 py-4">
            {agentAnswer && (
              <div className="mb-3 rounded-lg border bg-muted/40 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">AI Answer</p>
                <p className="text-xs text-foreground leading-relaxed">{agentAnswer}</p>
                <button onClick={() => setAgentAnswer("")} className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground">
                  Dismiss
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask AI about this email..."
                value={agentQuery}
                onChange={(e) => setAgentQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAskAI(); }}
                disabled={agentLoading}
                className="flex-1 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <Button
                size="sm"
                onClick={handleAskAI}
                disabled={agentLoading || !agentQuery.trim()}
                className="shrink-0"
              >
                {agentLoading ? "..." : "Ask"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
