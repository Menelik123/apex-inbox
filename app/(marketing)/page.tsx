import Link from "next/link";

import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Apex Inbox — The AI Sales Action Inbox",
  description:
    "Every email gets a verdict. Every verdict gets a next action. Apex Inbox connects to Gmail, sorts your sales conversations into five action queues, and tells you exactly what to do next.",
  canonicalUrl: "https://apexinbox.io",
});

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Apex Digital",
      url: "https://apexinbox.io",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@apexdigi.org",
        contactType: "customer support",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Apex Inbox",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "An AI Sales Action Inbox that connects to Gmail, categorizes incoming emails into five action queues, generates AI summaries and draft replies, and helps sales teams respond faster to leads.",
      offers: {
        "@type": "Offer",
        price: "49",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "49",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is my Gmail data safe?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Apex Inbox connects through Google's official OAuth — we never see or store your Google password. You can revoke access from your Google Account settings at any time. All data is encrypted in transit and at rest.",
          },
        },
        {
          "@type": "Question",
          name: "Does my email content train AI models?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. By default, Anthropic does not use commercial API inputs to train shared models. Your email content is sent only to generate your specific categorizations and summaries — never shared with other users.",
          },
        },
        {
          "@type": "Question",
          name: "Which email categories does Apex Inbox use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every email is classified into one of five action buckets: Hot Lead, Needs Response, Client Follow-Up, Admin, and Noise.",
          },
        },
        {
          "@type": "Question",
          name: "Can I disconnect Gmail or delete my account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. From the Settings page you can disconnect your Gmail account or delete your Apex Inbox account entirely. Account deletion removes all your data within 30 days.",
          },
        },
      ],
    },
  ],
};

const DEMO_EMAILS = [
  {
    id: 1,
    from: "Marcus L.",
    subject: "Question about your coaching program",
    preview: "Hi, I came across your profile on LinkedIn and wanted to...",
    time: "9m ago",
    dot: "bg-emerald-400",
    badge: "Hot Lead",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    selected: true,
    unread: true,
  },
  {
    id: 2,
    from: "Jennifer K.",
    subject: "Quick question on the policy",
    preview: "Hey, following up on the whole life policy we discussed...",
    time: "45m ago",
    dot: "bg-amber-400",
    badge: "Needs Response",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    selected: false,
    unread: true,
  },
  {
    id: 3,
    from: "David M.",
    subject: "Checking in — policy renewal",
    preview: "I know we talked about renewing last quarter. Want to...",
    time: "2h ago",
    dot: "bg-blue-400",
    badge: "Client Follow-Up",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    selected: false,
    unread: false,
  },
  {
    id: 4,
    from: "Salesforce",
    subject: "Your August account statement",
    preview: "Your invoice for August 2026 is now available...",
    time: "3h ago",
    dot: "bg-slate-400",
    badge: "Admin",
    badgeColor: "text-slate-400 border-slate-500/30 bg-slate-500/10",
    selected: false,
    unread: false,
  },
  {
    id: 5,
    from: "InsuranceSummit",
    subject: "Register now — spots filling fast!",
    preview: "Don't miss the industry's biggest event of the year...",
    time: "5h ago",
    dot: "bg-zinc-500",
    badge: "Noise",
    badgeColor: "text-zinc-400 border-zinc-600/30 bg-zinc-600/10",
    selected: false,
    unread: false,
  },
];

const CATEGORIES = [
  {
    label: "Hot Lead",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
    example: "New prospect interested in your coaching program",
    action: "Reply within the hour. Strike while they're warm.",
  },
  {
    label: "Needs Response",
    color: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
    example: "Client asking about next steps in their policy",
    action: "Draft a reply. Your AI can write it in seconds.",
  },
  {
    label: "Client Follow-Up",
    color: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
    example: "Existing client checking in on renewal status",
    action: "Schedule a follow-up reminder — don't let it sit.",
  },
  {
    label: "Admin",
    color: "border-slate-500/40 bg-slate-500/10 text-slate-400",
    dot: "bg-slate-400",
    example: "Billing statement from your CRM platform",
    action: "Review when you have bandwidth. No urgency.",
  },
  {
    label: "Noise",
    color: "border-zinc-600/40 bg-zinc-600/10 text-zinc-400",
    dot: "bg-zinc-500",
    example: "Newsletter from a conference you attended once",
    action: "Filtered out. You never had to see it.",
  },
];

