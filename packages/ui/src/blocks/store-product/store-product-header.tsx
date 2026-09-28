import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { StoreProductSaleItem } from "./types";

type StoreProductHeaderCopy = {
  onlyLeft: (count: number) => string;
};

type StoreProductHeaderProps = {
  availabilityCount?: number;
  copy: StoreProductHeaderCopy;
  saleItem?: StoreProductSaleItem;
  title: string;
};

function StoreProductHeader({
  availabilityCount,
  copy,
  saleItem,
  title,
}: StoreProductHeaderProps) {
  return (
    <VStack data-slot="store-product-header" gap="sm">
      <h1 className="text-3xl font-semibold leading-9 text-foreground">
        {title}
      </h1>

      {saleItem ? (
        <VStack gap="xs">
          <HStack gap="sm" vAlign="baseline" className="flex-wrap">
            <Text className="font-semibold" size="xl">
              {saleItem.price}
            </Text>
            {saleItem.compareAtPrice ? (
              <Text
                className="line-through text-secondary-foreground"
                size="base"
              >
                {saleItem.compareAtPrice}
              </Text>
            ) : null}
          </HStack>
          {availabilityCount != null ? (
            <Text size="sm" tone="error">
              {copy.onlyLeft(availabilityCount)}
            </Text>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

export type { StoreProductHeaderCopy, StoreProductHeaderProps };
export { StoreProductHeader };
