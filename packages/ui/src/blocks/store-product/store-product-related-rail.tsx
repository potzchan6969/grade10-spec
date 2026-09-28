import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { StoreSectionHeader } from "../store-home/store-section-header";
import type { ProductCardCopy } from "../store-product-listing/product-card";
import { ProductCard } from "../store-product-listing/product-card";
import type { ProductSummary } from "../store-product-listing/types";

/** What the rail says the same for every card under it. */
type StoreProductRelatedRailCopy = {
  /** The heading over the rail — "You may also like" — and the name of the
   * region it opens. */
  heading: string;
  /** What every tile says the same way. */
  card: Pick<ProductCardCopy, "soldOut" | "sale">;
};

type StoreProductRelatedRailProps = {
  copy: StoreProductRelatedRailCopy;
  /** The cards to draw, in the order given. The rail cuts no list: the page
   * decides how many, and which, before it hands them over. It sells
   * nothing, so a card's `inCart`, `cartCount`, `maxCartQuantity` and
   * `remainingLabel` are never drawn. A card's `href` makes its tile a link
   * to it. Given none, it draws the heading over nothing: the page renders no
   * rail where it has nothing to show. */
  cards: readonly ProductSummary[];
  /** Fires on a plain press of a tile, identifying the card, in place of the
   * link's own navigation. A card with an address opens without it. */
  onCardClick?: (productId: string) => void;
  className?: string;
};

/**
 * The cards shown under a card on its own page: a region named by its
 * heading, then one tile per card given, in a row. The row answers the width
 * it is given: six tiles fit side by side on a wide rail, and on a narrower
 * one the row scrolls, each tile snapping to its start, with part of the next
 * tile showing so the reader can tell there is more. It composes the store
 * home's section header with no browse-all link and the listing's product
 * card with no cart control, and sells nothing; a sold-out card keeps its
 * treatment and still opens.
 */
function StoreProductRelatedRail({
  copy,
  cards,
  onCardClick,
  className,
}: StoreProductRelatedRailProps) {
  return (
    <section
      aria-label={copy.heading}
      className={cn("@container w-full", className)}
      data-slot="store-product-related-rail"
    >
      <VStack gap="md">
        <StoreSectionHeader copy={{}} title={copy.heading} />
        <HStack
          className="-m-1 snap-x snap-mandatory scroll-px-1 overflow-x-auto p-1 pb-3"
          data-slot="store-product-related-rail-row"
          gap="md"
          vAlign="stretch"
        >
          {/* Six across leaves room for the row's five gaps: `gap="md"` is
              1rem each, so a change to the gap changes the 5rem. */}
          {cards.map((card) => (
            <ProductCard
              badges={card.badges}
              className="w-[42%] shrink-0 snap-start @xl:w-[28%] @4xl:w-[22%] @6xl:w-[calc((100%_-_5rem)/6)]"
              copy={copy.card}
              href={card.href}
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
    </section>
  );
}

export type { StoreProductRelatedRailCopy, StoreProductRelatedRailProps };
export { StoreProductRelatedRail };
