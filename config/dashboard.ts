import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "INBOX",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "All Emails" },
      { href: "/dashboard?category=hot-leads", icon: "arrowUpRight", title: "Hot Leads" },
      { href: "/dashboard?category=needs-response", icon: "messages", title: "Needs Response" },
      { href: "/dashboard?category=client-followups", icon: "user", title: "Client Follow-Ups" },
      { href: "/dashboard?category=admin", icon: "billing", title: "Admin & Logistics" },
      { href: "/dashboard?category=noise", icon: "trash", title: "Noise" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
    ],
  },
];
