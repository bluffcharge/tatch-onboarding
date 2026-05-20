/**
 * Mocked invite-token resolver. In production, /j/[token] would call the API
 * to resolve to an operator + BDM context; here we hand-wire a default and
 * let query params override it for demo branching.
 */

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

/** Mock resolver: deterministically returns the default invite unless query
 *  flags overrride. The "existing" flag flips the short-circuit copy on P7. */
export function resolveInvite(opts?: { existing?: boolean }): InviteContext {
  return {
    ...defaultInvite,
    isExistingPartner: !!opts?.existing,
  };
}
