import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Admin — Apex Inbox" };

function badge(label: string, color: string) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sessions: { orderBy: { expires: "desc" }, take: 1 },
      emailAccounts: {
        include: {
          emails: { select: { id: true }, take: 1 },
          _count: { select: { emails: true } },
        },
      },
    },
  });

  const totalEmails = await prisma.email.count();
  const totalFollowUps = await prisma.followUp.count();

  return (
    <div className="min-h-screen bg-[#07111c] p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-[#8da4be]">
            {users.length} registered user{users.length !== 1 ? "s" : ""} ·{" "}
            {totalEmails.toLocaleString()} emails processed ·{" "}
            {totalFollowUps.toLocaleString()} follow-ups
          </p>
        </div>

        <div className="border-white/8 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-white/8 bg-white/4 border-b text-left text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Last Session</th>
                <th className="px-4 py-3">Gmail Connected</th>
                <th className="px-4 py-3">Last Sync</th>
                <th className="px-4 py-3">Emails</th>
                <th className="px-4 py-3">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const account = u.emailAccounts[0] ?? null;
                const lastSession = u.sessions[0] ?? null;
                const isSessionActive =
                  lastSession && new Date(lastSession.expires) > new Date();
                const lastSync = account?.lastSyncAt;
                const syncIsStale =
                  lastSync &&
                  Date.now() - new Date(lastSync).getTime() >
                    1000 * 60 * 60 * 24;
                const emailCount = account?._count.emails ?? 0;
                const hasSub = !!u.stripeSubscriptionId;
                const subActive =
                  hasSub &&
                  u.stripeCurrentPeriodEnd &&
                  new Date(u.stripeCurrentPeriodEnd) > new Date();

                return (
                  <tr
                    key={u.id}
                    className="border-white/4 hover:bg-white/2 border-b last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.image}
                            alt=""
                            className="size-7 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{u.name ?? "—"}</p>
                          <p className="text-xs text-[#8da4be]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.role === "ADMIN"
                        ? badge("Admin", "bg-purple-500/20 text-purple-300")
                        : badge("User", "bg-white/8 text-[#8da4be]")}
                    </td>
                    <td className="px-4 py-3 text-[#8da4be]">
                      {formatDistanceToNow(new Date(u.createdAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {lastSession ? (
                        <span
                          className={
                            isSessionActive
                              ? "text-emerald-400"
                              : "text-[#8da4be]"
                          }
                        >
                          {isSessionActive
                            ? "Active"
                            : formatDistanceToNow(
                                new Date(lastSession.expires),
                                {
                                  addSuffix: true,
                                },
                              )}
                        </span>
                      ) : (
                        <span className="text-[#4d6479]">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {account ? (
                        <div>
                          {badge(
                            account.provider,
                            account.isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300",
                          )}
                          <p className="mt-0.5 text-xs text-[#8da4be]">
                            {account.email}
                          </p>
                        </div>
                      ) : (
                        badge("Not connected", "bg-white/8 text-[#4d6479]")
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lastSync ? (
                        <span
                          className={
                            syncIsStale ? "text-amber-400" : "text-emerald-400"
                          }
                        >
                          {formatDistanceToNow(new Date(lastSync), {
                            addSuffix: true,
                          })}
                        </span>
                      ) : (
                        <span className="text-[#4d6479]">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#8da4be]">
                      {emailCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {subActive
                        ? badge("Active", "bg-emerald-500/20 text-emerald-300")
                        : hasSub
                          ? badge("Expired", "bg-red-500/20 text-red-300")
                          : badge("Free", "bg-white/8 text-[#4d6479]")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
