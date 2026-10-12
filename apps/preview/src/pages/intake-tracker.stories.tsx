import { formatMediumDay } from "@grade10/date";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import {
  COMPLETED_ITEMS,
  filterItems,
  GRADING_IN_PROGRESS_ITEMS,
  groupBySubmission,
  IN_PROGRESS_ITEMS,
  type IntakeItemRow,
  type IntakeListFilter,
  LIST_FILTER_LABELS,
} from "./intake-content";
import { IntakeItemCard } from "./intake-item-card";
import {
  PAGE_ENTER_CLASS,
  PageHeader,
  StickyTabBar,
  VaultPageShell,
} from "./vault-shared";

const FILTERS: IntakeListFilter[] = ["in-progress", "completed", "all"];

/** Simulated submissions fetch — mirrors the portfolio's ready beat. */
const SUBMISSIONS_LOAD_MS = 350;
/** Per-card enter stagger — 30ms, capped so long lists don't drag. */
const REVEAL_STAGGER_MS = 30;
const REVEAL_STAGGER_CAP = 8;

function revealDelay(index: number): string {
  return `${Math.min(index, REVEAL_STAGGER_CAP) * REVEAL_STAGGER_MS + 120}ms`;
}

const HAND_IN_CLOCK = { locale: "en-HK", timeZone: "Asia/Hong_Kong" };

function formatHandInDate(ms: number): string {
  return formatMediumDay(ms, HAND_IN_CLOCK).replace("Sept", "Sep");
}

function BatchDivider({
  submissionId,
  handedInAt,
  count,
}: {
  submissionId: string;
  handedInAt: number;
  count: number;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border pb-2.5">
      <Text size="xs" weight="medium">
        Handed in {formatHandInDate(handedInAt)}
      </Text>
      <Text className="text-secondary-foreground" size="xs">
        {submissionId} · {count} {count === 1 ? "item" : "items"}
      </Text>
    </div>
  );
}

function IntakeItemList({
  items,
  loading = false,
}: {
  items: readonly IntakeItemRow[];
  /** Boneyard card skeletons while the submissions fetch settles. */
  loading?: boolean;
}) {
  const groups = useMemo(() => groupBySubmission(items), [items]);

  if (items.length === 0) {
    return (
      <Text className="text-secondary-foreground">
        No items match this filter.
      </Text>
    );
  }

  const groupOffsets: number[] = [];
  let total = 0;
  for (const group of groups) {
    groupOffsets.push(total);
    total += group.items.length;
  }

  return (
    <ul
      aria-busy={loading || undefined}
      aria-label={loading ? "Loading submissions" : undefined}
      className="flex flex-col gap-8"
    >
      {groups.map((group, groupIndex) => (
        <li key={group.submissionId} className="flex flex-col gap-3">
          <div
            className={loading ? undefined : PAGE_ENTER_CLASS}
            style={{
              animationDelay: loading
                ? undefined
                : revealDelay(groupOffsets[groupIndex] ?? 0),
            }}
          >
            <BatchDivider
              count={group.items.length}
              handedInAt={group.handedInAt}
              submissionId={group.submissionId}
            />
          </div>
          <ul className="flex flex-col gap-3">
            {group.items.map((item, itemIndex) => {
              const index = (groupOffsets[groupIndex] ?? 0) + itemIndex;
              return (
                <li
                  className={loading ? undefined : PAGE_ENTER_CLASS}
                  key={loading ? `skeleton-${item.itemId}` : item.itemId}
                  style={{
                    animationDelay: loading ? undefined : revealDelay(index),
                  }}
                >
                  <IntakeItemCard item={item} loading={loading} />
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function IntakeTrackerPage({
  items,
  initialFilter = "in-progress",
  loading = false,
}: {
  items: readonly IntakeItemRow[];
  initialFilter?: IntakeListFilter;
  /** Hold the list in skeletons to exercise the loading state. */
  loading?: boolean;
}) {
  const [filter, setFilter] = useState<IntakeListFilter>(initialFilter);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setFetching(false),
      SUBMISSIONS_LOAD_MS,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  const listLoading = loading || fetching;

  return (
    <VaultPageShell>
      <div className={PAGE_ENTER_CLASS}>
        <PageHeader
          title="Submissions"
          description="Items from counter hand-in through vaulting or the next service."
        />
      </div>

      <Tabs
        className="gap-8"
        value={filter}
        onValueChange={(value) => {
          if (
            value === "in-progress" ||
            value === "completed" ||
            value === "all"
          ) {
            setFilter(value);
          }
        }}
      >
        <StickyTabBar className="-mt-8">
          <div className={cn(PAGE_ENTER_CLASS, "delay-[90ms]")}>
            <TabsList aria-label="Filter intake items" variant="list">
              {FILTERS.filter(
                (key) => key === "all" || filterItems(items, key).length > 0,
              ).map((key) => (
                <TabsTrigger key={key} value={key}>
                  {LIST_FILTER_LABELS[key]}
                  <Badge size="sm">{filterItems(items, key).length}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </StickyTabBar>

        {FILTERS.map((key) => (
          <TabsContent key={key} className="mt-0 outline-none" value={key}>
            <IntakeItemList
              items={filterItems(items, key)}
              loading={key === filter ? listLoading : false}
            />
          </TabsContent>
        ))}
      </Tabs>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Submissions",
  component: IntakeTrackerPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    items: IN_PROGRESS_ITEMS,
    initialFilter: "in-progress" as IntakeListFilter,
  },
} satisfies Meta<typeof IntakeTrackerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    items: IN_PROGRESS_ITEMS,
    initialFilter: "in-progress",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cards enter after the simulated fetch — wait for skeletons to resolve.
    await waitFor(() => {
      expect(
        canvas.getByRole("heading", { level: 1, name: "Submissions" }),
      ).toBeVisible();
      expect(canvas.getByRole("tab", { name: /^In Progress/ })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(canvas.getByText("ITM-99482-01")).toBeVisible();
      expect(canvas.getByText("ITM-99110-01")).toBeVisible();
      expect(
        canvas.getAllByRole("button", { name: "View Agreement" }).length,
      ).toBeGreaterThan(0);
      expect(
        canvas.getAllByRole("button", { name: "View in Vault" })[0],
      ).toBeDisabled();
    });
  },
};

/** Submissions fetch in flight — Boneyard card skeletons under the tab bar. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[aria-label="Loading submissions"]'),
      ).not.toBeNull(),
    );
    expect(
      canvasElement.querySelectorAll('[data-slot="card"]').length,
    ).toBeGreaterThan(0);
  },
};

export const Completed: Story = {
  args: {
    items: COMPLETED_ITEMS,
    initialFilter: "completed",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByRole("tab", { name: /^Completed/ })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(canvas.getByText("ITM-99482-01")).toBeVisible();
      expect(canvas.getAllByText("Vault – Vaulted").length).toBeGreaterThan(0);
      expect(
        canvas.getAllByRole("button", { name: "View in Vault" })[0],
      ).toBeEnabled();
    });
  },
};

export const GradingInProgress: Story = {
  args: {
    items: GRADING_IN_PROGRESS_ITEMS,
    initialFilter: "in-progress",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText("ITM-99110-01")).toBeVisible();
      expect(canvas.getByText("ITM-99110-04")).toBeVisible();
      expect(
        canvas.queryByRole("button", { name: "View in Vault" }),
      ).toBeNull();
    });
  },
};
