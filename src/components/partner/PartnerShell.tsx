"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

/* Partner-wizard shell — the operator signup's OperatorShell with the
   partner step list. Same scoped brand (operator.css), same rail / floating
   card / slide-transition behavior, so the two flows stay visually twins. */

export const PARTNER_STEPS = [
  { n: 1, title: "Create login",   sub: "Email or Google",          href: "/partner/account" },
  { n: 2, title: "About you",      sub: "Name & contact",           href: "/partner/account/about" },
  { n: 3, title: "Your business",  sub: "Company details",          href: "/partner/account/business" },
  { n: 4, title: "Your team",      sub: "Technicians & services",   href: "/partner/questions" },
  { n: 5, title: "Invite team",    sub: "Optional",                 href: "/partner/team" },
  { n: 6, title: "You're connected", sub: "Start using Tatch",      href: "/partner/done" },
] as const;
const LAST_STEP = PARTNER_STEPS.length;

/* Direction is stamped on the source side (back arrow / earlier sidebar
   steps set "back"; everything else defaults to "fwd"), then read + cleared
   on the destination's first paint. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function markBackNav() {
  try { sessionStorage.setItem("op-nav-dir", "back"); } catch {}
}

function useSlideDir(): "fwd" | "back" {
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  useIsoLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("op-nav-dir") === "back") setDir("back");
      sessionStorage.removeItem("op-nav-dir");
    } catch {}
  }, []);
  return dir;
}

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
    <nav className="op-rail" aria-label="Setup progress">
      <p className="op-rail-eyebrow">Get set up</p>
      <ol className="op-steps">
        {PARTNER_STEPS.map((s) => {
          const state = s.n < step ? "is-done" : s.n === step ? "is-active" : "";
          const clickable = s.n <= step && s.n !== LAST_STEP;
          const dot = (
            <span className="op-step-dot" aria-hidden="true">
              {s.n < step ? <Check14 /> : s.n}
            </span>
          );
          const text = (
            <span className="op-step-text">
              <span className="op-step-title">{s.title}</span>
              <span className="op-step-sub">{s.sub}</span>
            </span>
          );
          return (
            <li key={s.n} className={`op-step ${state}${clickable ? " is-link" : ""}`}>
              {clickable ? (
                <Link href={s.href} className="op-step-hit" onClick={markBackNav}>
                  {dot}{text}
                </Link>
              ) : (
                <div className="op-step-hit">{dot}{text}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Check14() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FootLinks() {
  return (
    <div className="op-foot">
      <span className="op-foot-meta">tatch · onboarding</span>
      <span className="op-foot-links">
        <a href="#terms">Terms</a>
        <a href="#privacy">Privacy</a>
      </span>
    </div>
  );
}

type Props = {
  /** 1–6 highlights that wizard step; 0 = no rail (sign-in / terminal). */
  step?: number;
  /** Layout: form = rail + floating card; center = centered card, no rail. */
  variant?: "form" | "center";
  /** Mobile step label override. Auto-derives "Step N of 6". */
  counter?: string;
  backHref?: string;
  onBack?: () => void;
  /** Wider content column (chip grids read fine at 440, so rarely needed). */
  wide?: boolean;
  children: ReactNode;
};

export function PartnerShell({
  step = 0,
  variant = "form",
  counter,
  backHref,
  onBack,
  wide,
  children,
}: Props) {
  const meta = PARTNER_STEPS.find((s) => s.n === step);
  const counterLabel = counter ?? (meta ? `Step ${meta.n} of ${LAST_STEP}` : null);
  const dir = useSlideDir();
  const slide = `op-slide op-slide--${dir}`;
  const isForm = variant === "form" && step >= 1 && step <= LAST_STEP;

  const back =
    backHref || onBack ? (
      backHref ? (
        <Link href={backHref} className="op-back" aria-label="Back" onClick={markBackNav}>
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <button type="button" className="op-back" aria-label="Back" onClick={onBack}>
          <ChevronLeft size={20} />
        </button>
      )
    ) : null;

  return (
    <div className={`op-app${isForm ? "" : " is-center"}`}>
      <span className="op-backdrop" aria-hidden="true" />

      {/* Left side — wordmark + rail on the bare page (desktop); a slim top
          bar carries the wordmark + step on mobile. */}
      {isForm ? (
        <aside className="op-side">
          <TatchMark />
          <WizardRail step={step} />
          <FootLinks />
        </aside>
      ) : (
        <header className="op-topbar">
          <TatchMark />
        </header>
      )}

      {/* Mobile-only top bar for wizard screens (rail is hidden). */}
      {isForm && (
        <header className="op-topbar op-topbar--wizard">
          <TatchMark />
          {counterLabel && <span className="op-mini-step">{counterLabel}</span>}
        </header>
      )}

      {/* Right stage — the floating card. */}
      <div className="op-stage">
        <div className={`op-card${wide ? " is-wide" : ""}${isForm ? "" : " op-card--center"}`}>
          {isForm && (
            <div className="op-card-head">
              {back ?? <span />}
              {counterLabel && <span className="op-mini-step op-card-step">{counterLabel}</span>}
            </div>
          )}
          <div className={`op-card-body ${slide}`}>
            {!isForm && back}
            {children}
          </div>
        </div>
        {!isForm && <FootLinks />}
      </div>
    </div>
  );
}