const FEATURES = [
  {
    title: "AI Email Categorization",
    body: "Every email is read and sorted into one of five action buckets the moment it lands. Hot leads never hide behind admin noise again.",
  },
  {
    title: "AI Draft Reply",
    body: "One click generates a context-aware draft in your voice. Review and edit in the app, then send directly through Gmail — or copy and discard.",
  },
  {
    title: "Ask AI Anything",
    body: "Open any email and ask: 'What's the policy number they mentioned?' or 'Is this a good fit?' Get a grounded answer in seconds.",
  },
  {
    title: "Schedule Follow-Ups",
    body: "Set a reminder directly from the email. Pick a date, add a note, and Apex Inbox keeps track so you never ghost a warm lead.",
  },
  {
    title: "Smart Sync",
    body: "Connects to your Gmail and syncs new messages in batches. AI classifies each one automatically — no manual sorting required.",
  },
  {
    title: "Manual Category Correction",
    body: "AI got it wrong? Override the category with one click. Your correction persists, keeping your inbox accurate over time.",
  },
];

const PAIN_POINTS = [
  {
    problem: "A hot lead emailed you on Tuesday.",
    consequence: "You saw it Friday — buried under 40 other messages.",
    fix: "Apex Inbox surfaces it the moment it arrives and tells you to reply now.",
  },
  {
    problem: "You meant to follow up with a prospect last week.",
    consequence: "You forgot. They went with someone else.",
    fix: "Schedule a follow-up in two taps. We remind you on the day you chose.",
  },
  {
    problem: "You spend an hour every morning reading emails.",
    consequence: "Half of them don't need you at all.",
    fix: "AI reads every message and gives you a clear action. Read what matters.",
  },
];

const TRUST_ITEMS = [
  {
    icon: "🔐",
    title: "Secure Google OAuth",
    body: "We never see or store your Google password. Access is granted through Google's official OAuth flow.",
  },
  {
    icon: "🔒",
    title: "Minimum OAuth Scopes",
    body: "We request only the Gmail scopes needed to read messages and send replies. Nothing more.",
  },
  {
    icon: "🚫",
    title: "Not Used to Train AI",
    body: "Your email content is processed by Anthropic's Claude API to generate your results. It is not used to train shared models.",
  },
  {
    icon: "🗑️",
    title: "Delete Anytime",
    body: "Disconnect Gmail or delete your account from Settings at any time. All data is removed within 30 days.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is my Gmail data safe?",
    a: "Yes. Apex Inbox connects through Google's official OAuth — we never see or store your Google password. You can revoke access from your Google Account settings at any time. All data is encrypted in transit and at rest.",
  },
  {
    q: "Does Apex Inbox read all my emails?",
    a: "When you run a sync, Apex Inbox reads the messages in your inbox to categorize and summarize them. We store the text needed to display your inbox within the app. We do not read your Sent, Drafts, or other folders unless you connect them.",
  },
  {
    q: "Does my email content train AI models?",
    a: "No. Your email content is sent to Anthropic's Claude API to generate your specific categorizations and summaries. Anthropic's API terms prohibit using your data to train shared models. Your inbox stays private to you.",
  },
  {
    q: "What does 'Start free' mean?",
    a: "Apex Inbox is currently in early access. You can connect your Gmail and use the full product. No credit card is required to get started.",
  },
  {
    q: "Can I disconnect Gmail or delete my account?",
    a: "Yes. From the Settings page you can disconnect your Gmail account or delete your Apex Inbox account entirely. Account deletion removes all your data from our systems within 30 days.",
  },
  {
    q: "Which email categories does Apex Inbox use?",
    a: "Every email is classified into one of five action buckets: Hot Lead, Needs Response, Client Follow-Up, Admin, and Noise. You can correct any classification with a single click, and your override persists.",
  },
];

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
  "Archive and read-state (Apex view)",
  "Manual category correction",
];

