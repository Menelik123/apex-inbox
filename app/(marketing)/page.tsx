import Link from "next/link";

import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Apex Inbox — Your AI Sales Inbox",
  description:
    "Stop drowning in email. Apex Inbox reads every message, ranks what matters, and tells you exactly what to do next — so no lead, follow-up, or deal ever slips through.",
});

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
    example: "Existing agent checking in on commission status",
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
    body: "One click generates a context-aware draft in your voice. Edit, approve, and send — or discard. You're always in control.",
  },
  {
    title: "Ask AI Anything",
    body: "Open any email and ask: 'What's the policy number they mentioned?' or 'Is this person a good fit?' Get a grounded answer in seconds.",
  },
  {
    title: "Schedule Follow-Ups",
    body: "Set a reminder directly from the email. Pick a date, add a note, and Apex Inbox keeps track so you never ghost a warm lead.",
  },
  {
    title: "Smart Sync",
    body: "Connects to your Gmail inbox and continuously pulls new messages. AI classifies them in real time — no manual sorting ever.",
  },
  {
    title: "One-Click Reclassify",
    body: "AI got it wrong? Correct the category with a single click. Your override sticks permanently and trains the system to do better.",
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
    fix: "AI reads every message and gives you a three-sentence brief. Read what matters.",
  },
];

const PLANS = [
  {
    name: "Solo",
    price: "$49",
    period: "/mo",
    description:
      "One inbox, full AI power. Built for the solo operator who can't afford to miss a lead.",
    features: [
      "1 Gmail inbox connected",
      "Unlimited AI categorization",
      "AI draft replies",
      "Ask AI on any email",
      "Schedule follow-ups",
      "Smart sync with auto-pagination",
    ],
    cta: "Start free trial",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    description:
      "For sales coaches and team leaders managing multiple inboxes and pipelines.",
    features: [
      "Up to 3 Gmail inboxes",
      "Everything in Solo",
      "Priority AI processing",
      "Follow-up pipeline view",
      "Category analytics",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/login",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description:
      "Running a team or managing inboxes for multiple clients? Let's build something together.",
    features: [
      "Unlimited inboxes",
      "White-label option",
      "Multi-user access",
      "Custom AI business context per inbox",
      "Dedicated onboarding",
      "Everything in Pro",
    ],
    cta: "Contact us",
    href: "mailto:support@apexdigi.org",
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="text-white" style={{ background: "#080e18" }}>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-28 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            AI-Powered Email Intelligence
          </span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-6xl">
          Your inbox is running your business.
          <br />
          <span className="text-emerald-400">Time to flip that.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#8da4be]">
          Apex Inbox reads every email the moment it arrives, sorts it into the
          right bucket, and tells you exactly what to do next. Hot leads.
          Pending responses. Client follow-ups. You see what matters — and
          nothing you don&apos;t.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Start free — connect your inbox
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-white/15 px-8 py-3.5 text-base font-medium text-[#8da4be] transition-colors hover:border-white/30 hover:text-white"
          >
            See how it works
          </a>
        </div>

        <p className="mt-5 text-sm text-[#4d6479]">
          No credit card required. Works with Gmail. Setup in under 2 minutes.
        </p>
      </section>

      {/* Pain Points — emotional hook */}
      <section
        className="border-white/8 border-t"
        style={{ background: "#0c1520" }}
      >
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
                className="border-white/8 flex flex-col gap-4 rounded-xl border p-7"
                style={{ background: "#0a1320" }}
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
                <div className="border-white/8 mt-auto border-t pt-4">
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

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
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
              body: "Every email is analyzed by Claude AI — categorized, summarized, and given a suggested action. You open the app to decisions, not raw mail.",
            },
            {
              step: "03",
              title: "Act in one click",
              body: "Reply with an AI draft, schedule a follow-up, or archive the noise. Every action is one click from the moment you see the email.",
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="border-white/8 rounded-xl border p-7"
              style={{ background: "#0c1520" }}
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
                {step}
              </p>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-[#8da4be]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Showcase — unique to Apex Inbox */}
      <section
        className="border-white/8 border-t"
        style={{ background: "#0c1520" }}
      >
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
                <div className="flex shrink-0 items-center gap-2.5 sm:w-40">
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

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
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
                <p className="text-sm leading-relaxed text-[#8da4be]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section
        className="border-white/8 border-t"
        style={{ background: "#0c1520" }}
      >
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
              — Greg G., Life Insurance Sales Coach
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#4d6479]">
            Pricing
          </p>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="mx-auto max-w-xl text-[#8da4be]">
            Start free. Connect your inbox. Upgrade when you&apos;re ready. No
            long-term contracts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-white/10"
              }`}
              style={!plan.highlighted ? { background: "#0c1520" } : undefined}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-white">
                    Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <p className="mb-1 text-sm font-semibold text-[#8da4be]">
                  {plan.name}
                </p>
                <div className="mb-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="mb-1 text-sm text-[#4d6479]">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[#8da4be]">
                  {plan.description}
                </p>
              </div>
              <ul className="mb-8 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
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
                href={plan.href}
                className={`rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-emerald-500 text-white hover:bg-emerald-400"
                    : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="border-white/8 border-t"
        style={{ background: "#0c1520" }}
      >
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
            Works with Gmail. Setup in under 2 minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
