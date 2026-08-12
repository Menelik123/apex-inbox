import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  redirect("/dashboard");
}
