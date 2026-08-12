"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

type EmailAccount = { id: string; email: string; provider: string };

export function DeleteAccountSection() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/email-accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts ?? []))
      .catch(() => {});
  }, []);

  const handleDisconnect = async (accountId: string) => {
    if (
      !window.confirm(
        "Disconnect this mailbox? Your synced email data will remain but no new emails will be processed.",
      )
    )
      return;
    setDisconnecting(accountId);
    try {
      const res = await fetch(`/api/email-accounts/${accountId}/disconnect`, {
        method: "POST",
      });
      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      }
    } catch {}
    setDisconnecting(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      }
    } catch {}
    setDeleting(false);
  };

  return (
    <SectionColumns
      title="Danger Zone"
      description="Destructive actions. These cannot be undone."
    >
      <div className="flex flex-col gap-6 rounded-xl border border-red-400/40 p-5 dark:border-red-900/60">
        {/* Disconnect Mailbox */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Disconnect Mailbox</p>
          <p className="text-sm text-muted-foreground">
            Remove a connected email account from Apex Inbox. No new emails will
            be processed. You can reconnect at any time.
          </p>
          {accounts.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              No connected mailboxes.
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {accounts.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {a.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-red-400/40 text-xs text-red-500 hover:bg-red-500/10"
                    disabled={disconnecting === a.id}
                    onClick={() => handleDisconnect(a.id)}
                  >
                    {disconnecting === a.id ? "Disconnecting..." : "Disconnect"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div className="flex flex-col gap-2 border-t pt-4">
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete your Apex Inbox account, all connected mailbox
            data, and settings. This cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              size="sm"
              className="mt-1 w-fit"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Icons.trash className="mr-2 size-4" />
              Delete Account
            </Button>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-xs text-red-400">
                Type <strong>DELETE</strong> to confirm permanent deletion.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-40 rounded-md border bg-background px-3 py-1.5 text-sm"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteInput !== "DELETE" || deleting}
                  onClick={handleDeleteAccount}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionColumns>
  );
}
