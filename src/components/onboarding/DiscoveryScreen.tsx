"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Hammer,
  Home,
  MoreHorizontal,
  Sun,
  TreePine,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { TextField } from "@/components/ui/TextField";
import { OnboardingShell } from "./OnboardingShell";
import { DISCOVERY_QUESTIONS } from "@/lib/discoveryQuestions";

type Answers = Record<string, string | string[] | null>;
type SpecifyMap = Record<string, string>;

/** Icon mapping for the desktop tile selectors. Keys match option `value`
 *  from discoveryQuestions.ts. Missing keys fall back to a generic icon. */
const OPTION_ICON: Record<string, LucideIcon> = {
  // services
  roofing:    Home,
  hvac:       Wind,
  plumbing:   Wrench,
  solar:      Sun,
  electrical: Zap,
  landscaping: TreePine,
  general:    Hammer,
  other:      MoreHorizontal,
};

export function DiscoveryScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => {
    const seed: Answers = {};
    DISCOVERY_QUESTIONS.forEach((q) => {
      seed[q.id] = q.type === "multi_select_chips" ? [] : null;
    });
    return seed;
  });
  // Per-question "specify" text when a specifyFor option is selected.
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
      // If the specify option is checked, the specify text must also be filled.
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
      <div className="mt-2 md:mt-0">
        <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
          A couple of quick questions.
        </h1>
        <p className="t-body mb-6 text-ink-subtitle md:text-[15px] md:mb-8 lg:text-[16px]">
          This helps your operator route the right referrals to you.
        </p>

        <div className="space-y-8 lg:space-y-10">
          {DISCOVERY_QUESTIONS.map((q) => (
            <div key={q.id}>
              <h2 className="t-h4 mb-1 lg:text-[18px]">{q.prompt}</h2>
              {q.helperText && (
                <p className="t-caption mb-3 lg:mb-4">{q.helperText}</p>
              )}

              {q.type === "short_text" && (
                <div className="max-w-[240px]">
                  <TextField
                    inputMode={q.inputMode ?? "text"}
                    placeholder={q.placeholder}
                    value={(answers[q.id] as string | null) ?? ""}
                    onChange={(e) => {
                      // For numeric, soft-strip non-digits.
                      const raw = e.target.value;
                      const cleaned =
                        q.inputMode === "numeric" ? raw.replace(/[^\d]/g, "") : raw;
                      setAnswers((s) => ({ ...s, [q.id]: cleaned }));
                    }}
                  />
                </div>
              )}

              {/* Mobile/tablet: chip group. Desktop (lg+): big illustrated tiles. */}
              {q.type === "single_select_chips" && (
                <>
                  <div className="lg:hidden">
                    <ChipGroup
                      mode="single"
                      options={q.options}
                      value={(answers[q.id] as string | null) ?? null}
                      onChange={(v) =>
                        setAnswers((s) => ({ ...s, [q.id]: v }))
                      }
                      ariaLabel={q.prompt}
                    />
                  </div>
                  <div className="hidden lg:block">
                    <TileGroup
                      mode="single"
                      options={q.options}
                      value={(answers[q.id] as string | null) ?? null}
                      onChange={(v) =>
                        setAnswers((s) => ({ ...s, [q.id]: v }))
                      }
                      ariaLabel={q.prompt}
                    />
                  </div>
                </>
              )}

              {q.type === "multi_select_chips" && (
                <>
                  <div className="lg:hidden">
                    <ChipGroup
                      mode="multi"
                      options={q.options}
                      value={(answers[q.id] as string[]) ?? []}
                      onChange={(v) =>
                        setAnswers((s) => ({ ...s, [q.id]: v }))
                      }
                      ariaLabel={q.prompt}
                    />
                  </div>
                  <div className="hidden lg:block">
                    <TileGroup
                      mode="multi"
                      options={q.options}
                      value={(answers[q.id] as string[]) ?? []}
                      onChange={(v) =>
                        setAnswers((s) => ({ ...s, [q.id]: v }))
                      }
                      ariaLabel={q.prompt}
                    />
                  </div>

                  {/* Inline "specify" field when the specifyFor option is
                      selected (e.g. "Other"). Slides in below the chips. */}
                  {q.specifyFor &&
                    Array.isArray(answers[q.id]) &&
                    (answers[q.id] as string[]).includes(q.specifyFor) && (
                      <div className="mt-3 max-w-[420px]">
                        <TextField
                          label={q.specifyPrompt}
                          placeholder={q.specifyPlaceholder}
                          value={specify[q.id] ?? ""}
                          onChange={(e) =>
                            setSpecify((s) => ({ ...s, [q.id]: e.target.value }))
                          }
                          autoFocus
                        />
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}

/* ----------------------------------------------------------------- */
/* TileGroup — desktop-only big-tile selectors (single or multi)      */
/* ----------------------------------------------------------------- */

type Option = { value: string; label: string };

type TileSingle = {
  mode: "single";
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  ariaLabel?: string;
};

type TileMulti = {
  mode: "multi";
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  ariaLabel?: string;
};

function TileGroup(props: TileSingle | TileMulti) {
  const isMulti = props.mode === "multi";
  // 4-col at lg, 8-col at 2xl so the 8 service tiles spread across a single
  // row at Wide instead of stacking with 2x4. The 4-option tech-count
  // question stays 4-col either way.
  const cols =
    props.options.length <= 4 ? "grid-cols-4" : "grid-cols-4 2xl:grid-cols-8";
  return (
    <div
      role={isMulti ? "group" : "radiogroup"}
      aria-label={props.ariaLabel}
      className={`grid gap-3 2xl:gap-4 ${cols}`}
    >
      {props.options.map((o) => {
        const selected = isMulti
          ? (props as TileMulti).value.includes(o.value)
          : (props as TileSingle).value === o.value;
        const Icon = OPTION_ICON[o.value] ?? MoreHorizontal;
        return (
          <button
            type="button"
            key={o.value}
            role={isMulti ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => {
              if (isMulti) {
                const m = props as TileMulti;
                const next = selected
                  ? m.value.filter((v) => v !== o.value)
                  : [...m.value, o.value];
                m.onChange(next);
              } else {
                (props as TileSingle).onChange(o.value);
              }
            }}
            className={[
              "group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-[background-color,border-color,box-shadow,transform] duration-fast ease-snap",
              selected
                ? "border-[color:var(--text-title)] bg-card shadow-md"
                : "border-border bg-card hover:-translate-y-0.5 hover:border-strong hover:shadow-sm",
            ].join(" ")}
          >
            {selected && (
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-pill bg-[color:var(--text-title)] text-[color:var(--surface-canvas)]"
              >
                <Check size={11} strokeWidth={2.5} />
              </span>
            )}
            <span
              aria-hidden="true"
              className={[
                "grid h-11 w-11 place-items-center rounded-xl transition-colors duration-fast ease-snap",
                selected ? "bg-subtle text-ink-title" : "bg-subtle text-ink-body",
              ].join(" ")}
            >
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <span className="text-[13px] font-semibold leading-tight text-ink-title">
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
