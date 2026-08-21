import { Badge } from "@grade10/design-system/components/display/badge";
import { StatusIndicator } from "@grade10/design-system/components/display/status-indicator";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type ProductCardImageProps = {
  imageSrc?: string;
  imageAlt?: string;
  saleLabel?: ReactNode;
  soldOut?: boolean;
  soldOutLabel?: ReactNode;
  inCart?: boolean;
  cartCount?: ReactNode;
  /** Required accessible name for the cart control. */
  cartLabel: string;
  onCartClick?: () => void;
  /** Tile activation for the photo well. Ignored when `soldOut`. */
  onClick?: () => void;
  ariaLabel?: string;
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
  imageSrc,
  imageAlt = "",
  saleLabel,
  soldOut = false,
  soldOutLabel,
  inCart = false,
  cartCount,
  cartLabel,
  onCartClick,
  onClick,
  ariaLabel,
}: ProductCardImageProps) {
  const showCart = !soldOut;
  const cartAlwaysVisible = showCart && inCart;

  const well = (
    <>
      <div
        data-slot="product-card-image-well"
        className={cn(
          "absolute inset-0 overflow-hidden rounded-(--radius-md) bg-muted",
          soldOut && "opacity-50",
        )}
      >
        {imageSrc ? (
          <img
            alt={soldOut ? imageAlt : ""}
            aria-hidden={soldOut ? undefined : true}
            className={cn(
              "size-full object-cover",
              "transition-transform duration-200 ease-[ease] motion-reduce:transition-none",
              !soldOut &&
                "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/product-card-image:scale-105",
            )}
            src={imageSrc}
          />
        ) : null}
      </div>
      {soldOut && soldOutLabel != null ? (
        <Badge className="absolute top-3 left-3 z-10" size="sm">
          {soldOutLabel}
        </Badge>
      ) : null}
      {!soldOut && saleLabel != null ? (
        <Badge className="absolute top-3 left-3 z-10" size="sm" variant="brand">
          {saleLabel}
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
        "group/product-card-image relative aspect-square w-full rounded-(--radius-md)",
        className,
      )}
    >
      {soldOut || !onClick ? (
        <div className="absolute inset-0">{well}</div>
      ) : (
        <button
          aria-label={ariaLabel}
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
            aria-label={cartLabel}
            className="absolute bottom-0 left-0"
            onClick={onCartClick}
            size="md"
            variant="secondary"
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

export type { ProductCardImageProps };
export { ProductCardImage };
