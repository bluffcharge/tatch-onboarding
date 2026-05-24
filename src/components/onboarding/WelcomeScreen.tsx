"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Inbox,
  LineChart,
  Mail,
  Phone,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext } from "@/lib/mockInvite";

type Props = { invite: InviteContext };

export function WelcomeScreen({ invite }: Props) {
  const { inviter, operator } = invite;

  return (
    <OnboardingShell chrome={false} wide>
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

        {/* Layout: single column on mobile, 2-col on lg+. At 2xl the
            features cluster widens so it earns its share of the canvas. */}
        <div className="grid flex-1 gap-10 lg:grid-cols-[1fr_minmax(360px,440px)] lg:items-start lg:gap-16 2xl:grid-cols-[1fr_minmax(520px,640px)] 2xl:gap-24">
          {/* Hero (left on desktop) */}
          <div className="flex flex-1 flex-col">
            <p className="t-mono-label mb-3 text-ink-caption">You&apos;re invited</p>
            <h1 className="t-h1 mb-3 text-balance lg:text-[44px] lg:leading-[1.05]">
              <span className="t-brand-text">{inviter.firstName}</span>
              <span className="text-ink-title"> from </span>
              <span className="text-ink-title">{operator.name}</span>
              <span className="text-ink-title"> invited you to Tatch.</span>
            </h1>
            <p className="t-body-lg max-w-[44ch] text-ink-subtitle lg:text-[16px]">
              Set up your account in about 90 seconds. We&apos;ll get you connected to{" "}
              {operator.name} and ready to send referrals.
            </p>

            {/* Inviter chip */}
            <div className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-xs">
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

            {/* CTAs (live on mobile inline; on lg+ they pin to the bottom of
                the hero column so the right card cluster doesn't push them
                offscreen). */}
            <div className="mt-8 space-y-3 md:max-w-[480px] lg:mt-10 lg:max-w-[420px]">
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
            <p className="t-caption mt-6 text-center lg:text-left">
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

          {/* What you're signing up for (right on desktop, hidden on small) */}
          <aside
            aria-label="What you're signing up for"
            className="hidden lg:block"
          >
            <p className="t-mono-label mb-4 2xl:text-[13px]">What you&apos;re signing up for</p>
            <div className="grid grid-cols-2 gap-3.5 2xl:gap-5">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
            <p className="mt-5 text-[12px] leading-relaxed text-ink-caption">
              You&apos;ll see all of this — and more — inside your Tatch
              workspace right after sign up.
            </p>
          </aside>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* ----------------- Feature cards ------------------ */

type Feature = {
  title: string;
  body: string;
  Icon: LucideIcon;
  tone: "pink" | "purple" | "green" | "blue";
};

const FEATURES: Feature[] = [
  {
    title: "Receive qualified leads",
    body:  "Operators send referrals straight to your inbox.",
    Icon:  Inbox,
    tone:  "pink",
  },
  {
    title: "Track every job",
    body:  "From new lead to closed deal in one place.",
    Icon:  LineChart,
    tone:  "purple",
  },
  {
    title: "Get paid on time",
    body:  "Wallet + payout tracking built in.",
    Icon:  Wallet,
    tone:  "green",
  },
  {
    title: "Bring your team",
    body:  "Add admins and members in a couple of taps.",
    Icon:  UsersRound,
    tone:  "blue",
  },
];

// Pastel film removed — the card is a neutral Morphix surface and the
// per-tone color now lives on the small icon tile (soft tint bg + fg).
const TONE_CLS: Record<Feature["tone"], { iconBg: string; iconFg: string }> = {
  pink:   { iconBg: "bg-[color:var(--feature-pink-bg)]",   iconFg: "text-[color:var(--feature-pink-fg)]"   },
  purple: { iconBg: "bg-[color:var(--feature-purple-bg)]", iconFg: "text-[color:var(--feature-purple-fg)]" },
  green:  { iconBg: "bg-[color:var(--feature-green-bg)]",  iconFg: "text-[color:var(--feature-green-fg)]"  },
  blue:   { iconBg: "bg-[color:var(--feature-blue-bg)]",   iconFg: "text-[color:var(--feature-blue-fg)]"   },
};

function FeatureCard({ title, body, Icon, tone }: Feature) {
  const t = TONE_CLS[tone];
  return (
    <div className="morphix-card flex flex-col gap-3 p-4 2xl:gap-4 2xl:p-6">
      <div className={`grid h-9 w-9 place-items-center rounded-xl 2xl:h-11 2xl:w-11 ${t.iconBg} ${t.iconFg}`}>
        <Icon size={17} strokeWidth={1.75} className="2xl:h-5 2xl:w-5" />
      </div>
      <div>
        <p className="text-[13.5px] font-semibold leading-tight text-ink-title 2xl:text-[16px]">{title}</p>
        <p className="mt-1 text-[12px] leading-snug text-ink-subtitle 2xl:mt-1.5 2xl:text-[13.5px]">{body}</p>
      </div>
    </div>
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
