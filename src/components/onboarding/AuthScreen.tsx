"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import { TextField } from "@/components/ui/TextField";
import { useInvite } from "@/lib/useInvite";
import { mockGoogleProfile, type InviteContext } from "@/lib/mockInvite";

type Mode = "create" | "signin";

export function AuthScreen() {
  const sp = useSearchParams();
  const router = useRouter();
  const invite = useInvite();
  const mode = (sp.get("mode") === "signin" ? "signin" : "create") as Mode;
  const isCreate = mode === "create";

  // existing-account branch: ?existing=1 short-circuits the success copy on P7.
  const existingFlag = sp.get("existing") === "1";

  // Default the work-email field from any operator-typed prefill, then the
  // emailed invite handle.
  const emailDefault =
    invite.prefill?.email ??
    (invite.invitedRecipient?.kind === "email" ? invite.invitedRecipient.value : "");

  const [email, setEmail] = useState(isCreate ? emailDefault : "");
  const [password, setPassword] = useState("");

  const emailValid = /.+@.+\..+/.test(email.trim());
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid;

  // Forward the invite context (linked company, existing flag, prefill) into
  // the details step via URL params, so useInvite() rehydrates it there. The
  // chosen sign-up method contributes its own prefill (typed email, or the
  // name + email Google handed back).
  function nextHref(extra?: Partial<NonNullable<InviteContext["prefill"]>>) {
    if (existingFlag) return "/onboarding/done?existing=1";
    const p = new URLSearchParams();
    if (invite.linkedCompany?.id) p.set("co", invite.linkedCompany.id);
    const pf = { ...invite.prefill, ...extra };
    if (pf.firstName) p.set("fn", pf.firstName);
    if (pf.lastName) p.set("ln", pf.lastName);
    if (pf.email) p.set("email", pf.email);
    if (pf.phone) p.set("phone", pf.phone);
    const qs = p.toString();
    return `/onboarding/business${qs ? `?${qs}` : ""}`;
  }

  function submitEmail() {
    if (isCreate) router.push(nextHref({ email: email.trim() }));
    else router.push("/onboarding/done?existing=1");
  }

  function submitGoogle() {
    if (isCreate) {
      // Pretend OAuth finished and handed back the profile.
      router.push(
        nextHref({
          firstName: mockGoogleProfile.firstName,
          lastName: mockGoogleProfile.lastName,
          email: mockGoogleProfile.email,
        }),
      );
    } else {
      router.push("/onboarding/done?existing=1");
    }
  }

  return (
    <OnboardingShell
      backHref="/j/abc123"
      journey={{ currentKey: "auth" }}
      center
    >
      {/* Floating white card frame (kept from the partner-onboarding pattern
          Armen signed off on). On md+ the form sits in a centered card in the
          right pane; on mobile it stays a plain top-aligned form. */}
      <div className="mt-2 md:mt-0 md:mx-auto md:w-[440px] md:rounded-3xl md:border md:border-border md:bg-card md:p-8 md:shadow-lg">
        {/* Operator-context breadcrumb — only on create (sign-in is for
            returning users, not necessarily inside an invite). */}
        {isCreate && (
          <OperatorContext
            inviterFullName={invite.inviter.fullName}
            inviterInitial={invite.inviter.firstName[0]}
            operatorName={invite.operator.name}
          />
        )}

        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          {isCreate ? "Create your account" : "Sign in"}
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-7 lg:text-[16px]">
          {isCreate
            ? "Set up your Tatch login — we'll confirm a few business details next."
            : "Welcome back. Use the email or Google account you signed up with."}
        </p>

        <div className="space-y-4">
          <TextField
            label="Work email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="you@yourcompany.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helper={isCreate ? "Use your work email so teammates can find you." : undefined}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete={isCreate ? "new-password" : "current-password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helper={isCreate ? "At least 8 characters, with one number." : undefined}
          />
          {!isCreate && (
            <div className="-mt-1">
              <button
                type="button"
                className="text-[13px] font-medium text-ink-body hover:text-ink-title hover:underline"
                onClick={() => alert("(prototype) — password reset link sent")}
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button fullWidth size="lg" disabled={!canSubmit} onClick={submitEmail}>
            {isCreate ? "Create account" : "Sign in"}
          </Button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border-subtle" aria-hidden="true" />
          <span className="t-caption text-ink-disabled">or</span>
          <span className="h-px flex-1 bg-border-subtle" aria-hidden="true" />
        </div>

        <Button
          variant="secondary"
          fullWidth
          size="lg"
          leadingIcon={<GoogleG />}
          onClick={submitGoogle}
        >
          Continue with Google
        </Button>

        {/* Mode switch */}
        <p className="mt-6 text-center text-[13px] text-ink-subtitle">
          {isCreate ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-ink-body hover:text-ink-title hover:underline"
                onClick={() => router.replace("/onboarding/auth?mode=signin")}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New to Tatch?{" "}
              <button
                type="button"
                className="font-medium text-ink-body hover:text-ink-title hover:underline"
                onClick={() => router.replace("/onboarding/auth?mode=create")}
              >
                Create your account
              </button>
            </>
          )}
        </p>
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

/** Google "G" mark — official four-color logo, sized to sit inline in the
 *  secondary button next to the label. */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
