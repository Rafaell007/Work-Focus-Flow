"use client";

import { useState } from "react";
import { Brain, Leaf, Moon, Flower2 } from "lucide-react";
import { GlowCard } from "@/components/shared/GlowCard";

type Mood = "focus" | "relax" | "sleep" | "classic";

const items: {
  id: Mood;
  label: string;
  caption: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "focus", label: "Focus", caption: "Deep work · learning", Icon: Brain },
  { id: "relax", label: "Relax", caption: "Wind down · soft attention", Icon: Leaf },
  { id: "sleep", label: "Sleep", caption: "Drift off · ambient", Icon: Moon },
  { id: "classic", label: "Classic", caption: "Piano-led · cinematic", Icon: Flower2 },
];

export function MoodPicker() {
  const [selected, setSelected] = useState<Mood>("focus");

  return (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
      {items.map(({ id, label, caption, Icon }) => (
        <GlowCard
          key={id}
          mood={id}
          interactive
          selected={selected === id}
          onClick={() => setSelected(id)}
          ariaLabel={`Select ${label} mode`}
        >
          <div className="flex flex-col gap-3">
            <Icon className="h-5 w-5 text-[color:var(--glow-color)]" />
            <div className="flex flex-col gap-1">
              <span className="font-display text-2xl font-light tracking-tight text-text-primary">
                {label}
              </span>
              <span className="text-sm text-text-muted">{caption}</span>
            </div>
          </div>
        </GlowCard>
      ))}
    </div>
  );
}
