import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { Footprints } from "@phosphor-icons/react";
import { type MouseEvent, useEffect, useRef } from "react";
import { MARK_LABEL, type Surface } from "../../api/desk";
import {
  caseDone,
  issueLabel,
  NO_ISSUE,
  type PageGroup,
  type RunReading,
  shortId,
  valueOn,
  type WalkGroup,
} from "../model";
import { Pip } from "./marks";

export type RowPick = { row: string; extend: boolean };

const GROUP =
  "px-2 pt-3 pb-1 font-bold text-[0.65625rem] text-secondary-foreground uppercase tracking-wider";

/** What a case's current fails, blocks and skips say about themselves. */
function badgeOf(
  reading: RunReading,
  caseId: string,
  surface: Surface,
): string {
  const words = new Set<string>();
  for (const row of reading.rowsByCase.get(caseId) ?? []) {
    const mark = reading.current.get(row.key)?.[surface];
    if (!mark || !["fail", "blocked", "skipped"].includes(mark.value)) continue;
    if (mark.issue) words.add(issueLabel(mark.issue));
    else if (mark.triage === "bug") words.add(NO_ISSUE);
    else if (mark.triage) words.add(mark.triage);
  }
  return [...words].join(" · ");
}

export function RunList({
  reading,
  surface,
  walks,
  pages,
  shown,
  focusCase,
  focusRow,
  selected,
  pendingMarks,
  activeWalk,
  onCase,
  onRow,
  onWalk,
}: {
  reading: RunReading;
  surface: Surface;
  walks: WalkGroup[];
  pages: PageGroup[];
  shown: Set<string>;
  focusCase: string | null;
  focusRow: string | null;
  selected: Set<string>;
  pendingMarks: Set<string>;
  activeWalk: string | null;
  onCase: (id: string) => void;
  onRow: (pick: RowPick) => void;
  onWalk: (id: string) => void;
}) {
  const focused = useRef<HTMLButtonElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: the list follows the case in focus as it moves
  useEffect(() => {
    focused.current?.scrollIntoView?.({ block: "nearest" });
  }, [focusCase]);

  return (
    <nav
      aria-label="The run's cases"
      className="flex min-w-0 flex-col gap-0.5 rounded-(--radius-xl) border border-border bg-background-subtle p-1.5 text-[0.8125rem]"
      data-slot="run-list"
    >
      {walks.length > 0 ? <div className={GROUP}>Walks</div> : null}
      {walks.map((walk) => (
        <button
          aria-pressed={activeWalk === walk.id}
          className={cn(
            "flex flex-col gap-1 rounded-(--radius-lg) border border-border-strong border-dashed bg-background px-2.5 py-2 text-left outline-none transition-colors hover:border-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
            activeWalk === walk.id && "border-solid border-foreground",
          )}
          key={walk.id}
          onClick={() => onWalk(walk.id)}
          type="button"
        >
          <span className="flex items-center gap-2">
            <Footprints aria-hidden size={14} />
            <span className="min-w-0 flex-1 truncate font-semibold">
              {walk.title}
            </span>
          </span>
          <span className="flex flex-wrap items-center gap-1">
            {Array.from(
              { length: walk.steps },
              (_, step) => `${walk.id}#${step}`,
            ).map((key, step) => (
              <Pip key={key} value={step < walk.seen ? "pass" : "todo"} />
            ))}
          </span>
          <Text as="span" size="xs" tone="secondary">
            {walk.seen} of {walk.steps} observations
            {walk.open.length > 0
              ? ` · ${walk.open.map(shortId).join(", ")} still ${walk.open.length === 1 ? "has" : "have"} rows to do`
              : " · every case marked"}
          </Text>
        </button>
      ))}

      {pages.map((page) => (
        <div className="flex flex-col gap-0.5" key={page.key}>
          <div className={GROUP}>{page.title}</div>
          {page.sections.map((section) => {
            const visible = section.cases.filter((one) => shown.has(one.id));
            const done = section.cases.filter((one) =>
              caseDone(reading, one.id, surface),
            ).length;
            return (
              <div className="flex flex-col gap-0.5" key={section.key}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 border-border border-t px-2 pt-1.5 pb-1 font-semibold first:border-t-0">
                  <span className="min-w-0">{section.title}</span>
                  <Text as="span" size="xs" tone="secondary">
                    {visible.length === 0
                      ? "filtered out"
                      : `${section.cases.length} cases · ${done} done`}
                  </Text>
                </div>
                {visible.map((testCase) => {
                  const on = testCase.id === focusCase;
                  const rows = reading.rowsByCase.get(testCase.id) ?? [];
                  const badge = badgeOf(reading, testCase.id, surface);
                  return (
                    <div
                      className={cn(
                        "grid grid-cols-[2.6rem_minmax(0,1fr)_auto] items-center gap-x-2 rounded-(--radius-md) px-2 py-1.5 text-secondary-foreground",
                        on &&
                          "bg-background text-foreground shadow-[inset_3px_0_0_var(--foreground),0_0_0_1px_var(--border)]",
                      )}
                      data-case={testCase.id}
                      key={testCase.id}
                    >
                      <button
                        aria-current={on ? "true" : undefined}
                        className="col-span-2 grid grid-cols-subgrid items-center text-left outline-none focus-visible:underline"
                        onClick={() => onCase(testCase.id)}
                        ref={on ? focused : undefined}
                        type="button"
                      >
                        <span className="font-mono text-[0.6875rem] text-muted-foreground">
                          {shortId(testCase.id)}
                        </span>
                        <span className="truncate">{testCase.title}</span>
                      </button>
                      <span className="flex items-center gap-[3px]">
                        {rows.map((row) => {
                          const value = valueOn(reading, row, surface);
                          const mark = reading.current.get(row.key)?.[surface];
                          return (
                            <button
                              aria-label={`${shortId(testCase.id)} row ${row.index || 1}: ${MARK_LABEL[value]}${selected.has(row.key) ? ", selected" : ""}`}
                              className={cn(
                                "rounded-[3px] p-px outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                row.key === focusRow &&
                                  "ring-1 ring-foreground",
                                selected.has(row.key) &&
                                  "ring-2 ring-accent-foreground",
                              )}
                              key={row.key}
                              onClick={(event: MouseEvent) =>
                                onRow({
                                  row: row.key,
                                  extend: event.shiftKey || event.metaKey,
                                })
                              }
                              type="button"
                            >
                              <Pip
                                pending={
                                  mark ? pendingMarks.has(mark.id) : false
                                }
                                value={value}
                              />
                            </button>
                          );
                        })}
                      </span>
                      {badge ? (
                        <span className="col-start-2 col-end-4 truncate text-[0.6875rem] text-muted-foreground">
                          {badge}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
