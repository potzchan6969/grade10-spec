import type { MouseEvent, ReactNode } from "react";

type ProductCardActivationProps = {
  /** The product's own address; given one, this is a link to it. */
  href?: string;
  /** Reported on a plain press, in place of the link's own navigation. */
  onClick?: () => void;
  "aria-label"?: string;
  /** A pointer target alone: out of the tab order and the accessibility
   * tree, since another control in the tile is its one stop. */
  pointerOnly?: boolean;
  className: string;
  children: ReactNode;
};

/**
 * What opens a tile's product, for the photo and the name alike: a link where
 * the tile has the product's address, a button where it has only a handler. A
 * plain press on the link is the consumer's to report, so the link's own
 * navigation gives way to it; a press with a modifier key opens the address
 * where the browser puts it, a new tab or a new window, and reports nothing.
 */
function ProductCardActivation({
  href,
  onClick,
  pointerOnly = false,
  className,
  children,
  ...given
}: ProductCardActivationProps) {
  const labelled = pointerOnly
    ? { tabIndex: -1, "aria-hidden": true as const }
    : given;
  if (href == null) {
    return (
      <button
        {...labelled}
        className={className}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  const reportPlainPress = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick == null || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    onClick();
  };

  return (
    <a
      {...labelled}
      className={className}
      href={href}
      onClick={reportPlainPress}
    >
      {children}
    </a>
  );
}

type ProductCardOpensProps = {
  onClick?: () => void;
  href?: string;
  soldOut?: boolean;
  onCartQuantityChange?: (quantity: number) => void;
};

/**
 * Whether a product opens: given a callback or its address, unless it is sold
 * out on a surface that sells. The photo, the name and the image used alone
 * all ask this one rule.
 */
function productCardOpens({
  onClick,
  href,
  soldOut = false,
  onCartQuantityChange,
}: ProductCardOpensProps): boolean {
  if (onClick == null && href == null) return false;
  return !(soldOut && onCartQuantityChange != null);
}

export { ProductCardActivation, productCardOpens };
