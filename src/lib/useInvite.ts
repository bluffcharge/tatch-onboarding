"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { resolveInvite, type InviteContext } from "./mockInvite";

/* Invite session — survives across the partner-side flow without forcing
   every router.push() to forward query params. Production would resolve
   this from the token row in the DB; here we cache whatever the entry
   URL carried so subsequent screens (Auth → Business → Discovery → …)
   can read the same context.

   Priority on each screen:
     1. URL query params on the current screen  (gallery + entry routes)
     2. sessionStorage from earlier in the flow (subsequent screens)
     3. defaultInvite                            (everything else)

   When URL params are present they're persisted to sessionStorage so
   the rest of the flow picks them up without per-push forwarding. The
   first render uses URL params synchronously (no flash on direct
   gallery visits); the sessionStorage fallback resolves in a useEffect
   on mid-flow navigations. */

const KEY = "tatch-invite-session";

type SessionData = {
  co?: string;
  existing?: boolean;
  prefill?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
};

function sessionFromSearchParams(sp: ReadonlyURLSearchParams): SessionData {
  const co = sp.get("co") ?? undefined;
  const existing = sp.get("existing") === "1" ? true : undefined;
  const prefill = {
    firstName: sp.get("fn") ?? undefined,
    lastName: sp.get("ln") ?? undefined,
    email: sp.get("email") ?? undefined,
    phone: sp.get("phone") ?? undefined,
  };
  const hasPrefill = Object.values(prefill).some(Boolean);
  return {
    ...(co ? { co } : {}),
    ...(existing ? { existing } : {}),
    ...(hasPrefill ? { prefill } : {}),
  };
}

function urlHasInvite(sp: ReadonlyURLSearchParams): boolean {
  return Object.keys(sessionFromSearchParams(sp)).length > 0;
}

function readSession(): SessionData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as SessionData;
  } catch {
    return {};
  }
}

function writeSession(data: SessionData) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(data));
}

export function clearInviteSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

/** Resolves the current invite context. Reads URL query params (`?co`,
 *  `?existing=1`, `?fn`, `?ln`, `?email`, `?phone`) on the current
 *  route, persists them to sessionStorage so later screens pick them
 *  up, and falls back to the stored session + default invite when no
 *  URL params are present. */
export function useInvite(): InviteContext {
  const sp = useSearchParams();
  // Synchronous URL read for the initial render — no flash on direct
  // gallery visits like `/onboarding/business?co=northwind`.
  const initial = useMemo(() => {
    const s = sessionFromSearchParams(sp);
    return resolveInvite(s);
  }, [sp]);
  const [invite, setInvite] = useState<InviteContext>(initial);

  useEffect(() => {
    if (urlHasInvite(sp)) {
      const s = sessionFromSearchParams(sp);
      writeSession(s);
      setInvite(resolveInvite(s));
    } else {
      const s = readSession();
      setInvite(resolveInvite(s));
    }
  }, [sp]);

  return invite;
}

/** Imperatively write a resolved invite into sessionStorage. Used by
 *  the entry-point routes (e.g. `/j/[token]`) so that an invite the
 *  server resolved on the URL also gets picked up by downstream screens
 *  even though they're on different URLs without query params. */
export function persistInviteToSession(invite: InviteContext) {
  writeSession({
    co: invite.linkedCompany?.id,
    existing: invite.isExistingPartner || undefined,
    prefill: invite.prefill,
  });
}
