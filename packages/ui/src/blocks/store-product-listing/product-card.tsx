import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";
import skeletonImage from "./product-card.fixture.png";
import { ProductCardImage } from "./product-card-image";

type ProductCardProps = {
  /** Boneyard skeleton overlay while the consumer resolves product data. */
  loading?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /** `cardProps` slot — consumer-assembled badges, in order. */
  badges?: ReactNode;
  name: ReactNode;
  price: ReactNode;
  originalPrice?: ReactNode;
  saleLabel?: ReactNode;
  soldOut?: boolean;
  soldOutLabel?: ReactNode;
  inCart?: boolean;
  cartCount?: ReactNode;
  cartLabel: string;
  onCartClick?: () => void;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

type ProductCardContentProps = Omit<ProductCardProps, "loading">;

const SKELETON_FIXTURE_PROPS = {
  imageSrc: skeletonImage,
  imageAlt: "Ninja Spinner booster box",
  name: "Ninja Spinner",
  price: "HKD 105",
  originalPrice: "HKD 123",
  saleLabel: "SALE",
  cartLabel: "Add to cart",
  onClick: () => {},
  onCartClick: () => {},
} satisfies Omit<ProductCardContentProps, "className">;

/**
 * Listing tile. Figma set `Product / Product Card` (`4200:155`) is the image,
 * a badge slot, the name, and the prices. Cart, sale, and sold-out live on
 * `ProductCardImage`.
 */
function ProductCardContent({
  className,
  imageSrc,
  imageAlt,
  badges,
  name,
  price,
  originalPrice,
  saleLabel,
  soldOut = false,
  soldOutLabel,
  inCart = false,
  cartCount,
  cartLabel,
  onCartClick,
  onClick,
  ariaLabel,
}: ProductCardContentProps) {
  const cardAriaLabel =
    ariaLabel ?? (typeof name === "string" ? name : undefined);

  const content = (
    <VStack className="min-w-0" data-slot="product-card-content" gap="sm">
      {badges != null ? (
        <HStack className="content-start" gap="xs" vAlign="start" wrap>
          {badges}
        </HStack>
      ) : null}
      <p
        className={cn(
          "truncate text-base font-bold",
          soldOut ? "text-disabled-foreground" : "text-card-foreground",
        )}
      >
        {name}
      </p>
      <HStack gap="xs" vAlign="center">
        <p
          className={cn(
            "text-sm font-medium",
            soldOut ? "text-disabled-foreground" : "text-card-foreground",
          )}
        >
          {price}
        </p>
        {originalPrice != null ? (
          <p
            className={cn(
              "text-sm font-medium line-through",
              soldOut
                ? "text-disabled-foreground"
                : "text-secondary-foreground",
            )}
          >
            {originalPrice}
          </p>
        ) : null}
      </HStack>
    </VStack>
  );

  return (
    <VStack
      className={cn("group/product-card relative w-full", className)}
      data-in-cart={(!soldOut && inCart) || undefined}
      data-slot="product-card"
      data-sold-out={soldOut || undefined}
      gap="md"
    >
      <ProductCardImage
        ariaLabel={cardAriaLabel}
        cartCount={cartCount}
        cartLabel={cartLabel}
        imageAlt={imageAlt}
        imageSrc={imageSrc}
        inCart={inCart}
        onCartClick={onCartClick}
        onClick={soldOut ? undefined : onClick}
        saleLabel={saleLabel}
        soldOut={soldOut}
        soldOutLabel={soldOutLabel}
      />
      {soldOut ? (
        content
      ) : (
        <button
          aria-label={cardAriaLabel}
          className="w-full cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={onClick}
          type="button"
        >
          {content}
        </button>
      )}
    </VStack>
  );
}

const PRODUCT_CARD_FIXTURE = <ProductCardContent {...SKELETON_FIXTURE_PROPS} />;

/**
 * Product tile for a card-box / pack grid. Figma (`4200:155`) is the image, a
 * badge slot, the name, and the prices. Cart, sale, and sold-out live on
 * `ProductCardImage`.
 *
 * The image scales on hover; the cart action sits on the image and appears on
 * hover or keyboard focus, or stays visible when the product is already in
 * the cart. Sold-out tiles are inert.
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

export type { ProductCardProps };
export { ProductCard };
