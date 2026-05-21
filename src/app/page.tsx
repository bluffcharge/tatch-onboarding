"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Moon,
  RotateCcw,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type Group = "entry" | "onboarding" | "operator" | "edge";
type Viewport = "mobile" | "desktop";

type Route = {
  href: string;
  title: string;
  subtitle: string;
  group: Group;
  viewport: Viewport;
};

const ROUTES: Route[] = [
  { href: "/j/abc123",                   title: "P1 — Welcome",           subtitle: "SMS / email link entry",                  group: "entry",      viewport: "mobile"  },
  { href: "/join",                       title: "P0/B — Code entry",      subtitle: "No link, partner types the code",         group: "entry",      viewport: "mobile"  },
  { href: "/onboarding/auth?via=phone",  title: "P2 — Auth (phone)",      subtitle: "Phone OTP — primary path",                group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/auth?via=email",  title: "P2 — Auth (email)",      subtitle: "Secondary path",                          group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/business",        title: "P3 — Business profile",  subtitle: "Name + address + contact",                group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/discovery",       title: "P4 — Discovery",         subtitle: "Technicians + services (typed array)",    group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/team",            title: "P5 — Invite team",       subtitle: "SMS-first, optional",                     group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/activating",      title: "P6 — Activating",        subtitle: "1–2s two-beat transition",                group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/done",            title: "P7 — Connected (new)",   subtitle: "New-partner success",                     group: "onboarding", viewport: "mobile"  },
  { href: "/onboarding/done?existing=1", title: "P7 — Short-circuit",     subtitle: "Existing-partner copy",                   group: "onboarding", viewport: "mobile"  },
  { href: "/partner-admin/invite",       title: "O1 — Operator invite",   subtitle: "Settings panel · codes · recent",         group: "operator",   viewport: "desktop" },
  { href: "/join?bad=1",                 title: "Edge — Invalid code",    subtitle: "Code entry error state",                  group: "edge",       viewport: "mobile"  },
  { href: "/j/used",                     title: "Edge — Used invite",     subtitle: "Already-claimed error",                   group: "edge",       viewport: "mobile"  },
];

const GROUP_LABEL: Record<Group, string> = {
  entry:      "Entry",
  onboarding: "Onboarding",
  operator:   "Operator",
  edge:       "Edge cases",
};

const STORAGE_KEY = "tatch-gallery-route";

export default function Home() {
  const [activeHref, setActiveHref] = useState<string>(ROUTES[0].href);
  const [resetTick, setResetTick] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Restore last-viewed route on mount; persist on change.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ROUTES.some((r) => r.href === stored)) {
      setActiveHref(stored);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeHref);
  }, [activeHref]);

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

  const goPrev = useCallback(() => {
    const i = Math.max(0, activeIndex - 1);
    setActiveHref(ROUTES[i].href);
  }, [activeIndex]);
  const goNext = useCallback(() => {
    const i = Math.min(ROUTES.length - 1, activeIndex + 1);
    setActiveHref(ROUTES[i].href);
  }, [activeIndex]);

  // Keyboard arrows step through routes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const iframeSrc = useMemo(() => {
    const sep = active.href.includes("?") ? "&" : "?";
    return `${active.href}${sep}embed=1&t=${resetTick}`;
  }, [active.href, resetTick]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink">
      <GalleryHeader />

      <Stage
        viewport={active.viewport}
        title={active.title}
        href={active.href}
        iframeSrc={iframeSrc}
        onReset={() => setResetTick((n) => n + 1)}
      />

      <Filmstrip
        routes={ROUTES}
        active={active}
        activeIndex={activeIndex}
        onSelect={setActiveHref}
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

function GalleryHeader() {
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  return (
    <header className="border-b border-border-subtle">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold tracking-tight text-ink-title">
            tatch · onboarding prototype
          </span>
          <span className="hidden text-[12px] text-ink-caption sm:inline">
            arrow keys ← → to step
          </span>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-body hover:bg-subtle"
        >
          <ThemeIcon size={14} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Stage — the big canvas above the filmstrip                          */
/* ------------------------------------------------------------------ */

function Stage({
  viewport,
  title,
  href,
  iframeSrc,
  onReset,
}: {
  viewport: Viewport;
  title: string;
  href: string;
  iframeSrc: string;
  onReset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-5 pb-3 pt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="t-mono-label">Now showing</p>
            <h1 className="t-h3 mt-1 truncate">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <code className="hidden rounded-sm bg-subtle px-2 py-1 text-[12px] text-ink-body sm:inline">
              {href}
            </code>
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
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-xl border border-border-subtle bg-subtle/50 p-4 sm:p-6">
          {viewport === "mobile" ? (
            <MobileFrame src={iframeSrc} />
          ) : (
            <DesktopFrame src={iframeSrc} />
          )}
        </div>
      </div>
    </main>
  );
}

function MobileFrame({ src }: { src: string }) {
  const frameStyle: CSSProperties = {
    width: 390,
    height: 780,
    maxHeight: "min(780px, calc(100dvh - 320px))",
  };
  return (
    <div
      style={frameStyle}
      className="overflow-hidden rounded-[34px] border border-border bg-card shadow-lg"
    >
      <iframe
        key={src}
        src={src}
        title="Onboarding screen"
        className="h-full w-full border-0"
      />
    </div>
  );
}

function DesktopFrame({ src }: { src: string }) {
  return (
    <div
      style={{
        width: "min(1180px, 100%)",
        height: "min(780px, calc(100dvh - 320px))",
      }}
      className="overflow-hidden rounded-lg border border-border bg-card shadow-md"
    >
      <iframe
        key={src}
        src={src}
        title="Operator screen"
        className="h-full w-full border-0"
      />
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
      <div className="mx-auto flex w-full max-w-[1280px] items-stretch gap-2 px-3 py-3">
        <ArrowButton dir="prev" onClick={onPrev} disabled={activeIndex === 0} />

        <div
          ref={stripRef}
          className="flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: "thin" }}
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
      className="inline-flex h-[78px] w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-ink-body transition-colors duration-fast ease-snap hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
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
        "group relative flex shrink-0 snap-start flex-col items-start gap-1 rounded-md border px-3 py-2.5 text-left",
        "min-w-[180px] max-w-[220px]",
        "transition-[background-color,border-color,box-shadow,transform] duration-fast ease-snap",
        isActive
          ? "border-royal-400 bg-card shadow-[0_0_0_2px_var(--royal-100)]"
          : "border-border bg-card hover:border-strong hover:bg-subtle",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={["h-1.5 w-1.5 rounded-pill", GROUP_PIP[route.group]].join(" ")}
          />
          <span className="t-mono-label">{GROUP_LABEL[route.group]}</span>
        </span>
        <span className="text-[10px] font-semibold text-ink-disabled">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <span className={["truncate text-[13px] font-semibold leading-tight", isActive ? "text-royal-700" : "text-ink-title"].join(" ")}>
        {route.title}
      </span>
      <span className="line-clamp-1 text-[11.5px] text-ink-caption">
        {route.subtitle}
      </span>
    </button>
  );
}
