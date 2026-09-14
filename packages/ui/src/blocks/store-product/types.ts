type StoreProductImage = {
  src: string;
  alt: string;
};

type StoreProductSaleItem = {
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  sku?: string | null;
};

export type { StoreProductImage, StoreProductSaleItem };
