import Link from "next/link";

import { env } from "@/env.mjs";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Security — Apex Inbox",
  description:
    "How Apex Inbox handles your Gmail access, email data, OAuth scopes, encryption, and account deletion. Everything you need to know before connecting your inbox.",
  canonicalUrl: `${env.NEXT_PUBLIC_APP_URL}/security`,
});

const SCOPES = [
  {
    scope: "https://www.googleapis.com/auth/gmail.modify",
    why: "A restricted Gmail scope that allows reading messages, composing and sending email, and modifying message labels (used for actions such as marking messages read and archiving). Apex Inbox uses this scope to sync your inbox, send replies you approve, and manage read/archive state. We do not delete messages or access Google Drive.",
  },
  {
    scope: "https://www.googleapis.com/auth/userinfo.email",
    why: "Identifies which Gmail account is being connected so we can associate inbox data with your Apex Inbox account.",
  },
  {
    scope: "https://www.googleapis.com/auth/userinfo.profile",
    why: "Provides your display name and profile photo for use in the app interface.",
  },
];

const SUBPROCESSORS = [
  {
    name: "Google (Gmail API, OAuth)",
    purpose: "Email access and user authentication",
    location: "United States",
  },
  {
    name: "Anthropic (Claude API)",
    purpose:
      "AI categorization, email summaries, draft reply generation, and Ask AI responses",
    location: "United States",
  },
  {
    name: "Neon",
    purpose:
      "PostgreSQL database hosting — stores account data, email metadata, and body text",
    location: "United States",
  },
  {
    name: "Vercel",
    purpose: "Application hosting, serverless functions, and CDN",
    location: "United States",
  },
];

