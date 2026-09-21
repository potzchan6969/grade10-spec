import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { StoreSectionHeader } from "../store-home/store-section-header";
import type { ProductCardCopy } from "../store-product-listing/product-card";
import { ProductCard } from "../store-product-listing/product-card";
import type { ProductSummary } from "../store-product-listing/types";

/** What the rail says the same for every card under it. */
type StoreProductRelatedRailCopy = {
  /** The heading over the rail — "You may also like". */
  heading: string;
  /** What every tile says the same way; the rail draws no cart control, so
   * the cart words are never read. */
  card: ProductCardCopy;
};

type StoreProductRelatedRailProps = {
  copy: StoreProductRelatedRailCopy;
  /** The cards to draw, in the order given. The rail cuts no list: the page
   * decides how many, and which, before it hands them over. */
  cards: readonly ProductSummary[];
  /** Fires when a tile is activated, identifying the card. Omit it and the
   * tiles are inert. */
  onCardClick?: (productId: string) => void;
  className?: string;
};

/**
 * The cards shown under a card on its own page: the heading, then one tile
 * per card given, in a row that scrolls where it does not fit. It composes
 * the store home's section header with no browse-all link and the listing's
 * product card with no cart control, and sells nothing; a sold-out card keeps
 * its treatment and still opens.
 */
function StoreProductRelatedRail({
  copy,
  cards,
  onCardClick,
  className,
}: StoreProductRelatedRailProps) {
  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="store-product-related-rail"
      gap="md"
    >
      <StoreSectionHeader copy={{}} title={copy.heading} />
      <HStack
        className="w-full overflow-x-auto pb-2"
        data-slot="store-product-related-rail-row"
        gap="md"
        vAlign="stretch"
      >
        {cards.map((card) => (
          <ProductCard
            badges={card.badges}
            className="w-[240px] shrink-0"
            copy={copy.card}
            imageAlt={card.imageAlt}
            imageSrc={card.imageSrc}
            key={card.id}
            name={card.name}
            onClick={onCardClick ? () => onCardClick(card.id) : undefined}
            originalPrice={card.originalPrice}
            price={card.price}
            soldOut={card.soldOut}
          />
        ))}
      </HStack>
    </VStack>
  );
}

export type { StoreProductRelatedRailCopy, StoreProductRelatedRailProps };
export { StoreProductRelatedRail };
