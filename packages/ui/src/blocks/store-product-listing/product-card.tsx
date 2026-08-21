import { Badge } from "@grade10/design-system/components/display/badge";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Center } from "@grade10/design-system/components/layout/center";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";
import skeletonImage from "./product-card.fixture.png";

type ProductCardProps = {
  /** Boneyard skeleton overlay while the consumer resolves product data. */
  loading?: boolean;
  /** Product photo. Omit it and the muted image well still renders. */
  imageSrc?: string;
  imageAlt?: string;
  /** Metadata badges below the image, such as collection, series, and region. */
  tags?: readonly ReactNode[];
  /** Product title. Clamped to two lines with an ellipsis, matching Figma. */
  name: ReactNode;
  /** Current (or discounted) price, already formatted. */
  price: ReactNode;
  /** Strikethrough original price. Its presence is Figma's `hasDiscount` gate. */
  originalPrice?: ReactNode;
  /** Image badge copy such as `SALE`. Hidden when `soldOut`. */
  discountLabel?: ReactNode;
  /**
   * Figma's `soldOut` axis. Swaps the discount badge for SOLD OUT and
   * hides the cart action. The tile is inert.
   */
  soldOut?: boolean;
  /**
   * Annotation on the Product Card set: when the product is already in the
   * cart, show quantity on the cart button. Ignored when `soldOut`.
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

const SKELETON_FIXTURE_PROPS = {
  imageSrc: skeletonImage,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  tags: ["Pokémon", "M4", "JP"],
  name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$105",
  originalPrice: "HK$123",
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
  // Product photos ship with a white studio fill. Multiply knocks that white
  // out onto the well's gradient (`isolate` keeps the blend inside the well).
  const photoClassName = cn(
    "size-full object-cover mix-blend-multiply",
    !soldOut &&
      "transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/product-card:scale-105",
  );

  return (
    <VStack
      className={cn("group/product-card w-full", className)}
      data-added-to-cart={(!soldOut && addedToCart) || undefined}
      data-slot="product-card"
      data-sold-out={soldOut || undefined}
      gap="none"
    >
      <div
        className="relative isolate aspect-square w-full overflow-hidden rounded-(--radius-3xl) border border-[color:var(--border-subtle,var(--border))] bg-gradient-to-b from-[var(--gray-50,#fafafa)] to-[var(--gray-100,#f3f3f3)]"
        data-slot="product-card-image"
      >
        {soldOut ? (
          imageSrc ? (
            <img
              alt={imageAlt}
              className={cn("absolute inset-0", photoClassName)}
              src={imageSrc}
            />
          ) : null
        ) : (
          <button
            aria-label={cardAriaLabel}
            className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={onClick}
            type="button"
          >
            {imageSrc ? (
              <img
                alt=""
                aria-hidden
                className={photoClassName}
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
          <Badge className="absolute top-3 left-3" size="sm" variant="brand">
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
            <div className="relative">
              <IconButton
                aria-label={
                  typeof actionLabel === "string" ? actionLabel : undefined
                }
                onClick={onAction}
                size="md"
                variant="primary"
              >
                <ShoppingCartSimple aria-hidden size={14} weight="bold" />
              </IconButton>
              {addedToCart ? (
                <Center
                  aria-hidden
                  className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-accent-foreground px-1 text-xs font-medium text-primary-foreground"
                >
                  {quantity}
                </Center>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <VStack
        className="min-w-0 gap-2 py-2"
        data-slot="product-card-content"
        gap="none"
      >
        <p className="line-clamp-2 text-base font-medium text-card-foreground">
          {name}
        </p>
        <HStack gap="sm" vAlign="baseline">
          <p className="text-base font-medium text-card-foreground">{price}</p>
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
 * Product tile for a card-box / pack grid. Figma (`4200:155`) has a `soldOut`
 * axis; discount is a boolean that shows the SALE badge and original price.
 *
 * Hover scales the photo inside the well. Product photos keep a white studio
 * fill; multiply against the gray-50→gray-100 well makes that fill read as
 * transparent. The cart action is `IconButton` `primary` `md` (Figma
 * `4274:10075`) and appears on hover, or stays visible with a quantity when
 * the product is already in the cart. Sold-out tiles are inert.
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

export type { ProductCardProps };
export { ProductCard };
