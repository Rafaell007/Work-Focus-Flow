"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Vibe =
  | "auto"
  | "ambient"
  | "electronic"
  | "acoustic"
  | "nature"
  | "lofi";

export type BreaksConfig = {
  enabled: boolean;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesUntilLongBreak: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  vibe: Vibe;
  onVibeChange: (v: Vibe) => void;
  breaks: BreaksConfig;
  onBreaksChange: (b: BreaksConfig) => void;
};

const tabs = [
  { id: "vibe" as const, label: "Vibe" },
  { id: "breaks" as const, label: "Pomodoro settings" },
];

const vibeOptions: { id: Vibe; label: string; caption: string }[] = [
  { id: "auto", label: "Auto", caption: "Let the AI choose for you" },
  { id: "ambient", label: "Ambient", caption: "Drones, pads, slow textures" },
  { id: "electronic", label: "Electronic", caption: "Synths, pulses, drive" },
  { id: "acoustic", label: "Acoustic", caption: "Strings, piano, organic" },
  { id: "nature", label: "Nature", caption: "Rain, forest, water, wind" },
  { id: "lofi", label: "Lofi", caption: "Mellow beats, warm hiss" },
];

const workOptions = [15, 20, 25, 30, 45];
const shortBreakOptions = [3, 5, 10];
const longBreakOptions = [10, 15, 20, 30];
const cyclesOptions = [2, 3, 4, 5];

export function RefinePanel({
  open,
  onClose,
  vibe,
  onVibeChange,
  breaks,
  onBreaksChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<"vibe" | "breaks">("vibe");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            role="dialog"
            aria-label="Refine session"
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-border-subtle bg-bg-elevated shadow-[-12px_0_60px_rgba(0,0,0,0.6)]"
          >
            <header className="flex items-center justify-between px-6 py-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-faint">
                  Session
                </span>
                <h2 className="font-display text-2xl font-normal tracking-tight">
                  Refine
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-full p-2 text-text-muted transition-colors hover:bg-bg-elevated-hi hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="px-6">
              <div className="relative grid grid-cols-2 gap-1 rounded-full border border-border-subtle bg-bg-void p-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className="relative rounded-full px-4 py-2 text-sm transition-colors"
                  >
                    {activeTab === t.id && (
                      <motion.span
                        layoutId="activeRefineTab"
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                        className="absolute inset-0 rounded-full bg-bg-elevated-hi shadow-[var(--glow-sm)]"
                      />
                    )}
                    <span
                      className={cn(
                        "relative z-10",
                        activeTab === t.id
                          ? "text-text-primary"
                          : "text-text-muted",
                      )}
                    >
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {activeTab === "vibe" && (
                  <TabSection key="vibe">
                    <SectionLabel>Choose a vibe</SectionLabel>
                    <div className="flex flex-col gap-2">
                      {vibeOptions.map((opt) => (
                        <RadioRow
                          key={opt.id}
                          label={opt.label}
                          caption={opt.caption}
                          active={vibe === opt.id}
                          onClick={() => onVibeChange(opt.id)}
                        />
                      ))}
                    </div>
                  </TabSection>
                )}

                {activeTab === "breaks" && (
                  <TabSection key="breaks">
                    {!breaks.enabled && (
                      <p className="rounded-2xl border border-border-subtle bg-bg-void/40 px-4 py-3 text-xs text-text-muted">
                        Pomodoro is off — toggle it from the header to apply
                        these settings.
                      </p>
                    )}

                    <div
                      className={cn(
                        "flex flex-col gap-6 transition-opacity",
                        !breaks.enabled && "pointer-events-none opacity-40",
                      )}
                    >
                      <BreaksRow
                        label="Work"
                        suffix="min"
                        values={workOptions}
                        active={breaks.workMinutes}
                        onSelect={(v) =>
                          onBreaksChange({ ...breaks, workMinutes: v })
                        }
                      />
                      <BreaksRow
                        label="Short break"
                        suffix="min"
                        values={shortBreakOptions}
                        active={breaks.shortBreakMinutes}
                        onSelect={(v) =>
                          onBreaksChange({ ...breaks, shortBreakMinutes: v })
                        }
                      />
                      <BreaksRow
                        label="Long break"
                        suffix="min"
                        values={longBreakOptions}
                        active={breaks.longBreakMinutes}
                        onSelect={(v) =>
                          onBreaksChange({ ...breaks, longBreakMinutes: v })
                        }
                      />
                      <BreaksRow
                        label="Cycles before long break"
                        values={cyclesOptions}
                        active={breaks.cyclesUntilLongBreak}
                        onSelect={(v) =>
                          onBreaksChange({
                            ...breaks,
                            cyclesUntilLongBreak: v,
                          })
                        }
                      />
                    </div>
                  </TabSection>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function TabSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3"
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-faint">
      {children}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300",
        active
          ? "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/12 text-text-primary shadow-[0_0_14px_var(--glow-color-soft)]"
          : "border-border-subtle bg-bg-elevated text-text-muted hover:border-border-strong hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}

function ChipRow({
  values,
  active,
  onSelect,
  suffix,
}: {
  values: readonly number[];
  active: number;
  onSelect: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <Chip key={v} active={active === v} onClick={() => onSelect(v)}>
          {v}
          {suffix ? ` ${suffix}` : ""}
        </Chip>
      ))}
    </div>
  );
}

function RadioRow({
  label,
  caption,
  active,
  onClick,
}: {
  label: string;
  caption: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300",
        active
          ? "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/8 shadow-[0_0_14px_var(--glow-color-soft)]"
          : "border-border-subtle bg-bg-elevated hover:border-border-strong",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 h-3 w-3 shrink-0 rounded-full border transition-all",
          active
            ? "border-[color:var(--glow-color)] bg-[color:var(--glow-color)] shadow-[0_0_10px_var(--glow-color)]"
            : "border-border-strong bg-transparent",
        )}
      />
      <span className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-sm",
            active ? "text-text-primary" : "text-text-primary/85",
          )}
        >
          {label}
        </span>
        <span className="text-xs text-text-muted">{caption}</span>
      </span>
    </button>
  );
}

function BreaksRow({
  label,
  values,
  active,
  onSelect,
  suffix,
}: {
  label: string;
  values: readonly number[];
  active: number;
  onSelect: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>{label}</SectionLabel>
      <ChipRow
        values={values}
        active={active}
        onSelect={onSelect}
        suffix={suffix}
      />
    </div>
  );
}
