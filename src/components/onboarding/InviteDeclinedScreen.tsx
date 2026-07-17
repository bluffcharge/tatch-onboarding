"use client";

import { CircleSlash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext } from "@/lib/mockInvite";

/* Terminal state for a declined invite — mirrors AlreadyUsedScreen's
   centered, card-free pattern. Calm by design: declining is a valid
   outcome, not an error, so no warn/error tinting anywhere. The way
   back is a real primary button — the invite link stays live, so
   accepting later is one tap. */

type Props = { invite: InviteContext; token: string };

export function InviteDeclinedScreen({ invite, token }: Props) {
  const { inviter, operator } = invite;

  return (
    <OnboardingShell chrome={false} center>
      {/* Brand mark pinned top-left while the column centers. */}
      <div className="safe-pt absolute left-0 top-0 flex items-center p-4 md:p-6 lg:p-8">
        <Wordmark className="h-[18px]" />
      </div>

      <div className="flex w-full max-w-[480px] flex-col items-center px-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-pill bg-subtle text-ink-body">
          <CircleSlash size={22} strokeWidth={1.75} />
        </div>
        <h1 className="t-h1 mt-5 text-balance">
          You&apos;ve declined this invite.
        </h1>
        <p className="t-body-lg mt-3 max-w-[44ch] text-pretty text-ink-subtitle">
          We&apos;ll let {inviter.fullName} at {operator.name} know you
          passed. Nothing was set up on your side, and a new invite from
          them will work anytime.
        </p>

        <div className="mt-7 flex w-full flex-col items-center gap-3">
          <p className="text-[13.5px] text-ink-subtitle">Changed your mind?</p>
          <div className="w-full sm:max-w-xs">
            <Button fullWidth size="lg" onClick={() => goto(`/j/${token}`)}>
              Accept the invite
            </Button>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}
