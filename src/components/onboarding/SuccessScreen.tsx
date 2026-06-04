"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import { useInvite } from "@/lib/useInvite";

export function SuccessScreen() {
  const invite = useInvite();
  const existing = invite.isExistingPartner;
  const [showDetails, setShowDetails] = useState(false);
  const { inviter, operator, linkedCompany } = invite;

  const headline = existing
    ? `${operator.name} is now connected to your account.`
    : linkedCompany
      ? `You're connected — under ${linkedCompany.name}.`
      : "You're all set.";
  // Name the human as the only semibold line (pattern 05).
  const attribution = existing
    ? `Invited by ${inviter.fullName}`
    : `With ${inviter.fullName} at ${operator.name}`;
  const sub = existing
    ? `${operator.teammateCount} teammates added to your contacts. Nothing else changed.`
    : linkedCompany
      ? `Your account rolls up under ${linkedCompany.name}. ${operator.teammateCount} teammates from ${operator.name} have been added to your contacts.`
      : `${operator.teammateCount} teammates have been added to your contacts.`;

  return (
    <OnboardingShell chrome={false} center>
      <div className="flex w-full max-w-[600px] flex-col items-center px-6 text-center">
        <div className="relative mb-7 h-16 w-16">
          <span className="absolute inset-0 rounded-pill bg-brand-gradient-4 opacity-90" />
          <span className="absolute inset-0 grid place-items-center text-white">
            <Check size={28} strokeWidth={2.5} />
          </span>
        </div>

        <h1 className="t-h1 mb-2 text-balance 2xl:text-[52px] 2xl:leading-[1.05]">{headline}</h1>
        <p className="text-[18px] font-semibold text-ink-title md:text-[20px]">{attribution}</p>
        <p className="t-body-lg mt-2 max-w-[44ch] text-ink-subtitle">{sub}</p>

        <button
          type="button"
          onClick={() => setShowDetails((s) => !s)}
          className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
          aria-expanded={showDetails}
        >
          View connection details
          <ChevronDown
            size={14}
            strokeWidth={1.75}
            className={[
              "transition-transform duration-fast ease-snap",
              showDetails ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {showDetails && <ConnectionSummary invite={invite} />}

        {/* Single CTA — capped per pattern 05 (160–220px, never full-bleed). */}
        <div className="mt-8 w-full max-w-[220px]">
          <Button
            fullWidth
            size="lg"
            onClick={() => alert("(prototype) — would land on the partner home")}
          >
            Go to home
          </Button>
        </div>

        <ResolvedRecordSummary invite={invite} />
      </div>
    </OnboardingShell>
  );
}

function ConnectionSummary({ invite }: { invite: ReturnType<typeof useInvite> }) {
  const { operator, inviter, linkedCompany } = invite;
  return (
    <div className="mt-4 w-full rounded-lg border border-border bg-card p-4 text-left shadow-xs">
      <Row label="Operator">{operator.name}</Row>
      <Row label="Invited by">
        {inviter.fullName} · {inviter.title}
      </Row>
      {linkedCompany && (
        <Row label="Joined company">
          {linkedCompany.name}
          {linkedCompany.industry ? ` · ${linkedCompany.industry}` : ""}
        </Row>
      )}
      <Row label="Linked at">{new Date().toLocaleString()}</Row>
      <Row label="Teammates added">{operator.teammateCount}</Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle py-2.5 last:border-b-0">
      <span className="t-mono-label">{label}</span>
      <span className="text-right text-[13px] font-medium text-ink-title">
        {children}
      </span>
    </div>
  );
}

/* ----------------- Resolved partner record (contract preview) -----------
   On a real acceptance, the partner side emits this payload back to the
   operator system so they can update the Prospect record we created when
   the invite was sent (correct legal name, address, etc.). This panel
   shows the contract shape so the engineering teams on both sides can
   wire it without ambiguity. Collapsed by default; hidden in production. */

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
          // In the create variant the partner side would emit the
          // fields the invitee typed in BusinessProfileScreen here.
          name: "(value the invitee entered)",
          address: "(value the invitee entered)",
        },
    nextStage: "ACTIVE",
  };
  return (
    <div className="mt-10 w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-caption hover:bg-subtle hover:text-ink-body"
      >
        <ChevronsRight
          size={11}
          strokeWidth={1.85}
          className={[
            "transition-transform duration-fast ease-snap",
            open ? "rotate-90" : "",
          ].join(" ")}
        />
        Resolved partner record (contract)
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-border bg-subtle/40 p-3 text-left">
          <p className="t-caption mb-2">
            Payload the partner side will emit to the operator after
            acceptance — used to update the Prospect contact record
            created by the &ldquo;+ Invite User&rdquo; flow. Shown here for
            cross-team contract reference.
          </p>
          <pre className="overflow-x-auto rounded-md bg-canvas p-3 font-mono text-[11px] leading-relaxed text-ink-body">
{JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
