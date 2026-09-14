import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  StoreProductDescription,
  StoreProductGallery,
  StoreProductHeader,
  StoreProductMetadata,
  StoreProductPurchasePanel,
} from "@grade10/ui";
import { useState } from "react";
import type { ProductDetailProduct } from "../pages/product-detail-content";

const COPY = {
  description: { showLess: "Show less", showMore: "Show more" },
  header: {
    home: "Home",
    onlyLeft: (count: number) => `Only ${count} left`,
    shop: "Shop",
  },
  metadata: {
    aboutThisItem: "About This Item",
    freePickupAt: "Free pick-up at",
    hongKongGrade10Store: "Hong Kong Grade10 Store",
    shippingAndPickup: "Shipping & Pickup",
    shippingCalculatedAtCheckout: "Shipping calculated at checkout",
    shippingFee: "Shipping fee",
    skuLabel: "SKU",
  },
  purchase: {
    addedToCart: "Added to cart",
    addToCart: "Add to cart",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    notForSaleNote: "This product is not for sale.",
    quantityLabel: "Quantity",
    soldOut: "Sold out",
  },
};

type StoreProductDetailProps = {
  product: ProductDetailProduct;
};

function StoreProductDetail({ product }: StoreProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const saleItem = product.variants[0];

  return (
    <main className="flex-1">
      <VStack
        gap="lg"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:py-12"
      >
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-12">
          <StoreProductGallery images={product.images} title={product.title} />

          <VStack gap="lg" className="lg:sticky lg:top-24">
            <StoreProductHeader
              availabilityCount={
                saleItem?.quantityAvailable != null &&
                saleItem.quantityAvailable > 0 &&
                saleItem.quantityAvailable <= 3
                  ? saleItem.quantityAvailable
                  : undefined
              }
              copy={COPY.header}
              homeHref="#home"
              saleItem={saleItem}
              shopHref="#shop"
              title={product.title}
            />
            <StoreProductDescription
              copy={COPY.description}
              description={product.description}
            />
            <StoreProductPurchasePanel
              added={added}
              copy={COPY.purchase}
              onAddToCart={() => setAdded(true)}
              onQuantityChange={setQuantity}
              quantity={quantity}
              saleItem={saleItem}
            />
            <StoreProductMetadata
              badges={product.badges}
              copy={COPY.metadata}
              sku={saleItem?.sku}
            />

            <Link href="#shop" size="sm">
              Back to the store
            </Link>
          </VStack>
        </div>
      </VStack>
    </main>
  );
}

export type { StoreProductDetailProps };
export { StoreProductDetail };
