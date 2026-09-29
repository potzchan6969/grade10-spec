import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  CartDrawer,
  type CartItemSummary,
  LISTING_LOT_GALLERY_CLASS,
  ListingLotGallery,
  type PromoState,
  StoreProductDescription,
  StoreProductHeader,
  StoreProductMetadata,
  StoreProductPurchasePanel,
} from "@grade10/ui";
import { useMemo, useState } from "react";
import type { ProductDetailProduct } from "../pages/product-detail-content";
import { STORE_CART_COPY } from "../pages/store-content";

const ADD_TO_CART_MS = 400;
const CART_FETCH_MS = 400;

const COPY = {
  description: { showLess: "Show less", showMore: "Show more" },
  gallery: {
    previous: "Previous image",
    next: "Next image",
    images: "Product images",
  },
  header: {
    onlyLeft: (count: number) => `Only ${count} left`,
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
    adding: "Adding…",
    addToCart: "Add to cart",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    quantityLabel: "Quantity",
    soldOut: "Sold out",
  },
};

function parseDisplayAmount(value: string): number {
  const match = value.replace(/,/g, "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function formatHkd(amount: number): string {
  return `HK$${amount.toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

type StoreProductDetailProps = {
  product: ProductDetailProduct;
};

function StoreProductDetail({ product }: StoreProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(
    {},
  );
  const [promoState, setPromoState] = useState<PromoState>({
    status: "collapsed",
  });

  const saleItem =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];

  const cartItems = useMemo((): CartItemSummary[] => {
    return Object.entries(cartQuantities)
      .filter(([, qty]) => qty > 0)
      .flatMap(([id, qty]) => {
        const variant = product.variants.find((item) => item.id === id);
        if (!variant) return [];
        const item: CartItemSummary = {
          id,
          name: product.title,
          price: variant.price,
          originalPrice: variant.compareAtPrice,
          imageSrc: product.images[0]?.src,
          imageAlt: product.images[0]?.alt,
          quantity: qty,
          status: variant.availableForSale ? "default" : "soldOut",
        };
        return [item];
      });
  }, [cartQuantities, product]);

  const cartTotal = useMemo(() => {
    const amount = cartItems.reduce((sum, item) => {
      if (item.status === "soldOut") return sum;
      return sum + parseDisplayAmount(String(item.price)) * item.quantity;
    }, 0);
    return formatHkd(amount);
  }, [cartItems]);

  const handleAddToCart = () => {
    if (!saleItem || adding) return;
    setAdding(true);
    window.setTimeout(() => {
      setCartQuantities((previous) => ({
        ...previous,
        [saleItem.id]: (previous[saleItem.id] ?? 0) + quantity,
      }));
      setQuantity(1);
      setAdding(false);
      setCartOpen(true);
    }, ADD_TO_CART_MS);
  };

  return (
    <>
      <main className="flex-1">
        <VStack
          gap="lg"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:py-12"
        >
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-12">
            {/* `contents` on small viewports so title/price stay above the
                gallery while description and buy controls sit below it. */}
            <div className="contents lg:order-2 lg:flex lg:flex-col lg:gap-6 lg:sticky lg:top-24">
              <div className="order-1">
                <StoreProductHeader
                  copy={COPY.header}
                  saleItem={saleItem}
                  title={product.title}
                />
              </div>
              <VStack className="order-3 gap-6" gap="none">
                <StoreProductDescription
                  copy={COPY.description}
                  description={product.description}
                />
                <VStack className="gap-12" gap="none">
                  <StoreProductPurchasePanel
                    copy={COPY.purchase}
                    loading={adding}
                    onAddToCart={handleAddToCart}
                    onQuantityChange={setQuantity}
                    quantity={quantity}
                    saleItem={
                      saleItem
                        ? {
                            availableForSale: saleItem.availableForSale,
                          }
                        : undefined
                    }
                  />
                  <StoreProductMetadata
                    badges={product.badges}
                    copy={COPY.metadata}
                    sku={saleItem?.sku}
                  />
                </VStack>
              </VStack>
            </div>

            <div className="order-2 lg:order-1">
              {product.images.length > 0 ? (
                <ListingLotGallery
                  copy={COPY.gallery}
                  images={product.images}
                />
              ) : (
                <div
                  aria-label={product.title}
                  className={`${LISTING_LOT_GALLERY_CLASS} aspect-square rounded-(--radius-3xl) border border-border bg-linear-to-br from-muted via-background-subtle to-muted`}
                  role="img"
                />
              )}
            </div>
          </div>
        </VStack>
      </main>
      <CartDrawer
        copy={STORE_CART_COPY}
        estimatedTotal={cartTotal}
        items={cartItems}
        onCheckout={async () => {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }}
        onClose={() => setCartOpen(false)}
        onFetchStatusAndPrice={async () => {
          await new Promise((resolve) => setTimeout(resolve, CART_FETCH_MS));
        }}
        onPromoStateChange={setPromoState}
        onQuantityChange={(itemId, nextQuantity) =>
          setCartQuantities((previous) => {
            if (nextQuantity <= 0) {
              const next = { ...previous };
              delete next[itemId];
              return next;
            }
            return { ...previous, [itemId]: nextQuantity };
          })
        }
        onRemoveItem={(itemId) =>
          setCartQuantities((previous) => {
            const next = { ...previous };
            delete next[itemId];
            return next;
          })
        }
        open={cartOpen}
        promoState={promoState}
        shippingEstimate="Calculated at checkout"
        subtotal={cartTotal}
      />
    </>
  );
}

export type { StoreProductDetailProps };
export { StoreProductDetail };
