"use client";

import { useRouter } from "next/navigation";
import { Building2, Check, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext, LinkedCompany } from "@/lib/mockInvite";

type Props = { invite: InviteContext & { linkedCompany: LinkedCompany } };

/**
 * P3 — Join Company variant. Replaces the standard Business Profile
 * form when the operator's invite payload carries `linkedCompany`
 * (set when they chose an existing company in the "+ Invite User"
 * form). The invitee creates an account *under* this company instead
 * of creating a new one, so this screen is a confirmation + acknowledge
 * rather than a form.
 *
 * Sits in the same step slot as BusinessProfileScreen so the journey
 * rail still reads "Business profile" on the left — the eyebrow + step
 * pill copy is the only outward change. Skipping straight to P4
 * Discovery on continue.
 */
export function JoinCompanyScreen({ invite }: Props) {
  const router = useRouter();
  const { linkedCompany: co, operator } = invite;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      backHref="/onboarding/auth"
      journey={{ currentKey: "business" }}
      center
      vAlign="top"
    >
      <div className="mt-2 md:mx-auto md:mt-0 md:max-w-[520px]">
        <p className="t-mono-label mb-3">Company match</p>
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          You&apos;re joining {co.name}.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          {operator.name} attached this invite to an existing company on
          Tatch, so there&apos;s nothing to fill in here — your account
          will roll up under {co.name}&apos;s record.
        </p>

        {/* Company snapshot card — pulled from the linkedCompany payload.
            Read-only by design; the operator is the source of truth for
            this record on their CRM and we don't let the invitee edit
            company-level data on join. */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-subtle text-ink-body"
            >
              <Building2 size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold leading-tight text-ink-title">
                {co.name}
              </p>
              {co.industry && (
                <p className="mt-0.5 text-[12.5px] uppercase tracking-[0.12em] text-ink-caption">
                  {co.industry}
                </p>
              )}
            </div>
            <span
              aria-label="Verified by operator"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-ink-title text-canvas"
              title="Verified by operator"
            >
              <Check size={12} strokeWidth={2.5} />
            </span>
          </div>

          <div className="mt-4 space-y-2 border-t border-border-subtle pt-4">
            <Row icon={<MapPin size={14} strokeWidth={1.75} />}>
              {co.address.line1}, {co.address.city}, {co.address.state}{" "}
              {co.address.zip}
            </Row>
            {typeof co.teammateCount === "number" && (
              <Row icon={<Users size={14} strokeWidth={1.75} />}>
                {co.teammateCount} teammate
                {co.teammateCount === 1 ? "" : "s"} already on Tatch
              </Row>
            )}
          </div>
        </div>

        <p className="mt-4 text-[12.5px] leading-snug text-ink-caption">
          Wrong company? Ask {operator.name} to send a fresh invite without
          a company attached and you can set up your own.
        </p>

        {/* Continue moved inline (matches BusinessProfileScreen's pattern)
            so the form + CTA center together as one group. */}
        <div className="mt-8">
          <Button
            fullWidth
            size="lg"
            onClick={() => router.push("/onboarding/discovery")}
          >
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-[13px] leading-snug text-ink-body">
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-ink-caption">
        {icon}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}
