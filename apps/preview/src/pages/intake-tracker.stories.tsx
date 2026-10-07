import {
  BreadcrumbItem,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { expect, within } from "storybook/test";
import {
  COMPLETED_ITEMS,
  filterItems,
  GRADING_IN_PROGRESS_ITEMS,
  groupBySubmission,
  IN_PROGRESS_ITEMS,
  type IntakeItemRow,
  type IntakeListFilter,
  intakeItemCardStoryId,
  LIST_FILTER_LABELS,
} from "./intake-content";
import { IntakeItemCard } from "./intake-item-card";
import { PageHeader, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

const FILTERS: IntakeListFilter[] = ["in-progress", "completed", "all"];

function formatHandInDate(ms: number): string {
  return new Intl.DateTimeFormat("en-HK", {
    dateStyle: "medium",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(ms));
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
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <Text className="text-secondary-foreground" size="xs" weight="medium">
        Handed in {formatHandInDate(handedInAt)}
      </Text>
      <Text className="text-secondary-foreground" face="mono" size="xs">
        {submissionId}
        <span className="font-sans">
          {" "}
          · {count} {count === 1 ? "item" : "items"}
        </span>
      </Text>
    </div>
  );
}

function IntakeItemList({ items }: { items: readonly IntakeItemRow[] }) {
  const groups = useMemo(() => groupBySubmission(items), [items]);

  if (items.length === 0) {
    return (
      <Text className="text-secondary-foreground">
        No items match this filter.
      </Text>
    );
  }

  return (
    <ul className="flex flex-col gap-8">
      {groups.map((group) => (
        <li key={group.submissionId} className="flex flex-col gap-3">
          <BatchDivider
            count={group.items.length}
            handedInAt={group.handedInAt}
            submissionId={group.submissionId}
          />
          <ul className="flex flex-col gap-3">
            {group.items.map((item) => (
              <li key={item.itemId}>
                <IntakeItemCard
                  item={item}
                  onOpen={() =>
                    navigateToStory(intakeItemCardStoryId(item))
                  }
                />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function IntakeTrackerPage({
  items,
  initialFilter = "in-progress",
}: {
  items: readonly IntakeItemRow[];
  initialFilter?: IntakeListFilter;
}) {
  const [filter, setFilter] = useState<IntakeListFilter>(initialFilter);

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem current>Intake tracker</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="Intake tracker"
        description="Items from counter hand-in through vaulting or the next service."
      />

      <Tabs
        className="gap-6"
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
        <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/90 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          <TabsList aria-label="Filter intake items" size="sm" variant="pill">
            {FILTERS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {LIST_FILTER_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {FILTERS.map((key) => (
          <TabsContent key={key} className="mt-0 outline-none" value={key}>
            <IntakeItemList items={filterItems(items, key)} />
          </TabsContent>
        ))}
      </Tabs>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Intake Tracker",
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
    expect(
      canvas.getByRole("heading", { level: 1, name: "Intake tracker" }),
    ).toBeVisible();
    expect(canvas.getByRole("tab", { name: "In progress" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(canvas.getByText("ITM-99482-01")).toBeVisible();
    expect(canvas.getByText("ITM-99110-01")).toBeVisible();
    expect(canvas.getAllByRole("link").length).toBeGreaterThan(0);
    expect(
      canvas.getAllByRole("button", { name: "Custody agreement · PDF" }).length,
    ).toBeGreaterThan(0);
    expect(
      canvas.getAllByRole("button", { name: "View in vault portfolio" }).length,
    ).toBeGreaterThan(0);
    expect(canvas.getAllByRole("button", { name: "Vault receipt" })[0]).toBeDisabled();
  },
};

export const Completed: Story = {
  args: {
    items: COMPLETED_ITEMS,
    initialFilter: "completed",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("tab", { name: "Completed" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(canvas.getByText("ITM-99482-01")).toBeVisible();
    expect(canvas.getAllByText("Vaulted").length).toBeGreaterThan(0);
    expect(canvas.getAllByRole("button", { name: "Vault receipt" })[0]).toBeEnabled();
  },
};

export const GradingInProgress: Story = {
  args: {
    items: GRADING_IN_PROGRESS_ITEMS,
    initialFilter: "in-progress",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("ITM-99110-01")).toBeVisible();
    expect(canvas.getByText("ITM-99110-04")).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Vault receipt" })).toBeNull();
  },
};
