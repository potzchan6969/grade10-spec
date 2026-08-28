import { cn } from "@grade10/design-system/lib/utils";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import {
  type FocusEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProductCardCartStepperRow } from "./product-card-cart-stepper-row";

type CartControlMode = "hidden" | "collapsed" | "expanded";

type ProductCardCartControlCopy = {
  cart: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  removeFromCart: string;
  adjustQuantity: string;
};

type ProductCardCartControlProps = {
  copy: ProductCardCartControlCopy;
  inCart: boolean;
  cartCount?: ReactNode;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
};

function parseCartQuantity(
  cartCount: ReactNode | undefined,
  inCart: boolean,
): number {
  if (!inCart) return 0;
  if (cartCount == null) return 1;
  if (typeof cartCount === "number") return cartCount;
  if (typeof cartCount === "string") {
    const match = cartCount.match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 1;
  }
  return 1;
}

function collapsedLabel(
  copy: ProductCardCartControlCopy,
  cartCount: ReactNode | undefined,
  quantity: number,
): string {
  const display =
    cartCount != null && cartCount !== ""
      ? String(cartCount)
      : String(quantity);
  return `${display}. ${copy.adjustQuantity}`;
}

function ProductCardCartControl({
  copy,
  inCart,
  cartCount,
  quantity,
  onQuantityChange,
}: ProductCardCartControlProps) {
  const containerRef = useRef<HTMLFieldSetElement>(null);
  const [mode, setMode] = useState<CartControlMode>(() =>
    inCart ? "collapsed" : "hidden",
  );

  const cartAlwaysVisible = inCart;
  const isExpanded = mode === "expanded";
  const isCollapsed = mode === "collapsed" && inCart;
  const isIdle = mode === "hidden" && !inCart;

  useEffect(() => {
    if (!inCart) {
      setMode("hidden");
      return;
    }
    setMode((current) => (current === "hidden" ? "collapsed" : current));
  }, [inCart]);

  const collapseIfExpanded = () => {
    setMode((current) => {
      if (current !== "expanded") return current;
      return inCart ? "collapsed" : "hidden";
    });
  };

  const handleBlur = (event: FocusEvent<HTMLFieldSetElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      collapseIfExpanded();
    }
  };

  const report = (next: number) => {
    onQuantityChange?.(next);
  };

  const widthClass = isExpanded ? "w-[7.5rem]" : isCollapsed ? "w-12" : "w-10";

  const displayCount =
    cartCount != null && cartCount !== "" ? cartCount : quantity;

  return (
    <fieldset
      ref={containerRef}
      className={cn(
        "cart-control absolute right-2 bottom-2 z-10 m-0 size-11 min-w-0 border-0 p-0 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none",
        !cartAlwaysVisible && "pointer-events-none",
        cartAlwaysVisible && "pointer-events-auto opacity-100",
      )}
      onBlur={handleBlur}
    >
      <div
        className={cn(
          "absolute bottom-0 right-0 h-10 overflow-hidden rounded-full bg-primary transition-[width] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          widthClass,
        )}
        onPointerLeave={collapseIfExpanded}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            isIdle
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <button
            aria-label={copy.cart}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-primary-foreground transition-[box-shadow] duration-150 ease-out hover:shadow-[inset_0_0_20px_rgb(255_255_255_/_30%)] motion-reduce:transition-none"
            onClick={(event) => {
              event.stopPropagation();
              report(1);
              setMode("expanded");
            }}
            tabIndex={isIdle ? 0 : -1}
            type="button"
          >
            <ShoppingCartSimple aria-hidden size={14} weight="bold" />
          </button>
        </div>

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            isCollapsed
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <button
            aria-label={collapsedLabel(copy, cartCount, quantity)}
            className="flex h-10 w-full cursor-pointer items-center justify-center border-0 bg-transparent px-1 text-sm font-semibold text-primary-foreground"
            onClick={(event) => {
              event.stopPropagation();
              setMode("expanded");
            }}
            tabIndex={isCollapsed ? 0 : -1}
            type="button"
          >
            ×{displayCount}
          </button>
        </div>

        <div
          className={cn(
            "absolute inset-0 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            isExpanded
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <ProductCardCartStepperRow
            decrementLabel={copy.decreaseQuantity}
            incrementLabel={copy.increaseQuantity}
            onDecrement={() => {
              if (quantity <= 1) {
                report(0);
                setMode("hidden");
                return;
              }
              report(quantity - 1);
            }}
            onIncrement={() => report(quantity + 1)}
            qty={quantity}
            removeLabel={copy.removeFromCart}
          />
        </div>
      </div>
    </fieldset>
  );
}

export type { ProductCardCartControlCopy, ProductCardCartControlProps };
export { ProductCardCartControl, parseCartQuantity };
