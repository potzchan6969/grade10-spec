import type { ProductSummary } from "../store-product-listing/types";
import type { StoreProductRelatedRailCopy } from "./store-product-related-rail";
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
  },
};

const RELATED_RAIL_COPY = {
  heading: "You may also like",
  card: { soldOut: "SOLD OUT", sale: "SALE" },
} satisfies StoreProductRelatedRailCopy;

/** Seven cards: more than the rail's page ever hands over, to show the block
 * draws what it is given; the second discounted, the last one sold out. Each
 * carries its own address, as the page supplies it. */
const RELATED_RAIL_STORY: readonly ProductSummary[] = Array.from(
  { length: 7 },
  (_, index) => ({
    id: `related-${index + 1}`,
    href: `/store/products/booster-box-set-${index + 1}`,
    name: `Pokémon TCG Booster Box – Set ${index + 1}`,
    imageSrc: IMAGE,
    imageAlt: `Booster box ${index + 1}`,
    price: `HK$${105 + index * 10}`,
    originalPrice: index === 1 ? "HK$135" : undefined,
    soldOut: index === 6,
  }),
);

/** The rail's sold-out card: the last of the seven. */
const RELATED_RAIL_SOLD_OUT: ProductSummary = RELATED_RAIL_STORY[6];

/** A discounted card whose name runs past two lines at a phone's tile width,
 * priced the way the store formats a dear card. */
const RELATED_RAIL_LONG_NAME: ProductSummary = {
  id: "related-long-name",
  href: "/store/products/pokemon-tcg-sword-and-shield-evolving-skies-booster-box",
  name: "Pokémon TCG Sword & Shield Evolving Skies Booster Box (Japanese, sealed)",
  imageSrc: IMAGE,
  imageAlt: "Evolving Skies booster box",
  price: "HK$18,999.00",
  originalPrice: "HK$21,999.00",
};

export {
  DESCRIPTION_COPY,
  HEADER_COPY,
  METADATA_COPY,
  PRODUCT_DETAIL_STORY,
  PURCHASE_COPY,
  RELATED_RAIL_COPY,
  RELATED_RAIL_LONG_NAME,
  RELATED_RAIL_SOLD_OUT,
  RELATED_RAIL_STORY,
  SOLD_OUT_PRODUCT_STORY,
};
