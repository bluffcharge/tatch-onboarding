"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultInvite } from "@/lib/mockInvite";
import { OnboardingShell } from "./OnboardingShell";

const BEATS = [
  (op: string) => `Connecting you to ${op}…`,
  () => "Adding your team contacts…",
];

export function ActivatingScreen() {
  const router = useRouter();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    // Two-beat timing: each beat reads for ~1.2s, total ~2.4s. Slower than
    // the initial pass so the second beat ("Adding your team contacts…") is
    // actually perceived rather than flashing past.
    const t1 = setTimeout(() => setBeat(1), 1200);
    const t2 = setTimeout(() => router.push("/onboarding/done"), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [router]);

  const copy = BEATS[beat](defaultInvite.operator.name);

  return (
    <OnboardingShell chrome={false} ornament={false} center>
      {/* Transitional beat — no spinner / progress bar (pattern 04). A
          single focal orb breathes slowly while the copy cross-fades
          between beats; the atmosphere carries the wait. */}
      <div className="flex flex-col items-center px-6 text-center">
        <div className="relative grid place-items-center">
          <span
            aria-hidden="true"
            className="activating-glow absolute h-28 w-28 rounded-full bg-brand-gradient-4 opacity-40 blur-2xl"
          />
          <span
            aria-hidden="true"
            className="activating-orb relative h-16 w-16 rounded-full bg-brand-gradient-4"
          />
        </div>
        <p
          key={beat}
          aria-live="polite"
          className="activating-copy t-body-lg mt-7 max-w-[32ch] text-ink-title"
        >
          {copy}
        </p>
      </div>
    </OnboardingShell>
  );
}
