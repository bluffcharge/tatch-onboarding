"use client";

import { ChevronsLeft, FileText } from "lucide-react";
import type { RequirementContext } from "@/lib/requirementContext";

type Props = {
  context: RequirementContext | null;
  routeTitle: string;
  collapsed: boolean;
  onToggle: () => void;
};

export function RequirementsRail({ context, routeTitle, collapsed, onToggle }: Props) {
  if (collapsed) {
    return (
      <aside className="flex w-9 shrink-0 flex-col items-center border-r border-border-subtle bg-[color:var(--surface-stage)] py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open requirements rail"
          title="Show spec context"
          className="grid h-9 w-9 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <FileText size={14} strokeWidth={1.75} />
        </button>
      </aside>
    );
  }
  return (
    <aside className="flex w-[260px] shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-[color:var(--surface-stage)]">
      <header className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText size={13} strokeWidth={1.75} className="text-ink-caption" />
          <p className="t-mono-label">From the spec</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse requirements rail"
          title="Hide"
          className="grid h-7 w-7 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <ChevronsLeft size={14} strokeWidth={1.75} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!context ? (
          <p className="t-caption">No spec notes for this screen yet.</p>
        ) : (
          <div className="space-y-5">
            <section>
              <p className="t-mono-label mb-1.5">Screen</p>
              <p className="text-[13px] font-semibold leading-snug text-ink-title">
                {routeTitle}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-subtitle">
                {context.oneLine}
              </p>
            </section>

            <Divider />

            <section>
              <p className="t-mono-label mb-2">Flows</p>
              <ul className="space-y-2">
                {context.flowRefs.map((f, i) => (
                  <li key={i} className="text-[12.5px] leading-snug">
                    <span className="font-semibold text-ink-title">{f.flow}</span>
                    {f.step && (
                      <>
                        <br />
                        <span className="text-ink-caption">↳ {f.step}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            <section>
              <p className="t-mono-label mb-2">User stories</p>
              <ul className="flex flex-wrap gap-1.5">
                {context.storyRefs.map((s) => (
                  <li
                    key={s}
                    className="inline-flex h-6 items-center rounded-pill border border-border bg-card px-2 text-[11.5px] font-semibold text-ink-body"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            <section>
              <p className="t-mono-label mb-2">Key requirements</p>
              <ul className="space-y-2">
                {context.reqs.map((r, i) => (
                  <li
                    key={i}
                    className="relative pl-3.5 text-[12.5px] leading-relaxed text-ink-body before:absolute before:left-0 before:top-[7px] before:h-1.5 before:w-1.5 before:rounded-pill before:bg-royal-400"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}

function Divider() {
  return <div className="border-t border-border-subtle" aria-hidden="true" />;
}
