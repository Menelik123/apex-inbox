"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DraftModal } from "@/components/dashboard/draft-modal";
import { FollowUpModal } from "@/components/dashboard/follow-up-modal";

const CATEGORY_STYLES: Record<string, string> = {
  "hot-leads": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "needs-response": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "client-followups": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  admin: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  noise: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
};

const CATEGORY_LABELS: Record<string, string> = {
  "hot-leads": "Hot Lead",
  "needs-response": "Needs Response",
  "client-followups": "Client Follow-Up",
  admin: "Admin",
  noise: "Noise",
};

const CATEGORY_DISPLAY: Record<string, string> = {
  all: "All Emails",
  "hot-leads": "Hot Leads",
  "needs-response": "Needs Response",
  "client-followups": "Client Follow-Ups",
  admin: "Admin & Logistics",
  noise: "Noise",
};

type Email = {
  id: string;
  messageId: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string | null;
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
  const [syncMessage, setSyncMessage] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showDraft, setShowDraft] = useState(false);
  const [agentQuery, setAgentQuery] = useState("");
  const [agentAnswer, setAgentAnswer] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);
  const [comingSoonMsg, setComingSoonMsg] = useState("");
  const [reclassifying, setReclassifying] = useState(false);
  const [reclassifyMsg, setReclassifyMsg] = useState("");
  const [archiving, setArchiving] = useState(false);
  const [archiveMsg, setArchiveMsg] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [updateBanner, setUpdateBanner] = useState(false);
  const buildIdRef = useRef<string | null>(null);

  // Version staleness detection — poll every 90s
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/version");
        const { buildId } = await res.json();
        if (!buildIdRef.current) {
          buildIdRef.current = buildId;
        } else if (buildIdRef.current !== buildId) {
          setUpdateBanner(true);
        }
      } catch {}
    };
    check();
    const id = setInterval(check, 90_000);
    return () => clearInterval(id);
  }, []);

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
    setSyncMessage("");
    let totalSynced = 0;
    let batch = 0;

    try {
      while (true) {
        batch++;
        if (batch > 1) setSyncMessage(`Syncing batch ${batch}...`);

        const res = await fetch("/api/gmail/sync", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
          setSyncMessage(data.error || "Sync failed.");
          break;
        }

        const errors = (data.results as any[]).filter((r: any) => r.error);
        if (errors.length > 0) {
          setSyncMessage(`Error: ${errors[0].error}`);
          break;
        }

        const batchSynced = (data.results as any[]).reduce(
          (sum: number, r: any) => sum + (r.synced ?? 0),
          0,
        );
        totalSynced += batchSynced;

        const hasMore = (data.results as any[]).some((r: any) => r.hasMore);

        if (!hasMore) break;
        // Small pause between batches to avoid rate limits
        await new Promise((r) => setTimeout(r, 1000));
      }

      await fetchEmails();
      setSyncMessage(
        totalSynced > 0
          ? `Synced ${totalSynced} new email${totalSynced === 1 ? "" : "s"}.`
          : "Already up to date.",
      );
    } catch {
      setSyncMessage("Sync timed out or failed. Try again.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(""), 6000);
    }
  };

  const handleReclassify = async () => {
    setReclassifying(true);
    setReclassifyMsg("");
    try {
      const res = await fetch("/api/emails/reclassify", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setReclassifyMsg("Reclassify failed.");
      } else if (data.processed === 0 && data.remaining === 0) {
        setReclassifyMsg("All emails already classified.");
      } else {
        setReclassifyMsg(
          `Reclassified ${data.processed} email${data.processed === 1 ? "" : "s"}.${data.remaining > 0 ? ` ${data.remaining} remaining — click again.` : " Done."}`,
        );
        await fetchEmails();
      }
    } catch {
      setReclassifyMsg("Reclassify failed. Try again.");
    } finally {
      setReclassifying(false);
      setTimeout(() => setReclassifyMsg(""), 8000);
    }
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    setAgentAnswer("");
    setShowDraft(false);
    setComingSoonMsg("");
    setArchiveMsg("");
    setEditingCategory(false);
    setShowFollowUp(false);

    // Mark as read
    if (!email.read) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, read: true } : e)),
      );
      try {
        await fetch(`/api/emails/${email.id}/read`, { method: "POST" });
      } catch {}
    }
  };

  const handleArchive = async () => {
    if (!selectedEmail || archiving) return;
    if (
      !window.confirm("Archive this email? It will be removed from your inbox.")
    )
      return;
    setArchiving(true);
    setArchiveMsg("");
    try {
      const res = await fetch(`/api/emails/${selectedEmail.id}/archive`, {
        method: "POST",
      });
      if (res.ok) {
        setEmails((prev) => prev.filter((e) => e.id !== selectedEmail.id));
        setSelectedEmail(null);
      } else {
        setArchiveMsg("Archive failed. Try again.");
        setTimeout(() => setArchiveMsg(""), 4000);
      }
    } catch {
      setArchiveMsg("Archive failed. Try again.");
      setTimeout(() => setArchiveMsg(""), 4000);
    }
    setArchiving(false);
  };

  const handleCategoryChange = async (newCategory: string) => {
    if (!selectedEmail) return;
    setSavingCategory(true);
    const DB_MAP: Record<string, string> = {
      "hot-leads": "HOT_LEAD",
      "needs-response": "NEEDS_RESPONSE",
      "client-followups": "CLIENT_FOLLOWUP",
      admin: "ADMIN",
      noise: "NOISE",
    };
    try {
      const res = await fetch(`/api/emails/${selectedEmail.id}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: DB_MAP[newCategory] }),
      });
      if (res.ok) {
        const updated = { ...selectedEmail, category: newCategory };
        setSelectedEmail(updated);
        setEmails((prev) =>
          prev.map((e) => (e.id === selectedEmail.id ? updated : e)),
        );
        setEditingCategory(false);
      }
    } catch {}
    setSavingCategory(false);
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
      if (!res.ok) {
        setAgentAnswer(data.error || "Something went wrong. Try again.");
      } else {
        setAgentAnswer(data.answer || "No answer returned.");
      }
    } catch {
      setAgentAnswer("Something went wrong. Try again.");
    } finally {
      setAgentLoading(false);
      setAgentQuery("");
    }
  };

  const hotCount = emails.filter((e) => e.category === "hot-leads").length;
  const unreadCount = emails.filter((e) => !e.read).length;
  const needsReclassify = emails.some((e) => e.confidence === 0);

  return (
    <>
      {updateBanner && (
        <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-3 bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
          A new version is available.
          <button
            onClick={() => window.location.reload()}
            className="underline underline-offset-2"
          >
            Refresh now
          </button>
        </div>
      )}
      {showDraft && selectedEmail && (
        <DraftModal
          emailId={selectedEmail.id}
          emailSubject={selectedEmail.subject}
          fromEmail={selectedEmail.email}
          onClose={() => setShowDraft(false)}
        />
      )}
      {showFollowUp && selectedEmail && (
        <FollowUpModal
          emailId={selectedEmail.id}
          fromName={selectedEmail.from}
          fromEmail={selectedEmail.email}
          subject={selectedEmail.subject}
          onClose={() => setShowFollowUp(false)}
          onSaved={() => setSyncMessage("Follow-up scheduled.")}
        />
      )}
      <div className="flex h-[calc(100vh-68px)] w-full overflow-hidden rounded-lg border bg-background">
        {/* Email list */}
        <div
          className={cn(
            "flex min-w-0 flex-col border-r transition-all duration-200",
            selectedEmail ? "w-80 shrink-0" : "flex-1",
          )}
        >
          {/* Header */}
          <div className="flex shrink-0 flex-col gap-2 border-b px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                {CATEGORY_DISPLAY[activeCategory] ?? "All Emails"}
              </h2>
              <div className="flex gap-2">
                {needsReclassify && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-amber-400 hover:text-amber-300"
                    onClick={handleReclassify}
                    disabled={reclassifying}
                    title="Reclassify emails that failed AI categorization"
                  >
                    {reclassifying ? "Classifying..." : "Reclassify"}
                  </Button>
                )}
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
            </div>

            {/* Today summary — only on all emails view */}
            {activeCategory === "all" &&
              !loading &&
              hasAccounts &&
              emails.length > 0 && (
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Hot leads:{" "}
                    <span className="font-semibold text-emerald-400">
                      {hotCount}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Unread:{" "}
                    <span className="font-semibold text-amber-400">
                      {unreadCount}
                    </span>
                  </span>
                </div>
              )}

            {!loading && (
              <p className="text-xs text-muted-foreground">
                {syncMessage || reclassifyMsg ? (
                  <span
                    className={
                      (syncMessage || reclassifyMsg).startsWith("Error")
                        ? "text-red-400"
                        : "text-emerald-400"
                    }
                  >
                    {syncMessage || reclassifyMsg}
                  </span>
                ) : (
                  `${emails.length} emails`
                )}
              </p>
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
                  Connect your Gmail account in Settings to start categorizing
                  emails.
                </p>
                <a
                  href="/dashboard/settings"
                  className="mt-1 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Go to Settings
                </a>
              </div>
            ) : emails.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
                <p className="text-sm text-muted-foreground">No emails yet</p>
                <p className="text-xs text-muted-foreground">
                  Hit Sync to pull your latest inbox.
                </p>
              </div>
            ) : (
              emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={cn(
                    "w-full border-b px-5 py-3.5 text-left transition-colors hover:bg-muted/50",
                    selectedEmail?.id === email.id && "bg-muted",
                    !email.read && "border-l-2 border-l-primary",
                  )}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "truncate text-sm",
                            !email.read ? "font-semibold" : "font-medium",
                          )}
                        >
                          {email.from}
                        </p>
                        {!email.read && (
                          <span
                            className="size-1.5 shrink-0 rounded-full bg-primary"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs font-medium text-foreground/80">
                        {email.subject}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {email.preview}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {email.time}
                      </span>
                      {email.category && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "whitespace-nowrap px-1.5 py-0 text-[10px]",
                            CATEGORY_STYLES[email.category],
                          )}
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
                <h3 className="text-base font-semibold leading-tight">
                  {selectedEmail.subject}
                </h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  From: {selectedEmail.from} · {selectedEmail.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close email detail"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* AI Intelligence Panel */}
              <div className="mx-6 mt-5 rounded-lg border bg-muted/40 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="size-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    AI Analysis
                  </p>
                  {editingCategory ? (
                    <div className="ml-auto flex items-center gap-1.5">
                      <select
                        className="rounded border bg-background px-1.5 py-0.5 text-[10px]"
                        defaultValue={selectedEmail.category}
                        disabled={savingCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingCategory(false)}
                        className="text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="ml-auto flex items-center gap-1.5"
                      onClick={() => setEditingCategory(true)}
                      title="Change category"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 px-1.5 text-[10px] hover:opacity-80",
                          CATEGORY_STYLES[selectedEmail.category],
                        )}
                      >
                        {CATEGORY_LABELS[selectedEmail.category]}
                      </Badge>
                    </button>
                  )}
                </div>

                {selectedEmail.confidence === 0 ? (
                  <p className="text-sm italic text-muted-foreground">
                    AI categorization unavailable for this email.{" "}
                    <button
                      className="underline"
                      onClick={handleReclassify}
                      disabled={reclassifying}
                    >
                      {reclassifying ? "Classifying..." : "Reclassify now"}
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-foreground">
                    {selectedEmail.summary}
                  </p>
                )}

                {selectedEmail.why && selectedEmail.confidence > 0 && (
                  <div className="mt-3 rounded-md bg-background/60 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Why this category
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {selectedEmail.why}
                    </p>
                  </div>
                )}

                {selectedEmail.confidence > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Suggested action
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-primary">
                      {selectedEmail.action.length > 250
                        ? selectedEmail.action.slice(0, 247) + "..."
                        : selectedEmail.action}
                    </p>
                  </div>
                )}

                {(comingSoonMsg || archiveMsg) && (
                  <p
                    className={cn(
                      "mt-2 text-xs",
                      archiveMsg ? "text-red-400" : "text-amber-400",
                    )}
                  >
                    {archiveMsg || comingSoonMsg}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setShowDraft(true)}
                    disabled={
                      selectedEmail.category === "noise" ||
                      selectedEmail.category === "admin"
                    }
                    title={
                      selectedEmail.category === "noise" ||
                      selectedEmail.category === "admin"
                        ? "Draft Reply not available for Admin/Noise emails"
                        : undefined
                    }
                  >
                    Draft Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setShowFollowUp(true)}
                  >
                    Schedule Follow-Up
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => showComingSoon("Create Task")}
                  >
                    Create Task
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={handleArchive}
                    disabled={archiving}
                  >
                    {archiving ? "Archiving..." : "Archive"}
                  </Button>
                </div>
              </div>

              {/* Email body */}
              <div className="border-t px-6 py-5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Message
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {selectedEmail.body ||
                    selectedEmail.preview ||
                    "(No message body available)"}
                </p>
              </div>
            </div>

            {/* AI Agent prompt */}
            <div className="shrink-0 border-t px-6 py-4">
              {agentAnswer && (
                <div className="mb-3 rounded-lg border bg-muted/40 px-3 py-2.5">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    AI Answer
                  </p>
                  <p className="text-xs leading-relaxed text-foreground">
                    {agentAnswer}
                  </p>
                  <button
                    onClick={() => setAgentAnswer("")}
                    className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground"
                  >
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAskAI();
                  }}
                  disabled={agentLoading}
                  className="flex-1 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary disabled:opacity-50"
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
