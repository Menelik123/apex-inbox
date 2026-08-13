import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Apex Inbox",
  description:
    "Your AI-powered email command center. Never miss a lead, a follow-up, or a deal again.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/apexdigi",
    github: "https://github.com/Menelik123/apex-inbox",
  },
  mailSupport: "support@apexdigi.org",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "Pricing", href: "/pricing" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Contact", href: "mailto:support@apexdigi.org" },
      { title: "Get Started", href: "/login" },
    ],
  },
];
