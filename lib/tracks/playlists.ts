// Optional external base URL — when set (e.g. Supabase Storage public URL),
// every track src is prefixed with it. Empty/undefined → tracks served from
// /public/* by Next.js as static assets. Migration to external hosting is a
// one-line .env change once files are uploaded with the same folder layout.
const TRACKS_BASE = (
  process.env.NEXT_PUBLIC_TRACKS_BASE_URL || ""
).replace(/\/$/, "");

const trackUrl = (relPath: string) => `${TRACKS_BASE}${relPath}`;

export type Mood = "focus" | "relax" | "sleep" | "classic";

export type Track = {
  title: string;
  tags: string;
  src: string;
};

export const playlists: Record<Mood, Track[]> = {
  focus: [
    {
      title: "Focus Drift",
      tags: "ambient · sustained · electronic",
      src: trackUrl("/tracks/focus/focus-drift.mp3"),
    },
    {
      title: "Soft Focus Drift",
      tags: "ambient · gentle · steady",
      src: trackUrl("/tracks/focus/soft-focus-drift.mp3"),
    },
    {
      title: "Desk Lamp Drift",
      tags: "warm · low-key · sustained",
      src: trackUrl("/tracks/focus/desk-lamp-drift.mp3"),
    },
    {
      title: "Paper Horizon",
      tags: "open · airy · sustained",
      src: trackUrl("/tracks/focus/paper-horizon.mp3"),
    },
    {
      title: "Quiet Task Drift",
      tags: "calm · steady · light",
      src: trackUrl("/tracks/focus/quiet-task-drift.mp3"),
    },
    {
      title: "Soft Task Drift",
      tags: "soft · sustained · ambient",
      src: trackUrl("/tracks/focus/soft-task-drift.mp3"),
    },
  ],
  relax: [
    {
      title: "Ivory Focus",
      tags: "piano · gentle · sustained",
      src: trackUrl("/tracks/relax/ivory-focus.mp3"),
    },
    {
      title: "Driftwater Pause",
      tags: "soft · slow · meditative",
      src: trackUrl("/tracks/relax/driftwater-pause.mp3"),
    },
    {
      title: "Driftwood Halo",
      tags: "warm · open · gentle",
      src: trackUrl("/tracks/relax/driftwood-halo.mp3"),
    },
    {
      title: "Paper Moon Drift",
      tags: "airy · soft · evening",
      src: trackUrl("/tracks/relax/paper-moon-drift.mp3"),
    },
    {
      title: "Pillow Drift",
      tags: "gentle · low · comfortable",
      src: trackUrl("/tracks/relax/pillow-drift.mp3"),
    },
    {
      title: "Rain on Paper",
      tags: "rain · soft · texture",
      src: trackUrl("/tracks/relax/rain-on-paper.mp3"),
    },
    {
      title: "Slow Afternoon Drift",
      tags: "slow · warm · easy",
      src: trackUrl("/tracks/relax/slow-afternoon-drift.mp3"),
    },
    {
      title: "Slow Rain Tape",
      tags: "rain · vinyl-warm · slow",
      src: trackUrl("/tracks/relax/slow-rain-tape.mp3"),
    },
  ],
  sleep: [
    {
      title: "Brown Noise Nest",
      tags: "brown noise · warm · dense",
      src: trackUrl("/tracks/sleep/brown-noise-nest.mp3"),
    },
    {
      title: "Brown Tide Drift",
      tags: "brown noise · tidal · deep",
      src: trackUrl("/tracks/sleep/brown-tide-drift.mp3"),
    },
    {
      title: "Drift Under Brown",
      tags: "brown noise · enveloping · slow",
      src: trackUrl("/tracks/sleep/drift-under-brown.mp3"),
    },
    {
      title: "Forest Brown Noise",
      tags: "brown noise · forest · texture",
      src: trackUrl("/tracks/sleep/forest-brown-noise.mp3"),
    },
    {
      title: "Frozen Drift",
      tags: "cool · still · quiet",
      src: trackUrl("/tracks/sleep/frozen-drift.mp3"),
    },
    {
      title: "Pine Ember Drift",
      tags: "warm · pine · low",
      src: trackUrl("/tracks/sleep/pine-ember-drift.mp3"),
    },
    {
      title: "Rain Barrel Drift",
      tags: "rain · steady · soft",
      src: trackUrl("/tracks/sleep/rain-barrel-drift.mp3"),
    },
    {
      title: "Rain on Brown",
      tags: "rain · brown noise · deep",
      src: trackUrl("/tracks/sleep/rain-on-brown.mp3"),
    },
  ],
  classic: [
    {
      title: "Ivory Hall",
      tags: "piano · spacious · cinematic",
      src: trackUrl("/tracks/classic/ivory-hall.mp3"),
    },
    {
      title: "Ivory Pulse",
      tags: "piano · driving · steady",
      src: trackUrl("/tracks/classic/ivory-pulse.mp3"),
    },
    {
      title: "Ivory Study",
      tags: "piano · contemplative · soft",
      src: trackUrl("/tracks/classic/ivory-study.mp3"),
    },
    {
      title: "Marble Keys",
      tags: "piano · cool · precise",
      src: trackUrl("/tracks/classic/marble-keys.mp3"),
    },
    {
      title: "Midnight Etude",
      tags: "piano · moody · slow",
      src: trackUrl("/tracks/classic/midnight-etude.mp3"),
    },
    {
      title: "Moonlit Keys",
      tags: "piano · soft · evening",
      src: trackUrl("/tracks/classic/moonlit-keys.mp3"),
    },
  ],
};

export const breakTrack: Track = {
  title: "Soft Interlude",
  tags: "rest · breathe · pause",
  src: trackUrl("/tracks/break/01.mp3"),
};
