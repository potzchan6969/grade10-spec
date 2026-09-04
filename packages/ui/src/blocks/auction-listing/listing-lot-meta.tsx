import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ListingLotMetaBadge } from "./types";

type ListingLotMetaCopy = {
  aboutThisLot: string;
  vaultShipping: string;
  result: string;
  showMore: string;
};

type ListingLotMetaFact = {
  label: string;
  value: string;
};

type ListingLotMarketComps = {
  title: string;
  range: string;
};

type ListingLotMetaProps = {
  copy: ListingLotMetaCopy;
  badges: readonly ListingLotMetaBadge[];
  description: string;
  showMoreHref?: string;
  vaultShippingBody: string;
  resultFact?: string;
  /** Cataloguing facts under About this lot (year, set, grade, cert, …). */
  facts?: readonly ListingLotMetaFact[];
  /** Comparable sales, shown as a section under About this lot. */
  marketComps?: ListingLotMarketComps;
};

function ListingLotMeta({
  copy,
  badges,
  description,
  showMoreHref = "#description",
  vaultShippingBody,
  resultFact,
  facts,
  marketComps,
}: ListingLotMetaProps) {
  return (
    <VStack className="w-full" data-slot="listing-lot-meta" gap="lg">
      <VStack gap="md">
        <VStack gap="sm">
          <Text className="font-semibold">{copy.aboutThisLot}</Text>
          <VStack gap="sm">
            <Text as="p" className="line-clamp-3" size="base">
              {description}
            </Text>
            <Link href={showMoreHref}>{copy.showMore}</Link>
          </VStack>
        </VStack>
        <HStack className="flex-wrap" gap="sm">
          {badges.map((badge) => (
            <Badge key={badge.label}>{badge.label}</Badge>
          ))}
        </HStack>
        {facts && facts.length > 0 ? (
          <VStack gap="sm">
            {facts.map((fact) => (
              <HStack
                className="w-full"
                gap="sm"
                hAlign="space-between"
                key={fact.label}
                wrap
              >
                <Text size="sm" tone="secondary">
                  {fact.label}
                </Text>
                <Text size="sm">{fact.value}</Text>
              </HStack>
            ))}
          </VStack>
        ) : null}
      </VStack>
      {marketComps ? (
        <VStack gap="sm">
          <Text className="font-semibold">{marketComps.title}</Text>
          <Text size="base">{marketComps.range}</Text>
        </VStack>
      ) : null}
      <VStack gap="sm">
        <Text className="font-semibold">{copy.vaultShipping}</Text>
        <Text size="base">{vaultShippingBody}</Text>
      </VStack>
      {resultFact ? (
        <VStack gap="sm">
          <Text className="font-semibold">{copy.result}</Text>
          <Text size="sm">{resultFact}</Text>
        </VStack>
      ) : null}
    </VStack>
  );
}

export type {
  ListingLotMarketComps,
  ListingLotMetaCopy,
  ListingLotMetaFact,
  ListingLotMetaProps,
};
export { ListingLotMeta };
