"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TicketPrimaryCTA } from "@/components/ui/TicketPrimaryCTA";
import { OnboardingShell } from "./OnboardingShell";
import type { InviteContext } from "@/lib/mockInvite";

type Props = { invite: InviteContext };

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
 *
 * Flip: clicking "Have a code? Use it instead" below the ticket flips
 * the card 180° to reveal a back face with a code-entry field. The flow
 * folds the old standalone `/join` route onto the back of the ticket, so
 * the link-based and code-based entry paths share one physical object.
 */
export function TicketWelcomeScreen({ invite }: Props) {
  const { inviter, operator } = invite;
  const [flipped, setFlipped] = useState(false);
  const flipToBack = useCallback(() => setFlipped(true), []);
  const flipToFront = useCallback(() => setFlipped(false), []);

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

        {/* Stage: ticket centered, hangs from a thin cord at the top. */}
        <div className="relative mx-auto flex w-full max-w-[600px] flex-1 flex-col items-center pt-6 lg:pt-10">
          <TicketCord />
          <div className="relative mt-2" style={{ perspective: "1200px" }}>
            <Ticket
              inviter={inviter}
              operator={operator}
              flipped={flipped}
              onFlipToBack={flipToBack}
              onFlipBack={flipToFront}
            />
          </div>

          {/* Secondary actions — only the front face calls for them, so
              they fade out when the ticket flips to the back. The flip
              trigger ("Have a code? Use it instead") now lives on the
              ticket itself in the serial slot, so it's not in this
              block anymore. */}
          <div
            aria-hidden={flipped}
            className="mt-10 w-full max-w-[460px] lg:mt-14"
            style={{
              opacity: flipped ? 0 : 1,
              pointerEvents: flipped ? "none" : "auto",
              transition: "opacity 280ms ease",
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                leadingIcon={<Mail size={16} strokeWidth={1.75} />}
                onClick={() => goto("/partner/account")}
              >
                Email
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                leadingIcon={<GoogleMark />}
                onClick={() => goto("/partner/account")}
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
  flipped,
  onFlipToBack,
  onFlipBack,
}: {
  inviter: InviteContext["inviter"];
  operator: InviteContext["operator"];
  flipped: boolean;
  onFlipToBack: () => void;
  onFlipBack: () => void;
}) {
  // Pointer-tracking 3D tilt — center origin, ~8deg max in each axis.
  // Reduced-motion users + touch devices get a flat ticket. We also
  // skip tilt while the ticket is flipped to the back face — that side
  // is a focused task (typing a code), not an ambient hover state.
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

    if (flipped) {
      setTilt({ rx: 0, ry: 0, lift: 0 });
      return;
    }

    function onMove(e: MouseEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
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
  }, [flipped]);

  return (
    <div
      ref={ref}
      className="relative h-[460px] w-[340px] origin-center sm:h-[480px] sm:w-[400px] lg:h-[520px] lg:w-[480px]"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.lift}px)`,
        transformStyle: "preserve-3d",
        transition: "transform 240ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      {/* Flipper — owns the binary front/back rotation. Lives inside the
          tilt wrapper so cursor parallax and the flip compose cleanly
          via preserve-3d rather than fighting inside a single transform
          string. */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
      >
        <TicketFace inert={flipped}>
          <TicketFront
            inviter={inviter}
            operator={operator}
            onFlipToBack={onFlipToBack}
          />
        </TicketFace>
        <TicketFace back inert={!flipped}>
          <TicketBack onFlipBack={onFlipBack} flipped={flipped} />
        </TicketFace>
      </div>
    </div>
  );
}

/* Both faces share the same surface recipe — gradient outline, dark
   body, inset bevel — so the ticket reads as one physical card with
   two sides. backface-visibility hides the face that's currently
   pointing away from the camera. */
function TicketFace({
  back,
  inert,
  children,
}: {
  back?: boolean;
  inert?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      // `inert` keeps focus and pointer events out of the hidden face so
      // tabbing through the ticket doesn't land on offscreen controls.
      // Typed via a spread to dodge React's lagging DOM-prop types.
      {...({ inert: inert ? "" : undefined } as Record<string, string | undefined>)}
      // `.gradient-outline` sets `position: relative` (same specificity as
      // Tailwind utilities, defined later in the cascade), which beats
      // `absolute inset-0`. Force the layered positioning via inline
      // style so each face actually fills the flipper instead of
      // collapsing to height 0.
      className="gradient-outline rounded-[10px]"
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-[color:var(--grey-950)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(0,0,0,0.55),0_30px_60px_-20px_rgba(0,0,0,0.55)]">
        {children}
      </div>
    </div>
  );
}

/* ----------------- Front face ----------------- */

function TicketFront({
  inviter,
  operator,
  onFlipToBack,
}: {
  inviter: InviteContext["inviter"];
  operator: InviteContext["operator"];
  onFlipToBack: () => void;
}) {
  return (
    <>
      {/* Hole punch */}
      <div className="absolute left-1/2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-pill bg-[color:var(--surface-canvas)] ring-1 ring-white/15" />

      {/* Perforation line just below the hole */}
      <div className="absolute left-6 right-6 top-12 border-t border-dashed border-white/8" />

      {/* Header copy — wider ticket lets the headline scale up. */}
      <div className="absolute left-6 right-6 top-[72px]">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white">
          Tatch · invite pass
        </p>
        <p className="mt-3 text-[20px] font-semibold leading-[1.1] lg:text-[24px]">
          You&apos;re on the list.
        </p>
        <p className="mt-2 max-w-[34ch] text-[12.5px] leading-snug text-white lg:text-[13.5px]">
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
          <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.14em] text-white">
            {inviter.title} · {operator.name}
          </p>
        </div>
      </div>

      {/* Stub-style key/value row — three cells now that we have width. */}
      <div className="absolute inset-x-6 bottom-[140px] grid grid-cols-3 gap-3 border-t border-dashed border-white/8 pt-3">
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white">
            Pass
          </p>
          <p className="mt-1 font-mono text-[11px] text-white">TATCH-001</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white">
            Issued
          </p>
          <p className="mt-1 font-mono text-[11px] text-white">
            {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white">
            Seats
          </p>
          <p className="mt-1 font-mono text-[11px] text-white">
            {operator.teammateCount + 1} active
          </p>
        </div>
      </div>

      {/* Tatch wordmark */}
      <div className="absolute inset-x-6 bottom-[108px] flex items-center gap-2">
        <Logomark />
        <span className="text-[13px] font-semibold tracking-tight">tatch</span>
        <span className="ml-auto text-[10.5px] uppercase tracking-[0.16em] text-white">
          tatch.com
        </span>
      </div>

      {/* Primary CTA — sits where the barcode used to live, so it tilts
          with the ticket. The hairline above echoes the perforation
          rhythm above the stub row. */}
      <div className="absolute inset-x-6 bottom-[44px]">
        <div className="mb-3 border-t border-dashed border-white/8" />
        <TicketPrimaryCTA
          icon={<ArrowRight size={15} strokeWidth={1.85} />}
          onClick={() => goto("/partner/account")}
        >
          Get started
        </TicketPrimaryCTA>
      </div>

      {/* Flip-to-back trigger — sits in the serial slot at the bottom of
          the ticket. Mirrors the back's "Use the invite link instead"
          slot so the bottom-most band reads as paired metadata across
          the flip. */}
      <button
        type="button"
        onClick={onFlipToBack}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute inset-x-6 bottom-4 inline-flex items-center justify-center gap-1.5 text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/55 hover:text-white"
      >
        Have a code? Use it instead
        <ArrowRight size={11} strokeWidth={1.85} />
      </button>
    </>
  );
}

/* ----------------- Back face — code entry ----------------- */

function TicketBack({
  onFlipBack,
  flipped,
}: {
  onFlipBack: () => void;
  flipped: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // When the ticket lands on the back face, focus the input so the
  // user can type immediately. The 720ms timeout matches the flip
  // duration (+20ms cushion) so the focus ring doesn't appear
  // mid-rotation.
  useEffect(() => {
    if (!flipped) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 720);
    return () => window.clearTimeout(t);
  }, [flipped]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .slice(0, 12);
    setCode(next);
    if (error) setError(null);
  }

  function handleSubmit() {
    if (code.length < 4) {
      setError("Codes are 6–12 characters.");
      return;
    }
    // mock: pretend "BAD" prefix is invalid; everything else routes
    // through the link-based flow.
    if (code.startsWith("BAD")) {
      setError("This code doesn't look right or it's expired. Ask your operator to send a new TatchLink.");
      return;
    }
    router.push("/j/abc123");
  }

  return (
    <>
      {/* Hole + perforation echoing the front so the ticket reads as
          two sides of the same physical card (the hole goes through). */}
      <div className="absolute left-1/2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-pill bg-[color:var(--surface-canvas)] ring-1 ring-white/15" />
      <div className="absolute left-6 right-6 top-12 border-t border-dashed border-white/8" />

      {/* Header copy mirrors the front's typographic rhythm so the flip
          reads as the same object turned over, not a different screen. */}
      <div className="absolute left-6 right-6 top-[72px]">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white">
          Tatch · access code
        </p>
        <p className="mt-3 text-[20px] font-semibold leading-[1.1] lg:text-[24px]">
          Enter your code
        </p>
        <p className="mt-2 max-w-[34ch] text-[12.5px] leading-snug text-white lg:text-[13.5px]">
          Your operator may have given you a 6–8 character code. Type or paste it below.
        </p>
      </div>

      {/* Code field — dark surface variant of the standalone /join input.
          Border white/15 default, white/55 on focus; subtle white/4 fill
          so the field reads as inset on the dark ticket rather than as
          another button. */}
      <div className="absolute inset-x-6 top-[210px]">
        <div
          className={[
            "flex h-12 items-center rounded-[10px] border bg-white/[0.04] px-4 transition-colors duration-fast ease-snap",
            error
              ? "border-rose-300/60"
              : "border-white/15 focus-within:border-white/55",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            value={code}
            onChange={handleChange}
            placeholder="ABC123"
            aria-label="TatchLink code"
            inputMode="text"
            autoComplete="one-time-code"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="w-full bg-transparent text-[18px] font-semibold tracking-[0.18em] text-white outline-none placeholder:text-white/35 placeholder:tracking-[0.18em]"
          />
        </div>
        {error && (
          <p
            role="alert"
            className="mt-2 text-[11.5px] leading-snug text-rose-300/90"
          >
            {error}
          </p>
        )}
      </div>

      {/* Primary CTA — same die-cut treatment as the front so the flip
          doesn't break the primary-action language. */}
      <div className="absolute inset-x-6 bottom-[44px]">
        <div className="mb-3 border-t border-dashed border-white/8" />
        <TicketPrimaryCTA
          icon={<ArrowRight size={15} strokeWidth={1.85} />}
          onClick={handleSubmit}
          disabled={code.length < 4}
        >
          Continue
        </TicketPrimaryCTA>
      </div>

      {/* Flip-back — uses the serial-line slot on the front, so when the
          ticket flips the bottom-most band reads as paired metadata
          rather than a sudden new control. */}
      <button
        type="button"
        onClick={onFlipBack}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute inset-x-6 bottom-4 inline-flex items-center justify-center gap-1.5 text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/55 hover:text-white"
      >
        <ArrowLeft size={11} strokeWidth={1.85} />
        Use the invite link instead
      </button>
    </>
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
