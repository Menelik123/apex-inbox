import Link from "next/link";

import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Pricing — Apex Inbox",
  description:
    "Simple, honest pricing for the AI Sales Action Inbox. Start free — no credit card required.",
  canonicalUrl: "https://apexinbox.live/pricing",
});

const SOLO_FEATURES = [
  "1 Gmail inbox",
  "AI categorization — 5 action buckets",
  "AI email summaries",
  "Ask AI on any email",
  "AI draft reply generation",
  "Send reply via Gmail",
  "Schedule follow-up reminders",
  "Smart sync with auto-pagination",
  "Full-text search (sender, subject, body)",
  "Archive and read-state management",
  "Manual category correction",
];

const FAQ = [
  {
    q: "What does 'Start free' mean?",
    a: "Apex Inbox is in early access. Connect your Gmail and use the full Solo plan. No credit card is required to get started.",
  },
  {
    q: "Is pricing monthly or annual?",
    a: "Monthly. No annual commitment required. Cancel at any time — cancellation takes effect at the end of your current billing period.",
  },
  {
    q: "What does 'AI categorization' mean in practice?",
    a: "Every email synced from your inbox is automatically classified into one of five action buckets: Hot Lead, Needs Response, Client Follow-Up, Admin, or Noise. No per-email charge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings at any time. You keep access through the end of the billing period you paid for.",
  },
  {
    q: "When are Pro and Agency available?",
    a: "Pro and Agency are in development. Join the waitlist and we'll notify you before launch.",
  },
];

export default function PricingPage() {
  return (
    <div className="text-white" style={{ background: "#080e18" }}>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Pricing
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">
            Simple, honest pricing
          </h1>
          <p className="mx-auto max-w-xl text-[#8da4be]">
            Start free. Connect your inbox. No credit card required.
          </p>
        </div>

        {/* Plans */}
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          {/* Solo */}
          <div
            className="relative flex flex-col rounded-xl border p-8"
            style={{
              background: "rgba(16,185,129,0.04)",
              borderColor: "rgba(16,185,129,0.35)",
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-white">
                Available now
              </span>
            </div>
            <div className="mb-6">
              <p className="mb-1 text-sm font-semibold text-[#8da4be]">Solo</p>
              <div className="mb-3 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="mb-1 text-sm text-[#4d6479]">/mo</span>
              </div>
              <p className="text-sm leading-relaxed text-[#8da4be]">
                One inbox. Full AI power. Built for the solo operator who
                can&apos;t afford to miss a lead.
              </p>
            </div>
            <ul className="mb-8 flex flex-1 flex-col gap-3">
              {SOLO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-[#eef2f7]"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
            >
              Start free trial
            </Link>
          </div>

          {/* Pro */}
          <div
            className="flex flex-col rounded-xl border p-8"
            style={{
              background: "#0c1520",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="mb-6">
              <p className="mb-1 text-sm font-semibold text-[#8da4be]">Pro</p>
              <div className="mb-3">
                <span className="text-2xl font-bold text-[#8da4be]">
                  Coming soon
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#8da4be]">
                Multiple inboxes, follow-up pipeline, analytics, and priority
                support. In development.
              </p>
            </div>
            <ul className="mb-8 flex flex-1 flex-col gap-3 text-[#4d6479]">
              {[
                "Everything in Solo",
                "Up to 3 Gmail inboxes",
                "Follow-up pipeline view",
                "Category analytics dashboard",
                "Priority AI processing",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="mailto:support@apexdigi.org?subject=Pro%20Waitlist"
              className="rounded-lg border border-white/15 py-3 text-center text-sm font-semibold text-[#8da4be] transition-colors hover:border-white/30 hover:text-white"
            >
              Join the waitlist
            </a>
          </div>

          {/* Agency */}
          <div
            className="flex flex-col rounded-xl border p-8"
            style={{
              background: "#0c1520",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="mb-6">
              <p className="mb-1 text-sm font-semibold text-[#8da4be]">
                Agency
              </p>
              <div className="mb-3">
                <span className="text-2xl font-bold text-[#8da4be]">
                  Talk to sales
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#8da4be]">
                Managing inboxes for a team or multiple clients? Let&apos;s
                build the right solution together.
              </p>
            </div>
            <ul className="mb-8 flex flex-1 flex-col gap-3 text-[#4d6479]">
              {[
                "Unlimited inboxes",
                "Multi-user access",
                "Custom AI business context",
                "White-label option",
                "Dedicated onboarding",
                "SLA and dedicated support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="mailto:support@apexdigi.org?subject=Agency%20Inquiry"
              className="rounded-lg border border-white/15 py-3 text-center text-sm font-semibold text-[#8da4be] transition-colors hover:border-white/30 hover:text-white"
            >
              Contact us
            </a>
          </div>
        </div>

        <p className="mb-20 text-center text-xs text-[#4d6479]">
          Solo is available today. Pro and Agency features listed are planned,
          not yet shipped.
        </p>

        {/* FAQ */}
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-white">
            Pricing FAQ
          </h2>
          <div className="flex flex-col gap-4">
            {FAQ.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl border p-6"
                style={{
                  background: "#0c1520",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <p className="mb-2 font-semibold text-white">{q}</p>
                <p className="text-sm leading-relaxed text-[#8da4be]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
