"use client";

import { useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import { MoodIllustration } from "@/components/onboarding/MoodIllustration";
import { cn } from "@/lib/utils";

type Mood = "focus" | "relax" | "sleep" | "meditate";

const moods: {
  id: Mood;
  label: string;
  caption: string;
}[] = [
  {
    id: "focus",
    label: "Focus",
    caption: "Deep work, study, anything that asks for sustained attention.",
  },
  {
    id: "relax",
    label: "Relax",
    caption: "Soft attention. Reading, light tasks, winding the day down.",
  },
  {
    id: "sleep",
    label: "Sleep",
    caption: "Drift off without effort. Ambient layers that fade you out.",
  },
  {
    id: "meditate",
    label: "Meditate",
    caption: "Be present. Breathwork, stillness, body scans, intention.",
  },
];

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

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease },
  },
};

export function MoodPicker() {
  const router = useRouter();

  const select = (mood: Mood) => {
    router.push(`/session?mood=${mood}`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex w-full flex-col items-center gap-14"
    >
      <motion.header
        variants={headerVariants}
        className="flex max-w-2xl flex-col items-center gap-3 text-center"
      >
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-text-muted">
          Step 01 · Mood
        </span>
        <h1 className="font-display text-5xl font-normal leading-[1.05] tracking-tight text-text-primary md:text-6xl">
          What are you in the{" "}
          <span className="text-text-muted">mood for?</span>
        </h1>
        <p className="text-sm text-text-muted md:text-base">
          Pick a lane. We&apos;ll handle the rest — refine inside the session.
        </p>
      </motion.header>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {moods.map(({ id, label, caption }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => select(id)}
            variants={cardVariants}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            aria-label={`Start a ${label} session`}
            className={cn(
              "group relative flex aspect-[3/4] flex-col items-center overflow-hidden rounded-3xl p-6 text-center",
              "bg-bg-elevated border border-border-subtle",
              "transition-[box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "shadow-[var(--glow-sm)]",
              "hover:bg-bg-elevated-hi hover:border-[color:var(--glow-color)]/45 hover:shadow-[var(--glow-md)]",
              "focus-visible:outline-none focus-visible:border-[color:var(--glow-color)]/60 focus-visible:shadow-[var(--glow-lg)]",
              moodVar[id],
              "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:opacity-0 before:transition-opacity before:duration-500 before:bg-[radial-gradient(140%_70%_at_50%_0%,var(--glow-color-soft),transparent_70%)] hover:before:opacity-100 focus-visible:before:opacity-100",
            )}
          >
            <div
              className="relative z-10 flex flex-1 w-full items-center justify-center text-[color:var(--glow-color)] transition-transform duration-500 group-hover:scale-[1.04]"
              style={{ filter: "drop-shadow(0 0 18px var(--glow-color-soft))" }}
            >
              <MoodIllustration mood={id} className="h-32 w-32 md:h-36 md:w-36" />
            </div>

            <div className="relative z-10 mt-2 flex w-full flex-col gap-1.5">
              <span className="font-display text-4xl font-normal leading-none tracking-tight text-text-primary md:text-[2.75rem]">
                {label}
              </span>
              <p className="text-[0.8rem] leading-relaxed text-text-muted">
                {caption}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
