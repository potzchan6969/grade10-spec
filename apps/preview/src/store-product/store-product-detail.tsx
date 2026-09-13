import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { useState } from "react";
import type { ProductDetailProduct } from "../pages/product-detail-content";
import { StoreProductDescription } from "./store-product-description";
import { StoreProductGallery } from "./store-product-gallery";
import { StoreProductHeader } from "./store-product-header";
import { StoreProductMetadata } from "./store-product-metadata";
import { StoreProductPurchasePanel } from "./store-product-purchase-panel";

type StoreProductDetailProps = {
  product: ProductDetailProduct;
};

function StoreProductDetail({ product }: StoreProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  return (
    <main className="flex-1">
      <VStack
        gap="lg"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:py-12"
      >
        <Breadcrumbs>
          <BreadcrumbItem href="#home">Home</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#shop">Shop</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>{product.title}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-12">
          <StoreProductGallery images={product.images} title={product.title} />

          <VStack gap="lg" className="lg:sticky lg:top-24">
            <StoreProductHeader
              title={product.title}
              variant={selectedVariant}
            />
            <StoreProductDescription description={product.description} />
            <StoreProductPurchasePanel
              added={added}
              onAddToCart={() => setAdded(true)}
              onQuantityChange={setQuantity}
              onSelectedVariantIdChange={(value) => {
                setSelectedVariantId(value);
                setQuantity(1);
                setAdded(false);
              }}
              quantity={quantity}
              selectedVariantId={selectedVariantId}
              variants={product.variants}
            />
            <StoreProductMetadata
              badges={product.badges}
              sku={selectedVariant?.sku}
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
