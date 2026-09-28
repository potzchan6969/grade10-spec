import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import type { MouseEvent, ReactNode } from "react";
import {
  ProductCardCartControl,
  parseCartQuantity,
} from "./product-card-cart-control";

/**
 * A tile's link, pressed. A plain press is the consumer's to report, so the
 * link's own navigation gives way to it; a press with a modifier key opens
 * the address where the browser puts it — a new tab or a new window — and
 * reports nothing.
 */
function reportPlainPress(
  event: MouseEvent<HTMLAnchorElement>,
  onClick: (() => void) | undefined,
) {
  if (onClick == null || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  onClick();
}

/**
 * What the well says, whichever product is in it — supplied once for a whole
 * listing rather than restated per tile.
 *
 * The cart words are optional because the cart control is: a surface that
 * merchandises rather than sells draws none and so names none.
 */
type ProductCardImageCopy = {
  /** Accessible name for the add-to-cart affordance. */
  cart?: string;
  /** Stepper decrement control. */
  decreaseQuantity?: string;
  /** Stepper increment control. */
  increaseQuantity?: string;
  /** Stepper decrement at minimum (remove). */
  removeFromCart?: string;
  /** Collapsed in-cart control when the count is already shown. */
  adjustQuantity?: string;
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
  /**
   * Ceiling for the cart control, as the consumer supplies it. Omit it and the
   * control counts on: the well derives no maximum of its own.
   */
  maxCartQuantity?: number;
  /** Supply one to sell: the cart control is drawn only where it is present. */
  onCartQuantityChange?: (quantity: number) => void;
  /** Tile activation for the photo well. The card passes none for a sold-out
   * tile on a surface that sells, so a well with a handler always opens. */
  onClick?: () => void;
  /** The product's own address. Given one, the well is a link to it; the card
   * passes none for a tile that does not open. */
  href?: string;
  /** The product's own name, which names the well for a screen reader. */
  name?: string;
  className?: string;
};

/**
 * Product photo well. Figma set `Product / Product Card Image` (`4274:10074`)
 * has `state` (hover, CSS) and `soldOut`, plus the BOOLEAN `sale`. In-cart
 * chrome is an annotation on the set, not an axis, so `inCart` is code-only.
 * The set draws no hover on a sold-out well; one that opens takes the
 * available well's grow over its dim photo, and the focus ring either way.
 *
 * Cart sits outside the well's activation target so nested buttons stay valid.
 * It is drawn only where a quantity-change handler was supplied, so a surface
 * that merchandises rather than sells draws none and no press is swallowed.
 * Hover and `:focus-within` reveal it on fine pointers when the product is
 * available and not already in the cart; coarse pointers and narrow viewports
 * keep it visible; in-cart always shows it; sold-out never does.
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
  maxCartQuantity,
  onCartQuantityChange,
  onClick,
  href,
  name,
}: ProductCardImageProps) {
  const showCart = !soldOut && onCartQuantityChange != null;
  const quantity = parseCartQuantity(cartCount, inCart);
  const opens = onClick != null || href != null;

  /* A sold-out photo stays dim, and takes the hover wherever the well opens:
     the grow says the tile leads somewhere, sold out or not. */
  const photoClassName = cn(
    "size-full rounded-(--radius-3xl) object-contain",
    soldOut && "opacity-50",
    (!soldOut || opens) &&
      "transition-transform duration-200 ease-[ease] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/product-card-image:scale-105",
  );
  const activationClassName =
    "absolute inset-0 cursor-pointer overflow-hidden rounded-(--radius-3xl) border-0 bg-transparent p-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

  const well = (
    <>
      <div
        data-slot="product-card-image-well"
        className="absolute inset-0 isolate overflow-hidden rounded-(--radius-3xl) border border-[color:var(--border-subtle,var(--border))] bg-gradient-to-b from-[var(--gray-50,#fafafa)] to-[var(--gray-100,#f3f3f3)]"
      >
        {imageSrc ? (
          <img
            alt={opens ? "" : imageAlt}
            aria-hidden={opens ? true : undefined}
            className={photoClassName}
            src={imageSrc}
          />
        ) : null}
      </div>
      {soldOut && copy.soldOut != null ? (
        <Badge
          className="absolute top-3 left-3 z-10"
          size="sm"
          variant="outline"
        >
          {copy.soldOut}
        </Badge>
      ) : null}
      {!soldOut && discounted && copy.sale != null ? (
        <Badge
          className="absolute top-3 left-3 z-10"
          size="sm"
          variant="success"
        >
          {copy.sale}
        </Badge>
      ) : null}
    </>
  );

  return (
    <div
      data-slot="product-card-image"
      data-discounted={(discounted && !soldOut) || undefined}
      data-sold-out={soldOut || undefined}
      data-in-cart={(!soldOut && inCart) || undefined}
      className={cn(
        "group/product-card-image relative aspect-square w-full rounded-(--radius-3xl)",
        "[&:focus-within_.cart-control]:pointer-events-auto [&:focus-within_.cart-control]:opacity-100",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:[&_.cart-control]:pointer-events-auto",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:[&_.cart-control]:opacity-100",
        /* Phones / no-hover: round cart stays visible without a hover reveal. */
        "[@media(hover:none),_(pointer:coarse)]:[&_.cart-control]:pointer-events-auto",
        "[@media(hover:none),_(pointer:coarse)]:[&_.cart-control]:opacity-100",
        /* Narrow listing (same breakpoint as pill chrome): always on. */
        "max-lg:[&_.cart-control]:pointer-events-auto max-lg:[&_.cart-control]:opacity-100",
        className,
      )}
    >
      {!opens ? (
        <div className="absolute inset-0 overflow-hidden rounded-(--radius-3xl)">
          {well}
        </div>
      ) : href != null ? (
        <a
          aria-label={name}
          className={activationClassName}
          href={href}
          onClick={(event) => reportPlainPress(event, onClick)}
        >
          {well}
        </a>
      ) : (
        <button
          aria-label={name}
          className={activationClassName}
          onClick={onClick}
          type="button"
        >
          {well}
        </button>
      )}
      {showCart ? (
        <ProductCardCartControl
          cartCount={cartCount}
          copy={copy}
          inCart={inCart}
          maxQuantity={maxCartQuantity}
          onQuantityChange={onCartQuantityChange}
          quantity={quantity}
        />
      ) : null}
    </div>
  );
}

export type { ProductCardImageCopy, ProductCardImageProps };
export { ProductCardImage, reportPlainPress };
