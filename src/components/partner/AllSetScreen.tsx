"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
  Check,
  ChevronRight,
} from "lucide-react";
import { PartnerShell } from "./PartnerShell";
import { useInvite } from "@/lib/useInvite";

const PARTNER_APP = "https://tatch-half-mvp.vercel.app";

/* P7 — the terminal confirmation. The copy's job (PRD Stories 3 & 4) is to
   confirm the two invisible side effects of acceptance: the operator-partner
   linkage, and every operator contact (not just the BDM) landing in the
   partner's contact list. Three variants: new partner, linked-company
   rollup, and the existing-partner short-circuit. */
export function AllSetScreen() {
  const sp = useSearchParams();
  const invite = useInvite();
  const existing = sp.get("existing") === "1";
  const invites = parseInt(sp.get("invites") ?? "0", 10) || 0;

  const { inviter, operator, linkedCompany } = invite;
  // "Sara and 4 teammates" — the BDM plus the rest of the operator's users.
  // The existing-partner line already names the operator, so it skips the
  // "from {operator}" qualifier to avoid naming them twice in one sentence.
  const contactsPhrase = `${inviter.firstName} and ${operator.teammateCount} teammates from ${operator.name} have been added to your contacts`;
  const contactsPhraseShort = `${inviter.firstName} and ${operator.teammateCount} teammates have been added to your contacts`;

  return (
    <PartnerShell variant="center">
      <div className="op-terminal">
        <span className="op-orb" aria-hidden="true">
          <Check size={34} strokeWidth={3} />
        </span>
        <h1 className="op-h1">
          {existing ? "You're connected." : linkedCompany ? `You're connected — under ${linkedCompany.name}.` : "You're connected."}
        </h1>
        <p className="op-sub">
          {existing ? (
            <>
              {operator.name} is now connected to your account — {contactsPhraseShort}.
              Nothing else changed.
            </>
          ) : linkedCompany ? (
            <>
              Your account rolls up under {linkedCompany.name}. {contactsPhrase},
              and they can start sending referrals right away.
            </>
          ) : (
            <>
              {contactsPhrase}, and they can start sending referrals right away.
              {invites > 0 && (
                <>
                  {" "}
                  Your {invites} teammate{invites === 1 ? "" : "s"} will get an
                  invitation shortly.
                </>
              )}
            </>
          )}
        </p>
        <a className="op-btn op-btn--primary" href={PARTNER_APP} target="_top">
          Open Tatch
        </a>

        {/* Notification expectations — the partner's default set from the
            notifications catalog (lead-stage, lead-qualified, wal-sent /
            lead-payout-pending), in plain language. Sets the "what happens
            next" contract before they ever open the app. */}
        <NotificationExpectations />

        {/* Dev-facing contract preview (TATCH-416) — the payload the partner
            side emits back to the operator system on acceptance, restored
            from the previous P7. Collapsed by default; hidden in prod. */}
        <ResolvedRecordSummary invite={invite} />
      </div>
    </PartnerShell>
  );
}

/* "What you'll hear about" — the notifications a partner account starts
   with (per-notification defaults from the catalog). Three rows keep it
   scannable; the footnote points at the settings surface where the full
   catalog lives. Icons carry a shape signal alongside the labels so
   color is never doing the work alone. */
function NotificationExpectations() {
  return (
    <section className="op-hear" aria-labelledby="op-hear-title">
      <h2 className="op-hear-title" id="op-hear-title">
        What you&apos;ll hear about
      </h2>
      <ul className="op-hear-list">
        <li className="op-hear-item">
          <span className="op-hear-icon" aria-hidden="true">
            <ArrowLeftRight size={14} strokeWidth={2} />
          </span>
          <span>
            <strong>Lead status changes</strong> — when a referral you sent
            moves to a new stage.
          </span>
        </li>
        <li className="op-hear-item">
          <span className="op-hear-icon" aria-hidden="true">
            <BadgeCheck size={14} strokeWidth={2} />
          </span>
          <span>
            <strong>Qualified referrals</strong> — when a referral qualifies
            and a reward comes due to you.
          </span>
        </li>
        <li className="op-hear-item">
          <span className="op-hear-icon" aria-hidden="true">
            <Banknote size={14} strokeWidth={2} />
          </span>
          <span>
            <strong>Payouts</strong> — when money is on its way to
            your bank.
          </span>
        </li>
      </ul>
      <p className="op-hear-foot">
        Tune these anytime in Settings → Notifications.
      </p>
    </section>
  );
}

function ResolvedRecordSummary({ invite }: { invite: ReturnType<typeof useInvite> }) {
  const [open, setOpen] = useState(false);
  const payload = {
    inviteToken: "abc123",
    acceptedAt: new Date().toISOString(),
    operator: { id: "summit", name: invite.operator.name },
    invitee: {
      firstName: invite.prefill?.firstName ?? null,
      lastName: invite.prefill?.lastName ?? null,
      email: invite.prefill?.email ?? null,
      phone:
        invite.invitedRecipient?.kind === "phone"
          ? invite.invitedRecipient.value
          : invite.prefill?.phone ?? null,
    },
    company: invite.linkedCompany
      ? { kind: "linked" as const, id: invite.linkedCompany.id, name: invite.linkedCompany.name }
      : {
          kind: "created" as const,
          // In the create variant the partner side would emit the fields
          // the invitee typed on the Your-business step here.
          name: "(value the invitee entered)",
          address: "(value the invitee entered)",
        },
    nextStage: "ACTIVE",
  };
  return (
    <div style={{ marginTop: 34, width: "100%", textAlign: "left" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "1px solid var(--op-line)",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--op-faint)",
        }}
      >
        <ChevronRight
          size={11}
          strokeWidth={2}
          style={{ transition: "transform .15s ease", transform: open ? "rotate(90deg)" : "none" }}
        />
        Resolved partner record (contract)
      </button>
      {open && (
        <div
          style={{
            marginTop: 8,
            border: "1px solid var(--op-line)",
            borderRadius: 12,
            background: "var(--op-soft2)",
            padding: 14,
          }}
        >
          <p style={{ fontSize: 12, color: "var(--op-muted)", marginBottom: 10, lineHeight: 1.5 }}>
            Payload the partner side emits to the operator after acceptance —
            used to update the Prospect contact record created by the
            &ldquo;+ Invite User&rdquo; flow. Shown for cross-team contract
            reference.
          </p>
          <pre
            style={{
              overflowX: "auto",
              background: "var(--op-bg)",
              border: "1px solid var(--op-line)",
              borderRadius: 8,
              padding: 12,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              lineHeight: 1.6,
              color: "var(--op-muted)",
            }}
          >
{JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
