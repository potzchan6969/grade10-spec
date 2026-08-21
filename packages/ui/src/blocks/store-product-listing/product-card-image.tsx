import { Badge } from "@grade10/design-system/components/display/badge";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import type { ReactNode } from "react";

/**
 * What the well says, whichever product is in it — supplied once for a whole
 * listing rather than restated per tile.
 */
type ProductCardImageCopy = {
  /** Accessible name for the cart control. */
  cart: string;
  /** Shown in place of the sale badge when the product has sold out. */
  soldOut?: string;
  /** Badge on a discounted product. Omit it and no badge is drawn. */
  sale?: string;
};

type ProductCardImageProps = {
  copy: ProductCardImageCopy;
  imageSrc?: string;
  imageAlt?: string;
  /** Whether this product is discounted — the badge follows it. */
  discounted?: boolean;
  soldOut?: boolean;
  inCart?: boolean;
  cartCount?: ReactNode;
  onCartClick?: () => void;
  /** Tile activation for the photo well. Ignored when `soldOut`. */
  onClick?: () => void;
  /** The product's own name, which names the well for a screen reader. */
  name?: string;
  className?: string;
};

/**
 * Product photo well. Figma set `Product / Product Card Image` (`4274:10074`)
 * has `state` (hover, CSS), `inCart`, `soldOut`, and BOOLEAN `sale`.
 *
 * Cart sits outside the well's activation target so nested buttons stay valid.
 * Hover and `:focus-within` reveal it when the product is available and not
 * already in the cart; in-cart always shows it; sold-out never does.
 */
function ProductCardImage({
  className,
  copy,
  imageSrc,
  imageAlt = "",
  discounted = false,
  soldOut = false,
  inCart = false,
  cartCount,
  onCartClick,
  onClick,
  name,
}: ProductCardImageProps) {
  const showCart = !soldOut;
  const cartAlwaysVisible = showCart && inCart;

  // Product photos ship with a white studio fill. Multiply knocks that white
  // out onto the well's gradient (`isolate` keeps the blend inside the well).
  const photoClassName = cn(
    "size-full object-cover mix-blend-multiply",
    !soldOut &&
      "transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/product-card-image:scale-105",
  );

  const well = (
    <>
      <div
        data-slot="product-card-image-well"
        className="absolute inset-0 isolate overflow-hidden rounded-(--radius-3xl) border border-[color:var(--border-subtle,var(--border))] bg-gradient-to-b from-[var(--gray-50,#fafafa)] to-[var(--gray-100,#f3f3f3)]"
      >
        {imageSrc ? (
          <img
            alt={soldOut ? imageAlt : ""}
            aria-hidden={soldOut ? undefined : true}
            className={photoClassName}
            src={imageSrc}
          />
        ) : null}
      </div>
      {soldOut && copy.soldOut != null ? (
        <Badge className="absolute top-3 left-3 z-10" size="sm">
          {copy.soldOut}
        </Badge>
      ) : null}
      {!soldOut && discounted && copy.sale != null ? (
        <Badge className="absolute top-3 left-3 z-10" size="sm" variant="brand">
          {copy.sale}
        </Badge>
      ) : null}
    </>
  );

  return (
    <div
      data-slot="product-card-image"
      data-sold-out={soldOut || undefined}
      data-in-cart={(!soldOut && inCart) || undefined}
      className={cn(
        "group/product-card-image relative aspect-square w-full rounded-(--radius-3xl)",
        className,
      )}
    >
      {soldOut || !onClick ? (
        <div className="absolute inset-0">{well}</div>
      ) : (
        <button
          aria-label={name}
          className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={onClick}
          type="button"
        >
          {well}
        </button>
      )}
      {showCart ? (
        <div
          className={cn(
            "absolute right-1 bottom-2 z-10 size-11",
            !cartAlwaysVisible &&
              "pointer-events-none opacity-0 group-focus-within/product-card-image:pointer-events-auto group-focus-within/product-card-image:opacity-100 group-hover/product-card-image:pointer-events-auto group-hover/product-card-image:opacity-100",
          )}
        >
          <IconButton
            aria-label={copy.cart}
            className="absolute bottom-0 left-0"
            onClick={onCartClick}
            size="md"
            variant="primary"
          >
            <ShoppingCartSimple aria-hidden size={14} weight="bold" />
          </IconButton>
          {inCart && cartCount != null ? (
            <StatusIndicator
              className="absolute top-0 right-0 z-10"
              type="count"
              variant="brand"
            >
              {cartCount}
            </StatusIndicator>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export type { ProductCardImageCopy, ProductCardImageProps };
export { ProductCardImage };
