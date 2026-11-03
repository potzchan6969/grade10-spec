import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { useState } from "react";
import type { VaultAsset } from "../../vault-content";
import { PAGE_ENTER_CLASS } from "../../vault-shared";
import { VaultAssetCard } from "./vault-asset-card";

/** Per-card enter stagger — 40ms, capped so long lists don't drag. */
const REVEAL_STAGGER_MS = 30;
const REVEAL_STAGGER_CAP = 8;

type ListTab = "all" | "in-vault" | "live-auction" | "listed";

const TABS: { key: ListTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in-vault", label: "In Vault" },
  { key: "live-auction", label: "Live Auction" },
  { key: "listed", label: "Listed" },
];

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

/**
 * Holdings grid with status tabs — Figma `Vault Asset List`
 * (`7077:10911`). Tabs carry live counts; a tab with no items is
 * hidden (annotation). Retrieval Pending sits in the In Vault tab while it
 * awaits admin approval.
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
  const activeTab = visibleTabs.some((t) => t.key === tab)
    ? tab
    : (visibleTabs[0]?.key ?? "all");

  const filtered = assets.filter((a) => matchesTab(a, activeTab));

  if (assets.length === 0) {
    return (
      <Text className="text-secondary-foreground">No items in your vault.</Text>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-8", className)}
      data-slot="vault-asset-list"
    >
      <div
        className={cn(
          PAGE_ENTER_CLASS,
          "flex flex-wrap items-center justify-between gap-3 delay-[90ms]",
        )}
      >
        <fieldset
          aria-label="Filter holdings"
          className="flex flex-wrap items-center gap-2"
        >
          {visibleTabs.map((t) => (
            <Button
              aria-pressed={t.key === activeTab}
              key={t.key}
              size="md"
              type="button"
              variant={t.key === activeTab ? "secondary" : "outline"}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </fieldset>
      </div>

      <ul
        aria-busy={loading || undefined}
        aria-label={loading ? "Loading vault assets" : undefined}
        className="grid grid-cols-2 gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-8 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((asset, index) => (
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
    </div>
  );
}

export { VaultAssetList };
