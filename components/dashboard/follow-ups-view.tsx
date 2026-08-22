"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FollowUp = {
  id: string;
  contactEmail: string;
  contactName: string | null;
  subject: string | null;
  notes: string | null;
  dueAt: string | null;
  state: string;
};

type EditState = {
  id: string;
  dueAt: string;
  notes: string;
};

function formatDue(dueAt: string | null): { label: string; overdue: boolean } {
  if (!dueAt) return { label: "No date set", overdue: false };
  const date = new Date(dueAt);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const overdue = diff < 0;

  if (overdue) {
    const absDays = Math.abs(days);
    return {
      label: absDays === 0 ? "Due today (overdue)" : `${absDays}d overdue`,
      overdue: true,
    };
  }
  if (days === 0) return { label: "Due today", overdue: false };
  if (days === 1) return { label: "Due tomorrow", overdue: false };
  return {
    label: `Due ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    overdue: false,
  };
}

export function FollowUpsView() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/follow-ups");
      const data = await res.json();
      setFollowUps(data.followUps ?? []);
    } catch {
      setError("Failed to load follow-ups.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/follow-ups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complete: true }),
      });
      setFollowUps((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError("Failed to complete follow-up.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this follow-up?")) return;
    try {
      await fetch(`/api/follow-ups/${id}`, { method: "DELETE" });
      setFollowUps((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError("Failed to delete follow-up.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/follow-ups/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueAt: editing.dueAt, notes: editing.notes }),
      });
      if (res.ok) {
        setFollowUps((prev) =>
          prev.map((f) =>
            f.id === editing.id
              ? { ...f, dueAt: editing.dueAt, notes: editing.notes }
              : f,
          ),
        );
        setEditing(null);
      } else {
        setError("Failed to save. Try again.");
        setTimeout(() => setError(""), 3000);
      }
    } catch {
      setError("Failed to save. Try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Loading follow-ups...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Follow-Ups</h2>
          <p className="text-xs text-muted-foreground">
            {followUps.length === 0
              ? "No pending follow-ups."
              : `${followUps.length} pending`}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={load}
        >
          Refresh
        </Button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {followUps.length === 0 && !loading && (
        <div className="rounded-lg border bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          No pending follow-ups. Schedule one from any email in your inbox.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {followUps.map((f) => {
          const { label, overdue } = formatDue(f.dueAt);
          const isEditing = editing?.id === f.id;

          return (
            <div
              key={f.id}
              className={cn(
                "rounded-lg border bg-background p-4",
                overdue && "border-red-500/30 bg-red-500/5",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {f.contactName
                      ? `${f.contactName} <${f.contactEmail}>`
                      : f.contactEmail}
                  </p>
                  {f.subject && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {f.subject}
                    </p>
                  )}
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      overdue ? "text-red-400" : "text-amber-400",
                    )}
                  >
                    {label}
                  </p>
                  {f.notes && !isEditing && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {f.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setEditing(
                        isEditing
                          ? null
                          : {
                              id: f.id,
                              dueAt: f.dueAt
                                ? new Date(f.dueAt).toISOString().slice(0, 16)
                                : "",
                              notes: f.notes ?? "",
                            },
                      )
                    }
                  >
                    {isEditing ? "Cancel" : "Reschedule"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs text-emerald-400 hover:text-emerald-300"
                    onClick={() => handleComplete(f.id)}
                  >
                    Done
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(f.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-3 flex flex-col gap-2 border-t pt-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">
                      New date
                    </label>
                    <input
                      type="datetime-local"
                      value={editing.dueAt}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, dueAt: e.target.value } : prev,
                        )
                      }
                      className="w-fit rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">
                      Notes
                    </label>
                    <textarea
                      value={editing.notes}
                      onChange={(e) =>
                        setEditing((prev) =>
                          prev ? { ...prev, notes: e.target.value } : prev,
                        )
                      }
                      rows={2}
                      className="resize-none rounded-md border bg-muted/30 px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-fit"
                    onClick={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
