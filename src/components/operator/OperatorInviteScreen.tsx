"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Inbox,
  Mail,
  MessageSquareText,
  MoreVertical,
  Plus,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Wordmark } from "@/components/ui/Wordmark";

type InviteStatus = "sent" | "opened" | "linked" | "expired";

const STATUS_STYLE: Record<InviteStatus, { label: string; cls: string }> = {
  sent:    { label: "Sent",     cls: "bg-subtle text-ink-body" },
  opened:  { label: "Opened",   cls: "bg-royal-50 text-royal-700 dark:bg-royal-900 dark:text-white" },
  linked:  { label: "Linked",   cls: "bg-[#E6F8F0] text-[#0F6B47] dark:bg-[#0E3B2A] dark:text-[#A8E6CA]" },
  expired: { label: "Expired",  cls: "bg-subtle text-ink-caption" },
};

const RECENT: Array<{
  id: string;
  recipient: string;
  kind: "phone" | "email";
  status: InviteStatus;
  bdm: string;
  sentAt: string;
}> = [
  { id: "1", recipient: "(555) 014-2207",       kind: "phone", status: "opened",  bdm: "Sara Hernandez", sentAt: "2h ago"  },
  { id: "2", recipient: "joel@apexroofing.com", kind: "email", status: "linked",  bdm: "Sara Hernandez", sentAt: "1d ago"  },
  { id: "3", recipient: "(555) 902-3318",       kind: "phone", status: "sent",    bdm: "Tomás León",     sentAt: "1d ago"  },
  { id: "4", recipient: "(555) 766-1129",       kind: "phone", status: "expired", bdm: "Sara Hernandez", sentAt: "11d ago" },
];

