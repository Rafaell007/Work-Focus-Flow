"use client";

import { useEffect, useRef } from "react";
import type { Bands } from "@/lib/audio/useAudioAnalyser";

type Props = {
  bandsRef: React.RefObject<Bands>;
  height?: number;
};

export function WaveLine({ bandsRef, height = 140 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smoothed band values for soft, organic motion
  const sRef = useRef({ bass: 0, mid: 0, treble: 0, level: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let glowColor = "#8b6fff";
    let glowSoft = "rgba(139, 111, 255, 0.18)";

    const refreshColors = () => {
      // Canvas strokeStyle silently rejects "var(--…)" strings, so we hoist
      // the CSS var values onto resolved properties (color / borderTopColor)
      // and read those — they always come back as concrete rgb()/rgba().
      const cs = getComputedStyle(container);
      const c = cs.color;
      const cSoft = cs.borderTopColor;
      if (c) glowColor = c;
      if (cSoft) glowSoft = cSoft;
    };

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refreshColors();
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const startTime = performance.now();

    const lerp = (cur: number, to: number) => {
      // Faster attack, slightly faster release than orb — wave reads punchier
      const k = to > cur ? 0.45 : 0.12;
      return cur + (to - cur) * k;
    };

    const loop = (now: number) => {
      const t = (now - startTime) / 1000;
      const target = bandsRef.current;
      const s = sRef.current;
      s.bass = lerp(s.bass, target.bass);
      s.mid = lerp(s.mid, target.mid);
      s.treble = lerp(s.treble, target.treble);
      s.level = lerp(s.level, target.level);

      const w = container.clientWidth;
      const h = height;
      ctx.clearRect(0, 0, w, h);

      const baseY = h / 2;
      // Idle breath — quieter when silent so the contrast with audio is bigger
      const idle = (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.1;
      const energy = idle + s.level * 1.15;
      // Roomier amplitude ceiling so peaks read clearly
      const maxAmp = Math.min(h * 0.48, 70);
      const amp = maxAmp * (0.18 + energy * 1.35);

      // Soft saturation limit — keep peaks inside the canvas regardless of
      // what the harmonic sum would naively produce. Without this, loud
      // moments make peaks clip flat at the canvas edge (or vanish entirely).
      const softLimit = h * 0.46;
      const softClip = (y: number) => {
        const dev = y - baseY;
        return baseY + softLimit * Math.tanh(dev / softLimit);
      };

      // Draw helper for one wave pass at a given phase + amplitude scalar
      const tracePath = (
        phaseT: number,
        ampScale: number,
        h1: number,
        h2: number,
        h3: number,
      ) => {
        ctx.beginPath();
        const step = 2;
        for (let x = 0; x <= w; x += step) {
          const k = x / w;
          const rawY =
            baseY +
            Math.sin(k * Math.PI * 4 + phaseT * 1.0) * amp * 0.7 * ampScale +
            Math.sin(k * Math.PI * 8 - phaseT * 0.6) *
              amp *
              0.4 *
              (1 + s.bass * 1.6) *
              h1 *
              ampScale +
            Math.sin(k * Math.PI * 14 + phaseT * 1.6) *
              amp *
              0.26 *
              (1 + s.mid * 1.3) *
              h2 *
              ampScale +
            Math.sin(k * Math.PI * 22 + phaseT * 2.4) *
              amp *
              0.18 *
              (1 + s.treble * 1.5) *
              h3 *
              ampScale;
          const y = softClip(rawY);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      // Outer soft glow halo — wide blur, low opacity
      tracePath(t, 1, 1, 1, 1);
      ctx.lineWidth = 2;
      ctx.strokeStyle = glowSoft;
      ctx.shadowBlur = 28;
      ctx.shadowColor = glowColor;
      ctx.globalAlpha = 0.55;
      ctx.stroke();

      // Mid glow — tighter blur, mood color
      ctx.shadowBlur = 14;
      ctx.strokeStyle = glowColor;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Sharp inner stroke — bright core
      ctx.shadowBlur = 4;
      ctx.strokeStyle = glowColor;
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Echo — second wave slightly offset for parallax depth
      tracePath(t + 0.7, 0.55, 0.6, 0.4, 0.3);
      ctx.shadowBlur = 18;
      ctx.strokeStyle = glowColor;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [bandsRef, height]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        height: `${height}px`,
        // Hoist CSS vars onto resolvable properties so the canvas effect
        // can read concrete rgb() values via getComputedStyle.
        color: "var(--glow-color)",
        borderTopColor: "var(--glow-color-soft)",
        borderTopStyle: "solid",
        borderTopWidth: 0,
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
