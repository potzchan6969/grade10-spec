import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { StoreProductSaleItem } from "./types";

type StoreProductHeaderCopy = {
  home: string;
  onlyLeft: (count: number) => string;
  shop: string;
};

type StoreProductHeaderProps = {
  availabilityCount?: number;
  copy: StoreProductHeaderCopy;
  homeHref: string;
  saleItem?: StoreProductSaleItem;
  shopHref: string;
  title: string;
};

function StoreProductHeader({
  availabilityCount,
  copy,
  homeHref,
  saleItem,
  shopHref,
  title,
}: StoreProductHeaderProps) {
  return (
    <VStack data-slot="store-product-header" gap="sm">
      <Breadcrumbs>
        <BreadcrumbItem href={homeHref}>{copy.home}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href={shopHref}>{copy.shop}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{title}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-3xl font-semibold leading-9 text-foreground">
        {title}
      </h1>

      {saleItem ? (
        <VStack gap="xs">
          <HStack gap="sm" vAlign="center" className="flex-wrap">
            <Text size="xl" weight="bold">
              {saleItem.price}
            </Text>
            {saleItem.compareAtPrice ? (
              <Text size="base" tone="secondary" className="line-through">
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
