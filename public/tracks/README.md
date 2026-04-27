# Track staging — drop your Suno MP3s here

Bulk-drop area for generated tracks. Same structure that will mirror to
Supabase Storage in stage 2 (no path changes in code needed at migration).

## Folders

| Folder       | What goes in                                            |
| ------------ | ------------------------------------------------------- |
| `focus/`     | Deep-work, study, sustained-attention tracks            |
| `relax/`     | Soft reading, light tasks, evening wind-down            |
| `sleep/`     | Slow, deep, no-melody ambient — fade-out friendly       |
| `meditate/`  | Drones, warm pads, breathwork-friendly                  |
| `break/`     | Pomodoro-break interludes — short, calm, "rest" feel    |

## Naming

Either of these works — pick one and stay consistent inside a folder:

- `01.mp3`, `02.mp3`, `03.mp3` … (numeric, simplest, mirrors current state)
- `crystalline-drive.mp3`, `lattice-pulse.mp3` … (slug, easier to scan in
  the file listing — but always `lowercase-with-dashes`, no spaces)

## After you drop a batch

Tell me how many tracks landed in each folder + a one-line description for
each (mood vibe / tempo / instrumentation). I'll update
`lib/tracks/playlists.ts` so the new tracks show up in the carousel and the
upcoming AI-Curate flow has metadata to pick from.

## Stage 2 — Supabase migration

When the folder gets heavy (~20+ tracks or >50MB), I'll spin up a Supabase
Storage public bucket called `tracks` with the same subfolder layout, do a
bulk upload, swap `src` URLs in `playlists.ts`, and add
`audio.crossOrigin = "anonymous"` in `useAudioPlayer.ts` (required for the
Web Audio analyser when audio is cross-origin).

Until then: anything dropped here is served as a static asset by Next.js
under `/tracks/<folder>/<file>.mp3`.
