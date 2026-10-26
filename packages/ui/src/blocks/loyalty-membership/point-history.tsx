import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useState } from "react";
import type { AsyncState } from "../shared/async";
import { AsyncMessage } from "../shared/async-message";
import { PointHistoryCard } from "./point-history-card";
import { PointHistorySummary, type PointHistorySummaryCopy } from "./point-history-summary";
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

  return (
    <VStack className={className} data-slot="point-history" gap="md">
      {summary ? <PointHistorySummary copy={copy.summary} totals={summary} /> : null}

      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="point-history-loading">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </VStack>
      ) : null}
      {state.status === "empty" || state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot={`point-history-${state.status}`}
        />
      ) : null}

      {state.status === "ready" ? (
        <Tabs
          data-slot="point-history-filters"
          onValueChange={(value) => setFilter(value as PointHistoryFilter)}
          value={filter}
        >
          <TabsList aria-label={copy.label} variant="list">
            {FILTERS.map((name) => (
              <TabsTrigger
                aria-controls="point-history-panel"
                id={`point-history-tab-${name}`}
                key={name}
                value={name}
              >
                {copy.filters[name]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            aria-labelledby={`point-history-tab-${filter}`}
            className="flex flex-col gap-4"
            id="point-history-panel"
            role="tabpanel"
          >
            {showPending ? (
              <PointHistoryCard
                entries={pending}
                header={{
                  title: `${copy.pending.title} ${pending.reduce((sum, entry) => sum + entry.delta, 0)}${copy.pending.points}`,
                  description: copy.pending.body,
                }}
                label={copy.label}
              />
            ) : null}

            {groups.map((group, index) => (
              <PointHistoryCard
                entries={group.items}
                key={`${group.key}-${index}`}
                label={copy.label}
                month={group.month}
              />
            ))}
          </div>
        </Tabs>
      ) : null}
    </VStack>
  );
}

export type { PointHistoryFilter, PointHistoryCopy, PointHistoryProps };
export { PointHistory };
