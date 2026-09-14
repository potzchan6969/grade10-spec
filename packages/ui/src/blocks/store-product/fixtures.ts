import type { StoreProductImage, StoreProductSaleItem } from "./types";

const IMAGE = new URL(
  "../store-product-listing/product.fixture.png",
  import.meta.url,
).href;

const PRODUCT_IMAGES: readonly StoreProductImage[] = [
  {
    src: IMAGE,
    alt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), front view",
  },
  {
    src: IMAGE,
    alt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), detail view",
  },
];

const SALE_ITEM: StoreProductSaleItem = {
  price: "HK$105.00",
  compareAtPrice: "HK$123.00",
  availableForSale: true,
  quantityAvailable: 3,
  sku: "G10-M5-ABYSS-STD",
};

const PRODUCT_DETAIL_STORY = {
  title: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  description:
    "A sealed Japanese Pokémon TCG booster box for collectors and openers. Keep the complete set together or discover the cards inside one pack at a time. Each box is carefully selected and shipped from our Hong Kong showroom.",
  images: PRODUCT_IMAGES,
  badges: ["Booster Box", "Pokémon", "Japanese"],
  saleItem: SALE_ITEM,
};

const DESCRIPTION_COPY = {
  showMore: "Show more",
  showLess: "Show less",
};

const HEADER_COPY = {
  home: "Home",
  onlyLeft: (count: number) => `Only ${count} left`,
  shop: "Shop",
};

const METADATA_COPY = {
  aboutThisItem: "About This Item",
  freePickupAt: "Free pick-up at",
  hongKongGrade10Store: "Hong Kong Grade10 Store",
  shippingAndPickup: "Shipping & Pickup",
  shippingCalculatedAtCheckout: "Shipping calculated at checkout",
  shippingFee: "Shipping fee",
  skuLabel: "SKU",
};

const PURCHASE_COPY = {
  addedToCart: "Added to cart",
  addToCart: "Add to cart",
  decreaseQuantity: "Decrease quantity",
  increaseQuantity: "Increase quantity",
  notForSaleNote: "This product is not for sale.",
  quantityLabel: "Quantity",
  soldOut: "Sold out",
};

const SOLD_OUT_PRODUCT_STORY = {
  ...PRODUCT_DETAIL_STORY,
  saleItem: {
    ...SALE_ITEM,
    availableForSale: false,
    quantityAvailable: 0,
  },
};

export {
  DESCRIPTION_COPY,
  HEADER_COPY,
  METADATA_COPY,
  PRODUCT_DETAIL_STORY,
  PURCHASE_COPY,
  SOLD_OUT_PRODUCT_STORY,
};
