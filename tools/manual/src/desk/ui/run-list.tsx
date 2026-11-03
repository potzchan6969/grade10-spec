import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown, Footprints, MagnifyingGlass } from "@phosphor-icons/react";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { MARK_LABEL, SURFACE_LABEL, type Surface } from "../../api/desk";
import {
  caseDone,
  caseLabels,
  issueLabel,
  NO_ISSUE,
  outstanding,
  type PageGroup,
  plural,
  type RunReading,
  valueOn,
  type WalkGroup,
} from "../model";
import { Pip } from "./marks";

export type RowPick = { row: string; extend: boolean };

/** The list's search box, which `/` focuses. */
export const DESK_SEARCH_ID = "desk-case-search";

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

/** A section's progress on the tester's surface, and the other surface a
 * person walks wherever it has more left to do. */
export function sectionProgress(
  reading: RunReading,
  caseIds: string[],
  surface: Surface,
): string {
  const done = caseIds.filter((id) => caseDone(reading, id, surface)).length;
  const left = outstanding(reading, caseIds);
  const mine = caseIds.length - done;
  const others = (["web", "mobile"] as const)
    .filter((one) => one !== surface && left[one] > 0 && left[one] !== mine)
    .map((one) => `${SURFACE_LABEL[one]}: ${left[one]} to do`);
  return [plural(caseIds.length, "case"), `${done} done`, ...others].join(
    " · ",
  );
}

/** Moves only the list's own scroll to keep the case in focus in sight;
 * the page itself never moves. */
