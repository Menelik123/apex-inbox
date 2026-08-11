"use client";

import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

export function DeleteAccountSection() {
  return (
    <SectionColumns
      title="Danger Zone"
      description="Destructive actions. These cannot be undone."
    >
      <div className="flex flex-col gap-6 rounded-xl border border-red-400/40 p-5 dark:border-red-900/60">

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Disconnect Mailbox</p>
          <p className="text-sm text-muted-foreground">
            Remove your connected email account from Apex Inbox. Your emails will no longer be processed. You can reconnect at any time.
          </p>
          <Button variant="outline" size="sm" className="mt-1 w-fit border-red-400/40 text-red-500 hover:bg-red-500/10">
            Disconnect Mailbox
          </Button>
        </div>

        <div className="border-t pt-4 flex flex-col gap-2">
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete your Apex Inbox account, connected mailbox data, automations, and all settings. This action cannot be undone. You will receive a confirmation email before deletion is finalized.
          </p>
          <Button
            variant="destructive"
            size="sm"
            className="mt-1 w-fit"
            onClick={() => window.confirm("Type DELETE to confirm") }
          >
            <Icons.trash className="mr-2 size-4" />
            Delete Account
          </Button>
        </div>

      </div>
    </SectionColumns>
  );
}
