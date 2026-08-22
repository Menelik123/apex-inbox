import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { FollowUpsView } from "@/components/dashboard/follow-ups-view";

export const metadata = constructMetadata({
  title: "Follow-Ups – Apex Inbox",
  description: "View and manage your scheduled follow-ups.",
});

export default async function FollowUpsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");
  return (
    <>
      <h1 className="sr-only">Follow-Ups</h1>
      <FollowUpsView />
    </>
  );
}