export function OperatorInviteScreen() {
  return (
    <div className="onboarding-canvas min-h-[100dvh] text-ink">
      <Topbar />
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-16 pt-6">
        <PageHeader />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px] 2xl:gap-8">
          <SendInviteCard />
          <CodesCard />
        </div>
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <header className="border-b border-border-subtle bg-card">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-6">
          <Link href="/gallery" className="flex items-center">
            <Wordmark className="h-[17px]" />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {["Dash", "Leads", "Records", "Wallet"].map((n) => (
              <span
                key={n}
                className="rounded-md px-2.5 py-1 text-[13px] text-ink-caption"
              >
                {n}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {/* Avatar highlighted with a subtle violet ring to anchor the
              "you opened this from the avatar menu" mental model. */}
          <div className="relative">
            <span aria-hidden="true" className="absolute -inset-1 rounded-pill ring-2 ring-royal-400/40" />
            <div className="relative grid h-8 w-8 place-items-center rounded-pill bg-brand-gradient-4 text-[12px] font-semibold text-white">
              S
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PageHeader() {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="t-mono-label mb-2">From your account menu</p>
        <h1 className="t-h1 2xl:text-[44px]">Invite a partner</h1>
        <p className="t-body mt-2 max-w-[60ch] text-ink-subtitle">
          Send a TatchLink to a new partner company. They&apos;ll get a text (or
          email) to set up their account and link to Summit Builders. Existing
          Tatch partners are short-circuited to one tap.
        </p>
      </div>
    </div>
  );
}

type Recipient = { id: string; value: string; touched: boolean };

function rid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Each recipient validates on its own so the operator can see exactly
 *  which entries are bad (Ernest's note) — phone or email per row. */
function classifyRecipient(v: string): "phone" | "email" | "empty" | "invalid" {
  const t = v.trim();
  if (!t) return "empty";
  if (t.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? "email" : "invalid";
  }
  const digits = t.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? "phone" : "invalid";
}

function SendInviteCard() {
  const [rows, setRows] = useState<Recipient[]>(() => [{ id: rid(), value: "", touched: false }]);
  const [submitted, setSubmitted] = useState(false);
  const [sentToast, setSentToast] = useState<string | null>(null);

  function update(id: string, value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, value } : r)));
  }
  function touch(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, touched: true } : r)));
  }
  function addRow() {
    setRows((rs) => [...rs, { id: rid(), value: "", touched: false }]);
  }
  function removeRow(id: string) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }

  const nonEmpty = rows.filter((r) => r.value.trim());
  const validCount = nonEmpty.filter((r) => classifyRecipient(r.value) !== "invalid").length;
  const invalidCount = nonEmpty.length - validCount;

  function send() {
    setSubmitted(true);
    if (invalidCount > 0 || validCount === 0) return; // surface per-row errors
    setSentToast(
      `Invite${validCount === 1 ? "" : "s"} sent to ${validCount} recipient${validCount === 1 ? "" : "s"}.`
    );
    setRows([{ id: rid(), value: "", touched: false }]);
    setSubmitted(false);
    setTimeout(() => setSentToast(null), 3500);
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-xs">
      <h2 className="t-h3 mb-1">Send a new invite</h2>
      <p className="t-caption mb-4">
        We&apos;ll send by SMS where you give us a number, and fall back to email otherwise.
      </p>

      <label className="text-[13px] font-medium text-ink-body">Recipients</label>
      {/* One input per recipient so each phone/email validates on its own —
          invalid entries are flagged individually instead of disappearing
          into a single combined field. */}
      <div className="mt-1.5 space-y-2">
        {rows.map((row) => {
          const kind = classifyRecipient(row.value);
          const showErr = (row.touched || submitted) && kind === "invalid";
          return (
            <div key={row.id}>
              <div
                className={[
                  "flex items-center gap-2 rounded-md border bg-card px-2.5 transition-colors duration-fast ease-snap",
                  showErr
                    ? "border-error"
                    : "border-border focus-within:border-royal-400 focus-within:shadow-[0_0_0_2px_var(--royal-100)]",
                ].join(" ")}
              >
                <span className={["shrink-0", showErr ? "text-error" : "text-ink-caption"].join(" ")}>
                  {row.value.includes("@") ? <Mail size={14} /> : <MessageSquareText size={14} />}
                </span>
                <input
                  value={row.value}
                  onChange={(e) => update(row.id, e.target.value)}
                  onBlur={() => touch(row.id)}
                  placeholder="Phone number or email"
                  aria-invalid={showErr}
                  aria-label="Recipient phone number or email"
                  className="h-10 flex-1 bg-transparent text-[13px] text-ink-title outline-none placeholder:text-ink-disabled"
                />
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    aria-label="Remove recipient"
                    className="shrink-0 text-ink-caption hover:text-ink-title"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {showErr && (
                <p role="alert" className="mt-1 text-[12px] text-error">
                  Enter a valid phone number or email.
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
      >
        <Plus size={14} strokeWidth={1.75} />
        Add another
      </button>
      <p className="t-caption mt-2">
        By sending, you confirm recipients have consented to receive marketing texts.
      </p>

      <div className="mt-5">
        <p className="t-mono-label mb-2">Outgoing message preview</p>
        <div className="rounded-md border border-border-subtle bg-subtle p-3 text-[13px] text-ink-body">
          Sara at Summit Builders invited you to Tatch — set up your account: <span className="text-ink-link">tatch.app/j/abc123</span> · Reply STOP to opt out.
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="t-caption">
          {sentToast ? (
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check size={13} strokeWidth={2.25} /> {sentToast}
            </span>
          ) : (
            <>This sends immediately. Scheduled send coming soon.</>
          )}
        </p>
        <Button
          size="md"
          disabled={nonEmpty.length === 0}
          onClick={send}
          leadingIcon={<Send size={14} strokeWidth={1.75} />}
        >
          Send TatchLink invite
        </Button>
      </div>
    </section>
  );
}

function CodesCard() {
  return (
    <section className="space-y-5">
      <CodeBlock
        title="Company Code"
        sub="Anyone who joins via this code is linked to Summit Builders."
        code="SUMMIT-7K2"
      />
      <CodeBlock
        title="My BDM Code"
        sub="New partners using this code are credited to you (Sara)."
        code="SARA-94F"
      />
    </section>
  );
}

function CodeBlock({
  title,
  sub,
  code,
}: {
  title: string;
  sub: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="t-h4">{title}</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-caption hover:text-ink-body"
          onClick={() => alert("(prototype) — would rotate the code with a confirm")}
        >
          <RotateCcw size={12} strokeWidth={1.75} />
          Rotate
        </button>
      </div>
      <p className="t-caption mt-1">{sub}</p>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-border-subtle bg-subtle px-3 py-2.5">
        <span className="flex-1 font-mono text-[15px] font-semibold tracking-[0.12em] text-ink-title">
          {code}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-2 text-[12px] font-medium text-ink-body hover:bg-subtle"
        >
          {copied ? <Check size={12} strokeWidth={2.25} /> : <Copy size={12} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        <ShareButton icon={<MessageSquareText size={12} />} label="Share via SMS" />
        <ShareButton icon={<Mail size={12} />} label="Share via Email" />
      </div>
    </div>
  );
}

function ShareButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={() => alert(`(prototype) — would open ${label.toLowerCase()} composer`)}
      className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-card text-[12px] font-medium text-ink-body hover:bg-subtle"
    >
      {icon}
      {label}
    </button>
  );
}

function RecentInvitesCard({ className = "" }: { className?: string }) {
  return (
    <section className={"rounded-lg border border-border bg-card shadow-xs " + className}>
      <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div>
          <h2 className="t-h3">Recent invites</h2>
          <p className="t-caption">Last 30 days · 4 invites · 1 linked</p>
        </div>
        <TextField
          placeholder="Search recipient or BDM"
          className="max-w-[260px]"
          leadingAdornment={<Inbox size={14} strokeWidth={1.75} />}
        />
      </header>

      <ul role="list" className="divide-y divide-border-subtle">
        {RECENT.map((r) => {
          const s = STATUS_STYLE[r.status];
          return (
            <li key={r.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3 hover:bg-subtle">
              <div className="flex items-center gap-3 min-w-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-pill bg-subtle text-ink-caption">
                  {r.kind === "phone" ? <MessageSquareText size={13} /> : <Mail size={13} />}
                </span>
                <span className="truncate text-[13.5px] font-medium text-ink-title">{r.recipient}</span>
              </div>
              <span className={["inline-flex items-center rounded-pill px-2 py-0.5 text-[11.5px] font-semibold", s.cls].join(" ")}>{s.label}</span>
              <span className="hidden sm:inline text-[12.5px] text-ink-caption">via {r.bdm}</span>
              <span className="text-[12.5px] text-ink-caption">{r.sentAt}</span>
              <button
                type="button"
                aria-label="More actions"
                className="grid h-8 w-8 place-items-center rounded-md text-ink-caption hover:bg-subtle"
                onClick={() => alert("(prototype) — Resend / Copy link / Revoke")}
              >
                <MoreVertical size={14} strokeWidth={1.75} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
