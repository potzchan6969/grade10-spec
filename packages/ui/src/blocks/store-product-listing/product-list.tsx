import { cn } from "@grade10/design-system/lib/utils";
import type { ProductCardCopy } from "./product-card";
import { ProductCard } from "./product-card";
import type { ProductSummary } from "./types";

/** What every tile in the list says the same way. */
type ProductListCopy = { card: ProductCardCopy };

/** Figma tile width on the Product List page (`240px`) drives auto-fill so
 * columns grow with the results area while the sidebar stays fixed. Gaps
 * match the page instance: 32px row and column. */
const PRODUCT_LIST_GRID_CLASS =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-8";

const DEFAULT_SKELETON_COUNT = 8;
/** Figma Product List annotation: ten items per fetch while scrolling. */
const DEFAULT_LOAD_MORE_SKELETON_COUNT = 10;

const APPEND_STAGGER_MS = 30;
const APPEND_STAGGER_CAP = 6;

type ProductListProps = {
  copy: ProductListCopy;
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
  onProductCartQuantityChange?: (productId: string, quantity: number) => void;
  /** Drives the staggered entrance after a `loading → ready` reload. */
  revealed?: boolean;
  revealStaggerMs?: number;
  revealStaggerCap?: number;
  /**
   * Tiles below this index stay settled. Appends animate from this index
   * with the quieter load-more recipe.
   */
  revealFromIndex?: number;
  className?: string;
};

/**
 * Infinite scroll product list.
 *
 * A grid of product tiles. Renderable on its own, so a search-results surface
 * can reuse it without the browse root.
 *
 * The column count follows the available width after the fixed sidebar: each
 * tile needs at least 240px. A store that wants a different grid wants a
 * different design, not a prop.
 */
function ProductList({
  copy,
  products,
  loading = false,
  skeletonCount,
  loadingMore = false,
  loadMoreSkeletonCount = DEFAULT_LOAD_MORE_SKELETON_COUNT,
  onProductClick,
  onProductCartQuantityChange,
  revealed = true,
  revealStaggerMs = 40,
  revealStaggerCap = 8,
  revealFromIndex = 0,
  className,
}: ProductListProps) {
  const placeholderCount =
    skeletonCount ??
    (products.length > 0 ? products.length : DEFAULT_SKELETON_COUNT);
  const isAppendReveal = revealFromIndex > 0;
  const staggerMs = isAppendReveal ? APPEND_STAGGER_MS : revealStaggerMs;
  const staggerCap = isAppendReveal ? APPEND_STAGGER_CAP : revealStaggerCap;
  const durationClass = isAppendReveal ? "duration-300" : "duration-400";

  return (
    <div
      className={cn(PRODUCT_LIST_GRID_CLASS, className)}
      data-revealed={revealed || undefined}
      data-slot="product-list"
    >
      {loading
        ? Array.from({ length: placeholderCount }, (_, index) => (
            <ProductCard
              copy={copy.card}
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders have no identity beyond position.
              key={`product-skeleton-${index}`}
              loading
              name=""
              price=""
            />
          ))
        : products.map((product, index) => {
            const isSettledTile = index < revealFromIndex;
            const staggerIndex = index - revealFromIndex;
            const showRevealed = isSettledTile || revealed;

            return (
              <div
                className={cn(
                  !isSettledTile &&
                    "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none",
                  !isSettledTile && durationClass,
                  isSettledTile && "translate-y-0 opacity-100 blur-none",
                  showRevealed &&
                    !isSettledTile &&
                    "translate-y-0 opacity-100 blur-none",
                )}
                key={product.id}
                style={{
                  transitionDelay:
                    showRevealed && !isSettledTile
                      ? `${Math.min(staggerIndex, staggerCap) * staggerMs}ms`
                      : "0ms",
                }}
              >
                <ProductCard
                  badges={product.badges}
                  cartCount={product.cartCount}
                  copy={copy.card}
                  imageAlt={product.imageAlt}
                  imageSrc={product.imageSrc}
                  inCart={product.inCart}
                  maxCartQuantity={product.maxCartQuantity}
                  name={product.name}
                  onCartQuantityChange={
                    onProductCartQuantityChange
                      ? (quantity) =>
                          onProductCartQuantityChange(product.id, quantity)
                      : undefined
                  }
                  onClick={
                    onProductClick
                      ? () => onProductClick(product.id)
                      : undefined
                  }
                  originalPrice={product.originalPrice}
                  price={product.price}
                  remainingLabel={product.remainingLabel}
                  soldOut={product.soldOut}
                />
              </div>
            );
          })}
      {loadingMore && !loading
        ? Array.from({ length: loadMoreSkeletonCount }, (_, index) => (
            <ProductCard
              copy={copy.card}
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

export type { ProductListCopy, ProductListProps };
export {
  DEFAULT_LOAD_MORE_SKELETON_COUNT,
  PRODUCT_LIST_GRID_CLASS,
  ProductList,
};
