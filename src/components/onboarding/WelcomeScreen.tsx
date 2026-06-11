"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext } from "@/lib/mockInvite";

type Props = { invite: InviteContext };

export function WelcomeScreen({ invite }: Props) {
  const { inviter, operator } = invite;

  return (
    // `center` (no journey) makes main fill the viewport height so the hero
    // can truly center and the footer pins to the bottom — with the feature
    // tiles cut there's no content mass to fake it. The screen owns its own
    // width caps + padding (mirrors the shell's `wide` band).
    <OnboardingShell chrome={false} center>
      <div className="flex min-h-[100dvh] w-full max-w-[480px] flex-col px-4 md:min-h-full md:max-w-[720px] md:px-10 lg:max-w-[1120px] lg:px-14 xl:max-w-[1320px] 2xl:max-w-[1800px] 2xl:px-20">
        {/* Top brand row + step pill (step pill shows on lg+, where the
            centered layout has room for it on the right). On mobile the
            wordmark moves to the footer, so it's hidden here below md.
            lg padding-top is tuned so the step pill's center sits on the
            same horizontal plane as the floating DevPalette controls
            (fixed top-2 + 12px safe inset + 32px pill → center ≈ 36px) —
            the chrome reads as part of the interface in presentations. */}
        <div className="flex items-center justify-between pb-8 pt-[max(env(safe-area-inset-top),12px)] lg:pb-12 lg:pt-[21px]">
          <Wordmark className="hidden h-[18px] md:block" />
          <div className="hidden lg:block">
            <StepPill current={1} total={6} label="Welcome" />
          </div>
        </div>

        {/* Centered hero column. The marketing feature tiles / card stack
            that used to sit below the CTA were cut (design call 2026-06-10):
            the invite IS the pitch — accept it and go. The hero centers in
            the freed canvas instead. */}
        <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center text-center 2xl:max-w-[840px]">
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
          <p className="t-body-lg mt-3 text-ink-subtitle lg:mt-4 lg:text-[16px]">
            Set up in about 90 seconds.
          </p>

          {/* Single CTA into the partner wizard — the create-login step
              presents the actual methods (email or Google). */}
          <div className="mt-8 w-full max-w-[230px] md:max-w-[280px] lg:mt-10 lg:max-w-[320px]">
            <Button
              fullWidth
              size="lg"
              onClick={() => goto("/partner/account")}
            >
              Get started
            </Button>
          </div>

          {/* Quiet path for partners who already have an account. */}
          <p className="mt-4 text-[13px] text-ink-subtitle">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-ink-body hover:text-ink-title hover:underline"
              onClick={() => goto("/partner/signin")}
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Footer brand + legal links. On mobile the wordmark sits here,
            centered above the microcopy (it's hidden from the top row
            below md); md+ keeps it top-left and out of the footer. */}
        <div className="mt-12 flex flex-col items-center gap-2 pb-2 text-[12px] text-ink-caption md:flex-row md:justify-between md:gap-4 lg:mt-16">
          <Wordmark className="mb-1 h-[18px] md:hidden" />
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

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}
