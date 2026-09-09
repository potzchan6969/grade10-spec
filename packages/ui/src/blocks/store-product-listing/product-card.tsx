import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";
import skeletonImage from "./product-card.fixture.png";
import type { ProductCardImageCopy } from "./product-card-image";
import { ProductCardImage } from "./product-card-image";

/** What a tile says whichever product is in it. */
type ProductCardCopy = ProductCardImageCopy;

type ProductCardProps = {
  copy: ProductCardCopy;
  /** Boneyard skeleton overlay while the consumer resolves product data. */
  loading?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /**
   * Metadata badges such as collection, series, and region. Accepted so
   * callers typecheck; the listing page does not display this slot.
   */
  tags?: readonly ReactNode[];
  /** `cardProps` slot — accepted and currently not displayed. */
  badges?: ReactNode;
  /** Product title. Clamped to two lines with an ellipsis, matching Figma —
   * and the name a screen reader reads the tile as, so it is text. */
  name: string;
  price: ReactNode;
  /** Strikethrough original price. Its presence is what makes the tile
   * discounted, and what draws the sale badge when the copy carries one. */
  originalPrice?: ReactNode;
  /**
   * Figma's `soldOut` axis. Swaps the sale badge for the sold-out treatment
   * and hides the cart action. The tile is inert.
   */
  soldOut?: boolean;
  /**
   * When the product is already in the cart, show the cart control and the
   * supplied count. Ignored when `soldOut`.
   */
  inCart?: boolean;
  cartCount?: ReactNode;
  /** Supply one to sell: the cart control is drawn only where it is present. */
  onCartQuantityChange?: (quantity: number) => void;
  /**
   * Fires when the image surface is activated. No navigation target is wired
   * here — the consumer decides what happens (route, modal, etc.).
   */
  onClick?: () => void;
  className?: string;
};

type ProductCardContentProps = Omit<ProductCardProps, "loading">;

const SKELETON_FIXTURE_PROPS = {
  copy: {
    cart: "Add to cart",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    removeFromCart: "Remove from cart",
    adjustQuantity: "Adjust cart quantity",
  },
  imageSrc: skeletonImage,
  imageAlt: "Abyss Eye Booster Box",
  /** One-line name so the Boneyard capture matches the common single-line tile. */
  name: "Abyss Eye Booster Box",
  price: "HK$105",
  onClick: () => {},
  onCartQuantityChange: () => {},
} satisfies Omit<ProductCardContentProps, "className">;

/**
 * Listing tile. Figma set `Product / Product Card` (`4200:155`) is the image,
 * a badge slot, the name, and the prices. Cart, sale, and sold-out live on
 * `ProductCardImage`.
 */
function ProductCardContent({
  className,
  copy,
  imageSrc,
  imageAlt,
  name,
  price,
  originalPrice,
  soldOut = false,
  inCart = false,
  cartCount,
  onCartQuantityChange,
  onClick,
}: ProductCardContentProps) {
  const onSale = originalPrice != null && !soldOut;

  return (
    <VStack
      className={cn("group/product-card w-full", className)}
      data-in-cart={(!soldOut && inCart) || undefined}
      data-slot="product-card"
      data-sold-out={soldOut || undefined}
      gap="none"
    >
      <ProductCardImage
        cartCount={cartCount}
        copy={copy}
        discounted={originalPrice != null}
        imageAlt={imageAlt}
        imageSrc={imageSrc}
        inCart={inCart}
        name={name}
        onCartQuantityChange={onCartQuantityChange}
        onClick={onClick}
        soldOut={soldOut}
      />

      <VStack
        className="min-w-0 gap-1 py-2"
        data-slot="product-card-content"
        gap="none"
      >
        <p className="line-clamp-2 text-base font-medium text-card-foreground">
          {name}
        </p>
        <HStack gap="sm" vAlign="baseline">
          <p
            className={cn(
              "text-base",
              onSale
                ? "font-medium text-success"
                : "font-normal text-card-foreground",
            )}
          >
            {price}
          </p>
          {originalPrice != null ? (
            <p className="text-base font-normal text-secondary-foreground line-through">
              {originalPrice}
            </p>
          ) : null}
        </HStack>
      </VStack>
    </VStack>
  );
}

const PRODUCT_CARD_FIXTURE = <ProductCardContent {...SKELETON_FIXTURE_PROPS} />;

/**
 * Display card box or card pack products in a grid layout.
 *
 * If discount is applied: show the discounted price and discount badge, with
 * the strikethrough original price. Hover over the image container: scale up
 * the background image within the container a bit with smooth transition.
 * When the product has already added to the cart: show the qty on the button
 * instead.
 *
 * Product tile for a card-box / pack grid. Figma (`4200:155`) has a `soldOut`
 * axis; discount is a boolean that shows the SALE badge and original price.
 *
 * Hover scales the photo inside the well. The cart control morphs from a
 * hover-revealed add affordance into an inline quantity stepper, collapsing to
 * a quantity pill when in cart. Sold-out tiles are inert and do not scale on
 * hover.
 */
function ProductCard({
  loading = false,
  className,
  ...props
}: ProductCardProps) {
  if (!loading) {
    return <ProductCardContent className={className} {...props} />;
  }

  return (
    <Skeleton
      animate="pulse"
      className={cn("w-full", className)}
      color="#E6E6E6"
      darkColor="rgba(249, 250, 250, 0.05)"
      fixture={PRODUCT_CARD_FIXTURE}
      loading
      name="store-product-card"
      transition={300}
    >
      <ProductCardContent {...SKELETON_FIXTURE_PROPS} />
    </Skeleton>
  );
}

export type { ProductCardCopy, ProductCardProps };
export { ProductCard };
