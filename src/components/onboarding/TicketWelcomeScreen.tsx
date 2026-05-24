"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext } from "@/lib/mockInvite";

type Props = { invite: InviteContext };

/* ----------------- Glass primary CTA -----------------
   Replaces the solid-purple `<Button>` on the ticket route. Translucent
   surface + backdrop-blur + the canonical gradient outline. The label
   inherits text-ink-title so it reads white in dark, near-black in light.
   Defined here before consumers so the bundler doesn't trip on the
   forward reference inside the client-component boundary.            */
function GlassPrimaryCTA({
  icon,
  children,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gradient-outline glass-surface group relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill px-5 text-[14px] font-semibold text-ink-title transition-transform duration-fast ease-snap active:scale-[0.99]"
    >
      <span className="relative z-[2] inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}

/**
 * P1 — Ticket variant. Inspired by the Vanguard hang-tag mockup but using
 * the Tatch palette (ink + white + a subtle DIS-blue back-tag) instead of
 * orange. The ticket itself carries the inviter context, a stylized
 * "barcode," and the Tatch wordmark; the CTAs sit beneath the ticket so
 * the action still drives the flow.
 *
 * Hover interaction: the ticket has a soft 3D tilt that tracks the cursor
 * (parallax over both axes ~10deg max), plus a tiny rise on Y. On mobile
 * the tilt drops off and the ticket sits flat.
 */
export function TicketWelcomeScreen({ invite }: Props) {
  const { inviter, operator } = invite;

  return (
    <OnboardingShell chrome={false}>
      {/* `ticket-page` dims the brand-ribbons on this route ~70% so they
          recede behind the ticket's own visual rhythm. */}
      <div className="ticket-page flex flex-1 flex-col">
        {/* Brand row */}
        <div className="safe-pt flex items-center justify-between pb-6 pt-1">
          <span className="text-[15px] font-semibold tracking-tight text-ink-title">
            tatch
          </span>
          <span className="t-mono-label">P1 · ticket variant</span>
        </div>

        {/* Stage: ticket centered, hangs from a thin cord at the top. The
            accent slip behind is gone — the new gradient outline on the
            ticket itself is the brand pop now. */}
        <div className="relative mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center pt-6 lg:pt-10">
          <TicketCord />
          <div className="relative mt-2" style={{ perspective: "1200px" }}>
            <Ticket inviter={inviter} operator={operator} />
          </div>

          {/* CTAs below the ticket */}
          <div className="mt-10 w-full max-w-[460px] space-y-3 lg:mt-14">
            <GlassPrimaryCTA
              icon={<Phone size={16} strokeWidth={1.75} />}
              onClick={() => goto("/onboarding/auth?via=phone")}
            >
              Continue with phone
            </GlassPrimaryCTA>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                leadingIcon={<Mail size={16} strokeWidth={1.75} />}
                onClick={() => goto("/onboarding/auth?via=email")}
              >
                Email
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                leadingIcon={<GoogleMark />}
                onClick={() => goto("/onboarding/auth?via=google")}
              >
                Google
              </Button>
            </div>
          </div>

          {/* Legal */}
          <p className="t-caption mt-6 text-center">
            By continuing you agree to our{" "}
            <Link href="#terms" className="text-ink-link underline-offset-2 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#privacy" className="text-ink-link underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </OnboardingShell>
  );
}

/* ----------------- The ticket itself ----------------- */

function Ticket({
  inviter,
  operator,
}: {
  inviter: InviteContext["inviter"];
  operator: InviteContext["operator"];
}) {
  // Pointer-tracking 3D tilt — center origin, ~8deg max in each axis.
  // Reduced-motion users + touch devices get a flat ticket.
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lift: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    function onMove(e: MouseEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
      // ry follows x (left/right tilt), rx inversely follows y (top/bottom)
      setTilt({ rx: -y * 14, ry: x * 14, lift: -6 });
    }
    function onLeave() {
      setTilt({ rx: 0, ry: 0, lift: 0 });
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="gradient-outline relative h-[460px] w-[340px] origin-center cursor-pointer rounded-[10px] sm:h-[480px] sm:w-[400px] lg:h-[520px] lg:w-[480px]"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.lift}px)`,
        transformStyle: "preserve-3d",
        transition: "transform 240ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      {/* Ticket body: near-black surface inside the conic gradient outline.
          The 1px gap between bg and pseudo-element ring is intentional —
          mask-composite paints only the ring. */}
      <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[color:var(--grey-950)] text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
        {/* Hole punch */}
        <div className="absolute left-1/2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-pill bg-[color:var(--surface-canvas)] ring-1 ring-white/15" />

        {/* Perforation line just below the hole */}
        <div className="absolute left-6 right-6 top-12 border-t border-dashed border-white/8" />

        {/* Header copy — wider ticket lets the headline scale up. */}
        <div className="absolute left-6 right-6 top-[72px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
            Tatch · invite pass
          </p>
          <p className="mt-3 text-[20px] font-semibold leading-[1.1] lg:text-[24px]">
            You&apos;re on the list.
          </p>
          <p className="mt-2 max-w-[34ch] text-[12.5px] leading-snug text-white/55 lg:text-[13.5px]">
            Set up in about 90 seconds and start receiving referrals from {operator.name}.
          </p>
        </div>

        {/* Inviter block (mid-ticket) — has more horizontal room now, so
            the line wraps less and the company name reads as a single line. */}
        <div className="absolute left-6 right-6 top-[200px] flex items-center gap-3 lg:top-[230px]">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-white text-[13px] font-semibold text-[color:var(--grey-950)]"
          >
            {inviter.firstName[0]}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white lg:text-[14px]">
              {inviter.fullName}
            </p>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-white/45">
              {inviter.title} · {operator.name}
            </p>
          </div>
        </div>

        {/* Stub-style key/value row — three cells now that we have width. */}
        <div className="absolute inset-x-6 bottom-[140px] grid grid-cols-3 gap-3 border-t border-dashed border-white/8 pt-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
              Pass
            </p>
            <p className="mt-1 font-mono text-[11px] text-white/85">TATCH-001</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
              Issued
            </p>
            <p className="mt-1 font-mono text-[11px] text-white/85">
              {new Date().toISOString().slice(0, 10)}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
              Seats
            </p>
            <p className="mt-1 font-mono text-[11px] text-white/85">
              {operator.teammateCount + 1} active
            </p>
          </div>
        </div>

        {/* Tatch wordmark */}
        <div className="absolute inset-x-6 bottom-[92px] flex items-center gap-2">
          <Logomark />
          <span className="text-[13px] font-semibold tracking-tight">tatch</span>
          <span className="ml-auto text-[10.5px] uppercase tracking-[0.16em] text-white/40">
            tatch.com
          </span>
        </div>

        {/* Barcode */}
        <div className="absolute inset-x-6 bottom-[44px] h-9">
          <Barcode />
        </div>

        {/* Serial */}
        <p className="absolute inset-x-6 bottom-4 text-center font-mono text-[9.5px] tracking-[0.3em] text-white/40">
          0001 · {operator.name.replace(/\s+/g, "").toUpperCase().slice(0, 6)} · {inviter.firstName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

/* ----------------- Cord ----------------- */

function TicketCord() {
  return (
    <svg
      aria-hidden="true"
      width="80"
      height="60"
      viewBox="0 0 80 60"
      className="absolute -top-2 left-1/2 -translate-x-1/2 text-white/30"
    >
      <path
        d="M 5 4 C 20 28, 60 28, 75 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ----------------- Logomark — small Tatch wordmark glyph ----------------- */

function Logomark() {
  // Square plug-shape echoing the Tatch logomark — kept simple at this size.
  return (
    <span
      aria-hidden="true"
      className="grid h-4 w-4 place-items-center rounded-[3px] bg-white text-[8px] font-bold text-[color:var(--grey-950)]"
    >
      T
    </span>
  );
}

/* ----------------- Barcode (stylized, decorative) ----------------- */

function Barcode() {
  // A pseudo-random but stable barcode pattern — width-varying bars.
  const bars = [3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2];
  return (
    <svg
      viewBox={`0 0 ${bars.reduce((sum, w) => sum + w + 2, 0)} 36`}
      preserveAspectRatio="none"
      className="h-full w-full text-white/80"
    >
      {(() => {
        let x = 0;
        return bars.map((w, i) => {
          const el = <rect key={i} x={x} y={0} width={w} height={36} fill="currentColor" />;
          x += w + 2;
          return el;
        });
      })()}
    </svg>
  );
}

/* ----------------- Helpers ----------------- */

function goto(href: string) {
  if (typeof window !== "undefined") window.location.assign(href);
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.68-3.86 2.68-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.96L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
