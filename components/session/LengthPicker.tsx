"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  lengthMinutes: number;
  onChange: (m: number) => void;
};

const presets = [5, 10, 15, 30, 50, 60, 90];
const MIN = 1;
const MAX = 240;

export function LengthPicker({ lengthMinutes, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const submitCustom = () => {
    const n = parseInt(customInput, 10);
    if (Number.isFinite(n) && n >= MIN && n <= MAX) {
      onChange(n);
      setOpen(false);
      setCustomInput("");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Set session length"
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300",
          open
            ? "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/12 text-text-primary shadow-[0_0_14px_var(--glow-color-soft)]"
            : "border-border-subtle bg-bg-elevated text-text-muted hover:border-[color:var(--glow-color)]/40 hover:text-text-primary",
        )}
      >
        <Clock className="h-4 w-4" />
        <span>
          <span className="text-text-primary">{lengthMinutes}</span>
          <span className="ml-1 text-text-muted">min</span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="popover"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Session length"
            className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-72 rounded-2xl border border-border-subtle bg-bg-elevated p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-faint">
              Quick presets
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((v) => {
                const active = v === lengthMinutes;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      onChange(v);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-all duration-300",
                      active
                        ? "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/12 text-text-primary shadow-[0_0_10px_var(--glow-color-soft)]"
                        : "border-border-subtle bg-bg-void text-text-muted hover:border-border-strong hover:text-text-primary",
                    )}
                  >
                    {v} min
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-faint">
                Custom
              </span>
              <div className="flex items-stretch gap-2">
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  min={MIN}
                  max={MAX}
                  step={1}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitCustom();
                    }
                  }}
                  placeholder="e.g. 22"
                  className="flex-1 rounded-full border border-border-subtle bg-bg-void px-3 py-1.5 text-sm text-text-primary placeholder:text-text-faint focus:border-[color:var(--glow-color)]/55 focus:outline-none focus:shadow-[0_0_10px_var(--glow-color-soft)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={submitCustom}
                  disabled={
                    customInput === "" ||
                    !Number.isFinite(parseInt(customInput, 10))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-all duration-300",
                    "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/12 text-text-primary hover:shadow-[0_0_12px_var(--glow-color-soft)]",
                    "disabled:opacity-40 disabled:pointer-events-none",
                  )}
                >
                  Set
                </button>
              </div>
              <span className="text-[0.65rem] text-text-faint">
                {MIN}–{MAX} min
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
