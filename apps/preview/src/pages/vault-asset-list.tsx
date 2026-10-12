import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowsDownUp, CaretDown, Check } from "@phosphor-icons/react";
import { useState } from "react";
import { VaultAssetCard } from "./vault-asset-card";
import type { VaultAsset } from "./vault-content";
import { PAGE_ENTER_CLASS, StickyTabBar } from "./vault-shared";

/** Per-card enter stagger — 40ms, capped so long lists don't drag. */
const REVEAL_STAGGER_MS = 30;
const REVEAL_STAGGER_CAP = 8;

type ListTab = "all" | "in-vault" | "live-auction" | "listed";

type SortKey =
  | "highest-estimate"
  | "lowest-estimate"
  | "recently-added"
  | "ending-soonest"
  | "highest-bid"
  | "recently-listed"
  | "highest-price";

const TABS: { key: ListTab; label: string }[] = [
  { key: "all", label: "All Assets" },
  { key: "in-vault", label: "In Vault" },
  { key: "live-auction", label: "Live Auction" },
  { key: "listed", label: "Listed" },
];

/** Figma `7077:10911` — the sort set is a property of the tab. */
const SORT_OPTIONS: Record<ListTab, { key: SortKey; label: string }[]> = {
  all: [
    { key: "highest-estimate", label: "Highest est. value" },
    { key: "lowest-estimate", label: "Lowest est. value" },
    { key: "recently-added", label: "Recently added" },
  ],
  "in-vault": [
    { key: "highest-estimate", label: "Highest est. value" },
    { key: "lowest-estimate", label: "Lowest est. value" },
    { key: "recently-added", label: "Recently added" },
  ],
  "live-auction": [
    { key: "ending-soonest", label: "Ending Soonest" },
    { key: "highest-bid", label: "Highest Bid" },
  ],
  listed: [
    { key: "recently-listed", label: "Recently Listed" },
    { key: "highest-price", label: "Highest Current Price" },
  ],
};

const DEFAULT_SORT: Record<ListTab, SortKey> = {
  all: "highest-estimate",
  "in-vault": "highest-estimate",
  "live-auction": "ending-soonest",
  listed: "recently-listed",
};

/** Retrieval Pending stays with In Vault — it awaits admin approval. */
function matchesTab(asset: VaultAsset, tab: ListTab): boolean {
  switch (tab) {
    case "all":
      return true;
    case "in-vault":
      return (
        asset.status === "In Vault" || asset.status === "Retrieval Pending"
      );
    case "live-auction":
      return asset.status === "Live Auction";
    case "listed":
      return asset.status === "Listed";
  }
}

function sortAssets(assets: VaultAsset[], sort: SortKey): VaultAsset[] {
  const byDate = (
    a: VaultAsset,
    b: VaultAsset,
    key: "vaultedAt" | "listedAt",
  ) => (b[key] ?? "").localeCompare(a[key] ?? "");
  const sorted = [...assets];
  switch (sort) {
    case "highest-estimate":
      return sorted.sort((a, b) => b.estimateHkd - a.estimateHkd);
    case "lowest-estimate":
      return sorted.sort((a, b) => a.estimateHkd - b.estimateHkd);
    case "recently-added":
      return sorted.sort((a, b) => byDate(a, b, "vaultedAt"));
    case "ending-soonest":
      return sorted.sort((a, b) =>
        (a.auctionEndsAt ?? "").localeCompare(b.auctionEndsAt ?? ""),
      );
    case "highest-bid":
      return sorted.sort(
        (a, b) => (b.currentBidHkd ?? 0) - (a.currentBidHkd ?? 0),
      );
    case "recently-listed":
      return sorted.sort((a, b) => byDate(a, b, "listedAt"));
    case "highest-price":
      return sorted.sort((a, b) => (b.listedHkd ?? 0) - (a.listedHkd ?? 0));
  }
}

/**
 * Holdings grid with status tabs and a per-tab sort — Figma `Vault Asset
 * List` (`7077:10911`). Tabs carry live counts; a tab with no items is
 * hidden (annotation). Retrieval Pending sits in the In Vault tab while it
 * awaits admin approval. Each tab remembers its sort for the session.
 */
function VaultAssetList({
  assets,
  onOpenAsset,
  loading = false,
  className,
}: {
  assets: VaultAsset[];
  onOpenAsset?: (asset: VaultAsset) => void;
  /** Boneyard card skeletons while the holdings fetch settles. */
  loading?: boolean;
  className?: string;
}) {
  const visibleTabs = TABS.filter(
    (tab) => tab.key === "all" || assets.some((a) => matchesTab(a, tab.key)),
  );
  const [tab, setTab] = useState<ListTab>(visibleTabs[0]?.key ?? "all");
  const [sorts, setSorts] = useState<Partial<Record<ListTab, SortKey>>>({});

  const activeTab = visibleTabs.some((t) => t.key === tab)
    ? tab
    : (visibleTabs[0]?.key ?? "all");
  const sort = sorts[activeTab] ?? DEFAULT_SORT[activeTab];
  const sortOptions = SORT_OPTIONS[activeTab];
  const activeSortLabel =
    sortOptions.find((o) => o.key === sort)?.label ?? sortOptions[0]?.label;

  const filtered = sortAssets(
    assets.filter((a) => matchesTab(a, activeTab)),
    sort,
  );

  const countFor = (key: ListTab) =>
    assets.filter((a) => matchesTab(a, key)).length;

  if (assets.length === 0) {
    return (
      <Text className="text-secondary-foreground">No items in your vault.</Text>
    );
  }

  return (
    <Tabs
      className={cn("gap-8", className)}
      data-slot="vault-asset-list"
      value={activeTab}
      onValueChange={(value) => setTab(value as ListTab)}
    >
      <StickyTabBar>
        <div
          className={cn(
            PAGE_ENTER_CLASS,
            "flex flex-wrap items-center justify-between gap-3 delay-[90ms]",
          )}
        >
          <TabsList aria-label="Filter holdings" variant="list">
            {visibleTabs.map((t) => (
              <TabsTrigger key={t.key} value={t.key}>
                {t.label}
                <Badge size="sm">{countFor(t.key)}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  leading={<ArrowsDownUp aria-hidden size={14} />}
                  size="md"
                  trailing={<CaretDown aria-hidden size={14} />}
                  variant="secondary"
                />
              }
            >
              {activeSortLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => {
                const selected = option.key === sort;
                return (
                  <DropdownMenuItem
                    key={option.key}
                    onClick={() =>
                      setSorts((prev) => ({ ...prev, [activeTab]: option.key }))
                    }
                    selected={selected}
                    trailing={
                      selected ? <Check aria-hidden size={14} /> : undefined
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </StickyTabBar>

      {visibleTabs.map((t) => (
        <TabsContent key={t.key} className="mt-0 outline-none" value={t.key}>
          <ul
            aria-busy={loading || undefined}
            aria-label={loading ? "Loading vault assets" : undefined}
            className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {(t.key === activeTab ? filtered : []).map((asset, index) => (
              <li
                className={loading ? undefined : PAGE_ENTER_CLASS}
                key={loading ? `skeleton-${index}` : asset.id}
                style={{
                  animationDelay: loading
                    ? undefined
                    : `${Math.min(index, REVEAL_STAGGER_CAP) * REVEAL_STAGGER_MS + 120}ms`,
                }}
              >
                <VaultAssetCard
                  asset={asset}
                  loading={loading}
                  onOpen={loading ? undefined : () => onOpenAsset?.(asset)}
                />
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export { VaultAssetList };
