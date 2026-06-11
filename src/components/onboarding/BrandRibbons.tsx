"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStringTones } from "@/lib/useStringTones";

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
 * (≤0.6px amplitude, ~18s cycle), phase-offset per ribbon.
 *
 * Strum: moving the pointer ACROSS a ribbon plucks it — each line is a
 * damped spring that takes a velocity impulse when the cursor crosses its
 * centerline, so dragging through the fan strums the four strings in
 * sequence. Springs integrate in one rAF loop and write a translateY onto
 * a dedicated wrapper <g>, composing cleanly with the draw-on/shimmer
 * (path) and pluck (outer group) animations. Disabled under
 * prefers-reduced-motion.
 *
 * Easter egg: clicking inside the bottom-left hit zone plucks all four
 * ribbons (one-shot wobble) and strums all four tones in sequence.
 *
 * Sound: each ribbon is tuned to a sampled tone (useStringTones — warm
 * plucks + lush convolution reverb). Crossing a ribbon plucks its note at
 * the same instant the spring takes its impulse, so sweeping the fan plays
 * an ascending glissando. Bottom ribbon = lowest pitch. Silent until the
 * first user gesture (autoplay policy) and under prefers-reduced-motion.
 */

/* 4 strings → the contiguous middle of the 9-sample D4–E5 ladder, ascending
   with the fan (RIBBONS[0] is the bottom-most sweep = lowest note). */
const TONE_URLS = [
  "/sounds/tone-G4.mp3",
  "/sounds/tone-A4.mp3",
  "/sounds/tone-B4.mp3",
  "/sounds/tone-C5.mp3",
];

/* Spring tuning: ω≈9.5 rad/s (~1.5 Hz wobble), ζ≈0.2 → ~4 visible
   oscillations decaying over ~1.2s. Impulse + clamp keep the peak around
   10 viewBox units (~8–14 screen px) — felt, not flashy. */
const SPRING_K = 90;
const SPRING_C = 4;
const IMPULSE = 110;
const MAX_AMP = 16;

type SpringState = {
  pos: number;
  vel: number;
  /** which side of the ribbon the pointer was on last move (+1/-1/0) */
  side: number;
  /** sampled centerline (y at increasing x) for crossing detection */
  samples: { x: number; y: number }[];
};