export default function HomePage() {
  return (
    <div className="text-white" style={{ background: "#080e18" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-28 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            The AI Sales Action Inbox
          </span>
        </div>

        <h1 className="mb-5 text-5xl font-extrabold leading-[1.08] tracking-tight text-white lg:text-6xl">
          Every email gets a verdict.
          <br />
          <span className="text-emerald-400">
            Every verdict gets a next action.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#8da4be]">
          Apex Inbox finds the leads, replies, and follow-ups buried in your
          Gmail — then tells you exactly what to do next. Built for insurance
          agents, sales coaches, and every solo operator who lives in their
          inbox.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Connect Gmail — Start Free
          </Link>
          <a
            href="#product"
            className="rounded-lg border border-white/15 px-8 py-3.5 text-base font-medium text-[#8da4be] transition-colors hover:border-white/30 hover:text-white"
          >
            See the product ↓
          </a>
        </div>

        <p className="mt-5 text-sm text-[#4d6479]">
          No credit card required · Secure Google OAuth · Setup in under 2
          minutes
        </p>
      </section>

      {/* ── Product Mockup ───────────────────────────────────────── */}
      <section id="product" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div
          className="overflow-hidden rounded-2xl border shadow-2xl"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-3 border-b px-4 py-3"
            style={{
              background: "#0c1520",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-amber-500/50" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
            </div>
            <div className="mx-auto rounded px-10 py-0.5 text-xs text-[#4d6479]">
              app.apexinbox.io — Inbox
            </div>
          </div>

          {/* App UI */}
          <div
            className="flex"
            style={{ background: "#080e18", minHeight: "440px" }}
          >
            {/* Email list */}
            <div
              className="hidden w-64 flex-col border-r sm:flex lg:w-72"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-xs font-semibold text-[#8da4be]">
                  Inbox
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  2 new
                </span>
              </div>
              {DEMO_EMAILS.map((email) => (
                <div
                  key={email.id}
                  className="cursor-pointer border-b px-4 py-3"
                  style={{
                    borderColor: "rgba(255,255,255,0.04)",
                    background: email.selected
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                  }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${email.dot}`}
                    />
                    <span
                      className={`truncate text-xs font-semibold ${email.unread ? "text-white" : "text-[#8da4be]"}`}
                    >
                      {email.from}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] text-[#4d6479]">
                      {email.time}
                    </span>
                  </div>
                  <p className="truncate pl-3.5 text-xs text-[#8da4be]">
                    {email.subject}
                  </p>
                  <p className="truncate pl-3.5 text-[10px] text-[#4d6479]">
                    {email.preview}
                  </p>
                </div>
              ))}
            </div>

            {/* Email detail */}
            <div className="flex flex-1 flex-col">
              {/* Detail header */}
              <div
                className="border-b px-6 py-4"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Hot Lead
                  </span>
                  <span className="text-xs text-[#4d6479]">9 minutes ago</span>
                </div>
                <h3 className="mb-0.5 text-base font-semibold text-white">
                  Question about your coaching program
                </h3>
                <p className="text-xs text-[#4d6479]">
                  Marcus L. &lt;marcus.l@email.com&gt;
                </p>
              </div>

              {/* AI Summary */}
              <div
                className="border-b px-6 py-4"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="rounded-lg border p-4"
                  style={{
                    background: "#0c1520",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    AI Summary
                  </p>
                  <p className="text-sm leading-relaxed text-[#c8d8e8]">
                    New prospect found you on LinkedIn. Interested in your 1:1
                    insurance sales coaching program. Mentions a team of 6
                    agents. High purchase intent — wants to discuss pricing this
                    week.
                  </p>
                </div>

                <div
                  className="mt-3 rounded-lg border p-3"
                  style={{
                    background: "rgba(16,185,129,0.05)",
                    borderColor: "rgba(16,185,129,0.15)",
                  }}
                >
                  <p className="text-xs font-semibold text-emerald-400">
                    Suggested action
                  </p>
                  <p className="mt-0.5 text-xs text-[#8da4be]">
                    Reply within the hour — this is a warm, high-value lead with
                    a clear buying signal.
                  </p>
                </div>
              </div>

              {/* Email body */}
              <div className="flex-1 px-6 py-4">
                <p className="text-sm leading-relaxed text-[#8da4be]">
                  Hi, I came across your LinkedIn profile and saw that you coach
                  insurance sales teams. I manage a team of 6 agents in the
                  Atlanta area and we&apos;re looking to tighten up our lead
                  response process...
                </p>
              </div>

              {/* Action bar */}
              <div
                className="flex items-center gap-2 border-t px-6 py-4"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-white">
                  Draft AI Reply
                </div>
                <div
                  className="rounded-md border px-4 py-2 text-xs font-semibold text-[#8da4be]"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  Schedule Follow-Up
                </div>
                <div
                  className="rounded-md border px-4 py-2 text-xs font-semibold text-[#8da4be]"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  Ask AI
                </div>
                <div
                  className="ml-auto rounded-md border px-4 py-2 text-xs font-semibold text-[#4d6479]"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  Archive
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#4d6479]">
          Sanitized demo data — your real inbox stays private.
        </p>
      </section>

      {/* ── Trust Bar ────────────────────────────────────────────── */}
      <section
        className="border-y"
        style={{
          background: "#0c1520",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-[#4d6479]">
            Security you can verify
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_ITEMS.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-3">
                <span className="shrink-0 text-xl">{icon}</span>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    {title}
                  </p>
                  <p className="text-xs leading-relaxed text-[#8da4be]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/security"
              className="text-xs text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
            >
              Read our full security details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pain Points ──────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            Sound familiar?
          </p>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight">
            Every day you don&apos;t have Apex Inbox, this is happening.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PAIN_POINTS.map(({ problem, consequence, fix }) => (
              <div
                key={problem}
                className="flex flex-col gap-4 rounded-xl border p-7"
                style={{
                  background: "#0c1520",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-400">
                    The Problem
                  </p>
                  <p className="font-semibold text-white">{problem}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#4d6479]">
                    What Happens
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    {consequence}
                  </p>
                </div>
                <div
                  className="mt-auto border-t pt-4"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    With Apex Inbox
                  </p>
                  <p className="text-sm leading-relaxed text-emerald-300/80">
                    {fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="border-t"
        style={{
          background: "#0c1520",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            How it works
          </p>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight">
            From cluttered inbox to clear actions in seconds
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect your Gmail",
                body: "One OAuth click. No app passwords, no forwarding rules. Apex Inbox connects directly to your Gmail in under 60 seconds.",
              },
              {
                step: "02",
                title: "AI reads and ranks everything",
                body: "Every email is analyzed by Claude AI — categorized, summarized, and given a suggested next action. You open the app to decisions, not raw mail.",
              },
              {
                step: "03",
                title: "Act in one click",
                body: "Reply with an AI draft, schedule a follow-up, or archive the noise. Every action is one click from the moment you see the email.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-xl border p-7"
                style={{
                  background: "#080e18",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  {step}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#8da4be]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Showcase ────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            Five buckets. Total clarity.
          </p>
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Every email gets a verdict the moment it lands.
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-[#8da4be]">
            Apex Inbox doesn&apos;t just sort your mail. It tells you what each
            email means for your business and what you should do about it.
          </p>
          <div className="flex flex-col gap-4">
            {CATEGORIES.map(({ label, color, dot, example, action }) => (
              <div
                key={label}
                className={`flex flex-col gap-3 rounded-xl border px-6 py-5 sm:flex-row sm:items-center sm:gap-6 ${color}`}
              >
                <div className="flex w-full shrink-0 items-center gap-2.5 sm:w-44">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                <div className="flex-1 text-sm text-[#8da4be]">
                  <span className="font-medium text-[#c8d8e8]">
                    &ldquo;{example}&rdquo;
                  </span>
                </div>
                <div className="shrink-0 text-xs font-medium sm:w-64 sm:text-right">
                  {action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section
        className="border-t"
        style={{
          background: "#0c1520",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            Features
          </p>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight">
            Everything your inbox should have been doing all along
          </h2>
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                <div>
                  <p className="mb-1 font-semibold text-white">{title}</p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ──────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <blockquote className="mx-auto max-w-2xl">
            <p className="text-xl font-medium italic leading-relaxed text-[#eef2f7]">
              &ldquo;I used to spend the first hour of my morning just reading
              through emails to figure out what needed my attention. Now I open
              Apex Inbox and everything is already sorted. I go straight to the
              hot leads and the responses I owe — the rest takes care of
              itself.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-[#4d6479]">
              — Greg G., Life Insurance Sales Coach · Early Access Customer
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── Security Overview ────────────────────────────────────── */}
      <section
        className="border-t"
        style={{
          background: "#0c1520",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
              Security
            </p>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              We handle your inbox with care
            </h2>
            <p className="mb-8 text-[#8da4be]">
              Apex Inbox requires Gmail access to work. We take that
              responsibility seriously. Read exactly how we handle your data,
              which OAuth scopes we use and why, and how to revoke access at any
              time.
            </p>
            <Link
              href="/security"
              className="inline-block rounded-lg border border-white/15 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Read our Security Details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            Pricing
          </p>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="mx-auto max-w-xl text-[#8da4be]">
            Start free. Connect your inbox. No credit card required. We
            won&apos;t charge you until you&apos;re ready.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Solo — fully available */}
          <div
            className="relative col-span-1 flex flex-col rounded-xl border p-8 md:col-span-1"
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

          {/* Pro — coming soon */}
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
                Multiple inboxes, follow-up pipeline view, category analytics,
                and priority support. In development.
              </p>
            </div>
            <ul className="mb-8 flex flex-1 flex-col gap-3">
              {[
                "Everything in Solo",
                "Up to 3 Gmail inboxes",
                "Follow-up pipeline view",
                "Category analytics dashboard",
                "Priority AI processing",
                "Priority support",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-[#4d6479]"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4d6479]"
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
                  {feature}
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

          {/* Agency — talk to sales */}
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
                Running a team or managing inboxes for multiple clients?
                Let&apos;s build the right solution together.
              </p>
            </div>
            <ul className="mb-8 flex flex-1 flex-col gap-3">
              {[
                "Unlimited inboxes",
                "Multi-user access",
                "Custom AI business context",
                "White-label option",
                "Dedicated onboarding",
                "SLA and dedicated support",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-[#4d6479]"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4d6479]"
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
                  {feature}
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

        <p className="mt-8 text-center text-xs text-[#4d6479]">
          Solo plan is fully available today. Pro and Agency are in development
          — features listed are planned, not yet shipped.
        </p>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section
        className="border-t"
        style={{
          background: "#0c1520",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            FAQ
          </p>
          <h2 className="mb-14 text-center text-3xl font-bold tracking-tight">
            Common questions
          </h2>
          <div className="flex flex-col gap-6">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl border p-6"
                style={{
                  background: "#080e18",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <p className="mb-2 font-semibold text-white">{q}</p>
                <p className="text-sm leading-relaxed text-[#8da4be]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Your next hot lead is already in your inbox.
          </h2>
          <p className="mx-auto mb-8 max-w-md text-[#8da4be]">
            Connect your Gmail in 60 seconds and see exactly what&apos;s been
            waiting for you.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-emerald-500 px-10 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Start free — no credit card required
          </Link>
          <p className="mt-4 text-sm text-[#4d6479]">
            Works with Gmail · Setup in under 2 minutes · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
