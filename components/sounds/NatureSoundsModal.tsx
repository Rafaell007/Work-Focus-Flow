"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AudioLines,
  AudioWaveform,
  Bird,
  Bug,
  Cat,
  CloudLightning,
  CloudRain,
  Droplet,
  Flame,
  Sparkles,
  Waves,
  Wind,
  X,
} from "lucide-react";
import {
  useNatureLoops,
  type NatureSoundId,
} from "@/lib/audio/useNatureLoops";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Sound = {
  id: NatureSoundId;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const sounds: Sound[] = [
  // Water
  { id: "waves", label: "Waves", Icon: Waves },
  { id: "rain", label: "Rain", Icon: CloudRain },
  { id: "stream", label: "Stream", Icon: Droplet },
  { id: "storm", label: "Storm", Icon: CloudLightning },
  // Weather
  { id: "wind", label: "Wind", Icon: Wind },
  { id: "fire", label: "Fire", Icon: Flame },
  // Life
  { id: "birds", label: "Birds", Icon: Bird },
  { id: "crickets", label: "Crickets", Icon: Bug },
  { id: "cat", label: "Purr", Icon: Cat },
  // Ambient / engineered
  { id: "binaural", label: "Binaural", Icon: AudioLines },
  { id: "noise", label: "Noise", Icon: AudioWaveform },
  { id: "om", label: "Om", Icon: Sparkles },
];

export function NatureSoundsModal({ open, onClose }: Props) {
  const { activeIds, isAvailable, toggle } = useNatureLoops();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeCount = activeIds.size;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sounds-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="sounds-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sounds-title"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border-subtle bg-bg-elevated shadow-[0_30px_120px_rgba(0,0,0,0.7)]"
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
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-text-muted transition-colors hover:bg-bg-elevated-hi hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex flex-col gap-7 px-7 py-9">
              <header className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glow-color)]/40 bg-[color:var(--glow-color)]/8 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--glow-color)]">
                  {activeCount > 0
                    ? `${activeCount} layer${activeCount === 1 ? "" : "s"} active`
                    : "Layer in"}
                </span>
                <h2
                  id="sounds-title"
                  className="font-display text-3xl font-normal tracking-tight text-text-primary md:text-4xl"
                >
                  Nature &amp; ambient.
                </h2>
                <p className="max-w-md text-sm text-text-muted">
                  Layer environmental textures over your session. Tap to toggle
                  — multiple sounds can play at once, all loop seamlessly.
                </p>
              </header>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {sounds.map((s) => {
                  const available = isAvailable(s.id);
                  const active = activeIds.has(s.id);
                  return (
                    <SoundCard
                      key={s.id}
                      sound={s}
                      available={available}
                      active={active}
                      onToggle={() => toggle(s.id)}
                    />
                  );
                })}
              </div>

              <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-text-faint">
                Tip · greyed-out tiles are coming soon. Active layers keep
                playing after you close this dialog.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SoundCard({
  sound,
  available,
  active,
  onToggle,
}: {
  sound: Sound;
  available: boolean;
  active: boolean;
  onToggle: () => void;
}) {
  const { Icon, label } = sound;
  return (
    <button
      type="button"
      onClick={available ? onToggle : undefined}
      disabled={!available}
      aria-pressed={available ? active : undefined}
      aria-label={
        available
          ? `Toggle ${label} (${active ? "playing" : "off"})`
          : `${label} (coming soon)`
      }
      className={cn(
        "group relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all duration-300",
        !available && "cursor-not-allowed border-border-subtle bg-bg-void/60",
        available &&
          !active &&
          "cursor-pointer border-border-subtle bg-bg-void/60 hover:border-[color:var(--glow-color)]/45 hover:bg-bg-elevated",
        active &&
          "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/10 shadow-[0_0_18px_var(--glow-color-soft)]",
      )}
    >
      <Icon
        className={cn(
          "h-6 w-6 transition-colors",
          active
            ? "text-[color:var(--glow-color)]"
            : "text-text-muted group-hover:text-[color:var(--glow-color)]",
        )}
      />
      <span
        className={cn(
          "font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors",
          active
            ? "text-text-primary"
            : "text-text-faint group-hover:text-text-muted",
        )}
      >
        {label}
      </span>

      {active && (
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[color:var(--glow-color)]"
          style={{ boxShadow: "0 0 6px var(--glow-color)" }}
        />
      )}
    </button>
  );
}
