"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";

type EmailAccount = {
  id: string;
  email: string;
  displayName: string | null;
  provider: string;
  lastSyncAt: string | null;
};

const PREFS_KEY = "apex_inbox_prefs";

function loadPrefs() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "null");
  } catch {
    return null;
  }
}

function savePrefs(prefs: object) {
  if (typeof window === "undefined") return;
  const existing = loadPrefs() || {};
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...existing, ...prefs }));
}

export function SettingsSection() {
  const [voice, setVoice] = useState("professional");
  const [digestTime, setDigestTime] = useState("07:00");
  const [digestDays, setDigestDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [followUpWindow, setFollowUpWindow] = useState("2 days");
  const [businessDaysOnly, setBusinessDaysOnly] = useState(true);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [savedMsg, setSavedMsg] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (connected === "gmail") toast.success("Gmail connected successfully.");
    if (connected === "outlook")
      toast.success("Outlook connected successfully.");
    if (error === "outlook_denied")
      toast.error("Outlook connection was cancelled.");
    if (error === "auth_failed")
      toast.error("Connection failed. Please try again.");
    if (error === "no_code") toast.error("OAuth error — no code returned.");
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/email-accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts ?? []))
      .catch(() => {});

    const prefs = loadPrefs();
    if (prefs) {
      if (prefs.voice) setVoice(prefs.voice);
      if (prefs.digestTime) setDigestTime(prefs.digestTime);
      if (prefs.digestDays) setDigestDays(prefs.digestDays);
      if (prefs.followUpWindow) setFollowUpWindow(prefs.followUpWindow);
      if (typeof prefs.businessDaysOnly === "boolean")
        setBusinessDaysOnly(prefs.businessDaysOnly);
    }
  }, []);

  const gmailAccounts = accounts.filter((a) => a.provider === "gmail");
  const outlookAccounts = accounts.filter((a) => a.provider === "outlook");

  const toggleDay = (day: string) =>
    setDigestDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const showSaved = (key: string) => {
    setSavedMsg((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setSavedMsg((prev) => ({ ...prev, [key]: false })), 2500);
  };

  const handleSaveAI = () => {
    savePrefs({ voice });
    showSaved("ai");
  };

  const handleSaveDigest = () => {
    savePrefs({ digestTime, digestDays });
    showSaved("digest");
  };

  const handleSaveFollowUp = () => {
    savePrefs({ followUpWindow, businessDaysOnly });
    showSaved("followup");
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
                <p className="text-sm font-medium">Outlook / Microsoft 365</p>
                {outlookAccounts.length > 0 ? (
                  outlookAccounts.map((a) => (
                    <p
                      key={a.id}
                      className="mt-0.5 text-xs text-muted-foreground"
                    >
                      {a.email}
                      {a.lastSyncAt && (
                        <span className="ml-2 text-muted-foreground/60">
                          Last sync: {new Date(a.lastSyncAt).toLocaleString()}
                        </span>
                      )}
                    </p>
                  ))
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Connect your Outlook or Microsoft 365 inbox
                  </p>
                )}
              </div>
              {outlookAccounts.length > 0 ? (
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                >
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="shrink-0 border-amber-400/30 bg-amber-400/10 text-amber-400"
                >
                  Not connected
                </Badge>
              )}
            </div>
            <a
              href="/api/outlook/connect"
              className="mt-3 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {outlookAccounts.length > 0
                ? "Add another Outlook"
                : "Connect Outlook"}
            </a>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Gmail / Google</p>
                {gmailAccounts.length > 0 ? (
                  gmailAccounts.map((a) => (
                    <p
                      key={a.id}
                      className="mt-0.5 text-xs text-muted-foreground"
                    >
                      {a.email}
                      {a.lastSyncAt && (
                        <span className="ml-2 text-muted-foreground/60">
                          Last sync: {new Date(a.lastSyncAt).toLocaleString()}
                        </span>
                      )}
                    </p>
                  ))
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Connect your Gmail or Google Workspace account
                  </p>
                )}
              </div>
              {gmailAccounts.length > 0 ? (
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                >
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="shrink-0 border-amber-400/30 bg-amber-400/10 text-amber-400"
                >
                  Not connected
                </Badge>
              )}
            </div>
            <a
              href="/api/gmail/connect"
              className="mt-3 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {gmailAccounts.length > 0 ? "Add another Gmail" : "Connect Gmail"}
            </a>
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
            <p className="mb-2 text-sm font-medium">Writing Voice</p>
            <div className="flex flex-wrap gap-2">
              {["professional", "conversational", "direct", "warm"].map((v) => (
                <button
                  key={v}
                  onClick={() => setVoice(v)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    voice === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">AI Draft Approval</p>
            <p className="mb-2 text-xs text-muted-foreground">
              All AI-generated replies require your approval before sending.
            </p>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Approval required — enabled
              </span>
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Draft Reply Scope</p>
            <p className="text-xs text-muted-foreground">
              Draft Reply is disabled for Admin and Noise emails to prevent
              replies to automated/no-reply messages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="w-fit" onClick={handleSaveAI}>
              Save AI Preferences
            </Button>
            {savedMsg.ai && (
              <span className="text-xs text-emerald-400">
                Saved to this browser.
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground/60">
            Preferences are stored in this browser. Clear your browser data to
            reset them.
          </p>
        </div>
      </SectionColumns>

      {/* 7AM Digest */}
      <SectionColumns
        title="7AM Digest"
        description="Configure your daily priority email briefing."
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium">Delivery Time</p>
            <input
              type="time"
              value={digestTime}
              onChange={(e) => setDigestTime(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Delivery Days</p>
            <div className="flex gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    digestDays.includes(day)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Last Digest Sent</p>
            <p className="text-xs text-muted-foreground">
              Not yet sent — digest scheduler coming soon.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="w-fit" onClick={handleSaveDigest}>
              Save Digest Settings
            </Button>
            {savedMsg.digest && (
              <span className="text-xs text-emerald-400">
                Saved to this browser.
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground/60">
            These settings are stored in this browser. Digest delivery is not
            yet active.
          </p>
        </div>
      </SectionColumns>

      {/* Follow-Up Rules */}
      <SectionColumns
        title="Follow-Up Rules"
        description="Set default follow-up timing for unanswered emails."
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1 text-sm font-medium">Default Follow-Up Window</p>
            <p className="mb-2 text-xs text-muted-foreground">
              Remind you if a hot lead has not replied within this window.
            </p>
            <div className="flex gap-2">
              {["24 hours", "2 days", "3 days", "5 days"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFollowUpWindow(t)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    followUpWindow === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Business Days Only</p>
            <p className="text-xs text-muted-foreground">
              Follow-ups skip weekends and only count business days.
            </p>
            <button
              onClick={() => setBusinessDaysOnly((v) => !v)}
              className="mt-2 flex items-center gap-2"
            >
              <div
                className={`size-2 rounded-full ${businessDaysOnly ? "bg-emerald-400" : "bg-muted-foreground"}`}
              />
              <span
                className={`text-xs font-medium ${businessDaysOnly ? "text-emerald-400" : "text-muted-foreground"}`}
              >
                {businessDaysOnly ? "Enabled" : "Disabled"}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="w-fit" onClick={handleSaveFollowUp}>
              Save Follow-Up Rules
            </Button>
            {savedMsg.followup && (
              <span className="text-xs text-emerald-400">
                Saved to this browser.
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground/60">
            Follow-up rules are stored in this browser and used as defaults when
            scheduling.
          </p>
        </div>
      </SectionColumns>
    </>
  );
}
