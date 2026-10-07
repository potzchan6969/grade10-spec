import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { FilterChip } from "@grade10/design-system/components/forms/filter-chip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { expect, within } from "storybook/test";
import {
  formatHkd,
  PORTFOLIO_SUMMARY,
  VAULT_ASSETS,
  VAULT_BOOK_VISIT_STORY_ID,
  VAULT_ITEM_DETAIL_STORY_ID,
  VAULT_PORTFOLIO_HREF,
  type VaultAsset,
  type VaultAssetStatus,
} from "./vault-content";
import {
  PageHeader,
  PageSection,
  PortfolioSummary,
  ProposalBanner,
  VaultAssetCard,
  VaultEmptyState,
  VaultPageShell,
} from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

type FilterKey = "all" | "vaulted" | "incoming" | "retrieval";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "vaulted", label: "In Vault" },
  { key: "incoming", label: "Incoming" },
  { key: "retrieval", label: "Retrieval" },
];

const INCOMING: VaultAssetStatus[] = [
  "Registered",
  "Pre-check",
  "Signing",
  "Imaging",
];

function matchesFilter(asset: VaultAsset, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "vaulted") return asset.status === "In Vault";
  if (filter === "retrieval") return asset.status === "Retrieval pending";
  return INCOMING.includes(asset.status);
}

function groupAssets(assets: VaultAsset[]) {
  const incoming = assets.filter((a) => INCOMING.includes(a.status));
  const vaulted = assets.filter((a) => a.status === "In Vault");
  const retrieval = assets.filter((a) => a.status === "Retrieval pending");
  return { incoming, vaulted, retrieval };
}

function AssetSection({
  heading,
  assets,
}: {
  heading: string;
  assets: VaultAsset[];
}) {
  if (assets.length === 0) return null;
  return (
    <PageSection count={assets.length} heading={heading}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {assets.map((asset) => (
          <VaultAssetCard
            key={asset.id}
            asset={asset}
            onOpen={() => navigateToStory(VAULT_ITEM_DETAIL_STORY_ID)}
          />
        ))}
      </div>
    </PageSection>
  );
}

function VaultPortfolioPage({ empty = false }: { empty?: boolean }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const assets = empty ? [] : VAULT_ASSETS;
  const filtered = useMemo(
    () => assets.filter((a) => matchesFilter(a, filter)),
    [assets, filter],
  );
  const groups = groupAssets(filtered);

  return (
    <VaultPageShell wide>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Portfolio</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="My Vault Portfolio"
        description="Physical assets stored after a shop visit. Estimates always name their source."
        actions={
          <Button
            type="button"
            onClick={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
          >
            Book a vault visit
          </Button>
        }
      />

      <PortfolioSummary
        itemCount={empty ? 0 : PORTFOLIO_SUMMARY.itemCount}
        estimate={
          empty ? formatHkd(0) : formatHkd(PORTFOLIO_SUMMARY.totalEstimateHkd)
        }
        feeLabel="Launch free"
        feeHint={PORTFOLIO_SUMMARY.feeStatus}
        valuationHint={PORTFOLIO_SUMMARY.valuationNote}
      />

      {empty ? (
        <VaultEmptyState
          title="No vaulted items yet"
          description="Book a visit or walk in. Staff register your items at the counter, you sign, then we scan and store."
          actionLabel="Book a vault visit"
          onAction={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
        />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/90 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
            <fieldset
              className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0"
              aria-label="Filter holdings"
            >
              {FILTERS.map((f) => (
                <FilterChip
                  key={f.key}
                  size="sm"
                  selected={filter === f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </FilterChip>
              ))}
            </fieldset>
          </div>

          <div className="flex flex-col gap-10">
            <AssetSection heading="Incoming" assets={groups.incoming} />
            <AssetSection heading="In Vault" assets={groups.vaulted} />
            <AssetSection heading="Retrieval" assets={groups.retrieval} />
            {filtered.length === 0 ? (
              <Text className="text-secondary-foreground">
                No items match this filter.
              </Text>
            ) : null}
          </div>
        </div>
      )}

      <ProposalBanner title="Day-one scope">
        List for Auction is Proposed. Live market feed is Proposed — values show
        Declared or Intake estimate today. Incoming items do not block booking
        another vault visit.
      </ProposalBanner>
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
      canvas.getByRole("heading", { level: 1, name: "My Vault Portfolio" }),
    ).toBeVisible();
    expect(canvas.getByText("Launch free")).toBeVisible();
    expect(
      canvasElement.querySelectorAll('[data-slot="vault-asset-card"]').length,
    ).toBeGreaterThan(0);
    expect(
      canvas.getByRole("button", { name: /1999 Charizard/i }),
    ).toBeVisible();
    expect(canvas.getByText("Day-one scope")).toBeVisible();
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No vaulted items yet")).toBeVisible();
  },
};
