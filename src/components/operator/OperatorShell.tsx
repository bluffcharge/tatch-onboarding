"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

/* The five wizard steps shown in the GET SET UP rail + top-right counter. */
export const OPERATOR_STEPS = [
  { n: 1, title: "Create account", sub: "Your details" },
  { n: 2, title: "Choose plan", sub: "Tatch Connect" },
  { n: 3, title: "Invite team", sub: "Add your operators" },
  { n: 4, title: "Payment", sub: "Confirm & pay" },
  { n: 5, title: "You're all set", sub: "Start using Tatch" },
] as const;

function TatchMark() {
  return (
    <span className="op-brand" aria-label="Tatch">
      <svg viewBox="0 0 619 559" fill="currentColor" aria-hidden="true">
        <path d="M33 0 L256 0 A33 33 0 0 1 289 33 L289 146 C291.69 180.96 317.3 209.34 352 214 L452 214 A33 33 0 0 1 485 247 L485 525 A33 33 0 0 1 452 558 L359 558 A33 33 0 0 1 326 525 L327 291 C334.2 238.65 291.86 193.2 249 180 L33 180 A33 33 0 0 1 0 147 L0 33 A33 33 0 0 1 33 0 Z" />
        <rect x="328" y="0" width="290" height="180" rx="33" />
        <rect x="133" y="213" width="157" height="345" rx="33" />
      </svg>
      <span className="op-brand-word">tatch</span>
    </span>
  );
}

function WizardRail({ step }: { step: number }) {
  return (
    <aside className="op-rail" aria-label="Setup progress">
      <p className="op-rail-eyebrow">Get set up</p>
      <ol className="op-steps">
        {OPERATOR_STEPS.map((s) => {
          const state =
            s.n < step ? "is-done" : s.n === step ? "is-active" : "";
          return (
            <li key={s.n} className={`op-step ${state}`}>
              <span className="op-step-dot" aria-hidden="true">
                {s.n < step ? <Check14 /> : s.n}
              </span>
              <span className="op-step-text">
                <span className="op-step-title">{s.title}</span>
                <span className="op-step-sub">{s.sub}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function Check14() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  /** 1–5 highlights that wizard step; 0 = no rail (sign-in / terminal). */
  step?: number;
  /** Layout: form = rail + content; center = no rail, vertically centered. */
  variant?: "form" | "center";
  /** Top-right counter label override. Auto-derives for steps 1–5. */
  counter?: string;
  backHref?: string;
  onBack?: () => void;
  /** Wider content column (plan / payment screens). */
  wide?: boolean;
  children: ReactNode;
};

export function OperatorShell({
  step = 0,
  variant = "form",
  counter,
  backHref,
  onBack,
  wide,
  children,
}: Props) {
  const meta = OPERATOR_STEPS.find((s) => s.n === step);
  const counterLabel =
    counter ?? (meta ? `Step ${meta.n} of 5 · ${meta.title}` : null);

  const back =
    backHref || onBack ? (
      backHref ? (
        <Link href={backHref} className="op-back" aria-label="Back">
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <button type="button" className="op-back" aria-label="Back" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
      )
    ) : null;

  return (
    <div className="op-app">
      <div className="op-shell">
        <header className="op-header">
          <TatchMark />
          {counterLabel && <span className="op-stepcount">{counterLabel}</span>}
        </header>

        {variant === "center" ? (
          <div className="op-center">{children}</div>
        ) : (
          <div className="op-body">
            {step >= 1 && step <= 5 && <WizardRail step={step} />}
            <div className="op-content">
              <div className={`op-content-inner${wide ? " is-wide" : ""}`}>
                {back}
                {children}
              </div>
            </div>
          </div>
        )}

        <footer className="op-footer">
          <span className="op-foot-meta">tatch · onboarding</span>
          <span className="op-foot-links">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </span>
        </footer>
      </div>
    </div>
  );
}
