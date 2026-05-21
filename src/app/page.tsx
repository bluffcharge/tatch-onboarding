"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Laptop,
  Monitor,
  Moon,
  RotateCcw,
  Smartphone,
  Sun,
  Tablet,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type Group = "entry" | "onboarding" | "operator" | "edge";
type RouteIntent = "mobile" | "desktop";

type Route = {
  href: string;
  title: string;
  subtitle: string;
  group: Group;
  /** which viewport this route was *designed* for — seeds the initial
   *  viewport on first gallery load only; user choice persists after. */
  intent: RouteIntent;
};

const ROUTES: Route[] = [
  { href: "/j/abc123",                   title: "P1 — Welcome",           subtitle: "SMS / email link entry",                  group: "entry",      intent: "mobile"  },
  { href: "/join",                       title: "P0/B — Code entry",      subtitle: "No link, partner types the code",         group: "entry",      intent: "mobile"  },
  { href: "/onboarding/auth?via=phone",  title: "P2 — Auth (phone)",      subtitle: "Phone OTP — primary path",                group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/auth?via=email",  title: "P2 — Auth (email)",      subtitle: "Secondary path",                          group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/business",        title: "P3 — Business profile",  subtitle: "Name + address + contact",                group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/discovery",       title: "P4 — Discovery",         subtitle: "Technicians + services (typed array)",    group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/team",            title: "P5 — Invite team",       subtitle: "SMS-first, optional",                     group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/activating",      title: "P6 — Activating",        subtitle: "1–2s two-beat transition",                group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/done",            title: "P7 — Connected (new)",   subtitle: "New-partner success",                     group: "onboarding", intent: "mobile"  },
  { href: "/onboarding/done?existing=1", title: "P7 — Short-circuit",     subtitle: "Existing-partner copy",                   group: "onboarding", intent: "mobile"  },
  { href: "/partner-admin/invite",       title: "O1 — Operator invite",   subtitle: "Settings panel · codes · recent",         group: "operator",   intent: "desktop" },
  { href: "/join?bad=1",                 title: "Edge — Invalid code",    subtitle: "Code entry error state",                  group: "edge",       intent: "mobile"  },
  { href: "/j/used",                     title: "Edge — Used invite",     subtitle: "Already-claimed error",                   group: "edge",       intent: "mobile"  },
];

const GROUP_LABEL: Record<Group, string> = {
  entry:      "Entry",
  onboarding: "Onboarding",
  operator:   "Operator",
  edge:       "Edge cases",
};

const ROUTE_STORAGE_KEY = "tatch-gallery-route";
const VIEWPORT_STORAGE_KEY = "tatch-gallery-viewport";

/* ------------------------------------------------------------------ */
/* Viewport catalog                                                    */
/* ------------------------------------------------------------------ */

type Viewport = "phone" | "tablet" | "laptop" | "desktop" | "wide";

type ViewportSpec = {
  width: number;
  height: number;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  /** Device-style corner radius applied to the frame at native scale. */
  radius: number;
};

const VIEWPORTS: Record<Viewport, ViewportSpec> = {
  phone:   { width: 390,  height: 844,  label: "Phone",   shortLabel: "iPhone 14",         Icon: Smartphone, radius: 44 },
  tablet:  { width: 820,  height: 1180, label: "Tablet",  shortLabel: "iPad Air",          Icon: Tablet,     radius: 28 },
  laptop:  { width: 1440, height: 900,  label: "Laptop",  shortLabel: "MacBook Pro 14\"",  Icon: Laptop,     radius: 10 },
  desktop: { width: 1920, height: 1080, label: "Desktop", shortLabel: "1920 × 1080",       Icon: Monitor,    radius: 10 },
  wide:    { width: 2560, height: 1440, label: "Wide",    shortLabel: "27\" QHD",          Icon: Tv,         radius: 10 },
};

const VIEWPORT_ORDER: Viewport[] = ["phone", "tablet", "laptop", "desktop", "wide"];

