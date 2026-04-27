"use client";

import { useEffect, useRef } from "react";
import type { Track } from "@/lib/tracks/playlists";
import { cn } from "@/lib/utils";

function PlayingBars() {
  // Three vertical bars that loop at slightly different rates so the motion
  // feels organic, not metronomic. Heights animated via CSS transform on
  // scaleY around the bottom edge — cheaper than animating height.
  return (
    <span
      aria-hidden="true"
      className="flex h-3 w-3 shrink-0 items-end justify-between gap-[1px]"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[2px] origin-bottom rounded-[1px] bg-[color:var(--glow-color)]"
          style={{
            height: "100%",
            animation: `playing-bars 1s ease-in-out ${i * 0.18}s infinite alternate`,
            boxShadow: "0 0 6px var(--glow-color)",
          }}
        />
      ))}
    </span>
  );
}

type Props = {
  tracks: Track[];
  currentIndex: number;
  onSelect: (index: number) => void;
  isActiveSource: boolean;
};

export function TrackQueue({
  tracks,
  currentIndex,
  onSelect,
  isActiveSource,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep the active card in view when it changes (skip arrows, phase transitions)
  useEffect(() => {
    const el = itemRefs.current[currentIndex];
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentIndex]);

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-text-muted">
          Up next · pick a track
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-faint">
          {tracks.length} tracks
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 pt-1"
        style={{ scrollbarWidth: "thin" }}
      >
        {tracks.map((t, i) => {
          const active = i === currentIndex && isActiveSource;
          return (
            <button
              key={`${t.src}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Play ${t.title}`}
              aria-current={active ? "true" : undefined}
              className={cn(
                "group relative flex w-44 shrink-0 snap-start flex-col gap-2 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300",
                active
                  ? "border-[color:var(--glow-color)]/60 bg-[color:var(--glow-color)]/10 shadow-[0_0_18px_var(--glow-color-soft)]"
                  : "border-border-subtle bg-bg-elevated hover:border-border-strong hover:bg-bg-elevated-hi",
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "h-20 w-full rounded-xl transition-opacity duration-300",
                  active ? "opacity-100" : "opacity-70 group-hover:opacity-90",
                )}
                style={{
                  background:
                    "linear-gradient(135deg, var(--glow-color) 0%, var(--glow-color-soft) 60%, transparent 100%)",
                  boxShadow: active
                    ? "inset 0 0 24px var(--glow-color-soft)"
                    : "inset 0 0 16px rgba(0,0,0,0.3)",
                }}
              />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  {active && <PlayingBars />}
                  <span
                    className={cn(
                      "truncate text-sm",
                      active ? "text-text-primary" : "text-text-primary/85",
                    )}
                  >
                    {t.title}
                  </span>
                </div>
                <span className="truncate text-[0.7rem] text-text-muted">
                  {t.tags}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
