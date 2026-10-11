import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";

type ConsignmentSellerLineCopy = {
  /** Who sells it, the consignor's display name in it. */
  line: string;
  /** What Grade10 does for the buyer. */
  note: string;
};

type ConsignmentSellerLineProps = {
  copy: ConsignmentSellerLineCopy;
  className?: string;
};

/**
 * The line a consigned item's page prints under its price: the name the
 * consignor agreed to be sold under, and what Grade10 does for the buyer.
 */
function ConsignmentSellerLine({
  copy,
  className,
}: ConsignmentSellerLineProps) {
  return (
    <VStack className={className} data-slot="consignment-seller-line" gap="xs">
      <Text as="p" size="sm" weight="medium">
        {copy.line}
      </Text>
      <Text as="p" size="xs" tone="secondary">
        {copy.note}
      </Text>
    </VStack>
  );
}

export type { ConsignmentSellerLineCopy, ConsignmentSellerLineProps };
export { ConsignmentSellerLine };
