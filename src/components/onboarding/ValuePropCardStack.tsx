"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tile visuals — faithful recreations of the four marketing tiles.    */
/* Each fills a 3:2 dark card; content is sized to read at ~320-440px.  */
/* ------------------------------------------------------------------ */

function TatchlineTile() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 bg-[#0b0b13] p-3.5">
      <span className="w-fit rounded-full bg-gradient-to-r from-sky-400 to-blue-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
        TatchLine
      </span>
      <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
        <span className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600" />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold leading-tight text-white">Westside Linen</p>
          <p className="text-[9.5px] text-white/40">Call · 4 min</p>
        </div>
        <span className="text-[9.5px] text-white/35">12:32</span>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2.5">
        <span className="h-7 w-7 shrink-0 rounded-full bg-white/90" />
        <p className="flex-1 text-[12px] font-semibold text-white">Voice note · 0:42</p>
        <span className="flex items-end gap-[2px]" aria-hidden="true">
          {[7, 11, 5, 13, 8, 4].map((h, i) => (
            <span key={i} className="w-[2px] rounded-full bg-white" style={{ height: h }} />
          ))}
        </span>
      </div>
    </div>
  );
}

function PipelineTile() {
  const bars = [42, 60, 50, 74, 64, 92, 80, 100];
  return (
    <div className="flex h-full w-full flex-col gap-2 bg-[#0b0b13] p-3.5">
      <div className="grid grid-cols-3 gap-1.5">
        <Kpi label="Active leads" value="284" delta="+12%" />
        <Kpi label="Visits" value="76" delta="+8%" />
        <Kpi label="Pipeline" value="$2.3M" delta="+22%" />
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[3px] bg-gradient-to-b from-[#7C5CFF] to-[#54A8FF]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
      <p className="truncate text-[8px] text-white/45">{label}</p>
      <p className="text-[13px] font-semibold leading-tight text-white">
        {value}
        <span className="ml-0.5 text-[8px] font-medium text-emerald-400">{delta}</span>
      </p>
    </div>
  );
}

function MapTile() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/marketing-tiles/map.jpg"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover"
      draggable={false}
    />
  );
}

function ReferralsTile() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0b0b13] p-3.5">
      <p className="text-[11px] font-semibold text-white">
        Active referrals <span className="font-normal text-white/40">3 this week</span>
      </p>
      <div className="w-full space-y-1.5">
        <RefRow grad="from-fuchsia-500 to-purple-600" name="Holloway Janitorial" sub="Referred by Westside Linen" amt="+$250" />
        <RefRow grad="from-sky-400 to-blue-600" name="North Bay Foodservice" sub="Closed · 2 days ago" amt="+$180" />
        <RefRow grad="from-blue-500 to-indigo-600" name="Trident Property Restoration" sub="Pending intro" amt="—" />
      </div>
      <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1.5 text-[10px] font-semibold text-black">
        <Check size={11} strokeWidth={3} /> Send rewards
      </span>
    </div>
  );
}

