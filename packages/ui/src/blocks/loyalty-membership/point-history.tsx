import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ShoppingBag } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import { PointHistoryCard } from "./point-history-card";
import {
  PointHistorySummary,
  type PointHistorySummaryCopy,
} from "./point-history-summary";
import type { LedgerEntry, PointsTotals } from "./types";

/** The filter tabs, in the order they read. */
type PointHistoryFilter = "all" | "earned" | "used" | "pending";

const FILTERS: readonly PointHistoryFilter[] = [
  "all",
  "earned",
  "used",
  "pending",
];

/** The words the list says, whatever the member did. */
type PointHistoryCopy = {
  /** Accessible name of the list. */
  label: string;
  /** The three figures over the list — Earned, Used, Pending. */
  summary: PointHistorySummaryCopy;
  /** The filter tabs' labels, keyed the way `PointHistoryFilter` is. */
  filters: Record<PointHistoryFilter, string>;
  /** The line a filter shows when it matches nothing, keyed the same way. */
  filteredEmpty: Record<PointHistoryFilter, string>;
  /** The pending card's words — its title, the rule it states, and the
   *  unit its total reads. */
  pending: { title: string; body: string; points: string };
};

type PointHistoryProps = {
  copy: PointHistoryCopy;
  state: AsyncState<readonly LedgerEntry[]>;
  /** The stat box over the list. Absent, no box draws. */
  summary?: PointsTotals;
  className?: string;
};

/**
 * The member's own ledger, in the member's own terms: the totals on top,
 * filter tabs beneath, what is still on the way under Pending, and the
 * settled entries grouped by month. Each entry arrives already named — what
 * an operator wrote on it, its retry key, and how it was priced internally
 * never reach this surface, so no prop can carry them.
 */
function PointHistory({ copy, state, summary, className }: PointHistoryProps) {
  const [filter, setFilter] = useState<PointHistoryFilter>("all");
  const entries = state.status === "ready" ? state.data : [];
  const pending = entries.filter((entry) => entry.pending);
  const counts: Record<PointHistoryFilter, number> = {
    all: entries.length,
    earned: entries.filter((e) => e.track === "earned" && !e.pending).length,
    used: entries.filter((e) => e.track === "used" && !e.pending).length,
    pending: pending.length,
  };
  const settled = entries.filter(
    (entry) => !entry.pending && (filter === "all" || entry.track === filter),
  );
  const showPending =
    pending.length > 0 && (filter === "all" || filter === "pending");

  /* Months in first-seen order; consecutive entries of one month share a card. */
  const groups: { key: string; month?: string; items: LedgerEntry[] }[] = [];
  for (const entry of settled) {
    const key = entry.month ?? "";
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(entry);
    else
      groups.push({
        key: key || `ungrouped-${entry.id}`,
        month: entry.month,
        items: [entry],
      });
  }

  const rootRef = useRef<HTMLDivElement>(null);
  const ready = state.status === "ready";

  /* Enter: the sections and cards rise in, staggered — spatial consistency,
   * not decoration. Reduced motion drops the rise, keeps the fade. */
  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const panel = rootRef.current.querySelector("#point-history-panel");
    const targets = [
      ...rootRef.current.children,
      ...(panel ? [...panel.children] : []),
    ];
    for (const [i, el] of targets.entries()) {
      el.animate(
        [
          { opacity: 0, transform: reduce ? "none" : "translateY(8px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          delay: i * 50,
          duration: 220,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "backwards",
        },
      );
    }
  }, [ready]);

  return (
    <VStack
      className={cn("gap-8", className)}
      data-slot="point-history"
      gap="none"
    >
      <div className="contents" ref={rootRef}>
        {summary ? (
          <PointHistorySummary copy={copy.summary} totals={summary} />
        ) : null}

        {state.status === "loading" ? (
          <VStack className="gap-3" data-slot="point-history-loading">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </VStack>
        ) : null}
        {state.status === "empty" ? (
          <EmptyState
            actions={
              state.action ? (
                <Button
                  size="md"
                  disabled={state.action.pending}
                  onClick={state.action.onAction}
                  type="button"
                  variant="secondary"
                >
                  {state.action.label}
                </Button>
              ) : undefined
            }
            data-slot="point-history-empty"
            description={state.description}
            icon={<ShoppingBag aria-hidden size={24} weight="regular" />}
            title={state.message}
          />
        ) : null}
        {state.status === "error" ? (
          <AsyncMessage
            action={state.action}
            message={state.message}
            slot="point-history-error"
          />
        ) : null}

        {state.status === "ready" ? (
          <Tabs
            className="gap-6"
            data-slot="point-history-filters"
            onValueChange={(value) => setFilter(value as PointHistoryFilter)}
            value={filter}
          >
            <TabsList
              aria-label={copy.label}
              className="w-full justify-start gap-4 overflow-x-auto overflow-y-hidden border-b border-border sm:gap-6"
              variant="list"
            >
              {FILTERS.filter((name) => name === "all" || counts[name] > 0).map(
                (name) => (
                  <TabsTrigger
                    aria-controls="point-history-panel"
                    id={`point-history-tab-${name}`}
                    key={name}
                    value={name}
                  >
                    {copy.filters[name]}
                    <Badge data-slot="point-history-count">
                      {counts[name]}
                    </Badge>
                  </TabsTrigger>
                ),
              )}
            </TabsList>

            <div
              aria-labelledby={`point-history-tab-${filter}`}
              className="flex flex-col gap-6"
              id="point-history-panel"
              role="tabpanel"
            >
              {showPending ? (
                <PointHistoryCard
                  entries={pending}
                  header={{
                    title: `${copy.pending.title} ${pending.reduce((sum, entry) => sum + entry.delta, 0).toLocaleString("en-HK")} ${copy.pending.points}`,
                    description: copy.pending.body,
                  }}
                  label={copy.label}
                  pending
                  points={copy.pending.points}
                />
              ) : null}

              {groups.map((group) => (
                <PointHistoryCard
                  entries={group.items}
                  key={`${group.key}-${group.items[0].id}`}
                  label={copy.label}
                  month={group.month}
                  points={copy.pending.points}
                />
              ))}

              {!showPending && groups.length === 0 ? (
                <Text size="sm" tone="secondary">
                  {copy.filteredEmpty[filter]}
                </Text>
              ) : null}
            </div>
          </Tabs>
        ) : null}
      </div>
    </VStack>
  );
}

export type { PointHistoryCopy, PointHistoryFilter, PointHistoryProps };
export { PointHistory };
