import { ProductCard } from "@grade10/design-system/components/display/product-card";
import { cn } from "@grade10/design-system/lib/utils";
import type { ProductSummary } from "./types";

type ProductGridProps = {
  products: readonly ProductSummary[];
  onProductClick?: (productId: string) => void;
  onProductAction?: (productId: string) => void;
  onProductQuantityChange?: (productId: string, quantity: number) => void;
  onProductWishlistClick?: (productId: string) => void;
  className?: string;
};

/**
 * A grid of product tiles. Renderable on its own, so a search-results surface
 * can reuse it without the listing root.
 *
 * The column progression is the component's, not the consumer's: a store that
 * wants a different grid wants a different design, not a prop.
 */
function ProductGrid({
  products,
  onProductClick,
  onProductAction,
  onProductQuantityChange,
  onProductWishlistClick,
  className,
}: ProductGridProps) {
  return (
    <div
      data-slot="product-grid"
      className={cn(
        "grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          addedToCart={product.addedToCart}
          actionLabel={product.actionLabel}
          ariaLabel={product.ariaLabel}
          category={product.category}
          description={product.description}
          discountLabel={product.discountLabel}
          imageAlt={product.imageAlt}
          imageSrc={product.imageSrc}
          key={product.id}
          name={product.name}
          onAction={
            onProductAction ? () => onProductAction(product.id) : undefined
          }
          onClick={
            onProductClick ? () => onProductClick(product.id) : undefined
          }
          onQuantityChange={
            onProductQuantityChange
              ? (value) => onProductQuantityChange(product.id, value)
              : undefined
          }
          onWishlistClick={
            onProductWishlistClick
              ? () => onProductWishlistClick(product.id)
              : undefined
          }
          originalPrice={product.originalPrice}
          price={product.price}
          quantity={product.quantity}
          soldOut={product.soldOut}
          wishlistLabel={product.wishlistLabel}
        />
      ))}
    </div>
  );
}

export type { ProductGridProps };
export { ProductGrid };
