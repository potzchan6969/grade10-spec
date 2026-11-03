import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { cn } from "@grade10/design-system/lib/utils";
import { Warning } from "@phosphor-icons/react";
import { registerBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import {
  assetEstDailyUsd,
  PORTFOLIO_ASSETS,
  type VaultAsset,
} from "../../vault-content";
import vaultAssetCardBones from "./vault-asset-card.bones.json";
import { VaultAssetStatus } from "./vault-asset-status";

registerBones({
  "vault-asset-card": vaultAssetCardBones,
});

/** Grade line under the image — cert grade for graded assets, `RAW` else. */
function gradeLine(asset: VaultAsset): string {
  return asset.condition === "Graded" ? asset.grade : "RAW";
}

/** Placeholder the skeleton overlay measures — any holding's shape works. */
const SKELETON_ASSET: VaultAsset = PORTFOLIO_ASSETS[0];

/** The card's layout — image well, grade, title, price line. */
function VaultAssetCardBody({ asset }: { asset: VaultAsset }) {
  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-(--radius-2xl) border border-border bg-background-subtle">
        <img
          alt=""
          aria-hidden
          className="size-full object-contain transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/vault-card:scale-105"
          height={640}
          src={asset.imageSrc}
          width={640}
        />
        <VaultAssetStatus status={asset.status} />
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-1">
          <p className="w-full text-sm font-medium text-secondary-foreground">
            {gradeLine(asset)}
          </p>
          <p className="line-clamp-3 w-full text-base leading-6 font-medium text-foreground underline-offset-2 group-hover/vault-card:underline">
            {asset.name}
          </p>
          <p className="flex w-full items-center gap-1 text-sm text-secondary-foreground tabular-nums">
            {asset.priceStale ? (
              <>
                Est. paused
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      aria-label="Why the daily estimate is paused"
                      className="inline-flex size-4 items-center justify-center text-warning outline-none"
                      render={<span />}
                    >
                      <Warning aria-hidden size={14} weight="fill" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Daily earning paused while the market price is
                      unavailable. Missed days credit immediately once pricing
                      resumes.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              `Est. ~US$${assetEstDailyUsd(asset).toFixed(2)} / day`
            )}
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * Collectible tile on the vault portfolio grid — Figma `Vault Asset Card`
 * (`7068:10249`). Square image well carries the `VaultAssetStatus` badge
 * (none for In Vault); body stacks grade and title. Only vaulted holdings render here — intake stays on
 * Submissions. Click opens the asset detail page.
 */
function VaultAssetCard({
  asset,
  onOpen,
  loading = false,
  className,
}: {
  asset: VaultAsset;
  onOpen?: () => void;
  /** Boneyard skeleton overlay while the holdings fetch settles. */
  loading?: boolean;
  className?: string;
}) {
  if (loading) {
    return (
      <Skeleton
        animate="pulse"
        className={cn("w-full", className)}
        color="#E6E6E6"
        darkColor="rgba(249, 250, 250, 0.05)"
        loading
        name="vault-asset-card"
        snapshotConfig={{ excludeSelectors: [] }}
        transition={300}
      >
        <article
          className="flex h-full w-full flex-col gap-4"
          data-slot="vault-asset-card"
        >
          <VaultAssetCardBody asset={SKELETON_ASSET} />
        </article>
      </Skeleton>
    );
  }

  return (
    <article
      className={cn(
        "group/vault-card relative flex h-full w-full flex-col gap-4",
        className,
      )}
      data-slot="vault-asset-card"
    >
      <button
        className="relative flex w-full cursor-pointer flex-col gap-4 text-left outline-none focus-visible:rounded-(--radius-3xl) focus-visible:ring-3 focus-visible:ring-ring/50"
        type="button"
        onClick={onOpen}
      >
        <VaultAssetCardBody asset={asset} />
      </button>
    </article>
  );
}

export { VaultAssetCard };
