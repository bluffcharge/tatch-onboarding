"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * useStringTones — sampled plucks for the onboarding ribbon strings.
 *
 * Web Audio, no libraries. The mp3 ArrayBuffers fetch eagerly on mount;
 * the AudioContext is created + buffers decoded lazily on the first real
 * user gesture (pointerdown/keydown anywhere), per autoplay policy —
 * hovers before that stay silent and are never queued. Each pluck is a
 * fresh AudioBufferSourceNode so overlapping ring-outs layer into a
 * glissando instead of cutting each other off.
 *
 * Voice: subtle and warm — master gain 0.6, ±5% per-pluck variation, and
 * a lush convolution reverb (generated 2.6s exponential-noise impulse, no
 * asset) on a low-passed send bus so the tails bloom soft instead of hissy.
 *
 * Respects prefers-reduced-motion by disabling entirely (quiet-mode
 * signal). All failures degrade silently — the strings keep working
 * exactly as they do today.
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
  const raw = useRef<(ArrayBuffer | null)[]>([]);
  const rawSparkle = useRef<ArrayBuffer | null>(null);
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
    let cancelled = false;

    // Eager fetch (cheap, ~25KB each); lazy decode on first gesture.
    urls.forEach((u, i) => {
      fetch(u)
        .then((r) => (r.ok ? r.arrayBuffer() : null))
        .then((ab) => {
          if (!cancelled) raw.current[i] = ab;
        })
        .catch(() => {});
    });
    if (SPARKLE_ENABLED) {
      fetch(SPARKLE_URL)
        .then((r) => (r.ok ? r.arrayBuffer() : null))
        .then((ab) => {
          if (!cancelled) rawSparkle.current = ab;
        })
        .catch(() => {});
    }

    const unlock = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      try {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        void ctx.resume();

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

        const eng: Engine = { ctx, master, send, buffers: urls.map(() => null), sparkle: null };
        raw.current.forEach((ab, i) => {
          if (!ab) return;
          ctx.decodeAudioData(ab.slice(0)).then(
            (buf) => {
              eng.buffers[i] = buf;
            },
            () => {},
          );
        });
        if (SPARKLE_ENABLED && rawSparkle.current) {
          ctx.decodeAudioData(rawSparkle.current.slice(0)).then(
            (buf) => {
              eng.sparkle = buf;
            },
            () => {},
          );
        }
        engine.current = eng;
      } catch {
        // Audio is best-effort.
      }
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      engine.current?.ctx.close().catch(() => {});
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

    /** Strum every string with a small stagger (the click easter egg). */
    const strumAll = (staggerMs = 70) => {
      if (disabled.current) return;
      const eng = engine.current;
      if (!eng) return;
      eng.buffers.forEach((_, i) => {
        window.setTimeout(() => pluck(i), i * staggerMs);
      });
    };

    return { pluck, strumAll };
  }, []);
}
