import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ShoppingCartSimple } from "@phosphor-icons/react";
import type { StoreProductPurchaseItem } from "./types";

type StoreProductPurchasePanelCopy = {
  adding: string;
  addToCart: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  quantityLabel: string;
  soldOut: string;
};

type StoreProductPurchasePanelProps = {
  /** Why the last add was refused, already worded; shown under the button. */
  addFailed?: string;
  copy: StoreProductPurchasePanelCopy;
  loading?: boolean;
  onAddToCart: () => void;
  onQuantityChange: (value: number) => void;
  quantity: number;
  saleItem?: StoreProductPurchaseItem;
};

function StoreProductPurchasePanel({
  addFailed,
  copy,
  loading = false,
  onAddToCart,
  onQuantityChange,
  quantity,
  saleItem,
}: StoreProductPurchasePanelProps) {
  const forSale = saleItem?.availableForSale === true;
  const label = forSale
    ? loading
      ? copy.adding
      : copy.addToCart
    : copy.soldOut;

  return (
    <VStack
      className="gap-3"
      data-slot="store-product-purchase-panel"
      gap="none"
    >
      <StepperInput
        aria-label={copy.quantityLabel}
        decrementLabel={copy.decreaseQuantity}
        disabled={!forSale || loading}
        incrementLabel={copy.increaseQuantity}
        max={saleItem?.quantityAvailable ?? undefined}
        min={1}
        onValueChange={onQuantityChange}
        size="lg"
        value={quantity}
      />

      <Button
        className="w-full"
        disabled={!forSale}
        leading={
          forSale ? (
            <ShoppingCartSimple aria-hidden size={16} weight="bold" />
          ) : undefined
        }
        loading={loading}
        onClick={onAddToCart}
      >
        {label}
      </Button>
      {addFailed ? (
        <Text role="alert" size="sm" tone="error">
          {addFailed}
        </Text>
      ) : null}
    </VStack>
  );
}

export type { StoreProductPurchasePanelCopy, StoreProductPurchasePanelProps };
export { StoreProductPurchasePanel };
