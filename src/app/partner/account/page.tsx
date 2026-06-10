import { Suspense } from "react";
import { CreateLoginScreen } from "@/components/partner/CreateLoginScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CreateLoginScreen />
    </Suspense>
  );
}
