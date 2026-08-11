import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { InboxView } from "@/components/dashboard/inbox-view";

export const metadata = constructMetadata({
  title: "Apex Inbox",
  description: "Your AI-powered email command center.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return <InboxView user={user} />;
}
