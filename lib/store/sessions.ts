"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionsState = {
  // Map from "YYYY-MM-DD" → minutes of focused listening that day
  minutesByDay: Record<string, number>;
  addStudyMinute: () => void;
  reset: () => void;
};

export const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

export const useSessionsStore = create<SessionsState>()(
  persist(
    (set) => ({
      minutesByDay: {},
      addStudyMinute: () =>
        set((s) => {
          const k = todayKey();
          return {
            minutesByDay: {
              ...s.minutesByDay,
              [k]: (s.minutesByDay[k] ?? 0) + 1,
            },
          };
        }),
      reset: () => set({ minutesByDay: {} }),
    }),
    {
      name: "focus-flow-sessions",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ minutesByDay: state.minutesByDay }),
    },
  ),
);
