"use client";

import { useId } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (v: number) => void;
};

export function VolumeSlider({ value, onChange }: Props) {
  const id = useId();
  const muted = value === 0;
  const Icon = muted ? VolumeX : Volume2;
  const pct = Math.round(value * 100);

  return (
    <div
      className={cn(
        "group flex items-center gap-2.5 rounded-full border border-border-subtle bg-bg-elevated px-3 py-1.5 transition-colors",
        "hover:border-[color:var(--glow-color)]/40",
      )}
    >
      <button
        type="button"
        onClick={() => onChange(muted ? 0.7 : 0)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex h-5 w-5 shrink-0 items-center justify-center text-text-muted transition-colors hover:text-text-primary"
      >
        <Icon className="h-4 w-4" />
      </button>

      <label htmlFor={id} className="relative block h-5 w-20 sm:w-24">
        {/* Track background */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-bg-void"
        />
        {/* Filled portion */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[color:var(--glow-color)]"
          style={{
            width: `${pct}%`,
            boxShadow: pct > 0 ? "0 0 6px var(--glow-color)" : undefined,
          }}
        />
        {/* Thumb dot */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--glow-color)] opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            left: `${pct}%`,
            boxShadow: "0 0 8px var(--glow-color)",
          }}
        />
        {/* Native range input — invisible but functional, sits on top */}
        <input
          id={id}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label="Volume"
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
      </label>
    </div>
  );
}
