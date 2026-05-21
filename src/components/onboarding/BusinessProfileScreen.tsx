"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AddressAutocomplete, type StructuredAddress } from "@/components/ui/AddressAutocomplete";
import { OnboardingShell } from "./OnboardingShell";

export function BusinessProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [addrText, setAddrText] = useState("");
  const [picked, setPicked] = useState<StructuredAddress | null>(null);
  const [manual, setManual] = useState(false);

  // Manual-entry state (separate so we can toggle without losing what's typed)
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  const addressOk = manual
    ? line1.trim().length > 1 && city.trim().length > 1 && stateVal.length === 2 && zip.length === 5
    : Boolean(picked) || addrText.trim().length > 4;
  const canContinue = name.trim().length > 1 && addressOk;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      backHref="/onboarding/auth"
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={!canContinue}
          onClick={() => router.push("/onboarding/discovery")}
        >
          Continue
        </Button>
      }
    >
      <div className="mt-2">
        <h1 className="t-h2 mb-2">Tell us about your business.</h1>
        <p className="t-body mb-6 text-ink-subtitle">
          We use this to match you to nearby operators and to label referrals correctly.
        </p>

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

          <div className="border-t border-border-subtle pt-4">
            <p className="t-mono-label mb-3">Primary contact</p>
            <div className="space-y-4">
              <TextField
                label="Business phone"
                type="tel"
                autoComplete="tel"
                defaultValue="(555) 014-2207"
                helper="Pre-filled from your sign-up. Change if you'd like."
              />
              <TextField
                label="Contact email"
                type="email"
                autoComplete="email"
                placeholder="dispatch@northwindroofing.com"
                helper="Optional — we'll only use this for important account notices."
              />
            </div>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
