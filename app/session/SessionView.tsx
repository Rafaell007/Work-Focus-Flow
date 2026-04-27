"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  FastForward,
  Leaf,
  Pause,
  Play,
  Settings2,
  SkipBack,
  SkipForward,
  Timer,
} from "lucide-react";
import { SessionOrb } from "@/components/session/SessionOrb";
import { WaveLine } from "@/components/session/WaveLine";
import { DriftingEmbers } from "@/components/session/DriftingEmbers";
import { LengthPicker } from "@/components/session/LengthPicker";
import { VolumeSlider } from "@/components/session/VolumeSlider";
import { SessionGuide } from "@/components/session/SessionGuide";
import { RefinePanel } from "@/components/session/RefinePanel";
import { ContributionGraph } from "@/components/stats/ContributionGraph";
import { useAudioAnalyser } from "@/lib/audio/useAudioAnalyser";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { UserMenu } from "@/components/auth/UserMenu";
import { NatureSoundsModal } from "@/components/sounds/NatureSoundsModal";
import { usePrefsStore } from "@/lib/store/preferences";
import { useSessionsStore } from "@/lib/store/sessions";
import { useAudioPlayer } from "@/lib/audio/useAudioPlayer";
import { playChime } from "@/lib/audio/chime";
import { breakTrack, playlists, type Mood } from "@/lib/tracks/playlists";
import { TrackQueue } from "@/components/session/TrackQueue";
import { cn } from "@/lib/utils";

const moodVar: Record<Mood, string> = {
  focus:
    "[--glow-color:var(--glow-primary)] [--glow-color-soft:var(--glow-primary-soft)]",
  relax:
    "[--glow-color:var(--glow-relax)] [--glow-color-soft:var(--glow-relax-soft)]",
  sleep:
    "[--glow-color:var(--glow-sleep)] [--glow-color-soft:var(--glow-sleep-soft)]",
  classic:
    "[--glow-color:var(--glow-classic)] [--glow-color-soft:var(--glow-classic-soft)]",
};

const moodLabel: Record<Mood, string> = {
  focus: "Focus",
  relax: "Relax",
  sleep: "Sleep",
  classic: "Classic",
};

type Phase = "work" | "short-break" | "long-break";

