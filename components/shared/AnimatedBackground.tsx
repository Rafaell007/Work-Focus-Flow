"use client";

import { motion } from "motion/react";

type Blob = {
  color: string;
  size: number;
  left: string;
  top: string;
  drift: { x: [number, number]; y: [number, number] };
  duration: number;
  opacity: number;
};

const blobs: Blob[] = [
  {
    color: "var(--glow-primary)",
    size: 820,
    left: "-12%",
    top: "-18%",
    drift: { x: [-80, 120], y: [-60, 80] },
    duration: 14,
    opacity: 0.55,
  },
  {
    color: "var(--glow-sleep)",
    size: 720,
    left: "55%",
    top: "30%",
    drift: { x: [60, -100], y: [-40, 80] },
    duration: 17,
    opacity: 0.4,
  },
  {
    color: "var(--glow-relax)",
    size: 540,
    left: "20%",
    top: "60%",
    drift: { x: [-50, 90], y: [40, -30] },
    duration: 20,
    opacity: 0.28,
  },
];

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={{ x: b.drift.x, y: b.drift.y }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 65%)`,
            willChange: "transform",
          }}
          className="absolute rounded-full blur-2xl"
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,var(--bg-void)_120%)]" />
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
