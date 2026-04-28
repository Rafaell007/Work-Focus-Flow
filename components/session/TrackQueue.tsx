"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { Track } from "@/lib/tracks/playlists";
import { cn } from "@/lib/utils";

function PlayingBars() {
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
    skipSnaps: true,
    duration: 22,
  });

  // True between pointerDown and pointerUp on the carousel — drives the
  // grabbing cursor and disables hover styles during the press.
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Center the active card whenever it changes (skip controls, phase swap).
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(currentIndex);
  }, [emblaApi, currentIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    const onDown = () => setIsPointerDown(true);
    const onUp = () => setIsPointerDown(false);
    emblaApi.on("pointerDown", onDown);
    emblaApi.on("pointerUp", onUp);
    return () => {
      emblaApi.off("pointerDown", onDown);
      emblaApi.off("pointerUp", onUp);
    };
  }, [emblaApi]);

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-text-muted">
          Up next · pick a track
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-faint">
          {tracks.length} tracks · drag to browse
        </span>
      </div>

      <div className="relative">
        <div
          ref={emblaRef}
          className={cn(
            "overflow-hidden",
            isPointerDown ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          <div className="flex gap-3 px-7 pb-2 pt-1 touch-pan-y">
            {tracks.map((t, i) => {
              const active = i === currentIndex && isActiveSource;
              return (
                <button
                  key={`${t.src}-${i}`}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={`Play ${t.title}`}
                  aria-current={active ? "true" : undefined}
                  draggable={false}
                  className={cn(
                    "group relative flex w-44 shrink-0 select-none flex-col gap-2 overflow-hidden rounded-2xl border p-3 text-left transition-[border-color,background-color,box-shadow] duration-200",
                    isPointerDown ? "cursor-grabbing" : "cursor-grab",
                    active
                      ? "border-[color:var(--glow-color)]/60 bg-[color:var(--glow-color)]/10 shadow-[0_0_18px_var(--glow-color-soft)]"
                      : isPointerDown
                        ? "border-border-subtle bg-bg-elevated"
                        : "border-border-subtle bg-bg-elevated hover:border-border-strong hover:bg-bg-elevated-hi",
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "relative h-20 w-full overflow-hidden rounded-xl transition-opacity duration-200",
                      active
                        ? "opacity-100"
                        : isPointerDown
                          ? "opacity-80"
                          : "opacity-80 group-hover:opacity-100",
                    )}
                    style={{
                      boxShadow: active
                        ? "inset 0 0 24px var(--glow-color-soft)"
                        : "inset 0 0 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    <img
                      src={t.cover}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {/* Subtle bottom gradient — keeps cover detail but pulls
                        contrast toward the title row directly below. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-bg-elevated/40 via-transparent to-transparent"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      {active && <PlayingBars />}
                      <span
                        className={cn(
                          "truncate text-sm",
                          active
                            ? "text-text-primary"
                            : "text-text-primary/85",
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

        {/* Edge fade overlays — purely visual, pointer-events:none so they
            never intercept clicks or drags. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg-void to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg-void to-transparent"
        />
      </div>
    </div>
  );
}
