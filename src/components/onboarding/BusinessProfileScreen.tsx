"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AddressAutocomplete, type StructuredAddress } from "@/components/ui/AddressAutocomplete";
import { OnboardingShell } from "./OnboardingShell";
import { useInvite } from "@/lib/useInvite";

export function BusinessProfileScreen() {
  const router = useRouter();
  const invite = useInvite();
  const [name, setName] = useState("");
  const [addrText, setAddrText] = useState("");
  const [picked, setPicked] = useState<StructuredAddress | null>(null);
  const [manual, setManual] = useState(false);

  // Manual-entry state (separate so we can toggle without losing what's typed)
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  // Phone + email pre-fill from the operator's invite payload. Falls
  // back to the invited recipient's phone (legacy default), then to the
  // demo phone number when nothing's been carried through.
  const [phone, setPhone] = useState(
    invite.prefill?.phone ??
      (invite.invitedRecipient?.kind === "phone"
        ? invite.invitedRecipient.value
        : "(555) 014-2207")
  );
  const [email, setEmail] = useState(
    invite.prefill?.email ??
      (invite.invitedRecipient?.kind === "email"
        ? invite.invitedRecipient.value
        : "")
  );

  const addressOk = manual
    ? line1.trim().length > 1 && city.trim().length > 1 && stateVal.length === 2 && zip.length === 5
    : Boolean(picked) || addrText.trim().length > 4;
  const canContinue = name.trim().length > 1 && addressOk;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      backHref="/onboarding/auth"
      journey={{ currentKey: "business" }}
      center
      vAlign="top"
    >
      <div className="mt-2 md:mx-auto md:mt-0 md:max-w-[520px]">
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          Tell us about your business.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          We use this to match you to nearby operators and to label referrals correctly.
        </p>

        {/* Single capped form column. The live operator-preview side-pane
            was cut (decorative per the Wide audit), so the form sits in
            cap-and-center geometry instead of a 2-column split. */}
        <div className="space-y-4">
            <TextField
              label="Business name"
              placeholder="e.g. Northwind Roofing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
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
              <p className="t-mono-label mb-3">Primary contact</p>
              {/* Phone locked to 140px (~44% reduction from the equal-split
                  baseline of ~250px) — the minimum width that renders
                  "(555) 014-2207" without clipping. Email takes the rest. */}
              <div className="grid gap-4 md:grid-cols-[140px_1fr] md:gap-5">
                <TextField
                  label="Business phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  helper="Pre-filled from your sign-up."
                />
                <TextField
                  label="Contact email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dispatch@northwindroofing.com"
                  helper="Optional — for important account notices."
                />
              </div>
            </div>
          </div>

          {/* Continue moved inline (out of the shell footer) so the form +
              CTA center together as one group. */}
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
