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
import { ActivityMonthCard } from "./activity-month-card";
import { ActivityPendingCard, type ActivityPendingCardCopy } from "./activity-pending-card";
import { ActivitySummary, type ActivitySummaryCopy } from "./activity-summary";
import type { ActivityEntry, ActivityTotals } from "./types";

/** The filter tabs, in the order they read. */
type ActivityFilter = "all" | "earned" | "used" | "pending";

const FILTERS: readonly ActivityFilter[] = [
  "all",
  "earned",
  "used",
  "pending",
];

/** The words the list says, whatever the member did. */
type ActivityListCopy = {
  /** Accessible name of the list. */
  label: string;
  /** The three figures over the list — Earned, Used, Pending. */
  summary: ActivitySummaryCopy;
  /** The filter tabs' labels, keyed the way `ActivityFilter` is. */
  filters: Record<ActivityFilter, string>;
  /** The pending card's words. */
  pending: ActivityPendingCardCopy;
};

type ActivityListProps = {
  copy: ActivityListCopy;
  state: AsyncState<readonly ActivityEntry[]>;
  /** The stat box over the list. Absent, no box draws. */
  summary?: ActivityTotals;
  className?: string;
};

/**
 * The member's own ledger, in the member's own terms: the totals on top,
 * filter tabs beneath, what is still on the way under Pending, and the
 * settled entries grouped by month. Each entry arrives already named — what
 * an operator wrote on it, its retry key, and how it was priced internally
 * never reach this surface, so no prop can carry them.
 */
function ActivityList({ copy, state, summary, className }: ActivityListProps) {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const entries = state.status === "ready" ? state.data : [];
  const pending = entries.filter((entry) => entry.pending);
  const settled = entries.filter(
    (entry) => !entry.pending && (filter === "all" || entry.track === filter),
  );
  const showPending =
    pending.length > 0 && (filter === "all" || filter === "pending");

  /* Months in first-seen order; consecutive entries of one month share a card. */
  const groups: { key: string; month?: string; items: ActivityEntry[] }[] = [];
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
    <VStack className={className} data-slot="activity-list" gap="md">
      {summary ? <ActivitySummary copy={copy.summary} totals={summary} /> : null}

      {state.status === "loading" ? (
        <VStack className="gap-3" data-slot="activity-list-loading">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </VStack>
      ) : null}
      {state.status === "empty" || state.status === "error" ? (
        <AsyncMessage
          action={state.action}
          message={state.message}
          slot={`activity-list-${state.status}`}
        />
      ) : null}

      {state.status === "ready" ? (
        <Tabs
          data-slot="activity-list-filters"
          onValueChange={(value) => setFilter(value as ActivityFilter)}
          value={filter}
        >
          <TabsList aria-label={copy.label} variant="list">
            {FILTERS.map((name) => (
              <TabsTrigger
                aria-controls="activity-list-panel"
                id={`activity-list-tab-${name}`}
                key={name}
                value={name}
              >
                {copy.filters[name]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            aria-labelledby={`activity-list-tab-${filter}`}
            className="flex flex-col gap-4"
            id="activity-list-panel"
            role="tabpanel"
          >
            {showPending ? (
              <ActivityPendingCard copy={copy.pending} entries={pending} />
            ) : null}

            {groups.map((group, index) => (
              <ActivityMonthCard
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

export type { ActivityFilter, ActivityListCopy, ActivityListProps };
export { ActivityList };
