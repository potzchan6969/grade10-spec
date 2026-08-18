import { cn } from "@grade10/design-system/lib/utils";
import { ProductCard } from "./product-card";
import type { ProductSummary } from "./types";

/** Figma tile width (`260px`) drives auto-fill so columns grow with the
 * results area while the sidebar stays fixed. */
const PRODUCT_LIST_GRID_CLASS =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-x-5 gap-y-6";

const DEFAULT_SKELETON_COUNT = 8;

type ProductListProps = {
  products: readonly ProductSummary[];
  /** Renders Boneyard skeleton tiles instead of product data. */
  loading?: boolean;
  /** Placeholder count while loading; defaults to `products.length` or 8. */
  skeletonCount?: number;
  onProductClick?: (productId: string) => void;
  onProductAction?: (productId: string) => void;
  /** Drives the staggered entrance after a `loading → ready` reload. */
  revealed?: boolean;
  revealStaggerMs?: number;
  revealStaggerCap?: number;
  className?: string;
};

/**
 * A grid of product tiles. Renderable on its own, so a search-results surface
 * can reuse it without the browse root.
 *
 * The column count follows the available width after the fixed sidebar: each
 * tile needs at least 260px (Figma's card width). A store that wants a
 * different grid wants a different design, not a prop.
 */
function ProductList({
  products,
  loading = false,
  skeletonCount,
  onProductClick,
  onProductAction,
  revealed = true,
  revealStaggerMs = 40,
  revealStaggerCap = 8,
  className,
}: ProductListProps) {
  const placeholderCount =
    skeletonCount ?? (products.length > 0 ? products.length : DEFAULT_SKELETON_COUNT);

  return (
    <div
      data-revealed={revealed || undefined}
      data-slot="product-list"
      className={cn(PRODUCT_LIST_GRID_CLASS, className)}
    >
      {loading
        ? Array.from({ length: placeholderCount }, (_, index) => (
            <ProductCard
              key={`product-skeleton-${index}`}
              loading
              name=""
              price=""
            />
          ))
        : products.map((product, index) => (
        <div
          className={cn(
            "translate-y-3 opacity-0 blur-[3px]",
            "transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none",
            revealed && "translate-y-0 opacity-100 blur-none",
          )}
          key={product.id}
          style={{
            transitionDelay: revealed
              ? `${Math.min(index, revealStaggerCap) * revealStaggerMs}ms`
              : "0ms",
          }}
        >
          <ProductCard
            addedToCart={product.addedToCart}
            actionLabel={product.actionLabel}
            ariaLabel={product.ariaLabel}
            discountLabel={product.discountLabel}
            imageAlt={product.imageAlt}
            imageSrc={product.imageSrc}
            name={product.name}
            onAction={
              onProductAction ? () => onProductAction(product.id) : undefined
            }
            onClick={
              onProductClick ? () => onProductClick(product.id) : undefined
            }
            originalPrice={product.originalPrice}
            price={product.price}
            quantity={product.quantity}
            soldOut={product.soldOut}
            tags={product.tags}
          />
        </div>
      ))}
    </div>
  );
}

export type { ProductListProps };
export { PRODUCT_LIST_GRID_CLASS, ProductList };
