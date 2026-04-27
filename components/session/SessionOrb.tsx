"use client";

import { useEffect, useRef } from "react";
import type { Bands } from "@/lib/audio/useAudioAnalyser";

type Props = {
  bandsRef: React.RefObject<Bands>;
};

export function SessionOrb({ bandsRef }: Props) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  // Smoothed values, updated each frame so movement feels organic, not jittery
  const sRef = useRef({ bass: 0, mid: 0, treble: 0, level: 0, t: 0 });

  useEffect(() => {
    let raf = 0;
    const startTime = performance.now();

    const loop = (now: number) => {
      const t = (now - startTime) / 1000;
      const target = bandsRef.current;
      const s = sRef.current;

      // Asymmetric smoothing — fast attack, slow release. Punchier feel.
      const lerp = (cur: number, to: number) => {
        const k = to > cur ? 0.35 : 0.08;
        return cur + (to - cur) * k;
      };

      s.bass = lerp(s.bass, target.bass);
      s.mid = lerp(s.mid, target.mid);
      s.treble = lerp(s.treble, target.treble);
      s.level = lerp(s.level, target.level);
      s.t = t;

      // Idle drift — keeps a subtle breath when paused or silent
      const breath = Math.sin(t * 0.7) * 0.5 + 0.5;

      const outer = outerRef.current;
      const mid = midRef.current;
      const inner = innerRef.current;
      const core = coreRef.current;
      const halo = haloRef.current;

      if (outer) {
        const scale = 1 + s.bass * 0.18 + breath * 0.02;
        outer.style.transform = `scale(${scale})`;
        outer.style.opacity = String(0.45 + s.level * 0.35);
      }
      if (mid) {
        const scale = 1 + s.mid * 0.16 + breath * 0.015;
        const rot = Math.sin(t * 0.6) * 4 + s.bass * 6;
        mid.style.transform = `scale(${scale}) rotate(${rot}deg)`;
        mid.style.opacity = String(0.6 + s.mid * 0.3);
      }
      if (inner) {
        const scale = 1 + s.treble * 0.22 + s.bass * 0.06;
        inner.style.transform = `scale(${scale})`;
      }
      if (core) {
        const scale = 1 + s.level * 0.25 + breath * 0.01;
        const opacity = 0.78 + s.level * 0.22;
        core.style.transform = `scale(${scale})`;
        core.style.opacity = String(opacity);
      }
      if (halo) {
        const scale = 1 + s.bass * 0.4 + breath * 0.04;
        halo.style.transform = `scale(${scale})`;
        halo.style.opacity = String(0.45 + s.bass * 0.4);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [bandsRef]);

  return (
    <div className="relative h-72 w-72 shrink-0 md:h-[22rem] md:w-[22rem]">
      <div
        ref={haloRef}
        aria-hidden="true"
        className="absolute -inset-8 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, var(--glow-color-soft) 0%, transparent 70%)",
          opacity: 0.55,
          pointerEvents: "none",
          transformOrigin: "center",
        }}
      />

      <div
        ref={outerRef}
        className="absolute inset-0 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, var(--glow-color) 0%, transparent 60%)",
          opacity: 0.5,
          filter: "blur(8px)",
          transformOrigin: "center",
        }}
      />

      <div
        ref={midRef}
        className="absolute inset-8 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, var(--glow-color) 0%, transparent 65%)",
          opacity: 0.7,
          filter: "blur(4px)",
          transformOrigin: "center",
        }}
      />

      <div
        ref={innerRef}
        className="absolute inset-20 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--glow-color) 0%, transparent 75%)",
          filter: "blur(2px)",
          transformOrigin: "center",
        }}
      />

      <div
        ref={coreRef}
        className="absolute inset-28 rounded-full will-change-transform"
        style={{
          background: "var(--glow-color)",
          opacity: 0.85,
          filter: "blur(1px)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