export default function SecurityPage() {
  return (
    <div className="text-white" style={{ background: "#080e18" }}>
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Security
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">
            How we handle your inbox
          </h1>
          <p className="mx-auto max-w-xl text-[#8da4be]">
            Apex Inbox requires access to your Gmail to function. This page
            explains exactly what we access, why, and how we protect it. If you
            have questions, email{" "}
            <a
              href="mailto:support@apexdigi.org"
              className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
            >
              support@apexdigi.org
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Section: Google OAuth */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">
              Google OAuth and Gmail Access
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "#0c1520",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <p className="mb-4 text-sm leading-relaxed text-[#8da4be]">
                Apex Inbox connects to Gmail using Google&apos;s official OAuth
                2.0 flow. You authorize access through Google&apos;s consent
                screen — Apex Inbox never sees or stores your Google password.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-[#8da4be]">
                We store an OAuth access token and refresh token in our
                database, encrypted at rest, so the app can sync your inbox
                without requiring you to re-authorize every session. These
                tokens grant only the scopes you approved and can be revoked at
                any time from your Google Account&apos;s security settings at{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                >
                  myaccount.google.com/permissions
                </a>
                .
              </p>
              <p className="text-sm leading-relaxed text-[#8da4be]">
                You can also disconnect Gmail from within Apex Inbox at any
                time. Go to{" "}
                <strong className="text-white">
                  Settings → Connected Accounts
                </strong>{" "}
                and click Disconnect.
              </p>
            </div>
          </section>

          {/* Section: OAuth Scopes */}
          <section>
            <h2 className="mb-2 text-xl font-bold text-white">
              Exact OAuth Scopes We Request
            </h2>
            <p className="mb-6 text-sm text-[#8da4be]">
              We request the minimum scopes required to deliver the product.
            </p>
            <div className="flex flex-col gap-4">
              {SCOPES.map(({ scope, why }) => (
                <div
                  key={scope}
                  className="rounded-xl border p-5"
                  style={{
                    background: "#0c1520",
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <code className="mb-2 block font-mono text-xs text-emerald-400">
                    {scope}
                  </code>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    {why}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Email Data */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">
              Email Data Storage and Processing
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "#0c1520",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex flex-col gap-5">
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    What we store
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    For each synced email we store: sender name, sender address,
                    subject, message body text (stripped of invisible formatting
                    characters), a snippet preview, the Gmail message ID, the AI
                    category assigned, and the AI-generated summary. We do not
                    store attachments.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    What we send to AI
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    When classifying an email or generating a draft reply, we
                    send the email subject and body text to Anthropic&apos;s
                    Claude API. By default, Anthropic does not use commercial
                    API inputs to train shared models, per their usage policies.
                    We do not have a separately negotiated zero-data-retention
                    agreement beyond Anthropic&apos;s standard commercial API
                    terms. Your email content is sent only to generate your
                    specific result — never shared with other users.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    Archive and read-state
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    When you archive or mark an email as read in Apex Inbox,
                    that action currently updates Apex&apos;s database only. The
                    email&apos;s state in your Gmail inbox is not changed. Gmail
                    synchronization for archive and read actions is planned for
                    a future release.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    What we do not do
                  </p>
                  <ul className="flex flex-col gap-1 text-sm text-[#8da4be]">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      We do not sell your email data to any third party
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      We do not use your emails to train any AI model
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      We do not access your Sent, Trash, or other folders beyond
                      what you sync
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-400">✓</span>
                      We do not read emails stored before your first sync unless
                      you trigger a sync
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Encryption */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">
              Encryption and Transport Security
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "#0c1520",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <ul className="flex flex-col gap-3 text-sm text-[#8da4be]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  All traffic between your browser and Apex Inbox is encrypted
                  over HTTPS (TLS 1.2 or higher)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  All traffic between Apex Inbox and Google&apos;s APIs is
                  encrypted over HTTPS
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  OAuth tokens are stored as encrypted secrets and are never
                  exposed in client-side code or logs
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  Database credentials and API keys are stored as environment
                  secrets managed by Vercel — they are not committed to source
                  code
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  Database storage is provided by Neon, which encrypts data at
                  rest
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Data Retention */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">
              Data Retention and Deletion
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "#0c1520",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    While your account is active
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    Synced email data is retained to power the inbox experience.
                    Follow-up reminders and notes are retained until you delete
                    them.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    Disconnecting Gmail
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    Disconnecting your Gmail account from Settings removes your
                    stored OAuth tokens. Synced email data stored in our
                    database remains until you delete your account. We will add
                    a &quot;delete synced emails only&quot; option in a future
                    release.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-white">
                    Deleting your account
                  </p>
                  <p className="text-sm leading-relaxed text-[#8da4be]">
                    Deleting your account removes all your data — account
                    record, synced emails, follow-ups, and OAuth tokens — from
                    our database within 30 days. You can initiate account
                    deletion from{" "}
                    <strong className="text-white">
                      Settings → Danger Zone
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Subprocessors */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">Subprocessors</h2>
            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "#0c1520",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#4d6479]">
                      Service
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#4d6479]">
                      Purpose
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#4d6479]">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SUBPROCESSORS.map(({ name, purpose, location }, i) => (
                    <tr
                      key={name}
                      style={{
                        background: i % 2 === 0 ? "#080e18" : "#0a1220",
                        borderBottom:
                          i < SUBPROCESSORS.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : undefined,
                      }}
                    >
                      <td className="px-5 py-4 font-medium text-white">
                        {name}
                      </td>
                      <td className="px-5 py-4 text-[#8da4be]">{purpose}</td>
                      <td className="px-5 py-4 text-[#8da4be]">{location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Access Controls */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">
              Access Controls
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "#0c1520",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <ul className="flex flex-col gap-3 text-sm text-[#8da4be]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  All API routes are authenticated — unauthenticated requests
                  return 401
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  All database queries are scoped to the authenticated
                  user&apos;s ID — one user cannot read another&apos;s emails
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  Production environment variables are managed through Vercel
                  and are never committed to source control
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                  Apex Inbox does not yet hold a SOC 2 certification — we are an
                  early-stage product. We are committed to transparent security
                  practices while we grow
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Contact */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-white">
              Security Contact
            </h2>
            <div
              className="rounded-xl border p-6"
              style={{
                background: "#0c1520",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-sm leading-relaxed text-[#8da4be]">
                To report a security vulnerability or ask questions about how we
                handle your data, email{" "}
                <a
                  href="mailto:support@apexdigi.org"
                  className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                >
                  support@apexdigi.org
                </a>{" "}
                with the subject line{" "}
                <strong className="text-white">Security Report</strong>. We will
                acknowledge your report within 48 hours.
              </p>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-sm text-[#4d6479] underline underline-offset-4 hover:text-white"
          >
            ← Back to Apex Inbox
          </Link>
        </div>
      </div>
    </div>
  );
}
