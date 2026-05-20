"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { TextField } from "@/components/ui/TextField";
import { defaultInvite } from "@/lib/mockInvite";

type Phase = "enter" | "otp";

export function AuthScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const via = (sp.get("via") || "phone") as "phone" | "email" | "google";

  // existing-account branch: ?existing=1 routes the success straight to short-circuit
  const existingFlag = sp.get("existing") === "1";
  const next = existingFlag
    ? "/onboarding/done?existing=1"
    : "/onboarding/business";

  const [phase, setPhase] = useState<Phase>("enter");
  const [phoneValid, setPhoneValid] = useState(false);

  return (
    <OnboardingShell
      backHref="/j/abc123"
      footer={
        phase === "enter" ? (
          <Button
            fullWidth
            size="lg"
            disabled={via === "phone" ? !phoneValid : false}
            onClick={() => {
              if (via === "google") {
                // pretend OAuth finished
                router.push(next);
              } else {
                setPhase("otp");
              }
            }}
          >
            {via === "phone" ? "Send code" : via === "email" ? "Continue" : "Continue with Google"}
          </Button>
        ) : (
          <p className="t-caption text-center">
            Didn&apos;t get it?{" "}
            <button
              type="button"
              className="font-medium text-ink-link hover:underline"
              onClick={() => alert("(prototype) — code re-sent")}
            >
              Resend in 60s
            </button>
          </p>
        )
      }
    >
      <div className="mt-2">
        {phase === "enter" && (
          <>
            <h1 className="t-h2 mb-2">
              {via === "phone" && "What's your mobile number?"}
              {via === "email" && "Sign in or create your account"}
              {via === "google" && "Continue with Google"}
            </h1>
            <p className="t-body mb-6 text-ink-subtitle">
              {via === "phone" &&
                "We'll text you a 6-digit code to verify. Standard message rates apply."}
              {via === "email" &&
                "Use the email your operator sent the invite to, or any address you check often."}
              {via === "google" &&
                "Sign in with your Google account in the next step. We never see your password."}
            </p>

            {via === "phone" && (
              <PhoneInput
                autoFocus
                defaultValue={defaultInvite.invitedRecipient?.kind === "phone" ? defaultInvite.invitedRecipient.value : ""}
                onChange={(_v, valid) => setPhoneValid(valid)}
                helper="We'll never share your number. Reply STOP any time to opt out."
              />
            )}

            {via === "email" && (
              <div className="space-y-4">
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@yourcompany.com"
                />
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="•••••••••"
                  helper="At least 8 characters, with one number."
                />
              </div>
            )}

            {via !== "phone" && (
              <div className="mt-5">
                <button
                  type="button"
                  className="text-[13px] font-medium text-ink-link hover:underline"
                  onClick={() => router.replace("/onboarding/auth?via=phone")}
                >
                  Use phone instead →
                </button>
              </div>
            )}
          </>
        )}

        {phase === "otp" && (
          <>
            <h1 className="t-h2 mb-2">Enter the code we sent</h1>
            <p className="t-body mb-6 text-ink-subtitle">
              We just texted a 6-digit code to your number. It expires in 10 minutes.
            </p>
            <OtpInput
              onComplete={() => {
                // In the prototype, any 6 digits passes
                setTimeout(() => router.push(next), 250);
              }}
            />
            <div className="mt-5">
              <button
                type="button"
                className="text-[13px] font-medium text-ink-link hover:underline"
                onClick={() => setPhase("enter")}
              >
                ← Change number
              </button>
            </div>
          </>
        )}
      </div>
    </OnboardingShell>
  );
}
