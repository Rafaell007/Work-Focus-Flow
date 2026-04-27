import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { MoodPicker } from "./MoodPicker";

export default function OnboardingPage() {
  return (
    <>
      <AnimatedBackground />
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-16">
        <MoodPicker />
      </main>
    </>
  );
}
