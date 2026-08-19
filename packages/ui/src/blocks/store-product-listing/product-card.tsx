import { Badge } from "@grade10/design-system/components/display/badge";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Center } from "@grade10/design-system/components/layout/center";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";

type ProductCardProps = {
  /** Boneyard skeleton overlay while the consumer resolves product data. */
  loading?: boolean;
  /** Product photo. Omit it and the muted image well still renders. */
  imageSrc?: string;
  imageAlt?: string;
  /** Metadata badges below the image, such as collection, series, and region. */
  tags?: readonly ReactNode[];
  /** Product title. Clamped to one line with an ellipsis, matching Figma. */
  name: ReactNode;
  /** Current (or discounted) price, already formatted. */
  price: ReactNode;
  /** Strikethrough original price. Its presence is Figma's `hasDiscount` gate. */
  originalPrice?: ReactNode;
  /** Image badge copy such as `SALE`. Hidden when `soldOut`. */
  discountLabel?: ReactNode;
  /**
   * Figma's `isSoldOut` axis. Dims the photo, swaps the discount badge for
   * SOLD OUT, and hides the cart action.
   */
  soldOut?: boolean;
  /**
   * Figma's `isAddedToCart` axis. Shows the quantity on the cart button.
   * Ignored when `soldOut`.
   */
  addedToCart?: boolean;
  /** Quantity shown on the cart button. The consumer owns the value. */
  quantity?: number;
  /**
   * Fires when the image surface is activated. No navigation target is wired
   * here — the consumer decides what happens (route, modal, etc.).
   */
  onClick?: () => void;
  /** Accessible name when the image is interactive. Defaults to string `name`. */
  ariaLabel?: string;
  /** Accessible name for the cart action. */
  actionLabel?: ReactNode;
  onAction?: () => void;
  className?: string;
};

type ProductCardContentProps = Omit<ProductCardProps, "loading">;

const SKELETON_IMAGE = new URL("./product-card.fixture.png", import.meta.url)
  .href;

const SKELETON_FIXTURE_PROPS = {
  imageSrc: SKELETON_IMAGE,
  imageAlt: "Ninja Spinner booster box",
  tags: ["Pokémon", "M4", "JP"],
  name: "Ninja Spinner",
  price: "HKD 105",
  originalPrice: "HKD 123",
  discountLabel: "SALE",
  actionLabel: "Add to cart",
  onClick: () => {},
  onAction: () => {},
} satisfies Omit<ProductCardContentProps, "className">;

function ProductCardContent({
  className,
  imageSrc,
  imageAlt = "",
  name,
  price,
  originalPrice,
  discountLabel,
  soldOut = false,
  addedToCart = false,
  quantity = 1,
  onClick,
  ariaLabel,
  actionLabel,
  onAction,
}: ProductCardContentProps) {
  const cardAriaLabel =
    ariaLabel ?? (typeof name === "string" ? name : undefined);
  const showCartAction = !soldOut && onAction != null;
  const cartVisible = addedToCart ? "opacity-100" : "opacity-0";

  return (
    <VStack
      className={cn("group/product-card w-full", className)}
      data-added-to-cart={(!soldOut && addedToCart) || undefined}
      data-slot="product-card"
      data-sold-out={soldOut || undefined}
      gap="md"
    >
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-(--radius-md)",
          soldOut && "opacity-50",
        )}
        data-slot="product-card-image"
      >
        {soldOut ? (
          <div className="absolute inset-0 bg-muted">
            {imageSrc ? (
              <img
                alt={imageAlt}
                className="size-full object-cover"
                src={imageSrc}
              />
            ) : null}
          </div>
        ) : (
          <button
            aria-label={cardAriaLabel}
            className="absolute inset-0 cursor-pointer border-0 bg-muted p-0 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onClick}
            type="button"
          >
            {imageSrc ? (
              <img
                alt=""
                aria-hidden
                className={cn(
                  "size-full object-cover",
                  "transition-transform duration-200 ease-[ease] motion-reduce:transition-none",
                  "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/product-card:scale-105",
                )}
                src={imageSrc}
              />
            ) : null}
          </button>
        )}
        {soldOut ? (
          <Badge className="absolute top-3 left-3" size="sm">
            SOLD OUT
          </Badge>
        ) : discountLabel != null ? (
          <Badge className="absolute top-3 left-3" size="sm" variant="success">
            {discountLabel}
          </Badge>
        ) : null}
        {showCartAction ? (
          <div
            className={cn(
              "absolute right-3 bottom-3 transition-opacity duration-200 ease-out motion-reduce:transition-none",
              cartVisible,
              "[@media(hover:hover)_and_(pointer:fine)]:group-hover/product-card:opacity-100",
            )}
          >
            <div className="relative size-11">
              <IconButton
                aria-label={
                  typeof actionLabel === "string" ? actionLabel : undefined
                }
                className="size-11"
                onClick={onAction}
                size="md"
                variant="secondary"
              >
                <ShoppingCartSimple aria-hidden size={16} weight="bold" />
              </IconButton>
              {addedToCart ? (
                <Center
                  aria-hidden
                  className="absolute top-0 left-7 h-4 min-w-4 rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground"
                >
                  {quantity}
                </Center>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <VStack className="min-w-0" data-slot="product-card-content" gap="sm">
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
    </VStack>
  );
}

const PRODUCT_CARD_FIXTURE = <ProductCardContent {...SKELETON_FIXTURE_PROPS} />;

/**
 * Product tile for a card-box / pack grid. Figma (`4200:155`) has `isSoldOut`
 * and `isAddedToCart`; discount is a boolean that shows the SALE badge and
 * original price.
 *
 * The image scales on hover; the cart action sits on the image and appears on
 * hover, or stays visible when the product is already in the cart. Sold-out
 * tiles are inert.
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
