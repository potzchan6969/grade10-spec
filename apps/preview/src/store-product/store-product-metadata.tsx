import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";

type StoreProductMetadataProps = {
  badges: readonly string[];
  sku?: string;
};

function StoreProductMetadata({ badges, sku }: StoreProductMetadataProps) {
  return (
    <VStack data-slot="store-product-metadata" gap="sm">
      <VStack className="border-t border-border pt-6" gap="sm">
        <Text size="sm" weight="bold">
          About this item
        </Text>
        <HStack gap="sm" className="flex-wrap">
          {badges.map((badge) => (
            <Badge key={badge} size="sm">
              {badge}
            </Badge>
          ))}
        </HStack>
        {sku ? (
          <Text size="sm" tone="secondary">
            SKU: {sku}
          </Text>
        ) : null}
      </VStack>

      <VStack className="border-t border-border pt-6" gap="sm">
        <Text size="sm" weight="bold">
          Shipping & pickup
        </Text>
        <Text size="sm" tone="secondary">
          Shipping calculated at checkout
        </Text>
      </VStack>
    </VStack>
  );
}

export type { StoreProductMetadataProps };
export { StoreProductMetadata };
