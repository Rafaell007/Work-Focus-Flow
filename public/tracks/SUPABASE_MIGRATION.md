# Supabase Storage migration — when you're ready

The codebase is wired so the move from `/public/tracks` to Supabase is a
**one-line `.env` change**, no code edits. Here's the playbook.

## What gets migrated

| Asset                       | Path under Supabase bucket             |
| --------------------------- | -------------------------------------- |
| `public/tracks/focus/*`     | `tracks/focus/*`                       |
| `public/tracks/relax/*`     | `tracks/relax/*`                       |
| `public/tracks/sleep/*`     | `tracks/sleep/*`                       |
| `public/tracks/classic/*`   | `tracks/classic/*`                     |
| `public/tracks/break/*`     | `tracks/break/*`                       |

**Not migrated** (small assets, stay bundled):
- `public/sounds/click.mp3` — 160KB tactile click
- `public/sounds/nature/*` — 35MB nature sound loops, used by the in-page modal

You can move these too if you want everything off the deploy, but the speed
gain is small and the upload effort isn't worth it for these.

## Steps

### 1. Create Supabase project (free)

1. Go to https://supabase.com → Sign up with GitHub.
2. New project → name it (e.g. `focus-flow`), pick a region close to you.
3. Wait ~1 min for provisioning.

### 2. Create a public bucket

1. Dashboard → **Storage** → **New bucket**.
2. Name: `tracks`.
3. **Toggle "Public bucket" ON**. Critical — without this the URLs 403.
4. Save.

### 3. Upload files (preserving folder structure)

The dashboard supports drag-and-drop folders. From your local machine:

```
public/tracks/break    → drag onto bucket → creates tracks/break/
public/tracks/focus    → drag onto bucket → creates tracks/focus/
public/tracks/relax    → drag onto bucket → creates tracks/relax/
public/tracks/sleep    → drag onto bucket → creates tracks/sleep/
public/tracks/classic  → drag onto bucket → creates tracks/classic/
```

(For larger libraries, use the Supabase CLI:
`supabase storage cp --recursive ./public/tracks ss://tracks/` — but the
dashboard handles ~100MB fine.)

### 4. Grab your project URL

Dashboard → **Project Settings** → **API** → copy **Project URL**, e.g.
`https://abcdefghij.supabase.co`.

### 5. Set the env var

Create `.env.local` in the project root (gitignored) with:

```
NEXT_PUBLIC_TRACKS_BASE_URL=https://abcdefghij.supabase.co/storage/v1/object/public
```

Note: **no trailing slash**, and the path includes `/storage/v1/object/public`
(that's how Supabase exposes public objects).

For Vercel: add the same variable under **Project Settings → Environment
Variables**, scope it to **Production / Preview / Development**.

### 6. Verify

Restart `next dev`. Open Network tab while playing a track — the request URL
should be `https://<project>.supabase.co/storage/v1/object/public/tracks/focus/focus-drift.mp3`,
not `/tracks/focus/focus-drift.mp3`.

The Web Audio analyser keeps working because `useAudioPlayer` already sets
`audio.crossOrigin = "anonymous"` (Supabase Storage sends the right CORS
headers by default).

### 7. Clean up `public/tracks/`

Once the Supabase URLs work in dev and prod, you can delete `public/tracks/*`
(except `README.md` and `SUPABASE_MIGRATION.md` if you want to keep them).
Repo size drops by ~110MB.

## Rollback

If something breaks: just unset `NEXT_PUBLIC_TRACKS_BASE_URL` (or set it to
empty string) and the app falls back to `/public/tracks/*`. Zero code change.

## Free tier notes

- Storage: 1 GB included — current library is ~110MB, room for ~10× growth.
- Egress: 5 GB/month — enough for a portfolio demo getting steady traffic.
- If you hit limits, add Cloudflare in front of the Supabase URL or upgrade
  to Pro ($25/mo).
