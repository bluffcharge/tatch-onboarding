import { Suspense } from "react";
import { SignInScreen } from "@/components/partner/SignInScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignInScreen />
    </Suspense>
  );
}
