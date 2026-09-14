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

const SOLD_OUT_PRODUCT_STORY = {
  ...PRODUCT_DETAIL_STORY,
  saleItem: {
    ...SALE_ITEM,
    availableForSale: false,
    quantityAvailable: 0,
  },
};

export { PRODUCT_DETAIL_STORY, SOLD_OUT_PRODUCT_STORY };
