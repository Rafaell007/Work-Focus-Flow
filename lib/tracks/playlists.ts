export type Mood = "focus" | "relax" | "sleep" | "meditate";

export type Track = {
  title: string;
  tags: string;
  src: string;
};

export const playlists: Record<Mood, Track[]> = {
  focus: [
    {
      title: "Crystalline Drive",
      tags: "electronic · driving · sustained",
      src: "/tracks/focus/01.mp3",
    },
    {
      title: "Lattice Pulse",
      tags: "synthwave · steady · forward",
      src: "/tracks/focus/02.mp3",
    },
  ],
  relax: [
    {
      title: "Soft Lattice",
      tags: "ambient · airy · gentle",
      src: "/tracks/relax/01.mp3",
    },
    {
      title: "Slow Tide",
      tags: "downtempo · warm · open",
      src: "/tracks/relax/02.mp3",
    },
  ],
  sleep: [
    {
      title: "Pillow Drift",
      tags: "ambient · slow · deep",
      src: "/tracks/sleep/01.mp3",
    },
    {
      title: "Velvet Hours",
      tags: "drone · heavy · still",
      src: "/tracks/sleep/02.mp3",
    },
  ],
  meditate: [
    {
      title: "Lotus Field",
      tags: "drone · warm · spacious",
      src: "/tracks/meditate/01.mp3",
    },
    {
      title: "Breath Cathedral",
      tags: "drone · resonant · open",
      src: "/tracks/meditate/02.mp3",
    },
  ],
};

export const breakTrack: Track = {
  title: "Soft Interlude",
  tags: "rest · breathe · pause",
  src: "/tracks/break/01.mp3",
};
