import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { expect, within } from "storybook/test";
import { ActiveIntakeAlert } from "./active-intake-alert";
import { activeIntakeSubmissionCount } from "./intake-content";
import {
  formatHkd,
  INTAKE_TRACKER_STORY_ID,
  PORTFOLIO_ASSETS,
  PORTFOLIO_SUMMARY,
  VAULT_BOOK_VISIT_STORY_ID,
  type VaultAsset,
  vaultItemRelatedStoryId,
} from "./vault-content";
import { VaultItemCard } from "./vault-item-card";
import {
  PageHeader,
  PortfolioSummary,
  VaultEmptyState,
  VaultPageShell,
} from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

/** Bottom rule only while stuck — at rest the bar sits flush with the page. */
function StickyFilterBar({ children }: { children: ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setStuck(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none h-px w-full"
        ref={sentinelRef}
      />
      <div
        className={cn(
          "sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/90 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8",
          stuck && "border-b border-border",
        )}
      >
        {children}
      </div>
    </>
  );
}

type FilterKey = "all" | "vaulted" | "retrieval";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "vaulted", label: "In Vault" },
  { key: "retrieval", label: "Retrieval" },
];

function isFilterKey(value: string): value is FilterKey {
  return FILTERS.some((f) => f.key === value);
}

function matchesFilter(asset: VaultAsset, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "vaulted") {
    return asset.status === "In Vault" || asset.status === "Listed on Auction";
  }
  return asset.status === "Retrieval pending";
}

function HoldingsPanel({ assets }: { assets: VaultAsset[] }) {
  if (assets.length === 0) {
    return (
      <Text className="text-secondary-foreground">
        No items match this filter.
      </Text>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {assets.map((asset) => (
        <VaultItemCard
          key={asset.id}
          asset={asset}
          onOpen={() => navigateToStory(vaultItemRelatedStoryId(asset))}
        />
      ))}
    </div>
  );
}

function VaultPortfolioPage({
  empty = false,
  intakeSubmissionCount = activeIntakeSubmissionCount(),
}: {
  empty?: boolean;
  /** Open intake submissions — omit to use the live intake fixture count. */
  intakeSubmissionCount?: number;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const assets = empty ? [] : PORTFOLIO_ASSETS;

  return (
    <VaultPageShell wide>
      <PageHeader
        title="Vault Portfolio"
        actions={
          empty ? undefined : (
            <Button
              type="button"
              onClick={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
            >
              Vault Collectibles
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-4">
        <PortfolioSummary
          itemCount={empty ? 0 : PORTFOLIO_SUMMARY.itemCount}
          estimate={
            empty ? formatHkd(0) : formatHkd(PORTFOLIO_SUMMARY.totalEstimateHkd)
          }
          feeLabel="Launch free"
          feeHint={PORTFOLIO_SUMMARY.feeStatus}
          valuationHint={PORTFOLIO_SUMMARY.valuationNote}
        />

        <ActiveIntakeAlert
          submissionCount={intakeSubmissionCount}
          onTrackProgress={() => navigateToStory(INTAKE_TRACKER_STORY_ID)}
        />

        {empty ? (
          <VaultEmptyState
            title="No vaulted items yet"
            description="Book a store visit to vault collectibles. Items appear here after staff verify and store them."
            actionLabel="Vault Collectibles"
            onAction={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
          />
        ) : (
          <Tabs
            className="gap-4"
            value={filter}
            onValueChange={(value) => {
              if (isFilterKey(value)) setFilter(value);
            }}
          >
            <StickyFilterBar>
              <TabsList aria-label="Filter holdings" size="sm" variant="pill">
                {FILTERS.map((f) => (
                  <TabsTrigger key={f.key} value={f.key}>
                    {f.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </StickyFilterBar>

            {FILTERS.map((f) => (
              <TabsContent
                key={f.key}
                className="mt-0 outline-none"
                value={f.key}
              >
                <HoldingsPanel
                  assets={assets.filter((a) => matchesFilter(a, f.key))}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault/Portfolio",
  component: VaultPortfolioPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultPortfolioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Vault Portfolio" }),
    ).toBeVisible();
    expect(canvas.getByText("Total Item Count")).toBeVisible();
    expect(canvas.getByText("Total Estimated Value")).toBeVisible();
    expect(canvas.getByText("Storage Fees")).toBeVisible();
    expect(canvas.getByText("Launch free")).toBeVisible();
    expect(
      canvas.getByText("2 submissions currently in intake"),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Track Progress" }),
    ).toBeVisible();
    expect(
      canvasElement.querySelectorAll('[data-slot="vault-item-card"]').length,
    ).toBeGreaterThan(0);
    expect(
      canvas.getByRole("button", { name: /1999 Charizard/i }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: { empty: true, intakeSubmissionCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No vaulted items yet")).toBeVisible();
    expect(canvas.queryByText(/currently in intake/)).toBeNull();
  },
};

/** Empty vault with open intake — alert still surfaces above the empty state. */
export const EmptyWithIntake: Story = {
  args: { empty: true, intakeSubmissionCount: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No vaulted items yet")).toBeVisible();
    expect(
      canvas.getByText("2 submissions currently in intake"),
    ).toBeVisible();
  },
};
