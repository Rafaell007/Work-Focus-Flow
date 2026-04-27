"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Mood = "focus" | "relax" | "sleep" | "meditate";

const moodVar: Record<Mood, string> = {
  focus:
    "[--glow-color:var(--glow-primary)] [--glow-color-soft:var(--glow-primary-soft)]",
  relax:
    "[--glow-color:var(--glow-relax)] [--glow-color-soft:var(--glow-relax-soft)]",
  sleep:
    "[--glow-color:var(--glow-sleep)] [--glow-color-soft:var(--glow-sleep-soft)]",
  meditate:
    "[--glow-color:var(--glow-meditate)] [--glow-color-soft:var(--glow-meditate-soft)]",
};

type CommonProps = {
  mood?: Mood;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
};

type InteractiveProps = CommonProps & {
  interactive: true;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
};

type StaticProps = CommonProps & {
  interactive?: false;
};

type GlowCardProps = InteractiveProps | StaticProps;

const baseClasses =
  "relative rounded-2xl p-6 bg-bg-elevated border border-border-subtle transition-[box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden";

const ambientGlow =
  "before:pointer-events-none before:absolute before:-inset-px before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500 before:bg-[radial-gradient(120%_60%_at_50%_0%,var(--glow-color-soft),transparent_70%)]";

export function GlowCard(props: GlowCardProps) {
  const { mood = "focus", selected = false, className, children } = props;

  const classes = cn(
    baseClasses,
    ambientGlow,
    moodVar[mood],
    selected
      ? "border-[color:var(--glow-color)]/55 shadow-[var(--glow-md)] before:opacity-100"
      : "shadow-[var(--glow-sm)]",
    className,
  );

  if (props.interactive) {
    const { onClick, disabled, type = "button", ariaLabel } = props;
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={selected}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className={cn(
          classes,
          "cursor-pointer text-left w-full",
          "hover:bg-bg-elevated-hi hover:border-[color:var(--glow-color)]/45 hover:shadow-[var(--glow-md)] hover:before:opacity-100",
          "focus-visible:outline-none focus-visible:border-[color:var(--glow-color)]/60 focus-visible:shadow-[var(--glow-lg)] focus-visible:before:opacity-100",
          "disabled:opacity-50 disabled:pointer-events-none",
        )}
      >
        {children}
      </motion.button>
    );
  }

  return <div className={classes}>{children}</div>;
}
