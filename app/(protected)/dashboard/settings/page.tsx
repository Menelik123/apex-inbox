import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import { SettingsSection } from "@/components/dashboard/settings-section";

export const metadata = constructMetadata({
  title: "Settings – Apex Inbox",
  description: "Manage your profile, inbox connections, AI preferences, team, and billing.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage your profile, inbox connections, and AI preferences."
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <SettingsSection />
        <DeleteAccountSection />
      </div>
    </>
  );
}
