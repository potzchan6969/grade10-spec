const IMAGE = new URL("./product.fixture.png", import.meta.url).href;

type ProductDetailVariant = {
  id: string;
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  quantityAvailable?: number;
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
      id: "sale-item",
      price: "HK$105.00",
      compareAtPrice: "HK$123.00",
      availableForSale: true,
      quantityAvailable: 3,
      sku: "G10-M5-ABYSS-STD",
    },
  ],
};

const SOLD_OUT_PRODUCT: ProductDetailProduct = {
  ...PRODUCT_DETAIL_PRODUCT,
  variants: PRODUCT_DETAIL_PRODUCT.variants.map((variant) => ({
    ...variant,
    availableForSale: false,
    quantityAvailable: 0,
  })),
};

export type { ProductDetailProduct, ProductDetailVariant };
export { PRODUCT_DETAIL_PRODUCT, SOLD_OUT_PRODUCT };
