"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { OnboardingShell } from "./OnboardingShell";

export function BusinessProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const canContinue = name.trim().length > 1 && address.trim().length > 1;

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

          <TextField
            label="Street address"
            placeholder="123 Main St."
            autoComplete="address-line1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
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
