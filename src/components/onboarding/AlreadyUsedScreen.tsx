"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { OnboardingShell } from "./OnboardingShell";

export function AlreadyUsedScreen() {
  return (
    <OnboardingShell chrome={false} center>
      {/* Brand mark pinned top-left while the error column centers. */}
      <div className="safe-pt absolute left-0 top-0 flex items-center p-4 md:p-6 lg:p-8">
        <Wordmark className="h-[18px]" />
      </div>

      {/* Centered error column — no card or banner per pattern 06; the
          screen looks like any other Tatch screen, just centered in the
          viewport with the message as the focal element. */}
      <div className="flex w-full max-w-[480px] flex-col items-center px-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-pill bg-subtle text-ink-body">
          <CircleAlert size={22} strokeWidth={1.75} />
        </div>
        <h1 className="t-h1 mt-5">This invite has already been used.</h1>
        <p className="t-body-lg mt-3 max-w-[44ch] text-ink-subtitle">
          Looks like this link was already claimed. Sign in to your existing
          account, or ask your operator to send a fresh TatchLink.
        </p>

        <div className="mt-7 flex w-full flex-col gap-3 sm:max-w-xs">
          <Button fullWidth size="lg" onClick={() => goto("/onboarding/auth?via=phone")}>
            Sign in
          </Button>
          <Link
            href="sms:?&body=Hi%20—%20my%20Tatch%20invite%20link%20already%20shows%20as%20used.%20Could%20you%20resend%3F"
            className="text-center text-[14px] font-medium text-ink-link underline-offset-2 hover:underline"
          >
            Contact your operator
          </Link>
        </div>
      </div>
    </OnboardingShell>
  );
}

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}
