import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ProductDetailVariant } from "../pages/product-detail-content";

type StoreProductPurchasePanelProps = {
  added: boolean;
  onAddToCart: () => void;
  onQuantityChange: (value: number) => void;
  quantity: number;
  saleItem?: ProductDetailVariant;
};

function StoreProductPurchasePanel({
  added,
  onAddToCart,
  onQuantityChange,
  quantity,
  saleItem,
}: StoreProductPurchasePanelProps) {
  const forSale = saleItem?.availableForSale === true;

  return (
    <VStack data-slot="store-product-purchase-panel" gap="lg">
      <StepperInput
        aria-label="Quantity"
        decrementLabel="Decrease quantity"
        disabled={!forSale}
        incrementLabel="Increase quantity"
        label="Quantity"
        max={saleItem?.quantityAvailable}
        min={1}
        onValueChange={onQuantityChange}
        size="lg"
        value={quantity}
      />

      <Button className="w-full" disabled={!forSale} onClick={onAddToCart}>
        {forSale ? (added ? "Added to cart" : "Add to cart") : "Sold out"}
      </Button>
      {!forSale ? (
        <Text size="sm" tone="secondary">
          This product is not for sale.
        </Text>
      ) : null}
    </VStack>
  );
}

export type { StoreProductPurchasePanelProps };
export { StoreProductPurchasePanel };
