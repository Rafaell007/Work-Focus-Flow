"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BreaksConfig, Vibe } from "@/components/session/RefinePanel";

type PrefsState = {
  vibe: Vibe;
  lengthMinutes: number;
  breaks: BreaksConfig;
  volume: number;
  seenSessionGuide: boolean;
  setVibe: (v: Vibe) => void;
  setLengthMinutes: (m: number) => void;
  setBreaks: (b: BreaksConfig | ((prev: BreaksConfig) => BreaksConfig)) => void;
  setVolume: (v: number) => void;
  setSeenSessionGuide: (v: boolean) => void;
  reset: () => void;
};

const DEFAULTS = {
  vibe: "auto" as Vibe,
  lengthMinutes: 50,
  volume: 0.7,
  seenSessionGuide: false,
  breaks: {
    enabled: false,
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    cyclesUntilLongBreak: 4,
  } satisfies BreaksConfig,
};

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setVibe: (vibe) => set({ vibe }),
      setLengthMinutes: (lengthMinutes) => set({ lengthMinutes }),
      setBreaks: (b) =>
        set((state) => ({
          breaks: typeof b === "function" ? b(state.breaks) : b,
        })),
      setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
      setSeenSessionGuide: (seenSessionGuide) => set({ seenSessionGuide }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: "focus-flow-prefs",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Only persist the data, not the setter functions
      partialize: (state) => ({
        vibe: state.vibe,
        lengthMinutes: state.lengthMinutes,
        breaks: state.breaks,
        volume: state.volume,
        seenSessionGuide: state.seenSessionGuide,
      }),
    },
  ),
);
