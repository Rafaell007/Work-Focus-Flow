import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { GlowButton } from "@/components/shared/GlowButton";
import { GlowCard } from "@/components/shared/GlowCard";
import { MoodPicker } from "../_showcase/MoodPicker";

const moods = [
  { id: "focus", label: "Focus" },
  { id: "relax", label: "Relax" },
  { id: "sleep", label: "Sleep" },
  { id: "meditate", label: "Meditate" },
] as const;

export default function Showcase() {
  return (
    <>
      <AnimatedBackground />
      <main className="flex flex-1 flex-col items-center gap-24 px-6 py-24">
        <header className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
            Internal · component showcase
          </span>
          <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
            Design system <em className="italic text-text-muted">primitives</em>
          </h1>
        </header>

        <Section eyebrow="Glow button — mood variants">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {moods.map((m) => (
              <GlowButton key={m.id} mood={m.id} size="md">
                {m.label}
              </GlowButton>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton mood="focus" size="sm">
              Small
            </GlowButton>
            <GlowButton mood="focus" size="md">
              Medium
            </GlowButton>
            <GlowButton mood="focus" size="lg">
              Start session
            </GlowButton>
          </div>
        </Section>

        <Section eyebrow="Get started — pick your mood">
          <MoodPicker />
        </Section>

        <Section eyebrow="Static card · for info / metadata">
          <GlowCard mood="focus" className="max-w-md">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-text-faint">
                Now playing · 24:43 of 50:00
              </span>
              <span className="font-display text-2xl font-light tracking-tight">
                Techno March
              </span>
              <span className="text-sm text-text-muted">
                Electronic · high neural effect · driving · energizing
              </span>
            </div>
          </GlowCard>
        </Section>
      </main>
    </>
  );
}

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-faint">
        {eyebrow}
      </span>
      {children}
    </section>
  );
}
