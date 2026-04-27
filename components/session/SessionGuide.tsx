"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeftRight,
  ArrowLeft,
  ArrowRight,
  Keyboard,
  X,
} from "lucide-react";
import { usePrefsStore } from "@/lib/store/preferences";

type Props = {
  forceOpen?: boolean;
  onClose?: () => void;
};

export function SessionGuide({ forceOpen, onClose }: Props) {
  const seen = usePrefsStore((s) => s.seenSessionGuide);
  const setSeen = usePrefsStore((s) => s.setSeenSessionGuide);
  // Open automatically on first visit, but only after the store has had a
  // chance to hydrate from localStorage (avoid a one-frame flash on returning users)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const open = forceOpen ?? (hydrated && !seen);

  const close = () => {
    setSeen(true);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="guide-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            key="guide-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-title"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border-subtle bg-bg-elevated shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--glow-color)]/60 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(50%_100%_at_50%_0%,var(--glow-color-soft),transparent_70%)] opacity-60"
            />

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-text-muted transition-colors hover:bg-bg-elevated-hi hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex flex-col gap-6 px-7 py-9">
              <header className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-void px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-muted">
                  <Keyboard className="h-3 w-3" />
                  Quick guide
                </span>
                <h2
                  id="guide-title"
                  className="font-display text-3xl font-normal tracking-tight text-text-primary md:text-4xl"
                >
                  Two shortcuts.
                </h2>
                <p className="max-w-sm text-sm text-text-muted">
                  Move through the session without lifting your hands. Works
                  while music is playing.
                </p>
              </header>

              <div className="flex flex-col gap-3">
                <ShortcutRow
                  direction="left"
                  label="Back to mood picker"
                  caption="Pick a different lane for this session."
                />
                <ShortcutRow
                  direction="right"
                  label="Open Refine"
                  caption="Tweak vibe and Pomodoro settings on the fly."
                />
              </div>

              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-bg-void/40 p-4">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-faint">
                  Trackpad
                </span>
                <div className="flex items-center gap-3 text-text-muted">
                  <ArrowLeftRight className="h-4 w-4 text-[color:var(--glow-color)]" />
                  <span className="text-xs">
                    Two-finger horizontal swipe works the same way.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--glow-color)]/45 bg-[color:var(--glow-color)]/14 px-5 py-2.5 text-sm font-medium text-text-primary shadow-[0_0_22px_var(--glow-color-soft)] transition-all hover:bg-[color:var(--glow-color)]/22"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ShortcutRow({
  direction,
  label,
  caption,
}: {
  direction: "left" | "right";
  label: string;
  caption: string;
}) {
  const Arrow = direction === "right" ? ArrowRight : ArrowLeft;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-bg-void/40 p-4">
      <kbd className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-bg-elevated text-text-primary shadow-[inset_0_-2px_0_rgba(0,0,0,0.4)]">
        <Arrow className="h-4 w-4" />
      </kbd>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-text-primary">{label}</span>
        <span className="text-xs text-text-muted">{caption}</span>
      </div>
    </div>
  );
}