const phaseLabel: Record<Phase, string> = {
  work: "Work",
  "short-break": "Short break",
  "long-break": "Long break",
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export function SessionView({ mood }: { mood: Mood }) {
  const [refineOpen, setRefineOpen] = useState(false);
  const [soundsOpen, setSoundsOpen] = useState(false);
  const vibe = usePrefsStore((s) => s.vibe);
  const setVibe = usePrefsStore((s) => s.setVibe);
  const lengthMinutes = usePrefsStore((s) => s.lengthMinutes);
  const setLengthMinutes = usePrefsStore((s) => s.setLengthMinutes);
  const breaks = usePrefsStore((s) => s.breaks);
  const setBreaks = usePrefsStore((s) => s.setBreaks);
  const volume = usePrefsStore((s) => s.volume);
  const setStoreVolume = usePrefsStore((s) => s.setVolume);

  const [phase, setPhase] = useState<Phase>("work");
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const moodPlaylist = playlists[mood];
  const inBreak = breaks.enabled && phase !== "work";
  const currentTrack = inBreak ? breakTrack : moodPlaylist[trackIndex];

  const phaseDuration = (() => {
    if (!breaks.enabled) return lengthMinutes * 60;
    if (phase === "work") return breaks.workMinutes * 60;
    if (phase === "short-break") return breaks.shortBreakMinutes * 60;
    return breaks.longBreakMinutes * 60;
  })();

  const {
    isPlaying,
    isReady,
    toggle,
    seek,
    play,
    pause,
    setVolume,
    audioRef,
  } = useAudioPlayer({
    src: currentTrack.src,
    loop: true,
    volume,
  });

  // Keep the <audio> volume in sync with persisted preference changes
  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

  const handleVolumeChange = (v: number) => setStoreVolume(v);

  const { bandsRef } = useAudioAnalyser(audioRef, { enabled: isPlaying });

  const router = useRouter();
  // Keyboard arrow shortcuts — surfaced via the first-visit guide below.
  // The trackpad horizontal-swipe handler used to live here too but it
  // intercepted scrolls inside the track carousel before they reached it.
  // Keyboard alone is enough; clean and zero-conflict.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable)
        return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        router.push("/onboarding");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setRefineOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // After a work→break skip we need the break track to actually start.
  // The src-change effect inside useAudioPlayer doesn't always carry playback
  // forward (chime AudioContext + same-tick state churn races the play()).
  // We set this ref in advancePhase and consume it after the src has updated.
  const autoPlayOnNextSrcRef = useRef(false);
  useEffect(() => {
    if (!autoPlayOnNextSrcRef.current) return;
    autoPlayOnNextSrcRef.current = false;
    play();
  }, [currentTrack.src, play]);

  // tick phase elapsed
  useEffect(() => {
    if (!isPlaying || isComplete) return;
    const id = setInterval(() => {
      setPhaseElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, isComplete]);

  // log study minutes — only counts active focus time (work phase, not breaks)
  const addStudyMinute = useSessionsStore((s) => s.addStudyMinute);
  useEffect(() => {
    if (!isPlaying || isComplete || inBreak) return;
    const id = setInterval(() => addStudyMinute(), 60_000);
    return () => clearInterval(id);
  }, [isPlaying, isComplete, inBreak, addStudyMinute]);

  // phase transition watcher
  const advancePhase = useCallback(() => {
    if (!breaks.enabled) {
      setIsComplete(true);
      pause();
      return;
    }
    setPhaseElapsed(0);
    if (phase === "work") {
      // work → break: chime, ensure break music plays after src swaps
      playChime("break-start");
      autoPlayOnNextSrcRef.current = true;
      const next = cyclesCompleted + 1;
      if (next >= breaks.cyclesUntilLongBreak) {
        setPhase("long-break");
        setCyclesCompleted(0);
      } else {
        setPhase("short-break");
        setCyclesCompleted(next);
      }
    } else {
      // break → work: chime, pause and wait for user to manually start
      playChime("work-ready");
      pause();
      setPhase("work");
    }
  }, [breaks, phase, cyclesCompleted, pause]);

  useEffect(() => {
    if (phaseElapsed >= phaseDuration && phaseDuration > 0) {
      advancePhase();
    }
  }, [phaseElapsed, phaseDuration, advancePhase]);

  // auto-pause on complete
  useEffect(() => {
    if (isComplete) pause();
  }, [isComplete, pause]);

  // reset session state when Pomodoro mode toggled
  useEffect(() => {
    setPhase("work");
    setPhaseElapsed(0);
    setCyclesCompleted(0);
    setIsComplete(false);
  }, [breaks.enabled]);

  // document title
  useEffect(() => {
    const base = "Focus Flow";
    if (isComplete) {
      document.title = `Done · ${moodLabel[mood]} · ${base}`;
    } else if (!isPlaying) {
      document.title = `Paused · ${moodLabel[mood]} · ${base}`;
    } else if (breaks.enabled) {
      document.title = `${formatTime(phaseElapsed)} · ${phaseLabel[phase]} · ${base}`;
    } else {
      document.title = `${formatTime(phaseElapsed)} · ${moodLabel[mood]} · ${base}`;
    }
  }, [phaseElapsed, isPlaying, mood, phase, breaks.enabled, isComplete]);

  useEffect(() => {
    return () => {
      document.title = "Focus Flow";
    };
  }, []);

  const progress = Math.min(phaseElapsed / Math.max(phaseDuration, 1), 1);
  const remaining = Math.max(phaseDuration - phaseElapsed, 0);

  const handleNext = () => {
    if (inBreak) {
      seek(0);
      return;
    }
    setTrackIndex((i) => (i + 1) % moodPlaylist.length);
  };

  const handlePrev = () => {
    if (inBreak) {
      seek(0);
      return;
    }
    setTrackIndex(
      (i) => (i - 1 + moodPlaylist.length) % moodPlaylist.length,
    );
  };

  const eyebrowText = isComplete
    ? `${moodLabel[mood]} · session complete`
    : breaks.enabled
      ? `${moodLabel[mood]} · ${phaseLabel[phase]} · cycle ${cyclesCompleted + (phase === "work" ? 1 : 0)}/${breaks.cyclesUntilLongBreak}`
      : `${moodLabel[mood]} · ${lengthMinutes} min session`;

  const tagsLine =
    vibe === "auto" ? currentTrack.tags : `${vibe} · refined · curated`;

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col overflow-x-hidden",
        moodVar[mood],
      )}
    >
      <header className="flex items-center justify-between px-6 py-5">
        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Change mood</span>
        </Link>
        <div className="flex items-center gap-2">
          {!breaks.enabled && (
            <LengthPicker
              lengthMinutes={lengthMinutes}
              onChange={setLengthMinutes}
            />
          )}
          <button
            type="button"
            onClick={() =>
              setBreaks((b) => ({ ...b, enabled: !b.enabled }))
            }
            role="switch"
            aria-checked={breaks.enabled}
            aria-label="Toggle Pomodoro mode"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300",
              breaks.enabled
                ? "border-[color:var(--glow-color)]/55 bg-[color:var(--glow-color)]/12 text-text-primary shadow-[0_0_14px_var(--glow-color-soft)]"
                : "border-border-subtle bg-bg-elevated text-text-muted hover:border-[color:var(--glow-color)]/40 hover:text-text-primary",
            )}
          >
            <Timer
              className={cn(
                "h-4 w-4 transition-transform",
                breaks.enabled && "text-[color:var(--glow-color)]",
              )}
            />
            <span className="hidden md:inline">Pomodoro</span>
            <span
              aria-hidden="true"
              className={cn(
                "relative h-4 w-7 shrink-0 rounded-full border transition-all duration-300",
                breaks.enabled
                  ? "border-[color:var(--glow-color)]/60 bg-[color:var(--glow-color)]/30"
                  : "border-border-subtle bg-bg-void",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-3 w-3 rounded-full transition-all duration-300",
                  breaks.enabled
                    ? "left-[calc(100%-0.875rem)] bg-[color:var(--glow-color)] shadow-[0_0_8px_var(--glow-color)]"
                    : "left-0.5 bg-text-muted",
                )}
              />
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSoundsOpen(true)}
            aria-label="Open nature & ambient sounds"
            className="group inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-muted transition-colors hover:border-[color:var(--glow-color)]/40 hover:text-text-primary md:px-4"
          >
            <Leaf className="h-4 w-4" />
            <span className="hidden md:inline">Sounds</span>
          </button>
          <button
            type="button"
            onClick={() => setRefineOpen(true)}
            aria-label="Open refine panel"
            className="group inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-muted transition-colors hover:border-[color:var(--glow-color)]/40 hover:text-text-primary md:px-4"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden md:inline">Refine</span>
          </button>
          <UserMenu variant="compact" />
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center gap-5 px-6 pb-4 md:gap-6"
      >
        <SessionOrb bandsRef={bandsRef} />

        <div className="relative z-10 -mx-6 -mt-10 w-screen md:-mx-8 md:-mt-12">
          <WaveLine bandsRef={bandsRef} height={120} />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-text-muted">
            {eyebrowText}
          </span>
          <h1 className="font-display text-4xl font-normal tracking-tight text-text-primary md:text-5xl">
            {currentTrack.title}
          </h1>
          <p className="text-sm text-text-muted">
            {!isReady ? "Loading…" : tagsLine}
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col gap-3">
          <div className="flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.2em] text-text-muted">
            <span>{formatTime(phaseElapsed)}</span>
            <span>−{formatTime(remaining)}</span>
          </div>
          <div className="relative h-px overflow-hidden bg-border-subtle">
            <div
              className="absolute inset-y-0 left-0 h-full bg-[color:var(--glow-color)] transition-[width] duration-1000 ease-linear"
              style={{
                width: `${progress * 100}%`,
                boxShadow: "0 0 10px var(--glow-color)",
              }}
            />
          </div>

          {breaks.enabled && !isComplete && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={advancePhase}
                aria-label={inBreak ? "Skip break" : "Skip to break"}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-text-muted transition-colors hover:border-[color:var(--glow-color)]/50 hover:text-text-primary"
              >
                <FastForward className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                <span>{inBreak ? "Skip break" : "Skip to break"}</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous track"
            className="text-text-muted transition-colors hover:text-text-primary"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <motion.button
            type="button"
            onClick={toggle}
            disabled={!isReady}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--glow-color)]/40 bg-bg-elevated text-text-primary shadow-[0_0_24px_var(--glow-color-soft)] transition-colors hover:border-[color:var(--glow-color)]/70 hover:bg-bg-elevated-hi disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-current" />
            )}
          </motion.button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next track"
            className="text-text-muted transition-colors hover:text-text-primary"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <VolumeSlider value={volume} onChange={handleVolumeChange} />

        <TrackQueue
          tracks={moodPlaylist}
          currentIndex={trackIndex}
          onSelect={setTrackIndex}
          isActiveSource={!inBreak}
        />
      </motion.main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <DriftingEmbers height={160} />
      </motion.div>

      <section className="mx-auto w-full max-w-5xl px-6 pt-4">
        <ContributionGraph />
      </section>

      <SiteFooter />

      {!refineOpen && (
        <motion.button
          type="button"
          onClick={() => setRefineOpen(true)}
          aria-label="Open refine panel"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ x: -3 }}
          className="group fixed right-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-3 rounded-l-2xl border-y border-l border-border-subtle bg-bg-elevated/90 py-5 pl-3 pr-2 shadow-[-8px_0_28px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:bg-bg-elevated-hi"
        >
          <span
            className="text-[0.65rem] uppercase tracking-[0.4em] text-text-muted transition-colors group-hover:text-text-primary"
            style={{ writingMode: "vertical-rl" }}
          >
            Refine
          </span>
          <span
            aria-hidden="true"
            className="h-14 w-0.5 rounded bg-[color:var(--glow-color)] opacity-55 transition-opacity group-hover:opacity-100"
            style={{ boxShadow: "0 0 12px var(--glow-color)" }}
          />
        </motion.button>
      )}

      <RefinePanel
        open={refineOpen}
        onClose={() => setRefineOpen(false)}
        vibe={vibe}
        onVibeChange={setVibe}
        breaks={breaks}
        onBreaksChange={setBreaks}
      />

      <NatureSoundsModal
        open={soundsOpen}
        onClose={() => setSoundsOpen(false)}
      />

      <SessionGuide />
    </div>
  );
}
