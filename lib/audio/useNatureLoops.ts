"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type NatureSoundId =
  | "waves"
  | "rain"
  | "stream"
  | "storm"
  | "wind"
  | "fire"
  | "birds"
  | "crickets"
  | "cat"
  | "binaural"
  | "noise"
  | "om";

// Mapping ID → static asset path. IDs without bundled assets stay null and
// the modal renders them disabled.
const ASSET: Partial<Record<NatureSoundId, string>> = {
  waves: "/sounds/nature/waves.mp3",
  rain: "/sounds/nature/rain.mp3",
  fire: "/sounds/nature/fire.mp3",
  birds: "/sounds/nature/birds.mp3",
  crickets: "/sounds/nature/crickets.mp3",
  cat: "/sounds/nature/purr.mp3",
  wind: "/sounds/nature/wind.mp3",
};

type Active = Record<string, { audio: HTMLAudioElement; volume: number }>;

// Allows multiple nature sounds to layer over the main player. Each sound
// loops on its own HTMLAudioElement; the consumer can toggle a sound and
// adjust its volume independently.
export function useNatureLoops() {
  const activeRef = useRef<Active>({});
  const [activeIds, setActiveIds] = useState<Set<NatureSoundId>>(new Set());

  const isAvailable = useCallback(
    (id: NatureSoundId) => Boolean(ASSET[id]),
    [],
  );

  const setVolume = useCallback((id: NatureSoundId, v: number) => {
    const entry = activeRef.current[id];
    if (!entry) return;
    const clamped = Math.min(1, Math.max(0, v));
    entry.audio.volume = clamped;
    entry.volume = clamped;
  }, []);

  const stop = useCallback((id: NatureSoundId) => {
    const entry = activeRef.current[id];
    if (!entry) return;
    entry.audio.pause();
    entry.audio.src = "";
    delete activeRef.current[id];
    setActiveIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const start = useCallback((id: NatureSoundId) => {
    const path = ASSET[id];
    if (!path) return;
    if (activeRef.current[id]) return;
    const audio = new Audio(path);
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => {});
    activeRef.current[id] = { audio, volume: 0.5 };
    setActiveIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const toggle = useCallback(
    (id: NatureSoundId) => {
      if (activeRef.current[id]) stop(id);
      else start(id);
    },
    [start, stop],
  );

  // Cleanup all on unmount
  useEffect(() => {
    return () => {
      for (const id of Object.keys(activeRef.current)) {
        const entry = activeRef.current[id];
        entry?.audio.pause();
        if (entry) entry.audio.src = "";
      }
      activeRef.current = {};
    };
  }, []);

  return { activeIds, isAvailable, toggle, setVolume };
}