function intentToViewport(intent: RouteIntent): Viewport {
  return intent === "mobile" ? "phone" : "desktop";
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [activeHref, setActiveHref] = useState<string>(ROUTES[0].href);
  const [viewport, setViewportState] = useState<Viewport>("phone");
  const [resetTick, setResetTick] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hydratedViewport = useRef(false);

  // Restore last-viewed route + viewport on mount; persist on change.
  useEffect(() => {
    const storedRoute = localStorage.getItem(ROUTE_STORAGE_KEY);
    if (storedRoute && ROUTES.some((r) => r.href === storedRoute)) {
      setActiveHref(storedRoute);
    }
    const storedViewport = localStorage.getItem(VIEWPORT_STORAGE_KEY) as Viewport | null;
    if (storedViewport && VIEWPORTS[storedViewport]) {
      setViewportState(storedViewport);
    } else {
      // No stored choice — seed from the active route's intent so a fresh
      // gallery shows mobile-first routes in Phone, operator routes in Desktop.
      const r = ROUTES.find((x) => x.href === (storedRoute ?? ROUTES[0].href));
      if (r) setViewportState(intentToViewport(r.intent));
    }
    hydratedViewport.current = true;
  }, []);
  useEffect(() => {
    localStorage.setItem(ROUTE_STORAGE_KEY, activeHref);
  }, [activeHref]);

  const setViewport = useCallback((v: Viewport) => {
    setViewportState(v);
    try { localStorage.setItem(VIEWPORT_STORAGE_KEY, v); } catch {}
  }, []);

  // Scroll the active card into view in the filmstrip.
  useEffect(() => {
    const el = cardRefs.current[activeHref];
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeHref]);

  const active = ROUTES.find((r) => r.href === activeHref) ?? ROUTES[0];
  const activeIndex = ROUTES.indexOf(active);

  // Single entry point for every route selection. Bumps reset on every call
  // so the iframe re-mounts and resets state (even on same-tile re-click).
  const selectRoute = useCallback((href: string) => {
    setActiveHref(href);
    setResetTick((n) => n + 1);
  }, []);

  const goPrev = useCallback(() => {
    const i = Math.max(0, activeIndex - 1);
    selectRoute(ROUTES[i].href);
  }, [activeIndex, selectRoute]);
  const goNext = useCallback(() => {
    const i = Math.min(ROUTES.length - 1, activeIndex + 1);
    selectRoute(ROUTES[i].href);
  }, [activeIndex, selectRoute]);

  // Keyboard: ← → step routes; ⇧← ⇧→ step viewports.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        const i = VIEWPORT_ORDER.indexOf(viewport);
        const next = e.key === "ArrowLeft"
          ? VIEWPORT_ORDER[Math.max(0, i - 1)]
          : VIEWPORT_ORDER[Math.min(VIEWPORT_ORDER.length - 1, i + 1)];
        setViewport(next);
        return;
      }
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, viewport, setViewport]);

  const iframeSrc = useMemo(() => {
    const sep = active.href.includes("?") ? "&" : "?";
    return `${active.href}${sep}embed=1&t=${resetTick}`;
  }, [active.href, resetTick]);

  const spec = VIEWPORTS[viewport];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink">
      <GalleryHeader
        title={active.title}
        href={active.href}
        viewport={viewport}
        onViewportChange={setViewport}
        onReset={() => setResetTick((n) => n + 1)}
      />

      <Stage iframeSrc={iframeSrc} spec={spec} />

      <Filmstrip
        routes={ROUTES}
        active={active}
        activeIndex={activeIndex}
        onSelect={selectRoute}
        onPrev={goPrev}
        onNext={goNext}
        stripRef={stripRef}
        cardRefs={cardRefs}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function GalleryHeader({
  title,
  href,
  viewport,
  onViewportChange,
  onReset,
}: {
  title: string;
  href: string;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  onReset: () => void;
}) {
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  return (
    <header className="border-b border-border-subtle">
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-3 px-5 py-2.5">
        {/* Left: brand */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[13px] font-semibold tracking-tight text-ink-title">
            tatch
          </span>
          <span className="text-[12px] text-ink-disabled">·</span>
          <span className="hidden text-[12px] text-ink-caption md:inline">
            onboarding prototype
          </span>
        </div>

        <span className="hidden h-5 w-px shrink-0 bg-border md:block" aria-hidden="true" />

        {/* Center: active route + URL */}
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="t-mono-label hidden sm:inline">Now</span>
          <span className="truncate text-[14px] font-semibold text-ink-title">
            {title}
          </span>
          <code className="hidden truncate rounded-sm bg-subtle px-1.5 py-0.5 text-[11.5px] text-ink-body xl:inline">
            {href}
          </code>
        </div>

        {/* Right: viewport switcher + actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <ViewportSwitcher value={viewport} onChange={onViewportChange} />
          <span className="hidden h-5 w-px shrink-0 bg-border lg:block" aria-hidden="true" />
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Reset this flow"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Reset
          </button>
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Open in a new tab"
          >
            <ExternalLink size={12} strokeWidth={1.75} />
            Open
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-body hover:bg-subtle"
          >
            <ThemeIcon size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Viewport switcher (segmented control)                               */
/* ------------------------------------------------------------------ */

function ViewportSwitcher({
  value,
  onChange,
}: {
  value: Viewport;
  onChange: (v: Viewport) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Preview viewport"
      className="inline-flex items-center gap-0 rounded-md border border-border bg-card p-0.5"
    >
      {VIEWPORT_ORDER.map((v) => {
        const { Icon, label, width, height, shortLabel } = VIEWPORTS[v];
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            title={`${label} · ${shortLabel} · ${width} × ${height}`}
            className={[
              "inline-flex h-7 w-9 items-center justify-center rounded-sm transition-colors duration-fast ease-snap",
              active
                ? "bg-royal-50 text-royal-700 dark:bg-royal-900 dark:text-white"
                : "text-ink-caption hover:bg-subtle hover:text-ink-body",
            ].join(" ")}
          >
            <Icon size={14} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage + ViewportFrame                                               */
/* ------------------------------------------------------------------ */

function Stage({
  iframeSrc,
  spec,
}: {
  iframeSrc: string;
  spec: ViewportSpec;
}) {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col overflow-hidden px-5 pb-2 pt-3">
        <ViewportFrame src={iframeSrc} spec={spec} />
      </div>
    </main>
  );
}

/**
 * Renders the iframe at its NATIVE viewport size (e.g. 1920×1080), then
 * applies a CSS transform: scale() so the visual fits the available stage
 * area. The iframe document genuinely renders at the target viewport, so
 * responsive breakpoints inside the page fire correctly — clicks and
 * scroll scale with the visual transform.
 */
function ViewportFrame({
  src,
  spec,
}: {
  src: string;
  spec: ViewportSpec;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setAvail({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute scale to fit, capped at 1 (we never blow tiny viewports up).
  const scale = avail.w && avail.h
    ? Math.min(1, avail.w / spec.width, avail.h / spec.height)
    : 0;
  const scaledW = spec.width  * scale;
  const scaledH = spec.height * scale;
  const scaledRadius = spec.radius * scale;

  return (
    <div ref={wrapperRef} className="flex w-full flex-1 items-center justify-center overflow-hidden">
      {scale > 0 && (
        <div
          style={{
            width: scaledW,
            height: scaledH,
            borderRadius: scaledRadius,
          }}
          className="overflow-hidden border border-border bg-card shadow-lg"
        >
          <iframe
            key={src}
            src={src}
            title="Preview"
            style={{
              width: spec.width,
              height: spec.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              display: "block",
            }}
            className="border-0"
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filmstrip — sticky bottom carousel                                  */
/* ------------------------------------------------------------------ */

function Filmstrip({
  routes,
  active,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  stripRef,
  cardRefs,
}: {
  routes: Route[];
  active: Route;
  activeIndex: number;
  onSelect: (href: string) => void;
  onPrev: () => void;
  onNext: () => void;
  stripRef: React.RefObject<HTMLDivElement>;
  cardRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
}) {
  return (
    <footer className="safe-pb sticky bottom-0 z-10 border-t border-border-subtle bg-canvas/95 backdrop-blur-[8px]">
      <div className="mx-auto flex w-full max-w-[1480px] items-stretch gap-1.5 px-3 py-2">
        <ArrowButton dir="prev" onClick={onPrev} disabled={activeIndex === 0} />

        <div
          ref={stripRef}
          className="flex flex-1 snap-x snap-mandatory gap-1.5 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none" }}
          role="tablist"
          aria-label="Onboarding routes"
        >
          {routes.map((r, i) => {
            const isActive = r.href === active.href;
            return (
              <FilmCard
                key={r.href}
                route={r}
                index={i + 1}
                isActive={isActive}
                onClick={() => onSelect(r.href)}
                refCb={(el) => {
                  cardRefs.current[r.href] = el;
                }}
              />
            );
          })}
        </div>

        <ArrowButton dir="next" onClick={onNext} disabled={activeIndex === routes.length - 1} />
      </div>
    </footer>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous route" : "Next route"}
      className="inline-flex h-12 w-8 shrink-0 items-center justify-center self-center rounded-md border border-border bg-card text-ink-body transition-colors duration-fast ease-snap hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon size={14} strokeWidth={1.75} />
    </button>
  );
}

const GROUP_PIP: Record<Group, string> = {
  entry:      "bg-[#00BBFF]",
  onboarding: "bg-royal-400",
  operator:   "bg-[#FF40F5]",
  edge:       "bg-ink-caption",
};

function FilmCard({
  route,
  index,
  isActive,
  onClick,
  refCb,
}: {
  route: Route;
  index: number;
  isActive: boolean;
  onClick: () => void;
  refCb: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={refCb}
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={onClick}
      title={`${route.title} — ${route.subtitle}`}
      className={[
        "group relative flex shrink-0 snap-start items-center gap-2.5 rounded-md border px-3 py-2 text-left",
        "h-12 min-w-[160px] max-w-[220px]",
        "transition-[background-color,border-color,box-shadow] duration-fast ease-snap",
        isActive
          ? "border-royal-400 bg-card shadow-[0_0_0_2px_var(--royal-100)]"
          : "border-border bg-card hover:border-strong hover:bg-subtle",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={["h-2 w-2 shrink-0 rounded-pill", GROUP_PIP[route.group]].join(" ")}
      />
      <span className="text-[10px] font-semibold tabular-nums text-ink-disabled">
        {String(index).padStart(2, "0")}
      </span>
      <span
        className={[
          "truncate text-[12.5px] font-semibold leading-tight",
          isActive ? "text-royal-700" : "text-ink-title",
        ].join(" ")}
      >
        {route.title}
      </span>
    </button>
  );
}
