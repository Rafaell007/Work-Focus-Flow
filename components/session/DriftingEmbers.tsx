"use client";

import { useEffect, useRef } from "react";

type Props = {
  // number → fixed pixel height; "fill" → expands to parent container's height
  height?: number | "fill";
  count?: number;
};

type Ember = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  // life ∈ [0, 1] — 0 invisible, 0.5 peak, 1 invisible (sin curve)
  life: number;
  lifeSpeed: number;
  twinklePhase: number;
};

// Ambient backdrop — slow drifting glow points, like sparks settling.
// Intentionally NOT audio-reactive; complements the wave (which is reactive)
// without competing for the eye.
export function DriftingEmbers({ height = 160, count = 48 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let glowColor = "#8b6fff";
    let glowSoft = "rgba(139, 111, 255, 0.18)";
    let w = container.clientWidth;
    let h = typeof height === "number" ? height : container.clientHeight;

    const refreshColors = () => {
      const cs = getComputedStyle(container);
      glowColor = cs.color || glowColor;
      glowSoft = cs.borderTopColor || glowSoft;
    };

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = container.clientWidth;
      h = typeof height === "number" ? height : container.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      refreshColors();
    };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const spawnEmber = (initial = false): Ember => ({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.18, -0.04), // slight upward drift, like rising embers
      size: rand(0.6, 2.2),
      life: initial ? Math.random() : 0,
      lifeSpeed: rand(0.0015, 0.0045),
      twinklePhase: Math.random() * Math.PI * 2,
    });

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    const embers: Ember[] = Array.from({ length: count }, () => spawnEmber(true));

    const startTime = performance.now();
    const loop = (now: number) => {
      const t = (now - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      ctx.shadowColor = glowColor;
      ctx.fillStyle = glowColor;

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += e.lifeSpeed;
        if (e.life >= 1) {
          embers[i] = spawnEmber();
          continue;
        }
        e.x += e.vx;
        e.y += e.vy;

        // Wrap horizontally so embers don't disappear off the side
        if (e.x < -10) e.x = w + 10;
        if (e.x > w + 10) e.x = -10;
        if (e.y < -10) e.y = h + 10; // wrap top → bottom

        // Sin envelope for fade-in / fade-out
        const fade = Math.sin(e.life * Math.PI);
        // Subtle twinkle
        const twinkle = 0.85 + Math.sin(t * 1.6 + e.twinklePhase) * 0.15;
        const alpha = fade * twinkle * 0.85;

        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 12 + e.size * 4;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [height, count]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        height: typeof height === "number" ? `${height}px` : "100%",
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
