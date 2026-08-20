import { cn } from "@grade10/design-system/lib/utils";
import { ProductCard } from "./product-card";
import type { ProductSummary } from "./types";

/** Figma tile width on the Product List page (`250px`) drives auto-fill so
 * columns grow with the results area while the sidebar stays fixed. Gaps
 * match the page instance: 24px row, 32px column. */
const PRODUCT_LIST_GRID_CLASS =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-x-6 gap-y-8";

const DEFAULT_SKELETON_COUNT = 8;
/** Figma Product List annotation: ten items per fetch while scrolling. */
const DEFAULT_LOAD_MORE_SKELETON_COUNT = 10;

type ProductListProps = {
  products: readonly ProductSummary[];
  /** Renders Boneyard skeleton tiles instead of product data. */
  loading?: boolean;
  /** Placeholder count while loading; defaults to `products.length` or 8. */
  skeletonCount?: number;
  /** Appends Boneyard skeleton tiles below resolved products. */
  loadingMore?: boolean;
  /** Skeleton count while loading more; defaults to 10. */
  loadMoreSkeletonCount?: number;
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
 * tile needs at least 250px. A store that wants a different grid wants a
 * different design, not a prop.
 */
function ProductList({
  products,
  loading = false,
  skeletonCount,
  loadingMore = false,
  loadMoreSkeletonCount = DEFAULT_LOAD_MORE_SKELETON_COUNT,
  onProductClick,
  onProductAction,
  revealed = true,
  revealStaggerMs = 40,
  revealStaggerCap = 8,
  className,
}: ProductListProps) {
  const placeholderCount =
    skeletonCount ??
    (products.length > 0 ? products.length : DEFAULT_SKELETON_COUNT);

  return (
    <div
      data-revealed={revealed || undefined}
      data-slot="product-list"
      className={cn(PRODUCT_LIST_GRID_CLASS, className)}
    >
      {loading
        ? Array.from({ length: placeholderCount }, (_, index) => (
            <ProductCard
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity beyond position.
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
                  onProductAction
                    ? () => onProductAction(product.id)
                    : undefined
                }
                onClick={
                  onProductClick ? () => onProductClick(product.id) : undefined
                }
                originalPrice={product.originalPrice}
                price={product.price}
                quantity={product.quantity}
                soldOut={product.soldOut}
              />
            </div>
          ))}
      {loadingMore && !loading
        ? Array.from({ length: loadMoreSkeletonCount }, (_, index) => (
            <ProductCard
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity beyond position.
              key={`load-more-skeleton-${index}`}
              loading
              name=""
              price=""
            />
          ))
        : null}
    </div>
  );
}

export type { ProductListProps };
export {
  DEFAULT_LOAD_MORE_SKELETON_COUNT,
  PRODUCT_LIST_GRID_CLASS,
  ProductList,
};
