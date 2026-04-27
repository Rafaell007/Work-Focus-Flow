import { ArrowRight, Compass, HeartPulse, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { GlowButton } from "@/components/shared/GlowButton";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { UserMenu } from "@/components/auth/UserMenu";

const steps = [
  {
    n: "01",
    Icon: Compass,
    title: "Pick what you're doing",
    body: "Focus, relax, sleep, train, rest — or drift into nature. Six broad lanes to start.",
  },
  {
    n: "02",
    Icon: HeartPulse,
    title: "Tell us how you feel",
    body: "Need stimulation? Need to wind down? We score the session to match your state today.",
  },
  {
    n: "03",
    Icon: Sparkles,
    title: "Press play, that's it",
    body: "Zero ads, zero interruptions. No more hunting for that one playlist that almost works.",
  },
] as const;

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-end p-4 md:p-6">
        <div className="pointer-events-auto">
          <UserMenu />
        </div>
      </div>
      <main className="flex flex-1 flex-col">
        <section className="relative flex min-h-screen flex-col justify-between gap-10 px-6 pb-12 pt-16 md:gap-12 md:pt-20">
          <div className="flex flex-1 flex-col items-center justify-center gap-7 md:gap-9">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-text-muted">
              Focus · Relax · Sleep · Meditate
            </span>

            <h1 className="max-w-5xl text-center font-display text-[3.25rem] font-normal leading-[1.04] tracking-[-0.01em] text-text-primary md:text-7xl">
              Soundtracks for the way{" "}
              <span className="text-text-muted">you think.</span>
            </h1>

            <p className="max-w-xl text-center text-base leading-relaxed text-text-muted md:text-lg">
              Tell us how you feel today. We score a session built to carry
              your attention — every track sequenced to build, hold, and
              release.
            </p>

            <div className="flex flex-col items-center gap-5 pt-2 sm:flex-row sm:gap-6">
              <GlowButton href="/onboarding" mood="focus" size="lg">
                Start a session
                <ArrowRight className="h-4 w-4" />
              </GlowButton>
              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                <span>How it works</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>

          <div
            id="how-it-works"
            className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-10"
          >
            {steps.map(({ n, Icon, title, body }) => (
              <div key={n} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-faint">
                    {n}
                  </span>
                  <Icon className="h-4 w-4 text-text-muted" />
                </div>
                <h3 className="font-display text-2xl font-normal leading-tight tracking-tight text-text-primary">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-text-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}