function keepInSight(item: HTMLElement | null) {
  const box = item?.closest<HTMLElement>("[data-desk-scroll]");
  if (!item || !box) return;
  const at = item.getBoundingClientRect();
  const view = box.getBoundingClientRect();
  if (at.top < view.top) box.scrollTop -= view.top - at.top;
  else if (at.bottom > view.bottom) box.scrollTop += at.bottom - view.bottom;
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
  query,
  onQuery,
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
  query: string;
  onQuery: (query: string) => void;
  onCase: (id: string) => void;
  onRow: (pick: RowPick) => void;
  onWalk: (id: string) => void;
}) {
  const focused = useRef<HTMLDivElement>(null);
  const labels = useMemo(
    () => caseLabels(reading.view.spec.cases),
    [reading.view.spec.cases],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: the list follows the case in focus as it moves
  useEffect(() => {
    keepInSight(focused.current);
  }, [focusCase]);

  return (
    <nav
      aria-label="The run's cases"
      className="flex min-w-0 flex-col gap-0.5 rounded-(--radius-xl) border border-border bg-background-subtle p-1.5 text-[0.8125rem]"
      data-slot="run-list"
    >
      <label className="flex h-8 items-center gap-1.5 rounded-(--radius-md) border border-border bg-input px-2 focus-within:border-border-strong focus-within:ring-1 focus-within:ring-ring">
        <span className="shrink-0 text-muted-foreground">
          <MagnifyingGlass aria-hidden size={14} />
        </span>
        <input
          aria-keyshortcuts="/"
          aria-label="Find a case by id, marker or title"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
          id={DESK_SEARCH_ID}
          onChange={(event) => onQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && query) {
              event.preventDefault();
              event.stopPropagation();
              onQuery("");
            }
          }}
          placeholder="Find a case"
          type="search"
          value={query}
        />
        <kbd className="rounded-(--radius-sm) border border-border px-1 font-mono text-[0.625rem] text-muted-foreground max-lg:hidden">
          /
        </kbd>
      </label>

      {walks.length > 0 ? (
        <div className={GROUP}>{plural(walks.length, "walk")}</div>
      ) : null}
      {walks.map((walk) => (
        <WalkLine
          active={activeWalk === walk.id}
          key={walk.id}
          labels={labels}
          onWalk={onWalk}
          walk={walk}
        />
      ))}

      {pages.map((page) => (
        <div className="flex flex-col gap-0.5" key={page.key}>
          <div className={GROUP}>{page.title}</div>
          {page.sections.map((section) => {
            const visible = section.cases.filter((one) => shown.has(one.id));
            return (
              <div className="flex flex-col gap-0.5" key={section.key}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 border-border border-t px-2 pt-1.5 pb-1 font-semibold first:border-t-0">
                  <span className="min-w-0">{section.title}</span>
                  <Text as="span" size="xs" tone="secondary">
                    {visible.length === 0
                      ? "filtered out"
                      : sectionProgress(
                          reading,
                          section.cases.map((one) => one.id),
                          surface,
                        )}
                  </Text>
                </div>
                {visible.map((testCase) => {
                  const on = testCase.id === focusCase;
                  const rows = reading.rowsByCase.get(testCase.id) ?? [];
                  const badge = badgeOf(reading, testCase.id, surface);
                  const label = labels.get(testCase.id) ?? testCase.id;
                  return (
                    <div
                      className={cn(
                        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 rounded-(--radius-md) px-2 py-1.5 text-secondary-foreground",
                        on &&
                          "bg-background text-foreground shadow-[inset_3px_0_0_var(--foreground),0_0_0_1px_var(--border)]",
                      )}
                      data-case={testCase.id}
                      key={testCase.id}
                      ref={on ? focused : undefined}
                    >
                      <button
                        aria-current={on ? "true" : undefined}
                        className="col-span-2 grid grid-cols-subgrid items-center text-left outline-none focus-visible:underline"
                        onClick={() => onCase(testCase.id)}
                        title={testCase.id}
                        type="button"
                      >
                        <span className="min-w-[2.6rem] font-mono text-[0.6875rem] text-muted-foreground">
                          {label}
                        </span>
                        <span className="truncate">{testCase.title}</span>
                      </button>
                      <span className="flex items-center gap-[3px]">
                        {rows.map((row) => {
                          const value = valueOn(reading, row, surface);
                          const mark = reading.current.get(row.key)?.[surface];
                          return (
                            <button
                              aria-label={`${label} row ${row.index || 1}: ${MARK_LABEL[value]}${selected.has(row.key) ? ", selected" : ""}`}
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

/** A walk in one line; its observations and the cases left open below it
 * on demand. */
function WalkLine({
  walk,
  active,
  labels,
  onWalk,
}: {
  walk: WalkGroup;
  active: boolean;
  labels: Map<string, string>;
  onWalk: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col rounded-(--radius-md) border border-transparent",
        (active || open) && "border-border-strong border-dashed bg-background",
        active && "border-solid border-foreground",
      )}
      data-walk={walk.id}
    >
      <div className="flex items-center gap-1">
        <button
          aria-pressed={active}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-(--radius-md) px-2 py-1 text-left outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onWalk(walk.id)}
          type="button"
        >
          <Footprints aria-hidden size={14} />
          <span className="min-w-0 flex-1 truncate font-semibold">
            {walk.title}
          </span>
          <Text as="span" className="shrink-0" size="xs" tone="secondary">
            {walk.seen}/{walk.steps}
          </Text>
        </button>
        <button
          aria-expanded={open}
          aria-label={`${open ? "Hide" : "Show"} ${walk.title}'s progress`}
          className="rounded-(--radius-sm) p-1 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen((held) => !held)}
          type="button"
        >
          <span
            className={cn("block transition-transform", open && "rotate-180")}
          >
            <CaretDown aria-hidden size={12} />
          </span>
        </button>
      </div>
      {open ? (
        <div className="flex flex-col gap-1 px-2 pb-2">
          <span className="flex flex-wrap items-center gap-1">
            {Array.from(
              { length: walk.steps },
              (_, step) => `${walk.id}#${step}`,
            ).map((key, step) => (
              <Pip key={key} value={step < walk.seen ? "pass" : "todo"} />
            ))}
          </span>
          <Text as="span" size="xs" tone="secondary">
            {walk.seen} of {plural(walk.steps, "observation")}
            {walk.open.length > 0
              ? ` · ${walk.open.map((id) => labels.get(id) ?? id).join(", ")} still ${walk.open.length === 1 ? "has" : "have"} rows to do`
              : " · every case marked"}
          </Text>
        </div>
      ) : null}
    </div>
  );
}
