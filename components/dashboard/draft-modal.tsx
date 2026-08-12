"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DraftModalProps {
  emailId: string;
  emailSubject: string;
  fromEmail: string;
  onClose: () => void;
}

export function DraftModal({ emailId, emailSubject, fromEmail, onClose }: DraftModalProps) {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/emails/${emailId}/draft`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate draft");
      const data = await res.json();
      setDraft(data.body);
      setGenerated(true);
    } catch {
      setError("Could not generate draft. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Draft Reply</p>
            <p className="mt-0.5 text-sm font-medium">Re: {emailSubject}</p>
            <p className="text-xs text-muted-foreground">To: {fromEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>

        {/* Generate prompt */}
        {!generated && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-8">
            <p className="text-sm text-muted-foreground">
              AI will write a draft reply based on the email content.
            </p>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button size="sm" onClick={generate} disabled={loading}>
              {loading ? "Generating..." : "Generate Draft"}
            </Button>
          </div>
        )}

        {/* Draft editor */}
        {generated && (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-lg border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-amber-400" />
              Review before sending — AI drafts require your approval.
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setGenerated(false); setDraft(""); }}>
                Regenerate
              </Button>
              <Button size="sm" variant="outline" className="ml-auto" onClick={onClose}>
                Discard
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(draft);
                  onClose();
                }}
              >
                Copy & Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
