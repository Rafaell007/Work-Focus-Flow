"use client";

import { useEffect, useRef } from "react";

export type Bands = {
  bass: number;
  mid: number;
  treble: number;
  level: number;
};

type Options = {
  enabled: boolean;
  fftSize?: number;
  smoothing?: number;
};

const SOURCE_KEY = "__ff_mediaSource";

type ElementWithSource = HTMLAudioElement & {
  [SOURCE_KEY]?: MediaElementAudioSourceNode;
};

export function useAudioAnalyser(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  { enabled, fftSize = 256, smoothing = 0.82 }: Options,
) {
  const bandsRef = useRef<Bands>({ bass: 0, mid: 0, treble: 0, level: 0 });
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current as ElementWithSource | null;
    if (!enabled || !audio) return;

    let cancelled = false;
    let ctx = ctxRef.current;

    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    let analyser = analyserRef.current;
    if (!analyser) {
      analyser = ctx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      analyserRef.current = analyser;

      // MediaElementSource can only be created once per element — cache on the element
      let source = audio[SOURCE_KEY];
      if (!source) {
        source = ctx.createMediaElementSource(audio);
        audio[SOURCE_KEY] = source;
      }
      source.connect(analyser);
      analyser.connect(ctx.destination);
    }

    const bins = analyser.frequencyBinCount;
    const data =
      dataRef.current ?? new Uint8Array(new ArrayBuffer(bins));
    dataRef.current = data;

    // Frequency band ranges (rough): bass 0–8%, mid 8–35%, treble 35–100%
    const bassEnd = Math.max(1, Math.floor(bins * 0.08));
    const midEnd = Math.max(bassEnd + 1, Math.floor(bins * 0.35));

    const tick = () => {
      if (cancelled || !analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(data);

      let bSum = 0;
      for (let i = 0; i < bassEnd; i++) bSum += data[i];
      let mSum = 0;
      for (let i = bassEnd; i < midEnd; i++) mSum += data[i];
      let tSum = 0;
      for (let i = midEnd; i < bins; i++) tSum += data[i];
      let lSum = 0;
      for (let i = 0; i < bins; i++) lSum += data[i];

      bandsRef.current.bass = bSum / (bassEnd * 255);
      bandsRef.current.mid = mSum / ((midEnd - bassEnd) * 255);
      bandsRef.current.treble = tSum / ((bins - midEnd) * 255);
      bandsRef.current.level = lSum / (bins * 255);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Decay bands toward 0 so the orb settles
      bandsRef.current = { bass: 0, mid: 0, treble: 0, level: 0 };
    };
  }, [enabled, audioRef, fftSize, smoothing]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      // Don't close the AudioContext — Chrome limits how many can be opened.
      // The MediaElementSource stays attached for the audio element's lifetime.
    };
  }, []);

  return { bandsRef, dataRef };
}
