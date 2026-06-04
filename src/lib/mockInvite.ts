/**
 * Mocked invite-token resolver. In production, /j/[token] would call the API
 * to resolve to an operator + BDM context; here we hand-wire a default and
 * let query params override it for demo branching.
 */

export type LinkedCompany = {
  id: string;
  name: string;
  address: { line1: string; city: string; state: string; zip: string };
  industry?: string;
  /** how many teammates already on Tatch under this company (excluding
   *  the invitee). Drives the "X teammates already onboard" copy on the
   *  Join variant. */
  teammateCount?: number;
};

export type InviteContext = {
  inviter: {
    firstName: string;
    fullName: string;
    title: string;
  };
  operator: {
    name: string;
    /** total teammates (excluding the inviter) that will be added on link */
    teammateCount: number;
  };
  /** the new partner's pre-filled handle from the invite — could be phone or email */
  invitedRecipient?: { kind: "phone" | "email"; value: string };
  /** is this person already a Tatch partner under a *different* operator? */
  isExistingPartner: boolean;
  /** Set when the operator linked this contact to an existing company on
   *  Tatch in their "+ Invite User" form. When present, the onboarding
   *  flow swaps P3 BusinessProfile for a JoinCompany confirmation — the
   *  invitee creates an account under the existing company instead of
   *  creating a new one. */
  linkedCompany?: LinkedCompany;
  /** Pre-fill from the operator's invite payload. Only fields the
   *  operator typed when sending the invite (name, email, phone). The
   *  partner-side forms hydrate from this on first render. */
  prefill?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    /** Free-form phone (any format the operator typed). Auth's
     *  PhoneInput normalizes it via libphonenumber. */
    phone?: string;
  };
};

export const defaultInvite: InviteContext = {
  inviter: {
    firstName: "Sara",
    fullName: "Sara Hernandez",
    title: "BDM",
  },
  operator: {
    name: "Summit Builders",
    teammateCount: 4,
  },
  invitedRecipient: { kind: "phone", value: "+1 (555) 014-2207" },
  isExistingPartner: false,
};

/** Mock catalog of "linkable" companies — companies already on Tatch
 *  that an operator can attach a new contact to via the "+ Invite User"
 *  form's Company field. In prod this is whatever the operator picks;
 *  here we hand-author a couple so the gallery can preview the Join
 *  variant deterministically.
 *  Key matches the `?co=<id>` URL query parameter. */
export const LINKABLE_COMPANIES: Record<string, LinkedCompany> = {
  northwind: {
    id: "northwind",
    name: "Northwind Roofing",
    address: {
      line1: "812 Hickory Way",
      city: "Sacramento",
      state: "CA",
      zip: "95817",
    },
    industry: "Roofing",
    teammateCount: 6,
  },
  "apex-electric": {
    id: "apex-electric",
    name: "Apex Electric",
    address: {
      line1: "55 Quarry Rd",
      city: "Folsom",
      state: "CA",
      zip: "95630",
    },
    industry: "Electrical",
    teammateCount: 3,
  },
};

export type ResolveInviteOpts = {
  existing?: boolean;
  /** Company id from the URL `?co=<id>` — when set and the id exists in
   *  LINKABLE_COMPANIES, the resolved invite carries `linkedCompany` and
   *  the onboarding flow swaps in the JoinCompany variant of P3. */
  co?: string | null;
  /** Operator-typed pre-fill for the downstream forms. */
  prefill?: InviteContext["prefill"];
};

/** Mock resolver: deterministically returns the default invite unless
 *  query flags override. */
export function resolveInvite(opts?: ResolveInviteOpts): InviteContext {
  const co = opts?.co ?? undefined;
  const linkedCompany = co ? LINKABLE_COMPANIES[co] : undefined;
  return {
    ...defaultInvite,
    isExistingPartner: !!opts?.existing,
    ...(linkedCompany ? { linkedCompany } : {}),
    ...(opts?.prefill ? { prefill: opts.prefill } : {}),
  };
}
