"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext } from "@/lib/mockInvite";

type Props = { invite: InviteContext };

export function WelcomeScreen({ invite }: Props) {
  const { inviter, operator } = invite;

  return (
    <OnboardingShell chrome={false}>
      <div className="flex flex-1 flex-col">
        {/* Top brand row */}
        <div className="safe-pt flex items-center justify-between pb-8 pt-1">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/tatch-logomark.svg"
              alt="Tatch"
              width={22}
              height={22}
              priority
            />
            <span className="text-[15px] font-semibold tracking-tight text-ink-title">
              tatch
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="flex-1">
          <p className="t-mono-label mb-3 text-ink-caption">You&apos;re invited</p>
          <h1 className="t-h1 mb-3 text-balance">
            <span className="t-brand-text">{inviter.firstName}</span>
            <span className="text-ink-title"> from </span>
            <span className="text-ink-title">{operator.name}</span>
            <span className="text-ink-title"> invited you to Tatch.</span>
          </h1>
          <p className="t-body-lg max-w-[44ch] text-ink-subtitle">
            Set up your account in about 90 seconds. We&apos;ll get you connected to{" "}
            {operator.name} and ready to send referrals.
          </p>

          {/* Inviter chip */}
          <div className="mt-7 flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
            <div className="grid h-10 w-10 place-items-center rounded-pill bg-brand-gradient-4 text-white">
              <span className="text-[13px] font-semibold">
                {inviter.firstName[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="t-body font-semibold text-ink-title">
                {inviter.fullName}
              </p>
              <p className="t-caption">
                {inviter.title} · {operator.name}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 space-y-3">
          <Button
            fullWidth
            size="lg"
            leadingIcon={<Phone size={16} strokeWidth={1.75} />}
            onClick={() => goto("/onboarding/auth?via=phone")}
          >
            Continue with phone
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border-subtle" />
            <span className="t-caption">or</span>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            leadingIcon={<Mail size={16} strokeWidth={1.75} />}
            onClick={() => goto("/onboarding/auth?via=email")}
          >
            Continue with email
          </Button>
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            leadingIcon={<GoogleMark />}
            onClick={() => goto("/onboarding/auth?via=google")}
          >
            Continue with Google
          </Button>
        </div>

        {/* Legal */}
        <p className="t-caption mt-6 text-center">
          By continuing you agree to our{" "}
          <Link href="#terms" className="text-ink-link underline-offset-2 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#privacy" className="text-ink-link underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </OnboardingShell>
  );
}

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.68-3.86 2.68-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.96L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
