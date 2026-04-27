type Mood = "focus" | "relax" | "sleep" | "meditate";

type Props = {
  mood: Mood;
  className?: string;
};

export function MoodIllustration({ mood, className }: Props) {
  switch (mood) {
    case "focus":
      return <FocusIllustration className={className} />;
    case "relax":
      return <RelaxIllustration className={className} />;
    case "sleep":
      return <SleepIllustration className={className} />;
    case "meditate":
      return <MeditateIllustration className={className} />;
  }
}

const baseSvgProps = {
  viewBox: "0 0 160 160",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function GlowDisc() {
  return (
    <ellipse
      cx="80"
      cy="128"
      rx="55"
      ry="6"
      fill="currentColor"
      opacity="0.28"
      stroke="none"
    />
  );
}

function FocusIllustration({ className }: { className?: string }) {
  return (
    <svg {...baseSvgProps} className={className} aria-hidden="true">
      <GlowDisc />
      {/* desk top — isometric parallelogram */}
      <path
        d="M 28 100 L 80 84 L 132 100 L 80 116 Z"
        fill="currentColor"
        fillOpacity="0.07"
      />
      <path d="M 28 100 L 80 84 L 132 100 L 80 116 Z" />
      {/* monitor stand */}
      <line x1="80" y1="86" x2="80" y2="68" />
      {/* monitor frame */}
      <rect
        x="56"
        y="32"
        width="48"
        height="34"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* monitor inner screen — soft glow plate */}
      <rect
        x="60"
        y="36"
        width="40"
        height="26"
        rx="1.5"
        fill="currentColor"
        fillOpacity="0.32"
        stroke="none"
      />
      {/* notebook on desk */}
      <path
        d="M 96 92 L 116 86 L 120 90 L 100 96 Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M 96 92 L 116 86 L 120 90 L 100 96 Z" />
      {/* small mug */}
      <path d="M 40 96 L 50 93 L 50 100 L 40 102 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M 40 96 L 50 93 L 50 100 L 40 102 Z" />
    </svg>
  );
}

function RelaxIllustration({ className }: { className?: string }) {
  return (
    <svg {...baseSvgProps} className={className} aria-hidden="true">
      <GlowDisc />
      {/* horizon line — soft curve */}
      <path d="M 22 116 Q 80 108 138 116" />
      {/* large leaf body */}
      <path
        d="M 80 38 Q 48 60 56 102 Q 80 100 96 80 Q 100 58 80 38 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M 80 38 Q 48 60 56 102 Q 80 100 96 80 Q 100 58 80 38 Z" />
      {/* leaf central vein */}
      <path d="M 80 38 Q 76 70 64 98" />
      {/* leaf branch veins */}
      <path d="M 78 56 Q 70 60 64 64" strokeOpacity="0.5" />
      <path d="M 76 76 Q 68 80 60 84" strokeOpacity="0.5" />
      {/* small accent leaf */}
      <path
        d="M 108 92 Q 116 84 126 90 Q 120 100 108 92 Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M 108 92 Q 116 84 126 90 Q 120 100 108 92 Z" />
    </svg>
  );
}

function SleepIllustration({ className }: { className?: string }) {
  return (
    <svg {...baseSvgProps} className={className} aria-hidden="true">
      <GlowDisc />
      {/* horizon */}
      <path d="M 20 118 L 140 118" strokeOpacity="0.6" />
      {/* mountains silhouette */}
      <path
        d="M 22 118 L 46 90 L 64 108 L 86 78 L 110 106 L 138 118 Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path d="M 22 118 L 46 90 L 64 108 L 86 78 L 110 106 L 138 118" />
      {/* crescent moon — outer arc minus inner arc to form crescent */}
      <path
        d="M 112 38 A 18 18 0 1 0 112 74 A 14 14 0 1 1 112 38 Z"
        fill="currentColor"
        fillOpacity="0.55"
        stroke="none"
      />
      {/* tiny stars */}
      <circle cx="44" cy="42" r="1.4" fill="currentColor" opacity="0.7" stroke="none" />
      <circle cx="62" cy="32" r="1" fill="currentColor" opacity="0.5" stroke="none" />
      <circle cx="34" cy="62" r="1.1" fill="currentColor" opacity="0.45" stroke="none" />
      <circle cx="78" cy="48" r="0.9" fill="currentColor" opacity="0.4" stroke="none" />
    </svg>
  );
}

function MeditateIllustration({ className }: { className?: string }) {
  return (
    <svg {...baseSvgProps} className={className} aria-hidden="true">
      <GlowDisc />
      {/* mat — flat ellipse */}
      <ellipse
        cx="80"
        cy="118"
        rx="46"
        ry="6"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <ellipse cx="80" cy="118" rx="46" ry="6" />
      {/* outer ring — breath / aura */}
      <circle cx="80" cy="76" r="38" strokeOpacity="0.25" />
      <circle cx="80" cy="76" r="28" strokeOpacity="0.4" />
      {/* lotus center */}
      <circle
        cx="80"
        cy="76"
        r="7"
        fill="currentColor"
        fillOpacity="0.45"
        stroke="none"
      />
      {/* lotus petals — 6 radiating */}
      <path d="M 80 76 Q 80 56 80 38" />
      <path d="M 80 76 Q 95 64 108 52" />
      <path d="M 80 76 Q 65 64 52 52" />
      <path d="M 80 76 Q 100 80 118 88" />
      <path d="M 80 76 Q 60 80 42 88" />
      <path d="M 80 76 Q 80 96 80 110" strokeOpacity="0.5" />
    </svg>
  );
}
