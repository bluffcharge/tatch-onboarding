"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { OnboardingShell } from "./OnboardingShell";
import { DISCOVERY_QUESTIONS } from "@/lib/discoveryQuestions";

type Answers = Record<string, string | string[] | null>;

export function DiscoveryScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => {
    const seed: Answers = {};
    DISCOVERY_QUESTIONS.forEach((q) => {
      seed[q.id] = q.type === "multi_select_chips" ? [] : null;
    });
    return seed;
  });

  const allRequiredAnswered = DISCOVERY_QUESTIONS.every((q) => {
    if (!q.required) return true;
    const a = answers[q.id];
    if (q.type === "single_select_chips") return typeof a === "string" && a.length > 0;
    if (q.type === "multi_select_chips") {
      const arr = Array.isArray(a) ? a : [];
      return arr.length >= (q.minSelected ?? 1);
    }
    return true;
  });

  return (
    <OnboardingShell
      step={{ current: 2, total: 3 }}
      backHref="/onboarding/business"
      journey={{ currentKey: "discovery" }}
      footer={
        <Button
          fullWidth
          size="lg"
          disabled={!allRequiredAnswered}
          onClick={() => router.push("/onboarding/team")}
        >
          Continue
        </Button>
      }
    >
      <div className="mt-2">
        <h1 className="t-h2 mb-2">A couple of quick questions.</h1>
        <p className="t-body mb-6 text-ink-subtitle">
          This helps your operator route the right referrals to you.
        </p>

        <div className="space-y-7">
          {DISCOVERY_QUESTIONS.map((q) => (
            <div key={q.id}>
              <h2 className="t-h4 mb-1">{q.prompt}</h2>
              {q.helperText && (
                <p className="t-caption mb-3">{q.helperText}</p>
              )}
              {q.type === "single_select_chips" && (
                <ChipGroup
                  mode="single"
                  options={q.options}
                  value={(answers[q.id] as string | null) ?? null}
                  onChange={(v) =>
                    setAnswers((s) => ({ ...s, [q.id]: v }))
                  }
                  ariaLabel={q.prompt}
                />
              )}
              {q.type === "multi_select_chips" && (
                <ChipGroup
                  mode="multi"
                  options={q.options}
                  value={(answers[q.id] as string[]) ?? []}
                  onChange={(v) =>
                    setAnswers((s) => ({ ...s, [q.id]: v }))
                  }
                  ariaLabel={q.prompt}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}
