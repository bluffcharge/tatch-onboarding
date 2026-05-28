"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Check,
  Inbox,
  LineChart,
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
        {/* Top brand row + step pill (step pill shows on lg+, where the
            centered layout has room for it on the right). */}
        <div className="safe-pt flex items-center justify-between pb-8 pt-1 lg:pb-12">
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
          <div className="hidden lg:block">
            <StepPill current={1} total={6} label="Welcome" />
          </div>
        </div>

        {/* Centered hero column. Single column at all sizes — content
            scales up at lg+ to fill the canvas the way the spec frames
            it (big avatar, large headline, centered CTA stack, tiles in
            a 4-across row below). At 2xl+ (Desktop + Wide) the column
            caps at 840px so the hero + feature tiles read as one focal
            lockup with intentional margin around it (cap-and-center per
            01-hero-welcome), instead of stretching across the wide
            shell. Below 2xl is untouched. */}
        <div className="mx-auto flex w-full flex-1 flex-col items-center text-center 2xl:max-w-[840px]">
          <InviterAvatar initial={inviter.firstName[0]} />

          <p className="mt-5 text-[13.5px] text-ink-subtitle lg:text-[15px]">
            <span className="font-semibold text-ink-title">{inviter.fullName}</span>
            <span className="text-ink-caption"> · </span>
            <span>{inviter.title} at </span>
            <span className="font-semibold text-ink-title">{operator.name}</span>
          </p>

          <h1 className="t-h1 mt-2 text-balance lg:mt-3 lg:text-[56px] lg:leading-[1.02] 2xl:text-[72px]">
            invited you to Tatch.
          </h1>
          <p className="t-body-lg mt-4 max-w-[56ch] text-ink-subtitle lg:mt-5 lg:text-[16px]">
            Set up your account in about 90 seconds and start receiving
            referrals from {operator.name}.
          </p>

          {/* Single CTA — phone OTP is the path we want every partner
              on, so the welcome screen commits to one button instead
              of presenting alternatives. */}
          <div className="mt-8 w-full md:max-w-[280px] lg:mt-10 lg:max-w-[320px]">
            <Button
              fullWidth
              size="lg"
              leadingIcon={<Phone size={16} strokeWidth={1.75} />}
              onClick={() => goto("/onboarding/auth?via=phone")}
            >
              Continue with phone
            </Button>
          </div>

          {/* Feature tiles — 4-across at lg+, 2-up at md, stack on phone. */}
          <section
            aria-label="What you're signing up for"
            className="mt-10 w-full lg:mt-14"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-5 2xl:gap-6">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>
        </div>

        {/* Footer brand + legal links */}
        <div className="mt-12 flex flex-col items-center gap-2 pb-2 text-[12px] text-ink-caption md:flex-row md:justify-between md:gap-4 lg:mt-16">
          <p>tatch · onboarding</p>
          <div className="flex items-center gap-4">
            <Link href="#terms" className="text-ink-link underline-offset-2 hover:underline">
              Terms
            </Link>
            <Link href="#privacy" className="text-ink-link underline-offset-2 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* ----------------- Inviter avatar ------------------
   Solid ink fill (zinc-900 in light, white in dark) with a tiny brand-
   gradient checkmark badge in the bottom-right. Replaces the previous
   full-fill purple gradient — the user is phasing brand violet out of
   the chrome, but the badge keeps a small brand pop. */
function InviterAvatar({ initial }: { initial: string }) {
  return (
    <div className="relative h-16 w-16 lg:h-20 lg:w-20">
      <span className="absolute inset-0 rounded-pill ring-2 ring-royal-400/30" aria-hidden="true" />
      {/* Uses text-canvas (the page bg color) for the initial so it inverts
          cleanly between themes: white initial on zinc-900 in light, dark
          initial on white in dark. --text-on-dark stays white in both
          themes, which is wrong here once dark flips bg-ink-title to white. */}
      <span className="absolute inset-[3px] grid place-items-center rounded-pill bg-ink-title text-canvas">
        <span className="text-[22px] font-semibold lg:text-[28px]">{initial}</span>
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-pill bg-brand-gradient-4 text-white lg:h-7 lg:w-7">
        <Check size={12} strokeWidth={3} className="lg:h-3.5 lg:w-3.5" />
      </span>
    </div>
  );
}

/* ----------------- Step pill ------------------ */
function StepPill({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-card px-3 py-1.5 text-[12px] text-ink-body shadow-xs">
      <span className="inline-flex h-1.5 w-1.5 rounded-pill bg-royal-400" aria-hidden="true" />
      <span>
        Step {current} of {total} · <span className="text-ink-caption">{label}</span>
      </span>
    </div>
  );
}

/* ----------------- Feature cards ------------------ */

type Feature = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    title: "Receive qualified leads",
    body:  "Operators send referrals straight to your inbox.",
    Icon:  Inbox,
  },
  {
    title: "Track every job",
    body:  "From new lead to closed deal in one place.",
    Icon:  LineChart,
  },
  {
    title: "Get paid on time",
    body:  "Wallet + payout tracking built in.",
    Icon:  Wallet,
  },
  {
    title: "Bring your team",
    body:  "Add admins and members in a couple of taps.",
    Icon:  UsersRound,
  },
];

/* Per-tone color dropped — the new tile spec is neutral across all four,
   so the row reads as a single rhythm rather than four separate cues.   */
function FeatureCard({ title, body, Icon }: Feature) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm 2xl:gap-5 2xl:p-6">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-subtle text-ink-body 2xl:h-11 2xl:w-11">
        <Icon size={17} strokeWidth={1.75} className="2xl:h-5 2xl:w-5" />
      </div>
      <div>
        <p className="text-[14px] font-semibold leading-tight text-ink-title 2xl:text-[16px]">{title}</p>
        <p className="mt-1.5 text-[12.5px] leading-snug text-ink-subtitle 2xl:mt-2 2xl:text-[13.5px]">{body}</p>
      </div>
    </div>
  );
}

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}
