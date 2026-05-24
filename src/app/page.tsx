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
import { RequirementsRail } from "@/components/gallery/RequirementsRail";
import { CommentsRail } from "@/components/gallery/CommentsRail";
import { getContextFor } from "@/lib/requirementContext";

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

// Note: route is NOT persisted. Every refresh lands on ROUTES[0] (P1) with
// a fresh iframe so the click-through always starts at the beginning and
// flow state is wiped. Viewport + rail-collapsed are UI prefs, not flow
// state, so those still persist.
const VIEWPORT_STORAGE_KEY = "tatch-gallery-viewport";
const LEFT_RAIL_KEY = "tatch-gallery-left-rail";
const RIGHT_RAIL_KEY = "tatch-gallery-right-rail";

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
  const [leftCollapsed, setLeftCollapsedState]   = useState(false);
  const [rightCollapsed, setRightCollapsedState] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hydratedViewport = useRef(false);

  // Restore viewport + rail state on mount. Route is intentionally NOT
  // restored — every refresh starts at ROUTES[0] (P1) with a fresh iframe
  // so flow state is reset for the next reviewer pass.
  useEffect(() => {
    const storedViewport = localStorage.getItem(VIEWPORT_STORAGE_KEY) as Viewport | null;
    if (storedViewport && VIEWPORTS[storedViewport]) {
      setViewportState(storedViewport);
    } else {
      setViewportState(intentToViewport(ROUTES[0].intent));
    }
    setLeftCollapsedState(localStorage.getItem(LEFT_RAIL_KEY) === "1");
    setRightCollapsedState(localStorage.getItem(RIGHT_RAIL_KEY) === "1");
    hydratedViewport.current = true;
  }, []);

  const toggleLeft = useCallback(() => {
    setLeftCollapsedState((prev) => {
      const next = !prev;
      try { localStorage.setItem(LEFT_RAIL_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);
  const toggleRight = useCallback(() => {
    setRightCollapsedState((prev) => {
      const next = !prev;
      try { localStorage.setItem(RIGHT_RAIL_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

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
  const reqContext = getContextFor(active.href);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[color:var(--surface-stage)] text-ink">
      <GalleryHeader
        title={active.title}
        href={active.href}
        viewport={viewport}
        onViewportChange={setViewport}
        onReset={() => setResetTick((n) => n + 1)}
      />

      <div className="flex flex-1 overflow-hidden">
        <RequirementsRail
          context={reqContext}
          routeTitle={active.title}
          collapsed={leftCollapsed}
          onToggle={toggleLeft}
        />
        <Stage iframeSrc={iframeSrc} spec={spec} />
        <CommentsRail
          routeHref={active.href}
          routeTitle={active.title}
          collapsed={rightCollapsed}
          onToggle={toggleRight}
        />
      </div>

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
  const themeNextLabel =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <header className="border-b border-border-subtle">
      {/* 3-column grid: left = active route (aligned with the PRD rail icon at
          16px); center = viewport switcher; right = actions. */}
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5">
        {/* Left — route label aligns with the PRD rail's FileText icon */}
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="t-mono-label">Now</span>
          <span className="truncate text-[14px] font-semibold text-ink-title">
            {title}
          </span>
          <code className="hidden truncate rounded-sm bg-subtle px-1.5 py-0.5 text-[11.5px] text-ink-body xl:inline">
            {href}
          </code>
        </div>

        {/* Center — viewport switcher */}
        <div className="justify-self-center">
          <ViewportSwitcher value={viewport} onChange={onViewportChange} />
        </div>

        {/* Right — actions */}
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Reset this flow"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Reset
          </button>
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Open in a new tab"
          >
            <ExternalLink size={12} strokeWidth={1.75} />
            Open
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={themeNextLabel}
            title={themeNextLabel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] border border-border text-ink-body hover:bg-subtle"
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
      className="inline-flex items-center gap-0.5 rounded-pill border border-border bg-card p-1 shadow-sm"
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
              "inline-flex h-7 items-center gap-1.5 rounded-pill px-2.5 transition-colors duration-fast ease-snap",
              active
                ? "bg-[color:var(--btn-ink-bg)] text-[color:var(--btn-ink-fg)]"
                : "text-ink-caption hover:bg-subtle hover:text-ink-body",
            ].join(" ")}
          >
            <Icon size={13} strokeWidth={1.75} />
            <span className="hidden text-[11px] font-medium tracking-wide xl:inline">
              {label}
            </span>
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
 *
 * Viewport switches are animated: the frame's width/height/border-radius
 * and the iframe's scale all transition with a single ease curve so the
 * preview morphs from one shape into the next rather than snapping.
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

  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const DUR  = "320ms";

  return (
    <div ref={wrapperRef} className="flex w-full flex-1 items-center justify-center overflow-hidden">
      {scale > 0 && (
        <div
          style={{
            width: scaledW,
            height: scaledH,
            borderRadius: scaledRadius,
            transition: `width ${DUR} ${EASE}, height ${DUR} ${EASE}, border-radius ${DUR} ${EASE}`,
            willChange: "width, height",
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
              transition: `transform ${DUR} ${EASE}`,
              display: "block",
              willChange: "transform",
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
    <footer className="safe-pb sticky bottom-0 z-10 border-t border-border-subtle bg-[color:var(--surface-stage)]/95 backdrop-blur-[8px]">
      <div className="mx-auto flex w-full max-w-[1640px] items-stretch gap-2 px-4 py-3">
        <ArrowButton dir="prev" onClick={onPrev} disabled={activeIndex === 0} />

        <div
          ref={stripRef}
          className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 py-1"
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
      className="inline-flex h-20 w-9 shrink-0 items-center justify-center self-center rounded-xl border border-border bg-card text-ink-body shadow-xs transition-colors duration-fast ease-snap hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon size={16} strokeWidth={1.75} />
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
      className={[
        "group relative flex shrink-0 snap-start flex-col items-start justify-between gap-1 rounded-xl border px-3.5 py-3 text-left",
        "h-20 w-[252px]",
        "transition-[background-color,border-color,box-shadow,transform] duration-fast ease-snap",
        isActive
          ? "border-royal-400 bg-card shadow-[0_4px_16px_-4px_rgba(129,69,255,0.25),0_0_0_2px_var(--royal-100)]"
          : "border-border bg-card shadow-sm hover:-translate-y-0.5 hover:border-strong hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex w-full items-center gap-2">
        <span
          aria-hidden="true"
          className={["h-2 w-2 shrink-0 rounded-pill", GROUP_PIP[route.group]].join(" ")}
        />
        <span className="t-mono-label flex-1 truncate">
          {GROUP_LABEL[route.group]}
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-ink-disabled">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <span
        className={[
          "truncate text-[13px] font-semibold leading-tight",
          isActive ? "text-royal-700" : "text-ink-title",
        ].join(" ")}
      >
        {route.title}
      </span>
      <span className="truncate text-[11.5px] leading-tight text-ink-caption">
        {route.subtitle}
      </span>
    </button>
  );
}
