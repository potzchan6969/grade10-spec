import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ProductDetailVariant } from "../pages/product-detail-content";

type StoreProductPurchasePanelProps = {
  added: boolean;
  onAddToCart: () => void;
  onQuantityChange: (value: number) => void;
  onSelectedVariantIdChange: (value: string) => void;
  quantity: number;
  selectedVariantId: string;
  variants: readonly ProductDetailVariant[];
};

function StoreProductPurchasePanel({
  added,
  onAddToCart,
  onQuantityChange,
  onSelectedVariantIdChange,
  quantity,
  selectedVariantId,
  variants,
}: StoreProductPurchasePanelProps) {
  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  );
  const forSale = selectedVariant?.availableForSale === true;

  return (
    <VStack data-slot="store-product-purchase-panel" gap="lg">
      {variants.length > 1 ? (
        <RadioList
          label="Grade"
          onValueChange={(value) => {
            const next = variants.find(
              (variant) => variant.id === String(value),
            );
            if (!next?.availableForSale) return;
            onSelectedVariantIdChange(next.id);
          }}
          value={selectedVariantId}
        >
          {variants.map((variant) => (
            <RadioListItem
              disabled={!variant.availableForSale}
              key={variant.id}
              value={variant.id}
            >
              <HStack gap="sm">
                <Text className="w-32 shrink-0" size="sm" weight="bold">
                  {variant.title}
                </Text>
                <Text size="sm" tone="secondary">
                  {variant.price}
                  {variant.availableForSale ? "" : " — sold out"}
                </Text>
              </HStack>
            </RadioListItem>
          ))}
        </RadioList>
      ) : selectedVariant ? (
        <HStack
          className="items-center justify-between rounded-(--radius-md) bg-muted px-4 py-3"
          gap="sm"
        >
          <Text size="sm" weight="bold">
            {selectedVariant.title}
          </Text>
          <Text size="sm" tone="secondary">
            {selectedVariant.price}
            {forSale ? "" : " — sold out"}
          </Text>
        </HStack>
      ) : null}

      <StepperInput
        aria-label="Quantity"
        decrementLabel="Decrease quantity"
        disabled={!forSale}
        incrementLabel="Increase quantity"
        label="Quantity"
        max={selectedVariant?.quantityAvailable}
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
