import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { StoreProductPurchaseItem } from "./types";

type StoreProductPurchasePanelCopy = {
  addedToCart: string;
  addToCart: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  notForSaleNote: string;
  quantityLabel: string;
  soldOut: string;
};

type StoreProductPurchasePanelProps = {
  added: boolean;
  copy: StoreProductPurchasePanelCopy;
  loading?: boolean;
  onAddToCart: () => void;
  onQuantityChange: (value: number) => void;
  quantity: number;
  saleItem?: StoreProductPurchaseItem;
};

function StoreProductPurchasePanel({
  added,
  copy,
  loading = false,
  onAddToCart,
  onQuantityChange,
  quantity,
  saleItem,
}: StoreProductPurchasePanelProps) {
  const forSale = saleItem?.availableForSale === true;

  return (
    <VStack data-slot="store-product-purchase-panel" gap="lg">
      <StepperInput
        aria-label={copy.quantityLabel}
        decrementLabel={copy.decreaseQuantity}
        disabled={!forSale || loading}
        incrementLabel={copy.increaseQuantity}
        label={copy.quantityLabel}
        max={saleItem?.quantityAvailable ?? undefined}
        min={1}
        onValueChange={onQuantityChange}
        size="lg"
        value={quantity}
      />

      <Button
        className="w-full"
        disabled={!forSale}
        loading={loading}
        onClick={onAddToCart}
      >
        {forSale ? (added ? copy.addedToCart : copy.addToCart) : copy.soldOut}
      </Button>
      {!forSale ? (
        <Text size="sm" tone="secondary">
          {copy.notForSaleNote}
        </Text>
      ) : null}
    </VStack>
  );
}

export type { StoreProductPurchasePanelCopy, StoreProductPurchasePanelProps };
export { StoreProductPurchasePanel };
