import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import {
  formatHkd,
  statusBadgeVariant,
  type ValuationSource,
  type VaultAsset,
} from "./vault-content";

const IMAGE_RADIUS = "rounded-(--radius-2xl) md:rounded-(--radius-3xl)";

function valuationLabel(source: ValuationSource): string {
  switch (source) {
    case "Declared":
      return "Declared value";
    case "Intake estimate":
      return "Intake estimate";
    case "Market":
      return "Market estimate";
  }
}

/**
 * Collectible tile for the vault portfolio grid. Only vaulted holdings —
 * intake and pre-check never appear here. Matches store and auction listing
 * cards: square contain well, status and estimate in the content stack.
 */
function VaultItemCard({
  asset,
  onOpen,
  className,
}: {
  asset: VaultAsset;
  onOpen?: () => void;
  className?: string;
}) {
  const estimateLabel = valuationLabel(asset.valuationSource);

  return (
    <article
      className={cn(
        "group/vault-card relative flex h-full w-full flex-col",
        className,
      )}
      data-slot="vault-item-card"
    >
      <button
        className="relative flex w-full cursor-pointer flex-col gap-2 text-left outline-none focus-visible:rounded-(--radius-2xl) focus-visible:ring-3 focus-visible:ring-ring/50"
        type="button"
        onClick={onOpen}
      >
        <div className={cn("relative aspect-square w-full", IMAGE_RADIUS)}>
          <span
            className={cn(
              "absolute inset-0 isolate overflow-hidden border border-[color:var(--border-subtle,var(--border))] bg-gradient-to-b from-[var(--gray-50,#fafafa)] to-[var(--gray-100,#f3f3f3)]",
              IMAGE_RADIUS,
            )}
          >
            <img
              alt=""
              aria-hidden
              className={cn(
                "size-full object-contain transition-transform duration-200 ease-[ease] motion-reduce:transition-none",
                "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/vault-card:scale-105",
                IMAGE_RADIUS,
              )}
              height={640}
              src={asset.imageSrc}
              width={640}
            />
          </span>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-2 py-1">
          <Badge size="sm" variant={statusBadgeVariant(asset.status)}>
            {asset.status}
          </Badge>

          <span className="line-clamp-2 w-full text-base font-medium leading-6 text-foreground underline-offset-2 group-hover/vault-card:underline">
            {asset.name}
          </span>

          <div className="flex w-full flex-col items-start">
            <p className="w-full text-sm text-secondary-foreground">
              {estimateLabel}
            </p>
            <p className="w-full text-lg leading-7 font-semibold tabular-nums text-card-foreground">
              {formatHkd(asset.estimateHkd)}
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}

export { VaultItemCard, valuationLabel };
