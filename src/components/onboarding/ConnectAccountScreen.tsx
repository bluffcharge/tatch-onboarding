"use client";

import Link from "next/link";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { OnboardingShell } from "./OnboardingShell";
import { InviterAvatar } from "./WelcomeScreen";
import { DeclineConfirm } from "./DeclineConfirm";
import type { InviteContext } from "@/lib/mockInvite";

/* Existing-account branch of /j/<token> — the rec-company-invite row in
   the notifications catalog ("New company invite alert — existing
   account"). The token resolved to someone who already has a Tatch
   account, so instead of the signup wizard this is a single decision:
   confirm to add the operator to the existing account, or decline.
   Confirm lands on the P7 short-circuit success (which points into the
   partner portal); decline mirrors the welcome screen's decline path.

   Layout deliberately mirrors WelcomeScreen — same avatar, identity
   line, and centered hero — so both entry variants read as one flow. */

type Props = { invite: InviteContext; token: string };

export function ConnectAccountScreen({ invite, token }: Props) {
  const { inviter, operator, invitedRecipient } = invite;
  const [declining, setDeclining] = useState(false);

  return (
    <OnboardingShell chrome={false} center>
      <div className="flex min-h-[100dvh] w-full max-w-[480px] flex-col px-4 md:min-h-full md:max-w-[720px] md:px-10 lg:max-w-[1120px] lg:px-14 xl:max-w-[1320px] 2xl:max-w-[1800px] 2xl:px-20">
        {/* Top brand row — no step pill: this isn't a wizard, it's one
            decision. Mobile moves the wordmark to the footer like P1. */}
        <div className="flex items-center justify-between pb-8 pt-[max(env(safe-area-inset-top),12px)] lg:pb-12 lg:pt-[21px]">
          <Wordmark className="hidden h-[18px] md:block" />
        </div>

        <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center text-center 2xl:max-w-[840px]">
          <InviterAvatar initial={inviter.firstName[0]} />

          <p className="mt-5 text-[13.5px] text-ink-subtitle lg:text-[15px]">
            <span className="font-semibold text-ink-title">{inviter.fullName}</span>
            <span className="text-ink-caption"> · </span>
            <span>{inviter.title} at </span>
            <span className="font-semibold text-ink-title">{operator.name}</span>
          </p>

          <h1 className="t-h1 mt-2 text-balance lg:mt-3 lg:text-[48px] lg:leading-[1.05] 2xl:text-[60px]">
            invited you to connect.
          </h1>
          <p className="t-body-lg mt-3 max-w-[46ch] text-pretty text-ink-subtitle lg:mt-4 lg:text-[16px]">
            {operator.name} invited your account to their referral program.
            Confirm to add them — this won&apos;t affect your existing
            operator relationships.
          </p>

          {/* The account this invite resolved to — the signal that this is
              the existing-account branch, not a fresh signup. */}
          {invitedRecipient && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-pill border border-border-subtle bg-card px-3 py-1.5 text-[12.5px] text-ink-body shadow-xs">
              <UserRound size={13} strokeWidth={1.75} aria-hidden="true" className="text-ink-caption" />
              <span>
                Your account: <span className="font-medium text-ink-title">{invitedRecipient.value}</span>
              </span>
            </p>
          )}

          {declining ? (
            <div className="mt-8 flex w-full justify-center lg:mt-10">
              <DeclineConfirm
                consequence={`${operator.name} will be told you passed. Your account and existing operator relationships stay exactly as they are, and you can still connect later from a new invite.`}
                onDecline={() => goto(`/j/${token}/declined`)}
                onKeep={() => setDeclining(false)}
              />
            </div>
          ) : (
            <>
              {/* Single forward CTA — confirming is the whole job here. */}
              <div className="mt-8 w-full max-w-[260px] md:max-w-[300px] lg:mt-10 lg:max-w-[340px]">
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => goto("/partner/done?existing=1")}
                >
                  Confirm and connect
                </Button>
              </div>

              <p className="mt-4 text-[13px] text-ink-caption">
                Not interested?{" "}
                <button
                  type="button"
                  className="font-medium text-ink-body underline-offset-2 hover:text-ink-title hover:underline"
                  onClick={() => setDeclining(true)}
                >
                  Decline
                </button>
              </p>

              {/* Wrong-account escape hatch, quietest of all. */}
              <p className="mt-2 text-[12.5px] text-ink-caption">
                Not your account?{" "}
                <button
                  type="button"
                  className="font-medium text-ink-body underline-offset-2 hover:text-ink-title hover:underline"
                  onClick={() => goto("/partner/signin")}
                >
                  Sign in as someone else
                </button>
              </p>
            </>
          )}
        </div>

        {/* Footer brand + legal links, mirroring P1. */}
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

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}
