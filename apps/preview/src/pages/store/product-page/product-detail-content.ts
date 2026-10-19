import type { ProductSummary } from "@grade10/ui";
import { storyHref } from "../../workbench-story-nav";

const IMAGE = new URL("../../product.fixture.png", import.meta.url).href;

type ProductDetailVariant = {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  sku: string;
};

type ProductDetailProduct = {
  title: string;
  description: string;
  images: { src: string; alt: string }[];
  badges: string[];
  variants: ProductDetailVariant[];
};

const PRODUCT_DETAIL_PRODUCT: ProductDetailProduct = {
  title: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  description:
    "A sealed Japanese Pokémon TCG booster box for collectors and openers. Keep the complete set together or discover the cards inside one pack at a time. Each box is carefully selected and shipped from our Hong Kong showroom.",
  images: [
    {
      src: IMAGE,
      alt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), front view",
    },
    {
      src: IMAGE,
      alt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), detail view",
    },
  ],
  badges: ["Booster Box", "Pokémon", "Japanese"],
  variants: [
    {
      id: "standard-box",
      title: "Standard box",
      price: "HK$105.00",
      compareAtPrice: "HK$123.00",
      availableForSale: true,
      sku: "G10-M5-ABYSS-STD",
    },
    {
      id: "collector-case",
      title: "Collector case",
      price: "HK$1,050.00",
      availableForSale: false,
      sku: "G10-M5-ABYSS-CASE",
    },
    {
      id: "gift-bundle",
      title: "Gift bundle",
      price: "HK$210.00",
      availableForSale: true,
      sku: "G10-M5-ABYSS-GIFT",
    },
  ],
};

const SOLD_OUT_PRODUCT: ProductDetailProduct = {
  ...PRODUCT_DETAIL_PRODUCT,
  variants: PRODUCT_DETAIL_PRODUCT.variants.map((variant) => ({
    ...variant,
    availableForSale: false,
  })),
};

/** The story id of this product page, which every related card links to. */
const PRODUCT_DETAIL_STORY_ID =
  "store-product-page-screens-product-detail--default";

/** The product listing the unknown-address page sends a collector back to. */
const PRODUCT_LIST_STORY_ID =
  "store-product-listing-screens-product-list--default";

/** Cards shown under a product: picks and similar cards, one of them sold out. */
const RELATED_PRODUCTS: ProductSummary[] = [
  {
    id: "related-1",
    name: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
    href: storyHref(PRODUCT_DETAIL_STORY_ID),
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4)",
    price: "HK$780",
  },
  {
    id: "related-2",
    name: "Pokémon TCG Sealed Booster Box – Storm Emeralda (M6)",
    href: storyHref(PRODUCT_DETAIL_STORY_ID),
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Storm Emeralda (M6)",
    price: "HK$780",
    originalPrice: "HK$820",
  },
  {
    id: "related-3",
    name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), collector case",
    href: storyHref(PRODUCT_DETAIL_STORY_ID),
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5), collector case",
    price: "HK$1,050",
    soldOut: true,
  },
  {
    id: "related-4",
    name: "Pokémon TCG Elite Trainer Box – Abyss Eye (M5)",
    href: storyHref(PRODUCT_DETAIL_STORY_ID),
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Elite Trainer Box – Abyss Eye (M5)",
    price: "HK$320",
  },
  {
    id: "related-5",
    name: "Pokémon TCG Booster Pack – Abyss Eye (M5)",
    href: storyHref(PRODUCT_DETAIL_STORY_ID),
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Booster Pack – Abyss Eye (M5)",
    price: "HK$28",
  },
  {
    id: "related-6",
    name: "Pokémon TCG Sealed Booster Box – Mega Dream (M3)",
    href: storyHref(PRODUCT_DETAIL_STORY_ID),
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Mega Dream (M3)",
    price: "HK$690",
  },
];

/** Words for the rail and the unknown-address page, not yet in `@grade10/i18n`. */
const YOU_MAY_ALSO_LIKE_COPY = {
  heading: "You may also like",
  card: { soldOut: "SOLD OUT", sale: "SALE" },
};

const UNKNOWN_PRODUCT_COPY = {
  title: "We couldn’t find this product",
  description: "Check the address, or browse the store for what is available.",
  browseStore: "Browse the store",
};

export type { ProductDetailProduct, ProductDetailVariant };
export {
  PRODUCT_DETAIL_PRODUCT,
  PRODUCT_DETAIL_STORY_ID,
  PRODUCT_LIST_STORY_ID,
  RELATED_PRODUCTS,
  SOLD_OUT_PRODUCT,
  UNKNOWN_PRODUCT_COPY,
  YOU_MAY_ALSO_LIKE_COPY,
};
