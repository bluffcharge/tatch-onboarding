"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";

export function AlreadyUsedScreen() {
  return (
    <OnboardingShell>
      <div className="mt-8 flex flex-col items-start">
        <div className="grid h-12 w-12 place-items-center rounded-pill bg-subtle text-ink-body">
          <CircleAlert size={22} strokeWidth={1.75} />
        </div>
        <h1 className="t-h2 mt-5">This invite has already been used.</h1>
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
