"use client";

let chimeCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!chimeCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    chimeCtx = new Ctor();
  }
  if (chimeCtx.state === "suspended") chimeCtx.resume().catch(() => {});
  return chimeCtx;
};

type ChimeKind = "break-start" | "work-ready";

const tone = (
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  gain = 0.18,
) => {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  const t0 = ctx.currentTime + startOffset;
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
};

export function playChime(kind: ChimeKind) {
  const ctx = getCtx();
  if (!ctx) return;

  if (kind === "break-start") {
    // Two-note descending — "session done, breathe"
    tone(ctx, 880, 0, 0.35);
    tone(ctx, 660, 0.18, 0.45);
  } else {
    // Two-note ascending — "ready when you are"
    tone(ctx, 523, 0, 0.3);
    tone(ctx, 784, 0.16, 0.4);
  }
}
