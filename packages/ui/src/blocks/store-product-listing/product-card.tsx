import { Badge } from "@grade10/design-system/components/display/badge";
import { Button } from "@grade10/design-system/components/forms/button";
import { Stepper } from "@grade10/design-system/components/forms/stepper";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type ProductCardProps = {
  /** Product photo. Omit it and the muted image well still renders. */
  imageSrc?: string;
  imageAlt?: string;
  category: ReactNode;
  /** Product title. Clamped to one line with an ellipsis, matching Figma. */
  name: ReactNode;
  description?: ReactNode;
  /** Current (or discounted) price, already formatted. */
  price: ReactNode;
  /** Strikethrough original price. Presence is Figma's `hasDiscount` gate. */
  originalPrice?: ReactNode;
  /** Discount badge copy such as `−15%`. Hidden when `soldOut`. */
  discountLabel?: ReactNode;
  /**
   * Figma's `isSoldOut` axis. Dims the photo, swaps the discount badge for
   * SOLD OUT, and disables the action.
   */
  soldOut?: boolean;
  /**
   * Figma's `isAddedToCart` axis. Replaces the Add button with a quantity
   * stepper. Ignored when `soldOut` — that combination is not drawn.
   */
  addedToCart?: boolean;
  /** Quantity shown in the stepper. The consumer owns the value. */
  quantity?: number;
  onQuantityChange?: (value: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  /**
   * Fires when the card surface is activated. No navigation target is wired
   * here — the consumer decides what happens (route, modal, etc.).
   */
  onClick?: () => void;
  /** Accessible name when the card is interactive. Defaults to string `name`. */
  ariaLabel?: string;
  /** Action label. Defaults to `Add`, or `Sold Out` when `soldOut`. */
  actionLabel?: ReactNode;
  onAction?: () => void;
  className?: string;
};

/**
 * Product tile for a card-box / pack grid. Figma (`4200:155`) has two axes,
 * `isSoldOut` and `isAddedToCart`; discount is a boolean that shows the badge
 * and original price.
 *
 * The image and copy share one button target; the Add button / stepper sit
 * outside it so nested controls stay valid. Hover scales the photo inside the
 * clipped well. Sold-out tiles are inert.
 */
function ProductCard({
  className,
  imageSrc,
  imageAlt = "",
  category,
  name,
  description,
  price,
  originalPrice,
  discountLabel,
  soldOut = false,
  addedToCart = false,
  quantity = 1,
  onQuantityChange,
  minQuantity,
  maxQuantity,
  onClick,
  ariaLabel,
  actionLabel,
  onAction,
}: ProductCardProps) {
  const cardAriaLabel =
    ariaLabel ?? (typeof name === "string" ? name : undefined);

  const body = (
    <>
      <div
        data-slot="product-card-image"
        className="relative aspect-square w-full overflow-hidden rounded-(--radius-sm)"
      >
        <div
          className={cn("absolute inset-0 bg-muted", soldOut && "opacity-25")}
        >
          {imageSrc ? (
            <img
              alt={soldOut ? imageAlt : ""}
              aria-hidden={soldOut ? undefined : true}
              className={cn(
                "size-full object-cover",
                "transition-transform duration-200 ease-[ease] motion-reduce:transition-none",
                !soldOut &&
                  "[@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/product-card:scale-105",
              )}
              src={imageSrc}
            />
          ) : null}
        </div>
        {soldOut ? (
          <Badge className="absolute top-3 left-3" size="sm">
            SOLD OUT
          </Badge>
        ) : discountLabel != null ? (
          <Badge className="absolute top-3 left-3" size="sm" variant="success">
            {discountLabel}
          </Badge>
        ) : null}
      </div>
      <div
        data-slot="product-card-content"
        className="flex min-w-0 flex-col gap-2"
      >
        <div
          className={cn(
            "flex min-w-0 flex-col gap-1",
            soldOut ? "text-disabled-foreground" : "text-secondary-foreground",
          )}
        >
          <p className="text-xs font-medium">{category}</p>
          <p
            className={cn(
              "truncate text-sm font-medium",
              soldOut ? "text-disabled-foreground" : "text-card-foreground",
            )}
          >
            {name}
          </p>
          {description != null ? (
            <p className="text-xs font-normal">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
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
        </div>
      </div>
    </>
  );

  return (
    <div
      data-slot="product-card"
      data-sold-out={soldOut || undefined}
      data-added-to-cart={(!soldOut && addedToCart) || undefined}
      className={cn(
        "group/product-card flex w-full flex-col gap-3 pb-3",
        className,
      )}
    >
      {soldOut ? (
        <div className="flex w-full flex-col gap-3 text-left">{body}</div>
      ) : (
        <button
          type="button"
          aria-label={cardAriaLabel}
          onClick={onClick}
          className="flex w-full cursor-pointer flex-col gap-3 border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {body}
        </button>
      )}
      {soldOut ? (
        <Button className="w-full" disabled size="sm" variant="secondary">
          {actionLabel ?? "Sold Out"}
        </Button>
      ) : addedToCart ? (
        <Stepper
          max={maxQuantity}
          min={minQuantity}
          onValueChange={onQuantityChange}
          value={quantity}
        />
      ) : (
        <Button
          className="w-full"
          onClick={onAction}
          size="sm"
          variant="secondary"
        >
          {actionLabel ?? "Add"}
        </Button>
      )}
    </div>
  );
}

export type { ProductCardProps };
export { ProductCard };
