"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { TicketPrimaryCTA } from "@/components/ui/TicketPrimaryCTA";
import {
  DarkFieldLabel,
  DarkFieldWrapper,
} from "@/components/ui/DarkField";
import { OnboardingShell } from "./OnboardingShell";
import { OnboardingTicketFrame } from "./OnboardingTicketFrame";
import { DISCOVERY_QUESTIONS } from "@/lib/discoveryQuestions";

type Answers = Record<string, string | string[] | null>;
type SpecifyMap = Record<string, string>;

/**
 * P4 — Discovery. Folded into the dark ticket frame. The previous
 * desktop illustrated-tile selectors are dropped in favor of dark
 * chips at all sizes — illustrated tiles don't fit the ticket motif,
 * and the chip rhythm reads more like the question-card it actually
 * is.
 */
export function DiscoveryScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => {
    const seed: Answers = {};
    DISCOVERY_QUESTIONS.forEach((q) => {
      seed[q.id] = q.type === "multi_select_chips" ? [] : null;
    });
    return seed;
  });
  const [specify, setSpecify] = useState<SpecifyMap>({});

  const allRequiredAnswered = DISCOVERY_QUESTIONS.every((q) => {
    if (!q.required) return true;
    const a = answers[q.id];
    if (q.type === "short_text") {
      return typeof a === "string" && a.trim().length > 0;
    }
    if (q.type === "single_select_chips") {
      return typeof a === "string" && a.length > 0;
    }
    if (q.type === "multi_select_chips") {
      const arr = Array.isArray(a) ? a : [];
      if (arr.length < (q.minSelected ?? 1)) return false;
      if (q.specifyFor && arr.includes(q.specifyFor)) {
        const sp = specify[q.id]?.trim() ?? "";
        if (sp.length === 0) return false;
      }
      return true;
    }
    return true;
  });

  return (
    <OnboardingShell
      step={{ current: 2, total: 3 }}
      backHref="/onboarding/business"
      journey={{ currentKey: "discovery" }}
    >
      <div className="mt-2 md:mx-auto md:max-w-[380px] lg:max-w-[460px]">
        <OnboardingTicketFrame
          eyebrow="Step 4 · Discovery"
          serial="PASS · DISCOVERY · ROUTING"
          footer={
            <TicketPrimaryCTA
              icon={<ArrowRight size={15} strokeWidth={1.85} />}
              onClick={() => router.push("/onboarding/team")}
              disabled={!allRequiredAnswered}
            >
              Continue
            </TicketPrimaryCTA>
          }
        >
          <h1 className="text-[22px] font-semibold leading-[1.15] text-white lg:text-[26px]">
            A couple of quick questions.
          </h1>
          <p className="mt-2 text-[13px] leading-snug text-white/55 lg:text-[13.5px]">
            This helps your operator route the right referrals to you.
          </p>

          <div className="mt-6 space-y-7">
            {DISCOVERY_QUESTIONS.map((q) => (
              <div key={q.id}>
                <h2 className="mb-1 text-[14px] font-semibold leading-snug text-white">
                  {q.prompt}
                </h2>
                {q.helperText && (
                  <p className="mb-3 text-[12px] leading-snug text-white/55">
                    {q.helperText}
                  </p>
                )}

                {q.type === "short_text" && (
                  <DarkFieldWrapper>
                    <input
                      inputMode={q.inputMode ?? "text"}
                      placeholder={q.placeholder}
                      value={(answers[q.id] as string | null) ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const cleaned =
                          q.inputMode === "numeric"
                            ? raw.replace(/[^\d]/g, "")
                            : raw;
                        setAnswers((s) => ({ ...s, [q.id]: cleaned }));
                      }}
                      className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                    />
                  </DarkFieldWrapper>
                )}

                {q.type === "single_select_chips" && (
                  <DarkChipGroup
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
                  <>
                    <DarkChipGroup
                      mode="multi"
                      options={q.options}
                      value={(answers[q.id] as string[]) ?? []}
                      onChange={(v) =>
                        setAnswers((s) => ({ ...s, [q.id]: v }))
                      }
                      ariaLabel={q.prompt}
                    />
                    {q.specifyFor &&
                      Array.isArray(answers[q.id]) &&
                      (answers[q.id] as string[]).includes(q.specifyFor) && (
                        <div className="mt-3">
                          {q.specifyPrompt && (
                            <DarkFieldLabel>{q.specifyPrompt}</DarkFieldLabel>
                          )}
                          <DarkFieldWrapper>
                            <input
                              placeholder={q.specifyPlaceholder}
                              value={specify[q.id] ?? ""}
                              onChange={(e) =>
                                setSpecify((s) => ({
                                  ...s,
                                  [q.id]: e.target.value,
                                }))
                              }
                              autoFocus
                              className="h-full w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
                            />
                          </DarkFieldWrapper>
                        </div>
                      )}
                  </>
                )}
              </div>
            ))}
          </div>
        </OnboardingTicketFrame>
      </div>
    </OnboardingShell>
  );
}

/* ----------------- Dark chip group -----------------
   Quiet dark pills with a check icon when active. Used in place of the
   light-surface ChipGroup + the illustrated TileGroup so the dark
   ticket-frame motif holds across the discovery questions. */

type Option = { value: string; label: string };

type SingleProps = {
  mode: "single";
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  ariaLabel: string;
};

type MultiProps = {
  mode: "multi";
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  ariaLabel: string;
};

function DarkChipGroup(props: SingleProps | MultiProps) {
  const { options, ariaLabel } = props;
  return (
    <div
      role={props.mode === "single" ? "radiogroup" : "group"}
      aria-label={ariaLabel}
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const active =
          props.mode === "single"
            ? props.value === opt.value
            : props.value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={props.mode === "single" ? "radio" : "checkbox"}
            aria-checked={active}
            onClick={() => {
              if (props.mode === "single") {
                props.onChange(opt.value);
              } else {
                const set = new Set(props.value);
                if (set.has(opt.value)) set.delete(opt.value);
                else set.add(opt.value);
                props.onChange(Array.from(set));
              }
            }}
            className={
              active
                ? "inline-flex h-9 items-center gap-1.5 rounded-pill border border-white/55 bg-white/[0.12] px-3.5 text-[12.5px] font-medium text-white transition-colors duration-fast ease-snap"
                : "inline-flex h-9 items-center gap-1.5 rounded-pill border border-white/15 bg-white/[0.04] px-3.5 text-[12.5px] font-medium text-white/75 transition-colors duration-fast ease-snap hover:border-white/30 hover:text-white"
            }
          >
            {active && <Check size={12} strokeWidth={2.5} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
