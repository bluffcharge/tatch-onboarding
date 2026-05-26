"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import { ArrowRight } from "lucide-react";
import { AsYouType } from "libphonenumber-js";
import { TicketPrimaryCTA } from "@/components/ui/TicketPrimaryCTA";
import {
  DarkFieldHelper,
  DarkFieldLabel,
  DarkFieldWrapper,
  DarkInviterBadge,
  DarkTertiaryLink,
} from "@/components/ui/DarkField";
import { OnboardingShell } from "./OnboardingShell";
import { OnboardingTicketFrame } from "./OnboardingTicketFrame";
import { defaultInvite } from "@/lib/mockInvite";

type Phase = "enter" | "otp";

/**
 * P2 — Identity. Lives inside the inset ticket frame so the dark
 * hang-tag motif from P1 carries through the flow. Form fields use the
 * dark variant we built for the back-of-ticket code entry (white/15
 * border, white/55 on focus, near-transparent fill).
 */
export function AuthScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const via = (sp.get("via") || "phone") as "phone" | "email" | "google";

  // existing-account branch: ?existing=1 short-circuits past onboarding
  const existingFlag = sp.get("existing") === "1";
  const next = existingFlag
    ? "/onboarding/done?existing=1"
    : "/onboarding/business";

  const [phase, setPhase] = useState<Phase>("enter");
  const [phoneValid, setPhoneValid] = useState(false);
  const seed = defaultInvite.invitedRecipient?.kind === "phone"
    ? defaultInvite.invitedRecipient.value.replace(/^\s*\+?1[\s\-.]?/, "")
    : "";
  const [phoneValue, setPhoneValue] = useState(() =>
    seed ? new AsYouType("US").input(seed) : ""
  );
  useEffect(() => {
    const digits = phoneValue.replace(/\D/g, "");
    setPhoneValid(digits.length >= 10);
  }, [phoneValue]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  function submit() {
    if (via === "google") {
      router.push(next);
      return;
    }
    if (phase === "enter") {
      setPhase("otp");
      return;
    }
    // otp phase — any 6 digits accepted in the prototype
    setTimeout(() => router.push(next), 250);
  }

  const continueDisabled =
    phase === "enter"
      ? via === "phone"
        ? !phoneValid
        : via === "email"
          ? !(email.length > 3 && password.length >= 6)
          : false
      : otp.replace(/\D/g, "").length < 6;

  return (
    <OnboardingShell backHref="/j/abc123" journey={{ currentKey: "auth" }}>
      <div className="mt-2 md:mx-auto md:max-w-[380px] lg:max-w-[460px]">
        <OnboardingTicketFrame
          eyebrow="Step 2 · Identity"
          serial={`PASS · ${defaultInvite.operator.name.replace(/\s+/g, "").toUpperCase().slice(0, 6)} · ${defaultInvite.inviter.firstName.toUpperCase()}`}
          footer={
            <TicketPrimaryCTA
              icon={<ArrowRight size={15} strokeWidth={1.85} />}
              onClick={submit}
              disabled={continueDisabled}
            >
              {phase === "otp"
                ? "Verify"
                : via === "phone"
                  ? "Send code"
                  : via === "email"
                    ? "Continue"
                    : "Continue with Google"}
            </TicketPrimaryCTA>
          }
        >
          {/* Inviter context — dark variant of the breadcrumb. */}
          <DarkInviterBadge
            initial={defaultInvite.inviter.firstName[0]}
            operatorName={defaultInvite.operator.name}
            inviterName={defaultInvite.inviter.fullName}
          />

          {phase === "enter" && (
            <>
              <h1 className="mt-4 text-[22px] font-semibold leading-[1.15] text-white lg:text-[26px]">
                {via === "phone" && "What's your mobile number?"}
                {via === "email" && "Sign in or create your account."}
                {via === "google" && "Continue with Google."}
              </h1>
              <p className="mt-2 text-[13px] leading-snug text-white/55 lg:text-[13.5px]">
                {via === "phone" &&
                  "We'll text you a 6-digit code to verify. Standard message rates apply."}
                {via === "email" &&
                  "Use the email your operator sent the invite to, or any address you check often."}
                {via === "google" &&
                  "Sign in with your Google account in the next step. We never see your password."}
              </p>

              {via === "phone" && (
                <div className="mt-5">
                  <DarkFieldLabel>Mobile number</DarkFieldLabel>
                  <DarkFieldWrapper>
                    <span className="select-none rounded-[6px] bg-white/[0.08] px-2 py-1 text-[12.5px] font-semibold text-white">
                      +1
                    </span>
                    <input
                      autoFocus
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(555) 014-2207"
                      value={phoneValue}
                      onChange={(e) =>
                        setPhoneValue(new AsYouType("US").input(e.target.value))
                      }
                      className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                    />
                  </DarkFieldWrapper>
                  <DarkFieldHelper>
                    We&apos;ll never share your number. Reply STOP any time to opt out.
                  </DarkFieldHelper>
                </div>
              )}

              {via === "email" && (
                <div className="mt-5 space-y-3">
                  <div>
                    <DarkFieldLabel>Email</DarkFieldLabel>
                    <DarkFieldWrapper>
                      <input
                        autoFocus
                        type="email"
                        autoComplete="email"
                        placeholder="you@yourcompany.com"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)
                        }
                        className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                      />
                    </DarkFieldWrapper>
                  </div>
                  <div>
                    <DarkFieldLabel>Password</DarkFieldLabel>
                    <DarkFieldWrapper>
                      <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="•••••••••"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                      />
                    </DarkFieldWrapper>
                    <DarkFieldHelper>At least 8 characters, with one number.</DarkFieldHelper>
                  </div>
                </div>
              )}

              {/* Alt-path tertiary links — uppercase mono-ish to echo the
                  ticket's serial / eyebrow language. */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                {via !== "phone" && (
                  <DarkTertiaryLink onClick={() => router.replace("/onboarding/auth?via=phone")}>
                    Use phone instead →
                  </DarkTertiaryLink>
                )}
                {via !== "google" && (
                  <DarkTertiaryLink onClick={() => router.replace("/onboarding/auth?via=google")}>
                    Use Google instead →
                  </DarkTertiaryLink>
                )}
              </div>
            </>
          )}

          {phase === "otp" && (
            <>
              <h1 className="mt-4 text-[22px] font-semibold leading-[1.15] text-white lg:text-[26px]">
                Enter the code we sent.
              </h1>
              <p className="mt-2 text-[13px] leading-snug text-white/55 lg:text-[13.5px]">
                We just texted a 6-digit code to your number. It expires in 10 minutes.
              </p>

              <div className="mt-5">
                <DarkFieldLabel>Verification code</DarkFieldLabel>
                <DarkFieldWrapper>
                  <input
                    autoFocus
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123 456"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.replace(/\D/g, "").length === 6) {
                        submit();
                      }
                    }}
                    className="h-full w-full bg-transparent text-[18px] font-semibold tracking-[0.4em] text-white outline-none placeholder:text-white/35 placeholder:tracking-[0.4em]"
                  />
                </DarkFieldWrapper>
                <DarkFieldHelper>
                  Prototype — any 6 digits work (try 123456).
                </DarkFieldHelper>
              </div>

              <div className="mt-5">
                <DarkTertiaryLink onClick={() => setPhase("enter")}>
                  ← Change number
                </DarkTertiaryLink>
              </div>
            </>
          )}
        </OnboardingTicketFrame>
      </div>
    </OnboardingShell>
  );
}