export function BrandRibbons() {
  // `pluck` toggles a CSS class that fires the one-shot wobble keyframes.
  // The token field flips so successive clicks re-trigger the animation
  // even if the previous run hasn't finished (React only re-applies the
  // class when the key changes).
  const [pluck, setPluck] = useState<{ on: boolean; key: number }>({ on: false, key: 0 });
  const tones = useStringTones(TONE_URLS);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const strumRefs = useRef<(SVGGElement | null)[]>([]);
  const springs = useRef<SpringState[]>(
    RIBBONS.map(() => ({ pos: 0, vel: 0, side: 0, samples: [] })),
  );
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);

  /* Integrate all springs; park the loop once everything settles. */
  const tick = useCallback((ts: number) => {
    const dt = Math.min(32, ts - (lastTsRef.current || ts)) / 1000;
    lastTsRef.current = ts;
    let live = false;
    springs.current.forEach((s, i) => {
      if (s.pos === 0 && Math.abs(s.vel) < 0.01) return;
      const acc = -SPRING_K * s.pos - SPRING_C * s.vel;
      s.vel += acc * dt;
      s.pos += s.vel * dt;
      s.pos = Math.max(-MAX_AMP, Math.min(MAX_AMP, s.pos));
      if (Math.abs(s.pos) < 0.04 && Math.abs(s.vel) < 0.6) {
        s.pos = 0;
        s.vel = 0;
      } else {
        live = true;
      }
      strumRefs.current[i]?.setAttribute("transform", `translate(0 ${s.pos.toFixed(2)})`);
    });
    if (live) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
      lastTsRef.current = 0;
    }
  }, []);

  const wake = useCallback(() => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  /* Sample each path's centerline on mount, then watch pointer crossings
     on the window (the ornament layer is pointer-events-none, so it can't
     observe events itself). */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    pathRefs.current.forEach((p, i) => {
      if (!p) return;
      const len = p.getTotalLength();
      const pts: { x: number; y: number }[] = [];
      for (let t = 0; t <= 48; t++) {
        const pt = p.getPointAtLength((len * t) / 48);
        pts.push({ x: pt.x, y: pt.y });
      }
      springs.current[i].samples = pts;
    });

    const yAt = (s: SpringState, x: number): number | null => {
      const pts = s.samples;
      if (pts.length === 0 || x < pts[0].x || x > pts[pts.length - 1].x) return null;
      let lo = 0;
      let hi = pts.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (pts[mid].x <= x) lo = mid;
        else hi = mid;
      }
      const a = pts[lo];
      const b = pts[hi];
      const f = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
      return a.y + (b.y - a.y) * f;
    };

    const onMove = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      if (
        r.width === 0 ||
        e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom
      )
        return;
      // Client → viewBox (1600×900, preserveAspectRatio="xMinYMax slice"):
      // uniform cover scale, x pinned left, y pinned bottom.
      const s = Math.max(r.width / 1600, r.height / 900);
      const vx = (e.clientX - r.left) / s;
      const vy = (e.clientY - r.top - (r.height - 900 * s)) / s;

      springs.current.forEach((sp, i) => {
        const y = yAt(sp, vx);
        if (y == null) {
          sp.side = 0;
          return;
        }
        const side = vy > y ? 1 : -1;
        if (sp.side !== 0 && side !== sp.side) {
          // Crossed the string — impulse in the direction of travel,
          // and the string's tone rings at the same instant.
          sp.vel += side * IMPULSE;
          wake();
          tones.pluck(i);
        }
        sp.side = side;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
    };
    // Re-run after a pluck remounts the groups (refs repopulate).
  }, [wake, pluck.key, tones]);

  const handlePluck = useCallback(() => {
    setPluck((prev) => ({ on: true, key: prev.key + 1 }));
    window.setTimeout(() => setPluck((prev) => ({ on: false, key: prev.key })), 1150);

    // Strum the four sampled tones low → high, staggered to match the
    // ribbons' wobble cascade. The click doubles as the autoplay-unlock
    // gesture (decode is ms-fast, so the tail of even the first strum
    // rings). Replaces the old synthesized sine — one voice for every
    // string sound.
    tones.strumAll(70);
  }, [tones]);

  return (
    <div
      ref={rootRef}
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
            {/* Strum layer — carries the spring's translateY so the physics
                composes with the group pluck + path shimmer animations. */}
            <g
              ref={(el) => {
                strumRefs.current[i] = el;
              }}
            >
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
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
// Opacities sit at 36% of their original values (−64%, design call
// 2026-06-11) — the bouquet underpaints the canvas rather than performing.
const RIBBONS: Ribbon[] = [
  {
    gradId: "ribbon-cyan",
    color: "#00BBFF",
    maxOpacity: 0.25,
    d: "M -60 860 C 500 870, 1100 770, 2000 620",
    width: 56,
    delay: 0,
    shimmerOffset: -2,
  },
  {
    gradId: "ribbon-royal",
    color: "#7533FF",
    maxOpacity: 0.23,
    d: "M -60 810 C 500 820, 1100 720, 2000 560",
    width: 48,
    delay: 130,
    shimmerOffset: -5.5,
  },
  {
    gradId: "ribbon-magenta",
    color: "#FF40F5",
    maxOpacity: 0.2,
    d: "M -60 760 C 500 770, 1100 670, 2000 500",
    width: 40,
    delay: 260,
    shimmerOffset: -9.5,
  },
  {
    gradId: "ribbon-deep",
    color: "#003ED8",
    maxOpacity: 0.18,
    d: "M -60 710 C 500 720, 1100 620, 2000 440",
    width: 32,
    delay: 390,
    shimmerOffset: -13.5,
  },
];
