import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type OrderHistoryLineItemProps = {
  /** Product name including quantity suffix (e.g. `Name × 2`). */
  product: ReactNode;
  /** Pre-formatted line total (e.g. `HK$210`). */
  total: ReactNode;
  imageSrc?: string;
  /** Accessible name for the thumbnail; use the product name at minimum. */
  imageAlt?: string;
  className?: string;
};

/**
 * A single line item within an order summary. Displays a product thumbnail,
 * the product name with quantity, and the line total.
 *
 * Figma set `Product / Order / Order Item` (`4901:3026`). Properties:
 * `product` (text), `total` (text). Embeds `Product / Image` (`4872:8386`) —
 * square thumbnail with gradient fallback, clipped to the card edge.
 * The image column is a height-driven square (Figma `aspect-[80/80]` +
 * `self-stretch`): a two-track grid sizes the row from the text, stretches
 * the image track to that height, and `aspect-square` sets width to match.
 * Nested in the card, the image well omits the outer stroke so it shares the
 * card border; `border-r` keeps the separator against the text column.
 * Product text already includes `× {qty}` from the data source.
 */
function OrderHistoryLineItem({
  product,
  total,
  imageSrc,
  imageAlt = "",
  className,
}: OrderHistoryLineItemProps) {
  return (
    // Height-driven square image column: flex aspect-square + stretch cannot
    // resolve width when the photo is abspos; a 2-track grid can.
    <div
      className={cn(
        "grid w-80 shrink-0 grid-cols-[auto_minmax(0,1fr)] items-stretch overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
      data-slot="order-history-line-item"
    >
      <div
        aria-hidden={imageSrc ? undefined : true}
        className="relative aspect-square h-auto min-h-0 min-w-0 self-stretch overflow-hidden border-r border-border bg-gradient-to-b from-background-subtle to-muted"
        data-slot="order-history-line-item-image"
      >
        {imageSrc ? (
          <img
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover"
            src={imageSrc}
          />
        ) : null}
      </div>
      <VStack
        className="min-w-0 px-4 py-3 text-sm leading-5 text-foreground"
        gap="sm"
        hAlign="stretch"
        vAlign="center"
      >
        <p className="w-full font-medium">{product}</p>
        <p className="w-full font-normal">{total}</p>
      </VStack>
    </div>
  );
}

export type { OrderHistoryLineItemProps };
export { OrderHistoryLineItem };
