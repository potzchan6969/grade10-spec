import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
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
            <StoreProductHeader saleItem={saleItem} title={product.title} />
            <StoreProductDescription description={product.description} />
            <StoreProductPurchasePanel
              added={added}
              onAddToCart={() => setAdded(true)}
              onQuantityChange={setQuantity}
              quantity={quantity}
              saleItem={saleItem}
            />
            <StoreProductMetadata badges={product.badges} sku={saleItem?.sku} />

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
