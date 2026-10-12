import { cn } from "@grade10/design-system/lib/utils";
import { VaultAssetStatus } from "./vault-asset-status";
import { assetPrice, formatHkd, type VaultAsset } from "./vault-content";

/** Grade line under the image — cert grade for graded assets, `RAW` else. */
function gradeLine(asset: VaultAsset): string {
  return asset.condition === "Graded" ? asset.grade : "RAW";
}

/**
 * Collectible tile on the vault portfolio grid — Figma `Vault Asset Card`
 * (`7068:10249`). Square image well carries the `VaultAssetStatus` badge
 * (none for In Vault); body stacks grade, title and a status-dependent
 * price line. Only vaulted holdings render here — intake stays on
 * Submissions. Click opens the asset detail page.
 */
function VaultAssetCard({
  asset,
  onOpen,
  className,
}: {
  asset: VaultAsset;
  onOpen?: () => void;
  className?: string;
}) {
  const price = assetPrice(asset);

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
        <div className="relative aspect-square w-full overflow-hidden rounded-(--radius-3xl) border border-border bg-background-subtle">
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
            <p className="w-full text-sm text-secondary-foreground">
              {gradeLine(asset)}
            </p>
            <p className="line-clamp-2 w-full text-lg leading-7 font-medium text-foreground underline-offset-2 group-hover/vault-card:underline">
              {asset.name}
            </p>
          </div>

          <div aria-hidden className="border-t border-border" />

          <div className="flex w-full flex-col items-start gap-1">
            <p className="w-full text-xs font-medium uppercase text-secondary-foreground">
              {price.label}
            </p>
            <p className="w-full text-lg leading-7 font-medium tabular-nums text-card-foreground">
              {formatHkd(price.amountHkd)}
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}

export { VaultAssetCard };
