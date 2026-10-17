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
  /** The shop's page. Omitted, the store name is the line's own text. */
  pickupHref?: string;
  /** The shipping fee's page. Omitted, the label is the line's own text. */
  shippingFeeHref?: string;
  sku?: string | null;
};

/** A fulfilment label: a link where a page answers it, plain text where none
 * does, so no label reads as a link that leads nowhere. */
function FulfilmentLabel({ href, label }: { href?: string; label: string }) {
  if (href == null) {
    return (
      <Text as="span" size="sm">
        {label}
      </Text>
    );
  }
  return (
    <Link href={href} size="sm">
      {label}
    </Link>
  );
}

function StoreProductMetadata({
  badges,
  copy,
  pickupHref,
  shippingFeeHref,
  sku,
}: StoreProductMetadataProps) {
  return (
    <VStack data-slot="store-product-metadata" gap="lg">
      <VStack gap="sm">
        <Text className="font-semibold" size="sm">
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

      <VStack gap="sm">
        <Text className="font-semibold" size="sm">
          {copy.shippingAndPickup}
        </Text>
        <ul className="list-disc pl-5">
          <li>
            <Text as="span" size="sm">
              {copy.shippingCalculatedAtCheckout}{" "}
            </Text>
            <FulfilmentLabel href={shippingFeeHref} label={copy.shippingFee} />
          </li>
          <li>
            <Text as="span" size="sm">
              {copy.freePickupAt}{" "}
            </Text>
            <FulfilmentLabel
              href={pickupHref}
              label={copy.hongKongGrade10Store}
            />
          </li>
        </ul>
      </VStack>

      {sku ? (
        <Text size="sm">
          {copy.skuLabel}: {sku}
        </Text>
      ) : null}
    </VStack>
  );
}

export type { StoreProductMetadataCopy, StoreProductMetadataProps };
export { StoreProductMetadata };
