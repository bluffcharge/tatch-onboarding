"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Brand ribbons — animated SVG sweep anchored to the bottom-left of the
 * canvas. Renders only at lg+ (1024px), where form/hero columns leave huge
 * dead space at desktop and wide breakpoints; mobile/tablet stay clean.
 *
 * Each ribbon strokes with a horizontal linear gradient that fades from
 * full opacity at the left (where the ribbon originates) to zero on the
 * right (where content lives). That preserves the "drawn-in, filling
 * space" feel of the Neuform sweep without overrunning the hero text,
 * feature cards, or CTAs on the upper-right.
 *
 * Paths draw on via stroke-dashoffset with a staggered ease so the bouquet
 * reveals left → right over ~2s rather than slapping on a decorative bar.
 *
 * Idle motion: each ribbon then breathes via a slow vertical shimmer
 * (≤0.6px amplitude, ~18s cycle). Each ribbon's shimmer is phase-offset
 * so they don't move in lockstep; the result is sub-conscious — closer
 * to a string sitting in a draft than to a "this thing is animated"
 * tell.
 *
 * Easter egg: clicking inside the bottom-left hit zone plucks all four
 * ribbons (one-shot wobble) and plays a quiet sine pluck via WebAudio.
 * Deliberately undecorated so the gesture is a discovery rather than a
 * marketed feature.
 */
export function BrandRibbons() {
  // `pluck` toggles a CSS class that fires the one-shot wobble keyframes.
  // The token field flips so successive clicks re-trigger the animation
  // even if the previous run hasn't finished (React only re-applies the
  // class when the key changes).
  const [pluck, setPluck] = useState<{ on: boolean; key: number }>({ on: false, key: 0 });
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handlePluck = useCallback(() => {
    setPluck((prev) => ({ on: true, key: prev.key + 1 }));
    window.setTimeout(() => setPluck((prev) => ({ on: false, key: prev.key })), 1150);

    // Soft pluck — sine that exponentially detunes from G3 → G2 over
    // ~0.8s with a quick attack and long decay. Lowpass keeps it warm.
    // Gain peaks at 0.025 — quieter than typical UI feedback by design.
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      filter.type = "lowpass";
      filter.frequency.value = 1100;
      filter.Q.value = 0.7;
      osc.type = "sine";
      osc.frequency.setValueAtTime(196, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(98, ctx.currentTime + 0.85);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.95);
    } catch {
      // Audio is best-effort; silent failure is fine.
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="brand-ribbons pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMinYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {RIBBONS.map((r) => (
            <linearGradient
              key={r.gradId}
              id={r.gradId}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0" stopColor={r.color} stopOpacity={r.maxOpacity} />
              <stop
                offset="0.75"
                stopColor={r.color}
                stopOpacity={r.maxOpacity * 0.85}
              />
              <stop offset="1" stopColor={r.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {RIBBONS.map((r, i) => (
          <g
            // Key bumps when a fresh pluck fires so React reattaches the
            // class and the keyframes replay even on rapid re-clicks.
            key={`${i}-${pluck.key}`}
            className={`ribbon-group${pluck.on ? " plucked" : ""}`}
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <path
              d={r.d}
              stroke={`url(#${r.gradId})`}
              strokeWidth={r.width}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              className="brand-ribbon"
              // Two delays: draw on mount (small stagger) + shimmer
              // phase offset (negative seconds = jump into the cycle so
              // ribbons aren't synchronized).
              style={{ animationDelay: `${r.delay}ms, ${r.shimmerOffset}s` }}
            />
          </g>
        ))}
      </svg>

      {/* Pluck hit zone — bottom-left of the canvas, sized to the visual
          density of the ribbon bouquet at that corner. Intentionally
          undecorated (no cursor change, no hover hint) so the gesture
          reads as a discovery. Sits over the svg so clicks land here
          rather than on the underlying pointer-events-none paths. */}
      <button
        type="button"
        onClick={handlePluck}
        aria-label="Pluck the ribbons"
        className="pointer-events-auto absolute bottom-0 left-0 h-[240px] w-[300px] bg-transparent outline-none focus-visible:outline-none"
        tabIndex={-1}
      />
    </div>
  );
}

type Ribbon = {
  gradId: string;
  color: string;
  maxOpacity: number;
  d: string;
  width: number;
  delay: number;
  /** Negative seconds — jumps each ribbon into a different point of
   *  the 18s shimmer cycle so they breathe out of phase. */
  shimmerOffset: number;
};

// Four parallel sweeps that originate from the off-canvas lower-left and
// arc up across the lower-two-thirds of the canvas, exiting middle-right.
// The stroke gradient fades them to transparent before they reach the
// content column at far right. Colors follow the signature Tatch gradient
// (#00BBFF → #7533FF → #FF40F5) plus a deep-royal anchor at the top of
// the fan so the bouquet reads brand-coherent at any width.
const RIBBONS: Ribbon[] = [
  {
    gradId: "ribbon-cyan",
    color: "#00BBFF",
    maxOpacity: 0.7,
    d: "M -60 860 C 500 870, 1100 770, 2000 620",
    width: 56,
    delay: 0,
    shimmerOffset: -2,
  },
  {
    gradId: "ribbon-royal",
    color: "#7533FF",
    maxOpacity: 0.65,
    d: "M -60 810 C 500 820, 1100 720, 2000 560",
    width: 48,
    delay: 130,
    shimmerOffset: -5.5,
  },
  {
    gradId: "ribbon-magenta",
    color: "#FF40F5",
    maxOpacity: 0.55,
    d: "M -60 760 C 500 770, 1100 670, 2000 500",
    width: 40,
    delay: 260,
    shimmerOffset: -9.5,
  },
  {
    gradId: "ribbon-deep",
    color: "#003ED8",
    maxOpacity: 0.5,
    d: "M -60 710 C 500 720, 1100 620, 2000 440",
    width: 32,
    delay: 390,
    shimmerOffset: -13.5,
  },
];
