"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { AddressAutocomplete, type StructuredAddress } from "@/components/ui/AddressAutocomplete";
import { OnboardingShell } from "./OnboardingShell";
import { CardBack } from "./CardBack";
import { useInvite } from "@/lib/useInvite";

/**
 * Tight variant of the create-account "step 2". Everything the sign-up
 * already knows (name, company, email) collapses into a confirm panel, so
 * the actual task is just the two things we still need: a mobile number
 * (to text the app link) and a business address. Onboarding is a tax —
 * this version keeps the visible ask to the minimum.
 */
export function FinishAccountScreen() {
  const router = useRouter();
  const invite = useInvite();

  const [firstName, setFirstName] = useState(invite.prefill?.firstName ?? "");
  const [lastName, setLastName] = useState(invite.prefill?.lastName ?? "");
  const [company, setCompany] = useState(invite.partnerCompany ?? "");
  const [email, setEmail] = useState(
    invite.prefill?.email ??
      (invite.invitedRecipient?.kind === "email" ? invite.invitedRecipient.value : ""),
  );
  // If we don't have a name yet (email sign-up), open the editable fields so
  // it doesn't read as "confirmed" when there's nothing to confirm.
  const [editing, setEditing] = useState(!invite.prefill?.firstName);

  const [addrText, setAddrText] = useState("");
  const [picked, setPicked] = useState<StructuredAddress | null>(null);

  const [, setPhone] = useState(invite.prefill?.phone ?? "");
  const [phoneValid, setPhoneValid] = useState(false);

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const addressOk = Boolean(picked) || addrText.trim().length > 4;
  const canContinue =
    firstName.trim().length > 1 && company.trim().length > 1 && phoneValid && addressOk;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      journey={{ currentKey: "business" }}
      center
      vAlign="top"
    >
      <div className="mt-2 md:mt-0 md:mx-auto md:w-full md:max-w-[440px] md:rounded-3xl md:border md:border-border md:bg-card md:p-8 md:shadow-lg">
        <CardBack href="/onboarding/auth" />
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          Last step.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-7 lg:text-[16px]">
          Confirm your info, then add a phone and address so we can set up your app.
        </p>

        {/* Confirmed identity — collapses name + company + email into one
            glanceable block with an Edit affordance. */}
        {!editing ? (
          <div className="mb-5 rounded-2xl border border-border-subtle bg-subtle px-4 py-3.5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-ink-title text-[13px] font-semibold text-canvas"
              >
                {(firstName[0] ?? company[0] ?? "?").toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink-title">{fullName}</p>
                <p className="truncate text-[12.5px] text-ink-subtitle">{company}</p>
                <p className="truncate text-[12.5px] text-ink-disabled">{email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-medium text-ink-body hover:text-ink-title hover:underline"
              >
                <Pencil size={13} strokeWidth={1.85} />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-5 space-y-4 rounded-2xl border border-border-subtle bg-subtle/60 p-4">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="First name"
                placeholder="Jordan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus={!firstName}
              />
              <TextField
                label="Last name"
                placeholder="Avery"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <TextField
              label="Business name"
              placeholder="e.g. Northwind Roofing"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <TextField
              label="Account email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
            />
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-[12.5px] font-medium text-ink-body hover:text-ink-title hover:underline"
              disabled={!firstName.trim() || !company.trim()}
            >
              Done editing
            </button>
          </div>
        )}

        {/* The actual asks. */}
        <div className="space-y-4">
          <PhoneInput
            label="Mobile number"
            defaultValue={invite.prefill?.phone ?? ""}
            onChange={(v, valid) => {
              setPhone(v);
              setPhoneValid(valid);
            }}
            helper="We'll text a link here so you can set up the Tatch app on your phone."
          />
          <AddressAutocomplete
            value={addrText}
            onTextChange={setAddrText}
            onSelect={(addr) => setPicked(addr)}
            onClear={() => setPicked(null)}
            helper="Business address — pick from the dropdown for fastest entry."
          />
          {picked && (
            <div className="rounded-md border border-border-subtle bg-subtle px-3 py-2 text-[12.5px] text-ink-subtitle">
              Locked to{" "}
              <span className="font-semibold text-ink-title">
                {picked.line1}, {picked.city}, {picked.state} {picked.zip}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button
            fullWidth
            size="lg"
            disabled={!canContinue}
            onClick={() => router.push("/onboarding/discovery")}
          >
            Continue
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
