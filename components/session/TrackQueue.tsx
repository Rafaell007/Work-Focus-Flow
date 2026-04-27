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

const DRAG_THRESHOLD = 6;

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

  // Drag-to-scroll for mouse users. Done with raw DOM listeners (mousedown
  // on the container, mousemove/mouseup on document) so pointer-capture
  // quirks of React's synthetic event system can't ever break clicks.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // left button only
      isDown = true;
      moved = false;
      startX = e.pageX;
      startScroll = el.scrollLeft;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        // Force grabbing cursor across the entire page during the drag —
        // setting it only on `el` doesn't override the buttons' own cursor,
        // which is why dragging "felt dead" while hovering inside cards.
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
      }
      if (moved) {
        el.scrollLeft = startScroll - dx;
        e.preventDefault();
      }
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (moved) {
        // Swallow the click that the browser is about to synthesize from
        // this drag-up. One-shot, capture phase so it runs before any
        // child onClick handler. Auto-cleanup if no click is fired.
        const swallow = (ev: Event) => {
          ev.stopPropagation();
          ev.preventDefault();
          document.removeEventListener("click", swallow, true);
        };
        document.addEventListener("click", swallow, true);
        window.setTimeout(
          () => document.removeEventListener("click", swallow, true),
          80,
        );
      }
      moved = false;
    };

    el.addEventListener("mousedown", onDown);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      // Failsafe — clear any leftover body cursor
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

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
          ref={containerRef}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-7 pb-2 pt-1"
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
                draggable={false}
                className={cn(
                  "group relative flex w-44 shrink-0 cursor-grab select-none snap-start flex-col gap-2 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300",
                  active
                    ? "border-[color:var(--glow-color)]/60 bg-[color:var(--glow-color)]/10 shadow-[0_0_18px_var(--glow-color-soft)]"
                    : "border-border-subtle bg-bg-elevated hover:border-border-strong hover:bg-bg-elevated-hi",
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-20 w-full rounded-xl transition-opacity duration-300",
                    active
                      ? "opacity-100"
                      : "opacity-70 group-hover:opacity-90",
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
