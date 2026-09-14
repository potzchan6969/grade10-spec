import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";

type StoreProductMetadataCopy = {
  aboutThisItem: string;
  freePickupAt: string;
  hongKongGrade10Store: string;
  shippingAndPickup: string;
  shippingCalculatedAtCheckout: string;
  shippingFee: string;
  skuLabel: string;
};

type StoreProductMetadataProps = {
  badges: readonly string[];
  copy: StoreProductMetadataCopy;
  pickupHref?: string;
  shippingFeeHref?: string;
  sku?: string | null;
};

function StoreProductMetadata({
  badges,
  copy,
  pickupHref = "#",
  shippingFeeHref = "#",
  sku,
}: StoreProductMetadataProps) {
  return (
    <VStack data-slot="store-product-metadata" gap="lg">
      <VStack className="border-t border-border pt-6" gap="sm">
        <Text size="sm" weight="bold">
          {copy.aboutThisItem}
        </Text>
        {badges.length > 0 ? (
          <HStack gap="sm" className="flex-wrap">
            {badges.map((badge) => (
              <Badge key={badge} size="sm">
                {badge}
              </Badge>
            ))}
          </HStack>
        ) : null}
      </VStack>

      <VStack className="border-t border-border pt-6" gap="sm">
        <Text size="sm" weight="bold">
          {copy.shippingAndPickup}
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text as="span" size="sm">
              {copy.shippingCalculatedAtCheckout}.{" "}
            </Text>
            <Link href={shippingFeeHref} size="sm">
              {copy.shippingFee}
            </Link>
          </li>
          <li>
            <Text as="span" size="sm">
              {copy.freePickupAt}{" "}
            </Text>
            <Link href={pickupHref} size="sm">
              {copy.hongKongGrade10Store}
            </Link>
          </li>
        </ul>
      </VStack>

      {sku ? (
        <Text size="sm" tone="secondary">
          {copy.skuLabel}: {sku}
        </Text>
      ) : null}
    </VStack>
  );
}

export type { StoreProductMetadataCopy, StoreProductMetadataProps };
export { StoreProductMetadata };
