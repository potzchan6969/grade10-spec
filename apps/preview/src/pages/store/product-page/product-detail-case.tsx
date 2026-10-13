import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  ListingLotGallery,
  StoreProductDescription,
  StoreProductHeader,
  StoreProductMetadata,
  StoreProductPurchasePanel,
} from "@grade10/ui";
import { fn } from "storybook/test";
import { STORE_LOCATOR_HREF } from "../../workbench-story-nav";
import type { ProductDetailProduct } from "./product-detail-content";
import { STORE_PRODUCT_DETAIL_COPY as COPY } from "./store-product-detail";

/**
 * The product detail parts for one card of a Flow, in the state of that step.
 * `StoreProductDetail` draws the page's `main` landmark and its own cart
 * drawer, so a Flow, which lays several steps side by side, composes the
 * parts in plain layout instead.
 */
function ProductDetailCase({
  adding = false,
  product,
  quantity = 1,
}: {
  adding?: boolean;
  product: ProductDetailProduct;
  quantity?: number;
}) {
  const saleItem =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];

  return (
    <VStack gap="lg">
      {product.images.length > 0 ? (
        <ListingLotGallery copy={COPY.gallery} images={product.images} />
      ) : (
        <div
          aria-label={product.title}
          className="aspect-square w-full rounded-2xl border border-border bg-muted"
          role="img"
        />
      )}
      <StoreProductHeader
        copy={COPY.header}
        saleItem={saleItem}
        title={product.title}
      />
      <StoreProductDescription
        copy={COPY.description}
        description={product.description}
      />
      <StoreProductPurchasePanel
        copy={COPY.purchase}
        loading={adding}
        onAddToCart={fn()}
        onQuantityChange={fn()}
        quantity={quantity}
        saleItem={
          saleItem ? { availableForSale: saleItem.availableForSale } : undefined
        }
      />
      <StoreProductMetadata
        badges={product.badges}
        copy={COPY.metadata}
        pickupHref={STORE_LOCATOR_HREF}
        sku={saleItem?.sku}
      />
    </VStack>
  );
}

export { ProductDetailCase };
