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
  VAULT_ITEM_DETAIL_STORY_ID,
  VAULT_SUBMIT_STORY_ID,
  type VaultAsset,
  type VaultAssetStatus,
} from "./vault-content";
import {
  PageHeader,
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
  "Submitted",
  "In transit",
  "At store",
  "Intake",
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
  proposedList,
}: {
  heading: string;
  assets: VaultAsset[];
  proposedList?: boolean;
}) {
  if (assets.length === 0) return null;
  return (
    <section className="flex flex-col gap-4" aria-labelledby={heading}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-xl font-medium" id={heading}>
          {heading}
        </h2>
        <Text size="sm" tone="secondary">
          {assets.length} {assets.length === 1 ? "item" : "items"}
        </Text>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <VaultAssetCard
            key={asset.id}
            asset={asset}
            proposedListAction={proposedList && asset.status === "In Vault"}
            onOpen={() => navigateToStory(VAULT_ITEM_DETAIL_STORY_ID)}
          />
        ))}
      </div>
    </section>
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
        <BreadcrumbItem current>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Portfolio</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="My Vault Portfolio"
        description="Physical assets stored at Crown Fine Art. Estimates always name their source."
        actions={
          <Button
            type="button"
            onClick={() => navigateToStory(VAULT_SUBMIT_STORY_ID)}
          >
            Submit to Vault
          </Button>
        }
      />

      <ProposalBanner title="Day-one scope">
        List for Auction is Proposed. Live market feed is Proposed — values
        show Declared or Intake estimate today.
      </ProposalBanner>

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
          description="Submit graded slabs to start your portfolio. We authenticate, scan, and store them at Crown Fine Art."
          actionLabel="Submit to Vault"
          onAction={() => navigateToStory(VAULT_SUBMIT_STORY_ID)}
        />
      ) : (
        <>
          <div
            className="flex flex-wrap gap-2"
            role="group"
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
          </div>

          <div className="flex flex-col gap-10">
            <AssetSection heading="Incoming" assets={groups.incoming} />
            <AssetSection
              heading="In Vault"
              assets={groups.vaulted}
              proposedList
            />
            <AssetSection heading="Retrieval" assets={groups.retrieval} />
            {filtered.length === 0 ? (
              <Text tone="secondary">No items match this filter.</Text>
            ) : null}
          </div>
        </>
      )}
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault Portfolio",
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
      canvas.getAllByRole("button", { name: "View details" }).length,
    ).toBeGreaterThan(0);
  },
};

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No vaulted items yet")).toBeVisible();
  },
};
