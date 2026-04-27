"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Mood = "focus" | "relax" | "sleep" | "meditate";
type Size = "sm" | "md" | "lg";

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

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-lg",
};

const baseClasses =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight " +
  "bg-bg-elevated text-text-primary border border-border-subtle " +
  "transition-[box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "shadow-[var(--glow-sm)] " +
  "hover:shadow-[var(--glow-md)] hover:bg-bg-elevated-hi " +
  "hover:border-[color:var(--glow-color)]/40 " +
  "focus-visible:outline-none focus-visible:shadow-[var(--glow-lg)] " +
  "focus-visible:border-[color:var(--glow-color)]/60 " +
  "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none";

const motionProps = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 420, damping: 26 },
};

const MotionLink = motion.create(Link);

type CommonProps = {
  mood?: Mood;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type GlowButtonProps =
  | (CommonProps & { href?: undefined } & Omit<
        HTMLMotionProps<"button">,
        "children" | "ref"
      >)
  | (CommonProps & { href: string } & Omit<
        HTMLMotionProps<"a">,
        "children" | "ref" | "href"
      >);

export function GlowButton({
  mood = "focus",
  size = "md",
  className,
  children,
  ...rest
}: GlowButtonProps) {
  const classes = cn(baseClasses, moodVar[mood], sizeClass[size], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest;
    return (
      <MotionLink
        href={href}
        className={classes}
        {...motionProps}
        {...anchorRest}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button className={classes} {...motionProps} {...rest}>
      {children}
    </motion.button>
  );
}
