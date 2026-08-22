"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface FollowUpModalProps {
  emailId: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  onClose: () => void;
  onSaved: () => void;
}

export function FollowUpModal({
  emailId,
  fromName,
  fromEmail,
  subject,
  onClose,
  onSaved,
}: FollowUpModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const defaultDue = tomorrow.toISOString().slice(0, 16);

  const [dueAt, setDueAt] = useState(defaultDue);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!dueAt) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/emails/${emailId}/follow-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueAt, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const formatContact = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Schedule Follow-Up"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Schedule Follow-Up
            </p>
            <p className="mt-0.5 max-w-xs truncate text-sm font-medium">
              {subject}
            </p>
            <p className="max-w-xs truncate text-xs text-muted-foreground">
              {formatContact}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Close follow-up modal"
          >
            ✕
          </button>
        </div>

        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Remind me on
          </label>
          <input
            type="datetime-local"
            value={dueAt}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setDueAt(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What do you need to follow up on?"
            rows={3}
            className="resize-none rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="ml-auto"
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !dueAt}>
            {saving ? "Saving..." : "Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
}