function RefRow({
  grad,
  name,
  sub,
  amt,
}: {
  grad: string;
  name: string;
  sub: string;
  amt: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1.5">
      <span className={`h-5 w-5 shrink-0 rounded-full bg-gradient-to-br ${grad}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold leading-tight text-white">{name}</p>
        <p className="truncate text-[8.5px] text-white/40">{sub}</p>
      </div>
      <span className={`text-[10px] font-semibold ${amt === "—" ? "text-white/30" : "text-emerald-400"}`}>
        {amt}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card data                                                           */
/* ------------------------------------------------------------------ */

type Card = { id: string; Tile: () => JSX.Element; headline: string; body: string };

const CARDS: Card[] = [
  { id: "tatchline", Tile: TatchlineTile, headline: "Capture every interaction", body: "One thumb-friendly feed for calls, drop-ins, and notes." },
  { id: "pipeline", Tile: PipelineTile, headline: "Track every job", body: "From new lead to closed deal in one place." },
  { id: "map", Tile: MapTile, headline: "Find leads worth showing up for", body: "Tatch surfaces high-fit accounts before competitors do." },
  { id: "referrals", Tile: ReferralsTile, headline: "Send referrals, earn rewards", body: "Refer once, get paid every time the work ships." },
];

const N = CARDS.length;

// Resting fan geometry per depth (0 = active/top).
const FAN: { rotate: number; x: number; y: number; scale: number; opacity: number }[] = [
  { rotate: 0, x: 0, y: 0, scale: 1, opacity: 1 },
  { rotate: -6, x: -12, y: 8, scale: 0.96, opacity: 0.7 },
  { rotate: 6, x: 12, y: 16, scale: 0.92, opacity: 0.5 },
  { rotate: -3, x: 0, y: 24, scale: 0.88, opacity: 0.35 },
];

/* ------------------------------------------------------------------ */
/* The stack                                                           */
/* ------------------------------------------------------------------ */

export function ValuePropCardStack() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0); // px offset of the active card while dragging / flying
  const [dragging, setDragging] = useState(false);
  const [noAnimId, setNoAnimId] = useState<string | null>(null);
  const [reduce, setReduce] = useState(false);
  const startX = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const width = () => wrapRef.current?.getBoundingClientRect().width ?? 320;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busy.current) return;
      if (reduce) {
        setIndex((i) => (i + dir + N) % N);
        return;
      }
      busy.current = true;
      const leavingId = CARDS[index].id;
      // Fly the active card off-screen in `dir`, then swap.
      setDragging(false);
      setDrag(dir * width() * 1.3);
      window.setTimeout(() => {
        setNoAnimId(leavingId); // suppress transition on the leaving card across the swap
        setDrag(0);
        setIndex((i) => (i + dir + N) % N);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setNoAnimId(null);
            busy.current = false;
          })
        );
      }, 360);
    },
    [index, reduce]
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    if (busy.current) return;
    startX.current = e.clientX;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging || startX.current === null) return;
    setDrag(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    startX.current = null;
    if (Math.abs(drag) > width() * 0.28) {
      go(drag > 0 ? 1 : -1);
    } else {
      setDrag(0); // spring back
    }
  };

  // Keyboard
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <section aria-roledescription="carousel" aria-label="What you're signing up for" className="w-full">
      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mx-auto w-full max-w-[360px] outline-none focus-visible:ring-2 focus-visible:ring-[#00A8FF] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent md:max-w-[440px]"
        style={{ aspectRatio: "3 / 2" }}
      >
        {CARDS.map((card, i) => {
          const depth = (i - index + N) % N;
          const visible = reduce ? depth <= 1 : depth <= 3;
          const isActive = depth === 0;
          const fan = FAN[Math.min(depth, FAN.length - 1)];

          let transform: string;
          let opacity: number;
          if (isActive) {
            const rot = dragging ? drag * 0.04 : drag * 0.05;
            transform = `translate(${drag}px, 0) rotate(${rot}deg) scale(1)`;
            opacity = 1;
          } else if (reduce) {
            // static peek: one card behind, no rotation/offset
            transform = `translate(0, 0) scale(${depth === 1 ? 0.97 : 1})`;
            opacity = depth === 1 ? 0.5 : 0;
          } else {
            transform = `translate(${fan.x}px, ${fan.y}px) rotate(${fan.rotate}deg) scale(${fan.scale})`;
            opacity = fan.opacity;
          }

          const animate = !(isActive && dragging) && noAnimId !== card.id;

          return (
            <div
              key={card.id}
              className="absolute inset-0"
              style={{
                transform,
                opacity: visible ? opacity : 0,
                zIndex: N - depth,
                pointerEvents: isActive ? "auto" : "none",
                transition: animate
                  ? "transform 500ms cubic-bezier(0.4,0,0.2,1), opacity 500ms cubic-bezier(0.4,0,0.2,1)"
                  : "none",
                touchAction: "pan-y",
                cursor: isActive ? (dragging ? "grabbing" : "grab") : "default",
              }}
              onPointerDown={isActive ? onPointerDown : undefined}
              onPointerMove={isActive ? onPointerMove : undefined}
              onPointerUp={isActive ? onPointerUp : undefined}
              onPointerCancel={isActive ? onPointerUp : undefined}
            >
              <div
                className={[
                  "h-full w-full overflow-hidden rounded-[20px]",
                  isActive
                    ? "ring-2 ring-[#00A8FF] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_rgba(139,92,246,0.1)]"
                    : "shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)]",
                ].join(" ")}
              >
                <card.Tile />
              </div>
            </div>
          );
        })}
      </div>

      {/* Headline + body for the active card, below the stack */}
      <div className="mx-auto mt-5 max-w-[360px] text-center md:max-w-[440px]">
        <p className="text-[18px] font-medium leading-snug text-ink-title md:text-[20px]">
          {CARDS[index].headline}
        </p>
        <p className="mt-1 text-[14px] leading-snug text-ink-subtitle md:text-[15px]">
          {CARDS[index].body}
        </p>
      </div>

      {/* Controls: arrows + pagination dots */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <StackButton label="Previous" onClick={() => go(-1)}>
          <ChevronLeft size={16} strokeWidth={2} />
        </StackButton>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Card position">
          {CARDS.map((c, i) => (
            <span
              key={c.id}
              aria-hidden="true"
              className={[
                "h-1.5 rounded-full transition-all duration-fast",
                i === index ? "w-4 bg-ink-title" : "w-1.5 bg-ink-disabled",
              ].join(" ")}
            />
          ))}
        </div>
        <StackButton label="Next" onClick={() => go(1)}>
          <ChevronRight size={16} strokeWidth={2} />
        </StackButton>
      </div>
    </section>
  );
}

function StackButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] border border-border bg-card text-ink-body transition-colors duration-fast ease-snap hover:bg-subtle hover:text-ink-title"
    >
      {children}
    </button>
  );
}
