"use client";

import { useEffect } from "react";
import type { InviteContext } from "./mockInvite";
import { persistInviteToSession } from "./useInvite";

/** Side-effect-only client component that writes the server-resolved
 *  invite into sessionStorage on mount. Render this once near the
 *  entry point (currently `/j/[token]`) so that downstream onboarding
 *  screens — which live on different URLs without the invite query
 *  params — pick up the same context via `useInvite()`.
 *
 *  Renders nothing. */
export function InviteSessionWriter({ invite }: { invite: InviteContext }) {
  useEffect(() => {
    persistInviteToSession(invite);
  }, [invite]);
  return null;
}
