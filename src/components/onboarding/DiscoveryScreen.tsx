"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Hammer,
  Home,
  Minus,
  MoreHorizontal,
  Plus,
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

/** technician_count lives in the page header as a typeable stepper rather
 *  than as a stacked question, so we render the rest of the questions in
 *  the body loop. The preset is 4 (most small shops land in the 2–6 band),
 *  but the value is free-typed — a slider capped at 25 didn't work for
 *  larger shops (75+ technicians), so it's a number field with +/- steppers. */
const TECH_COUNT_ID = "technician_count";
const TECH_COUNT_PRESET = 4;
const TECH_COUNT_MIN = 1;
const TECH_COUNT_MAX = 999;

export function DiscoveryScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(() => {
    const seed: Answers = {};
    DISCOVERY_QUESTIONS.forEach((q) => {
      if (q.id === TECH_COUNT_ID) {
        seed[q.id] = String(TECH_COUNT_PRESET);
      } else {
        seed[q.id] = q.type === "multi_select_chips" ? [] : null;
      }
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
      center
    >
      <div className="mt-2 md:mt-0">
        {/* Header row: title + helper on the left, technician slider
            inset to the top-right on md+. Lifting the tech count out
            of the body loop saves a question's worth of vertical
            space — keeps the service tiles and the Continue CTA above
            the fold on a standard desktop. */}
        <div className="md:flex md:items-start md:justify-between md:gap-8">
          <div className="md:flex-1">
            <h1 className="t-h2 mb-2 md:text-[28px] md:leading-tight lg:text-[32px]">
              A couple of quick questions.
            </h1>
            <p className="t-body mb-6 text-ink-subtitle md:mb-8 md:text-[15px] lg:text-[16px]">
              This helps your operator route the right referrals to you.
            </p>
          </div>
          <div className="mb-6 md:mb-0 md:w-[260px] md:shrink-0 lg:w-[300px]">
            <TechCountStepper
              value={parseInt(
                (answers[TECH_COUNT_ID] as string | null) ??
                  String(TECH_COUNT_PRESET),
                10
              )}
              onChange={(n) =>
                setAnswers((s) => ({ ...s, [TECH_COUNT_ID]: String(n) }))
              }
            />
          </div>
        </div>

        <div className="space-y-8 lg:space-y-10">
          {DISCOVERY_QUESTIONS.filter((q) => q.id !== TECH_COUNT_ID).map((q) => (
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

        {/* Continue moved inline (out of the shell footer) so the whole
            question stack + CTA center together as one group at md+. */}
        <div className="mx-auto mt-10 w-full md:max-w-[400px]">
          <Button
            fullWidth
            size="lg"
            disabled={!allRequiredAnswered}
            onClick={() => router.push("/onboarding/team")}
          >
            Continue
          </Button>
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
  // Always 4-up at lg+. The previous 2xl:grid-cols-8 squeezed all 8 service
  // tiles into one row at Desktop/Wide, which overflowed the content column
  // (anti-patterns: don't change the grid count between breakpoints — more
  // margin, same grid). 4-up gives a clean 2×4 at every desktop width.
  const cols = "grid-cols-4";
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
              "group relative flex h-[88px] items-center gap-3 rounded-2xl border px-3.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-fast ease-snap",
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
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-fast ease-snap",
                selected ? "bg-subtle text-ink-title" : "bg-subtle text-ink-body",
              ].join(" ")}
            >
              <Icon size={18} strokeWidth={1.75} />
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

/* ----------------------------------------------------------------- */
/* TechCountSlider — inset header control                            */
/* ----------------------------------------------------------------- */

function TechCountStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const clamp = (n: number) =>
    Math.max(TECH_COUNT_MIN, Math.min(TECH_COUNT_MAX, n));
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="t-mono-label">Technicians</p>
          <p className="mt-0.5 text-[11px] text-ink-caption">
            Including owners &amp; 1099s
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <StepButton
            label="Decrease"
            onClick={() => onChange(clamp(value - 1))}
            disabled={value <= TECH_COUNT_MIN}
          >
            <Minus size={15} strokeWidth={2} />
          </StepButton>
          <input
            type="text"
            inputMode="numeric"
            aria-label="Number of technicians"
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
              onChange(digits === "" ? TECH_COUNT_MIN : clamp(parseInt(digits, 10)));
            }}
            className="w-[3ch] bg-transparent text-center text-[24px] font-semibold leading-none tabular-nums text-ink-title outline-none"
          />
          <StepButton
            label="Increase"
            onClick={() => onChange(clamp(value + 1))}
            disabled={value >= TECH_COUNT_MAX}
          >
            <Plus size={15} strokeWidth={2} />
          </StepButton>
        </div>
      </div>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-border bg-canvas text-ink-body transition-colors duration-fast ease-snap hover:bg-subtle hover:text-ink-title disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
