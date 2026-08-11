"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionColumns } from "@/components/dashboard/section-columns";

export function SettingsSection() {
  const [voice, setVoice] = useState("professional");
  const [digestTime, setDigestTime] = useState("07:00");
  const [digestDays, setDigestDays] = useState(["Mon","Tue","Wed","Thu","Fri"]);

  const toggleDay = (day: string) => {
    setDigestDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <>
      {/* Connected Inboxes */}
      <SectionColumns
        title="Connected Inboxes"
        description="Manage the email accounts Apex Inbox monitors and processes."
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Outlook / Microsoft</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Connect your Outlook or Microsoft 365 account</p>
              </div>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 shrink-0">
                Not connected
              </Badge>
            </div>
            <Button size="sm" className="mt-3">Connect Outlook</Button>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Gmail / Google</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Connect your Gmail or Google Workspace account</p>
              </div>
              <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/10 shrink-0">
                Not connected
              </Badge>
            </div>
            <Button size="sm" variant="outline" className="mt-3">Connect Gmail</Button>
          </div>
        </div>
      </SectionColumns>

      {/* AI Preferences */}
      <SectionColumns
        title="AI Preferences"
        description="Control how the AI reads, classifies, and drafts responses on your behalf."
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-medium mb-2">Writing Voice</p>
            <div className="flex gap-2 flex-wrap">
              {["professional", "conversational", "direct", "warm"].map((v) => (
                <button
                  key={v}
                  onClick={() => setVoice(v)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    voice === v
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">AI Draft Approval</p>
            <p className="text-xs text-muted-foreground mb-2">All AI-generated replies require your approval before sending.</p>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Approval required — enabled</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Prohibited Topics</p>
            <p className="text-xs text-muted-foreground mb-2">AI will never independently respond to these topics.</p>
            <div className="flex flex-wrap gap-2">
              {["Coverage details", "Legal advice", "Financial recommendations"].map((t) => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">+ Add topic</Badge>
            </div>
          </div>

          <Button size="sm" className="w-fit">Save AI Preferences</Button>
        </div>
      </SectionColumns>

      {/* 7AM Digest */}
      <SectionColumns
        title="7AM Digest"
        description="Configure your daily priority email briefing."
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Delivery Time</p>
            <input
              type="time"
              value={digestTime}
              onChange={(e) => setDigestTime(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Delivery Days</p>
            <div className="flex gap-2">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    digestDays.includes(day)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Last Digest Sent</p>
            <p className="text-xs text-muted-foreground">Today at 7:00 AM — 5 emails summarized</p>
          </div>
          <Button size="sm" className="w-fit">Save Digest Settings</Button>
        </div>
      </SectionColumns>

      {/* Follow-Up Rules */}
      <SectionColumns
        title="Follow-Up Rules"
        description="Set default follow-up timing for unanswered emails."
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Default Follow-Up Window</p>
            <p className="text-xs text-muted-foreground mb-2">Remind you if a hot lead has not replied within this window.</p>
            <div className="flex gap-2">
              {["24 hours", "2 days", "3 days", "5 days"].map((t) => (
                <button
                  key={t}
                  className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors first:bg-primary first:text-primary-foreground first:border-primary"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Business Days Only</p>
            <p className="text-xs text-muted-foreground">Follow-ups skip weekends and only count business days.</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Enabled</span>
            </div>
          </div>
          <Button size="sm" className="w-fit">Save Follow-Up Rules</Button>
        </div>
      </SectionColumns>
    </>
  );
}
