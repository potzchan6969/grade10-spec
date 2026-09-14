import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ProductDetailVariant } from "../pages/product-detail-content";

type StoreProductHeaderProps = {
  title: string;
  variant?: ProductDetailVariant;
};

function StoreProductHeader({ title, variant }: StoreProductHeaderProps) {
  const quantityAvailable = variant?.quantityAvailable;

  return (
    <VStack data-slot="store-product-header" gap="sm">
      <h1 className="text-3xl font-bold leading-snug text-foreground">
        {title}
      </h1>

      {variant ? (
        <VStack gap="xs">
          <HStack gap="sm" vAlign="center" className="flex-wrap">
            <Text size="xl" weight="bold">
              {variant.price}
            </Text>
            {variant.compareAtPrice ? (
              <Text size="base" tone="secondary" className="line-through">
                {variant.compareAtPrice}
              </Text>
            ) : null}
          </HStack>
          {quantityAvailable != null &&
          quantityAvailable > 0 &&
          quantityAvailable <= 3 ? (
            <Text size="sm" tone="error">
              Only {quantityAvailable} left
            </Text>
          ) : null}
        </VStack>
      ) : null}
    </VStack>
  );
}

export type { StoreProductHeaderProps };
export { StoreProductHeader };
