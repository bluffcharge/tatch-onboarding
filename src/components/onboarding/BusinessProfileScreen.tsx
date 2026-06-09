"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { AddressAutocomplete, type StructuredAddress } from "@/components/ui/AddressAutocomplete";
import { OnboardingShell } from "./OnboardingShell";
import { CardBack } from "./CardBack";
import { useInvite } from "@/lib/useInvite";

export function BusinessProfileScreen() {
  const router = useRouter();
  const invite = useInvite();

  // Step 1 (auth) forwards how the account was created via the invite
  // prefill: Google hands back a name + email; email sign-up just the email.
  const [firstName, setFirstName] = useState(invite.prefill?.firstName ?? "");
  const [lastName, setLastName] = useState(invite.prefill?.lastName ?? "");

  // Company is pre-known from the invite — confirm, don't re-type.
  const [name, setName] = useState(invite.partnerCompany ?? "");
  const [email, setEmail] = useState(
    invite.prefill?.email ??
      (invite.invitedRecipient?.kind === "email" ? invite.invitedRecipient.value : ""),
  );

  const [addrText, setAddrText] = useState("");
  const [picked, setPicked] = useState<StructuredAddress | null>(null);
  const [manual, setManual] = useState(false);

  // Manual-entry state (separate so we can toggle without losing what's typed)
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  // Mobile number is the important add — required, since we text the
  // app-download link here right after sign-up. Pre-filled only if the
  // operator typed one on the invite.
  const [, setPhone] = useState(invite.prefill?.phone ?? "");
  const [phoneValid, setPhoneValid] = useState(false);

  const addressOk = manual
    ? line1.trim().length > 1 && city.trim().length > 1 && stateVal.length === 2 && zip.length === 5
    : Boolean(picked) || addrText.trim().length > 4;
  const canContinue =
    firstName.trim().length > 1 && name.trim().length > 1 && phoneValid && addressOk;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      journey={{ currentKey: "business" }}
      center
      vAlign="top"
    >
      {/* Floating card frame on md+ (matches the create-account step Armen
          signed off on); plain top-aligned form on mobile. */}
      <div className="mt-2 md:mx-auto md:mt-0 md:w-full md:max-w-[520px] md:rounded-3xl md:border md:border-border md:bg-card md:p-8 md:shadow-lg">
        <CardBack href="/onboarding/auth" />
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          A few details to finish.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          {invite.prefill?.firstName
            ? "We pulled what we could from your sign-up — confirm the rest."
            : "We use this to match you to nearby operators and to set up your app."}
        </p>

        <div className="space-y-4">
          {/* Your name — pre-filled from Google, manual for email sign-up. */}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="First name"
              autoComplete="given-name"
              placeholder="Jordan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus={!firstName}
            />
            <TextField
              label="Last name"
              autoComplete="family-name"
              placeholder="Avery"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <TextField
            label="Business name"
            placeholder="e.g. Northwind Roofing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helper={invite.partnerCompany ? "Pre-filled from your invite — edit if it's off." : undefined}
          />

          {!manual ? (
            <>
              <AddressAutocomplete
                value={addrText}
                onTextChange={setAddrText}
                onSelect={(addr) => setPicked(addr)}
                onClear={() => setPicked(null)}
                helper="Pick from the dropdown for fastest entry."
              />
              {picked && (
                <div className="rounded-md border border-border-subtle bg-subtle px-3 py-2 text-[12.5px] text-ink-subtitle">
                  Locked to{" "}
                  <span className="font-semibold text-ink-title">
                    {picked.line1}, {picked.city}, {picked.state} {picked.zip}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setManual(true)}
                className="text-[12.5px] font-medium text-ink-body hover:text-ink-title hover:underline"
              >
                Enter address manually →
              </button>
            </>
          ) : (
            <>
              <TextField
                label="Street address"
                placeholder="123 Main St."
                autoComplete="address-line1"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
              />
              <div className="grid grid-cols-[1fr_72px_88px] gap-3">
                <TextField
                  label="City"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <TextField
                  label="State"
                  autoComplete="address-level1"
                  maxLength={2}
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value.toUpperCase())}
                />
                <TextField
                  label="ZIP"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <button
                type="button"
                onClick={() => setManual(false)}
                className="text-[12.5px] font-medium text-ink-body hover:text-ink-title hover:underline"
              >
                ← Back to address search
              </button>
            </>
          )}

          <div className="border-t border-border-subtle pt-4 md:pt-6">
            <p className="t-mono-label mb-3">Contact</p>
            <div className="space-y-4">
              {/* Mobile number is the key add: we text the app-download link
                  here so the partner lands on their phone, already in-flow. */}
              <PhoneInput
                label="Mobile number"
                defaultValue={invite.prefill?.phone ?? ""}
                onChange={(v, valid) => {
                  setPhone(v);
                  setPhoneValid(valid);
                }}
                helper="We'll text a link here so you can set up the Tatch app on your phone."
              />
              <TextField
                label="Account email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                helper="From your sign-up — used for important account notices."
              />
            </div>
          </div>
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
