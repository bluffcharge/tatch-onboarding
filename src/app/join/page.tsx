import { Suspense } from "react";
import { CodeEntryScreen } from "@/components/onboarding/CodeEntryScreen";

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <CodeEntryScreen />
    </Suspense>
  );
}
