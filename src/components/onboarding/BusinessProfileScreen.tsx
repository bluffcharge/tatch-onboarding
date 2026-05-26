"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TicketPrimaryCTA } from "@/components/ui/TicketPrimaryCTA";
import {
  DarkFieldHelper,
  DarkFieldLabel,
  DarkFieldWrapper,
  DarkTertiaryLink,
} from "@/components/ui/DarkField";
import { OnboardingShell } from "./OnboardingShell";
import { OnboardingTicketFrame } from "./OnboardingTicketFrame";

/**
 * P3 — Business profile. Lives inside the inset ticket frame so the dark
 * hang-tag motif carries from P1/P2 through this step. Dropped the
 * lg+ "What Summit Builders sees" live-preview panel from the previous
 * version — the dark frame is the focus here. The preview can return
 * as a dark-variant card if we want it back, but the form first.
 */
export function BusinessProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [addrText, setAddrText] = useState("");
  const [manual, setManual] = useState(false);

  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [zip, setZip] = useState("");

  const [phone, setPhone] = useState("(555) 014-2207");
  const [email, setEmail] = useState("");

  const addressOk = manual
    ? line1.trim().length > 1 && city.trim().length > 1 && stateVal.length === 2 && zip.length === 5
    : addrText.trim().length > 4;
  const canContinue = name.trim().length > 1 && addressOk;

  return (
    <OnboardingShell
      step={{ current: 1, total: 3 }}
      backHref="/onboarding/auth"
      journey={{ currentKey: "business" }}
    >
      <div className="mt-2 md:mx-auto md:max-w-[760px] lg:max-w-[920px]">
        <OnboardingTicketFrame
          eyebrow="Step 3 · Business"
          serial="PASS · BUSINESS · IDENTITY"
          footer={
            <div className="md:max-w-[420px]">
              <TicketPrimaryCTA
                icon={<ArrowRight size={15} strokeWidth={1.85} />}
                onClick={() => router.push("/onboarding/discovery")}
                disabled={!canContinue}
              >
                Continue
              </TicketPrimaryCTA>
            </div>
          }
        >
          <h1 className="text-[26px] font-semibold leading-[1.15] text-white md:text-[32px] lg:text-[36px]">
            Tell us about your business.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-snug text-white/75 lg:text-[15px]">
            We use this to match you to nearby operators and to label referrals correctly.
          </p>

          <div className="mt-6 space-y-4 md:max-w-[560px]">
            <div>
              <DarkFieldLabel>Business name</DarkFieldLabel>
              <DarkFieldWrapper>
                <input
                  autoFocus
                  placeholder="e.g. Northwind Roofing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                />
              </DarkFieldWrapper>
            </div>

            {!manual ? (
              <div>
                <DarkFieldLabel>Business address</DarkFieldLabel>
                <DarkFieldWrapper>
                  <input
                    type="text"
                    autoComplete="street-address"
                    placeholder="Start typing your address…"
                    value={addrText}
                    onChange={(e) => setAddrText(e.target.value)}
                    className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                  />
                </DarkFieldWrapper>
                <DarkFieldHelper>
                  Pick from your dropdown for fastest entry.
                </DarkFieldHelper>
                <div className="mt-2">
                  <DarkTertiaryLink onClick={() => setManual(true)}>
                    Enter address manually →
                  </DarkTertiaryLink>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <DarkFieldLabel>Street address</DarkFieldLabel>
                  <DarkFieldWrapper>
                    <input
                      autoComplete="address-line1"
                      placeholder="123 Main St."
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                    />
                  </DarkFieldWrapper>
                </div>
                <div className="grid grid-cols-[1fr_72px_88px] gap-3">
                  <div>
                    <DarkFieldLabel>City</DarkFieldLabel>
                    <DarkFieldWrapper>
                      <input
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                      />
                    </DarkFieldWrapper>
                  </div>
                  <div>
                    <DarkFieldLabel>State</DarkFieldLabel>
                    <DarkFieldWrapper>
                      <input
                        autoComplete="address-level1"
                        maxLength={2}
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value.toUpperCase())}
                        className="h-full w-full bg-transparent text-[15px] uppercase text-white outline-none placeholder:text-white/45"
                      />
                    </DarkFieldWrapper>
                  </div>
                  <div>
                    <DarkFieldLabel>ZIP</DarkFieldLabel>
                    <DarkFieldWrapper>
                      <input
                        autoComplete="postal-code"
                        inputMode="numeric"
                        maxLength={5}
                        value={zip}
                        onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                        className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                      />
                    </DarkFieldWrapper>
                  </div>
                </div>
                <DarkTertiaryLink onClick={() => setManual(false)}>
                  ← Back to address search
                </DarkTertiaryLink>
              </div>
            )}

            {/* Primary contact — dashed perforation echo, then grid. */}
            <div className="border-t border-dashed border-white/8 pt-4">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                Primary contact
              </p>
              <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                <div>
                  <DarkFieldLabel>Business phone</DarkFieldLabel>
                  <DarkFieldWrapper>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                    />
                  </DarkFieldWrapper>
                  <DarkFieldHelper>Pre-filled from your sign-up.</DarkFieldHelper>
                </div>
                <div>
                  <DarkFieldLabel>Contact email</DarkFieldLabel>
                  <DarkFieldWrapper>
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dispatch@northwindroofing.com"
                      className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
                    />
                  </DarkFieldWrapper>
                  <DarkFieldHelper>Optional — for important account notices.</DarkFieldHelper>
                </div>
              </div>
            </div>
          </div>
        </OnboardingTicketFrame>
      </div>
    </OnboardingShell>
  );
}
