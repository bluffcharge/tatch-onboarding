"use client";

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
 */
export function BrandRibbons() {
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
          <path
            key={i}
            d={r.d}
            stroke={`url(#${r.gradId})`}
            strokeWidth={r.width}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            className="brand-ribbon"
            style={{ animationDelay: `${r.delay}ms` }}
          />
        ))}
      </svg>
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
  },
  {
    gradId: "ribbon-royal",
    color: "#7533FF",
    maxOpacity: 0.65,
    d: "M -60 810 C 500 820, 1100 720, 2000 560",
    width: 48,
    delay: 130,
  },
  {
    gradId: "ribbon-magenta",
    color: "#FF40F5",
    maxOpacity: 0.55,
    d: "M -60 760 C 500 770, 1100 670, 2000 500",
    width: 40,
    delay: 260,
  },
  {
    gradId: "ribbon-deep",
    color: "#003ED8",
    maxOpacity: 0.5,
    d: "M -60 710 C 500 720, 1100 620, 2000 440",
    width: 32,
    delay: 390,
  },
];
