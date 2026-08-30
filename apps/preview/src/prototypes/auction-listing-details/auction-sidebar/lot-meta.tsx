import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { LOT, stateMeta } from "../fixtures";
import type { BiddingState } from "../types";

type LotMetaProps = {
  state: BiddingState;
};

function LotMeta({ state }: LotMetaProps) {
  const meta = stateMeta(state);

  return (
    <VStack className="w-full" gap="lg">
      <VStack gap="md">
        <VStack gap="sm">
          <Text className="font-semibold">About this lot</Text>
          <LotDescription />
        </VStack>
        <HStack className="flex-wrap" gap="sm">
          <Badge>Listing {LOT.listingNumber}</Badge>
          <Badge>{LOT.category}</Badge>
          <Badge>{LOT.saleName}</Badge>
        </HStack>
      </VStack>
      <VStack gap="sm">
        <Text className="font-semibold">Vault shipping</Text>
        <Text size="base">
          Stored in Grade10 Vault — ships from our facility within 1 business
          day of payment.
        </Text>
      </VStack>
      <VStack gap="sm">
        <Text className="font-semibold">Authentication</Text>
        <Text size="base">Authenticated by Grade10 Marketplace</Text>
      </VStack>
      {meta.resultFact ? (
        <VStack gap="sm">
          <Text className="font-semibold">Result</Text>
          <Text size="sm">{meta.resultFact}</Text>
        </VStack>
      ) : null}
    </VStack>
  );
}

type LotDescriptionProps = {
  expanded?: boolean;
};

function LotDescription({ expanded = false }: LotDescriptionProps) {
  return (
    <VStack gap="sm">
      <Text
        as="p"
        className={expanded ? undefined : "line-clamp-3"}
        size="base"
      >
        {LOT.description}
      </Text>
      <Link href="#description">Show more</Link>
    </VStack>
  );
}

export { LotDescription, LotMeta };
