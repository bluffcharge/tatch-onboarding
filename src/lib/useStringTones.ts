"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * useStringTones — sampled plucks for the onboarding ribbon strings.
 *
 * Web Audio, no libraries. The AudioContext + reverb graph build on mount
 * and every tone fetches AND decodes eagerly right away, so the buffers are
 * ready long before the user interacts (this is what makes strumming feel
 * instant on load — the earlier version decoded lazily on the first gesture
 * and silently no-op'd if the fetch hadn't landed, which read as a multi-
 * second dead zone).
 *
 * Browsers still keep a freshly-created context suspended until a user
 * gesture, so we resume() on the first pointerdown / keydown / touchstart
 * (and opportunistically inside a pluck). A press-drag across the fan
 * unlocks on its own pointerdown and rings immediately; a pure hover-strum
 * stays silent until the user has clicked/typed once — a hard browser rule
 * we can't bypass, only make instant once cleared.
 *
 * Fresh AudioBufferSourceNode per pluck so ring-outs overlap into a
 * glissando. Master gain 0.6, ±5% per-pluck variation, 60ms per-string
 * retrigger throttle, lush warm convolution reverb on a low-passed send
 * bus (generated impulse, no asset). Disabled under prefers-reduced-motion;
 * every failure degrades to today's silent strings.
 */

const MASTER_GAIN = 0.6;
const THROTTLE_MS = 60;
const REVERB_SECONDS = 2.6;
const REVERB_SEND = 0.34;
const REVERB_LOWPASS_HZ = 5200;

/* Optional flourish: strumming every string within this window plays the
   sparkle sample once. Off by default per the brief. */
const SPARKLE_ENABLED = false;
const SPARKLE_WINDOW_MS = 1500;
const SPARKLE_GAIN = 0.35;
const SPARKLE_URL = "/sounds/sparkle-intro.mp3";

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  send: GainNode;
  buffers: (AudioBuffer | null)[];
  sparkle: AudioBuffer | null;
};

/** Synthesized impulse response: stereo exponentially-decaying noise. The
 *  classic no-asset room — warm because the send bus is low-passed. */
function makeImpulse(ctx: AudioContext, seconds: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const ir = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
    }
  }
  return ir;
}

export function useStringTones(urls: string[]) {
  const engine = useRef<Engine | null>(null);
  const disabled = useRef(false);
  const lastPluck = useRef<number[]>([]);
  const recent = useRef<number[]>([]);
  const sparkled = useRef(false);

  useEffect(() => {
    disabled.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (disabled.current) return;

    lastPluck.current = urls.map(() => 0);
    recent.current = urls.map(() => 0);

    let eng: Engine | null = null;
    let cancelled = false;
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;

      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = MASTER_GAIN;
      master.connect(ctx.destination);

      // Lush-but-warm reverb bus: send → lowpass → convolver → master.
      const send = ctx.createGain();
      send.gain.value = REVERB_SEND;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = REVERB_LOWPASS_HZ;
      const verb = ctx.createConvolver();
      verb.buffer = makeImpulse(ctx, REVERB_SECONDS);
      send.connect(lp);
      lp.connect(verb);
      verb.connect(master);

      eng = { ctx, master, send, buffers: urls.map(() => null), sparkle: null };
      engine.current = eng;

      // Fetch + decode every tone immediately — buffers are ready before
      // any gesture, so the first unlock plays with no perceptible latency.
      const decodeInto = (url: string, assign: (b: AudioBuffer) => void) =>
        fetch(url)
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
          .then((ab) => ctx.decodeAudioData(ab))
          .then((buf) => {
            if (!cancelled) assign(buf);
          })
          .catch(() => {});

      urls.forEach((u, i) => decodeInto(u, (b) => { if (eng) eng.buffers[i] = b; }));
      if (SPARKLE_ENABLED) decodeInto(SPARKLE_URL, (b) => { if (eng) eng.sparkle = b; });
    } catch {
      // Audio is best-effort.
    }

    // Browsers keep the new context suspended until a user gesture — resume
    // on the first one, then stop listening.
    const resume = () => {
      const e = engine.current;
      if (!e) return;
      if (e.ctx.state === "suspended") void e.ctx.resume();
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("touchstart", resume);
    };
    window.addEventListener("pointerdown", resume, { passive: true });
    window.addEventListener("keydown", resume, { passive: true });
    window.addEventListener("touchstart", resume, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("touchstart", resume);
      eng?.ctx.close().catch(() => {});
      engine.current = null;
    };
    // urls is a module-level constant at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => {
    const playBuffer = (buf: AudioBuffer, gain: number) => {
      const eng = engine.current;
      if (!eng) return;
      const src = eng.ctx.createBufferSource();
      src.buffer = buf;
      const g = eng.ctx.createGain();
      g.gain.value = gain;
      src.connect(g);
      g.connect(eng.master); // dry
      g.connect(eng.send); // wet
      src.start();
    };

    const pluck = (i: number) => {
      if (disabled.current) return;
      const eng = engine.current;
      const buf = eng?.buffers[i];
      if (!eng || !buf) return;
      // No gesture yet → context still suspended. Nudge it (works once the
      // page has had a click/keypress) and skip this note rather than queue
      // a source that would never fire.
      if (eng.ctx.state !== "running") {
        void eng.ctx.resume();
        return;
      }
      const now = performance.now();
      if (now - (lastPluck.current[i] ?? 0) < THROTTLE_MS) return;
      lastPluck.current[i] = now;
      recent.current[i] = now;

      playBuffer(buf, 1 + (Math.random() * 2 - 1) * 0.05); // ±5% organic

      if (SPARKLE_ENABLED && eng.sparkle && !sparkled.current) {
        const all = recent.current.every((t) => now - t < SPARKLE_WINDOW_MS);
        if (all) {
          sparkled.current = true;
          playBuffer(eng.sparkle, SPARKLE_GAIN);
          window.setTimeout(() => {
            sparkled.current = false;
          }, 8000);
        }
      }
    };

    /** Strum every string with a small stagger (the click easter egg). The
     *  click that triggers this is itself the unlocking gesture. */
    const strumAll = (staggerMs = 70) => {
      if (disabled.current) return;
      const eng = engine.current;
      if (!eng) return;
      if (eng.ctx.state === "suspended") void eng.ctx.resume();
      eng.buffers.forEach((_, i) => {
        window.setTimeout(() => pluck(i), i * staggerMs);
      });
    };

    return { pluck, strumAll };
  }, []);
}
