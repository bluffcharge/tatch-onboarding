"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { OtpInput } from "@/components/ui/OtpInput";
import { TextField } from "@/components/ui/TextField";
import { useInvite } from "@/lib/useInvite";

type Phase = "enter" | "otp";

export function AuthScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const invite = useInvite();
  const via = (sp.get("via") || "phone") as "phone" | "email" | "google";

  // existing-account branch: ?existing=1 routes the success straight to short-circuit
  const existingFlag = sp.get("existing") === "1";
  const next = existingFlag
    ? "/onboarding/done?existing=1"
    : "/onboarding/business";

  const [phase, setPhase] = useState<Phase>("enter");
  const [phoneValid, setPhoneValid] = useState(false);
  // Pre-fill the phone field from the invited recipient (legacy default)
  // and the email field from any operator-typed prefill on the invite.
  const phoneDefault =
    invite.invitedRecipient?.kind === "phone"
      ? invite.invitedRecipient.value
      : invite.prefill?.phone ?? "";
  const emailDefault =
    invite.invitedRecipient?.kind === "email"
      ? invite.invitedRecipient.value
      : invite.prefill?.email ?? "";

  return (
    <OnboardingShell
      backHref="/j/abc123"
      journey={{ currentKey: "auth" }}
      center
    >
      {/* Single-input-focus per pattern 02. On md+ the form sits in a
          centered frosted card in the right pane (vertically centered via
          the shell `center` prop next to the journey rail); on mobile it
          stays a plain top-aligned form. The Send-code / resend CTA lives
          inside the card so the whole task reads as one focal unit. */}
      <div className="mt-2 md:mt-0 md:mx-auto md:w-[440px] md:rounded-3xl md:border md:border-border md:bg-card md:p-8 md:shadow-lg">
        {/* Operator-context breadcrumb — keeps the inviting company top-of-mind
            after the user leaves P1 and is committing real credentials. */}
        <OperatorContext
          inviterFullName={invite.inviter.fullName}
          inviterInitial={invite.inviter.firstName[0]}
          operatorName={invite.operator.name}
        />

        {phase === "enter" && (
          <>
            <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
              {via === "phone" && "What's your mobile number?"}
              {via === "email" && "Sign in or create your account"}
              {via === "google" && "Continue with Google"}
            </h1>
            <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
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
                defaultValue={phoneDefault}
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
                  defaultValue={emailDefault}
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

            {/* Alt-path tertiary links — neutral text, symmetric across paths. */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {via !== "phone" && (
                <button
                  type="button"
                  className="text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
                  onClick={() => router.replace("/onboarding/auth?via=phone")}
                >
                  Use phone instead →
                </button>
              )}
              {via !== "google" && (
                <button
                  type="button"
                  className="text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
                  onClick={() => router.replace("/onboarding/auth?via=google")}
                >
                  Use Google instead →
                </button>
              )}
            </div>
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
              helper={
                <>
                  Prototype: any 6 digits work — try{" "}
                  <code className="rounded-xs bg-subtle px-1 py-0.5 font-mono text-[11.5px] text-ink-body">
                    123456
                  </code>
                  .
                </>
              }
            />
            <div className="mt-5">
              <button
                type="button"
                className="text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
                onClick={() => setPhase("enter")}
              >
                ← Change number
              </button>
            </div>
          </>
        )}

        {/* CTA / resend — moved out of the shell footer into the card so
            the form and its action are one focal unit. */}
        <div className="mt-8">
          {phase === "enter" ? (
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
                className="font-medium text-ink-body hover:text-ink-title hover:underline"
                onClick={() => alert("(prototype) — code re-sent")}
              >
                Resend in 60s
              </button>
            </p>
          )}
        </div>
      </div>
    </OnboardingShell>
  );
}

function OperatorContext({
  inviterFullName,
  inviterInitial,
  operatorName,
}: {
  inviterFullName: string;
  inviterInitial: string;
  operatorName: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-2.5 rounded-md border border-border-subtle bg-subtle px-2.5 py-2">
      <span
        aria-hidden="true"
        className="grid h-6 w-6 shrink-0 place-items-center rounded-pill bg-ink-title text-[10px] font-semibold text-canvas"
      >
        {inviterInitial}
      </span>
      <p className="t-caption flex-1 leading-snug">
        Joining{" "}
        <span className="font-semibold text-ink-title">{operatorName}</span>
        <span className="text-ink-disabled"> · invited by {inviterFullName}</span>
      </p>
    </div>
  );
}
