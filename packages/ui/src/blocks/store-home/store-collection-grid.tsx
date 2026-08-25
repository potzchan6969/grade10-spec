import { cn } from "@grade10/design-system/lib/utils";
import { StoreCollectionTile } from "./store-collection-tile";
import type { StoreCollectionSummary } from "./types";

type StoreCollectionGridProps = {
  collections: readonly StoreCollectionSummary[];
  className?: string;
};

/**
 * Bento grid of collection tiles on the store home page.
 *
 * Figma frame `Collection Cards` (`4195:1050`): five columns, sixteen-pixel
 * gaps, one featured tile spanning two by two, six standard tiles. The grid
 * layout is page-specific bento geometry — not an auto-layout primitive
 * translation.
 */
function StoreCollectionGrid({
  collections,
  className,
}: StoreCollectionGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-5 grid-rows-[repeat(2,fit-content(100%))] gap-4",
        className,
      )}
      data-slot="store-collection-grid"
    >
      {collections.map((collection) => (
        <StoreCollectionTile
          featured={collection.featured}
          href={collection.href}
          icon={collection.icon}
          key={collection.id}
          label={collection.label}
          onClick={collection.onClick}
        />
      ))}
    </div>
  );
}

export type { StoreCollectionGridProps };
export { StoreCollectionGrid };
