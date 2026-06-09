"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Back control that lives *inside* a screen's card, top-left, rather than
 * in the shell header floating above it. `-ml-2` pulls the chevron so its
 * optical left edge lines up with the card's content, and `-mt-1` nudges it
 * up toward the card's top padding. Used by the carded create-account steps
 * (auth + the two step-2 variants).
 */
export function CardBack({ href, onClick }: { href?: string; onClick?: () => void }) {
  const cls =
    "-ml-2 -mt-1 mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-body hover:bg-subtle transition-colors duration-fast ease-snap";
  const icon = <ChevronLeft size={20} strokeWidth={1.75} />;
  if (href) {
    return (
      <Link aria-label="Back" href={href} className={cls}>
        {icon}
      </Link>
    );
  }
  return (
    <button type="button" aria-label="Back" onClick={onClick} className={cls}>
      {icon}
    </button>
  );
}
