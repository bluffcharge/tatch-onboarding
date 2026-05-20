import { Suspense } from "react";
import { AuthScreen } from "@/components/onboarding/AuthScreen";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen />
    </Suspense>
  );
}
