"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface DraftModalProps {
  emailId: string;
  emailSubject: string;
  fromEmail: string;
  onClose: () => void;
}

export function DraftModal({
  emailId,
  emailSubject,
  fromEmail,
  onClose,
}: DraftModalProps) {
  const [draft, setDraft] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    setDraft("");
    setDraftId(null);
    setSent(false);
    setSendError("");
    try {
      const res = await fetch(`/api/emails/${emailId}/draft`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed");
      }
      const data = await res.json();
      setDraft(data.body);
      setDraftId(data.draftId);
    } catch (e: any) {
      setError(
        e.message ||
          "Could not generate draft. Check that your Gmail is connected and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!draftId || sending || sent) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch(`/api/emails/${emailId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, body: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setSent(true);
      setTimeout(onClose, 2000);
    } catch (e: any) {
      setSendError(e.message || "Send failed. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AI Draft Reply"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              AI Draft Reply
            </p>
            <p className="mt-0.5 text-sm font-medium">Re: {emailSubject}</p>
            <p className="text-xs text-muted-foreground">To: {fromEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close draft modal"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10">
            <div className="size-2 animate-pulse rounded-full bg-primary" />
            <p className="text-sm text-muted-foreground">
              Writing your draft...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={generate}
              className="mt-2 text-xs text-red-400 underline hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}

        {/* Sent confirmation */}
        {sent && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 py-8">
            <div className="size-2 rounded-full bg-emerald-400" />
            <p className="text-sm font-medium text-emerald-400">
              Sent successfully
            </p>
            <p className="text-xs text-muted-foreground">Closing...</p>
          </div>
        )}

        {/* Draft editor */}
        {!loading && !error && !sent && draft && (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-lg border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-amber-400" />
              Review and edit the draft above before sending.
            </div>
            {sendError && <p className="text-xs text-red-400">{sendError}</p>}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={generate}>
                Regenerate
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={onClose}
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSend}
                disabled={sending || !draftId}
              >
                {sending ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
