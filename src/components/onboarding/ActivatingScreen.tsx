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
    <OnboardingShell chrome={false} ornament={false}>
      {/* Celebratory screen — md:min-h-[80vh] gives the inner flex room
          to center vertically. The shell's main shrinks to content on md+,
          so without a min-height the spinner would stack at the top. */}
      <div className="flex flex-1 flex-col items-center justify-center text-center md:min-h-[80vh]">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 animate-ping rounded-pill bg-brand-gradient opacity-30" />
          <span
            className="absolute inset-0 animate-spin rounded-pill"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, var(--royal-400) 270deg, transparent 360deg)",
              mask: "radial-gradient(circle, transparent 60%, black 62%)",
              WebkitMask:
                "radial-gradient(circle, transparent 60%, black 62%)",
              animationDuration: "1.1s",
            }}
          />
          <span className="absolute inset-3 rounded-pill bg-brand-gradient-4" />
        </div>
        <p className="t-body-lg mt-6 max-w-[36ch] text-ink-title transition-opacity duration-med ease-snap">
          {copy}
        </p>
      </div>
    </OnboardingShell>
  );
}
