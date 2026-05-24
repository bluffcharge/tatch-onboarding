"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { AddressAutocomplete, type StructuredAddress } from "@/components/ui/AddressAutocomplete";
import { OnboardingShell } from "./OnboardingShell";
import { defaultInvite } from "@/lib/mockInvite";

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

  const [phone, setPhone] = useState("(555) 014-2207");
  const [email, setEmail] = useState("");

  const addressOk = manual
    ? line1.trim().length > 1 && city.trim().length > 1 && stateVal.length === 2 && zip.length === 5
    : Boolean(picked) || addrText.trim().length > 4;
  const canContinue = name.trim().length > 1 && addressOk;

  // Build a single display string for the preview card.
  const previewAddress = manual
    ? [line1, [city, stateVal, zip].filter(Boolean).join(" ").trim()]
        .filter(Boolean)
        .join(", ")
    : picked
    ? `${picked.line1}, ${picked.city}, ${picked.state} ${picked.zip}`
    : addrText;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      backHref="/onboarding/auth"
      journey={{ currentKey: "business" }}
      wide
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
      <div className="mt-2 md:mt-0">
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          Tell us about your business.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          We use this to match you to nearby operators and to label referrals correctly.
        </p>

        {/* 2-col on lg+: form left, live operator-preview right. The
            preview column widens at 2xl so the card has room to read. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 2xl:grid-cols-[minmax(0,1fr)_460px] 2xl:gap-20">
          {/* Form — cap field width on md+ to track the Continue CTA cap. */}
          <div className="space-y-4 md:max-w-[480px] lg:max-w-[520px]">
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
              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
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

          {/* Operator preview (lg+ only). Sticky so it follows long forms. */}
          <aside
            aria-label="Operator preview"
            className="mt-10 hidden lg:mt-0 lg:block"
          >
            <div className="sticky top-6">
              <div className="mb-3 flex items-center gap-2 text-ink-caption">
                <Eye size={13} strokeWidth={1.75} />
                <p className="t-mono-label">
                  What {defaultInvite.operator.name} sees
                </p>
              </div>
              <OperatorPreviewCard
                name={name}
                address={previewAddress}
                phone={phone}
                email={email}
              />
              <p className="mt-3 text-[11.5px] leading-relaxed text-ink-caption">
                Updates as you type. Your operator can&apos;t see this until you
                finish onboarding.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* ----------------- Operator-side preview card ------------------ */

function OperatorPreviewCard({
  name,
  address,
  phone,
  email,
}: {
  name: string;
  address: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      {/* Mock operator-app chrome */}
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-subtle/50 px-3.5 py-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-caption">
          <span className="grid h-3.5 w-3.5 place-items-center rounded-sm bg-brand-gradient-4 text-white">
            <span className="text-[7px] font-bold">t</span>
          </span>
          Summit Builders · Partners
        </div>
        <span className="text-[10px] text-ink-disabled">New</span>
      </div>

      {/* Row */}
      <div className="flex items-start gap-3 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-subtle text-ink-body">
          <Building2 size={17} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-[14px] font-semibold text-ink-title">
            {name || (
              <span className="italic text-ink-disabled">
                (your business name)
              </span>
            )}
          </p>
          <p className="truncate text-[12px] leading-snug text-ink-subtitle">
            {address || (
              <span className="italic text-ink-disabled">
                (address you enter)
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-1 text-[11.5px] text-ink-caption">
            {phone && <span>{phone}</span>}
            {phone && email && <span className="text-ink-disabled">·</span>}
            {email && <span className="truncate">{email}</span>}
            {!phone && !email && (
              <span className="italic text-ink-disabled">
                (contact info)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between gap-2 border-t border-border-subtle px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-pill bg-[#F6A623]" />
          <span className="text-[11.5px] font-medium text-ink-body">
            Pending activation
          </span>
        </div>
        <span className="text-[11px] text-ink-caption">
          Invited by Sara
        </span>
      </div>
    </div>
  );
}
