import { SessionView } from "./SessionView";

const validMoods = ["focus", "relax", "sleep", "meditate"] as const;
type Mood = (typeof validMoods)[number];

const isValidMood = (value: string | undefined): value is Mood =>
  value !== undefined && (validMoods as readonly string[]).includes(value);

export default async function SessionPage({
  searchParams,
}: {
  searchParams: Promise<{ mood?: string }>;
}) {
  const params = await searchParams;
  const mood: Mood = isValidMood(params.mood) ? params.mood : "focus";
  return <SessionView mood={mood} />;
}
