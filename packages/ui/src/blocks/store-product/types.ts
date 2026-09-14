type StoreProductImage = {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
};

type StoreProductSaleItem = {
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  sku?: string | null;
};

type StoreProductPurchaseItem = Pick<
  StoreProductSaleItem,
  "availableForSale" | "quantityAvailable"
>;

export type {
  StoreProductImage,
  StoreProductPurchaseItem,
  StoreProductSaleItem,
};
