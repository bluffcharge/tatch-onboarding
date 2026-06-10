import { Suspense } from "react";
import { YourBusinessScreen } from "@/components/partner/YourBusinessScreen";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <YourBusinessScreen />
    </Suspense>
  );
}
