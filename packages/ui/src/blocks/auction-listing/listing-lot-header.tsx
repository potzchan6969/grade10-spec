import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Bell, BellSlash } from "@phosphor-icons/react";

type ListingLotHeaderCopy = {
  auctionBreadcrumb: string;
  lotBreadcrumb: string;
  watch: string;
  watching: string;
  watchAriaLabel: string;
  unwatchAriaLabel: string;
};

type ListingLotHeaderProps = {
  copy: ListingLotHeaderCopy;
  title: string;
  auctionHref?: string;
  watched?: boolean;
  onWatchToggle?: () => void;
};

function ListingLotHeader({
  copy,
  title,
  auctionHref = "#auction",
  watched = false,
  onWatchToggle,
}: ListingLotHeaderProps) {
  return (
    <VStack className="w-full" data-slot="listing-lot-header" gap="md">
      <Breadcrumbs>
        <BreadcrumbItem href={auctionHref}>{copy.auctionBreadcrumb}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{copy.lotBreadcrumb}</BreadcrumbItem>
      </Breadcrumbs>
      <HStack
        className="w-full"
        gap="md"
        hAlign="space-between"
        vAlign="center"
      >
        <h1 className="min-w-0 text-3xl font-semibold leading-9 text-foreground">
          {title}
        </h1>
        <Button
          aria-label={watched ? copy.unwatchAriaLabel : copy.watchAriaLabel}
          className="shrink-0"
          leading={
            watched ? (
              <BellSlash aria-hidden />
            ) : (
              <Bell aria-hidden />
            )
          }
          onClick={onWatchToggle}
          size="md"
          variant="outline"
        >
          {watched ? copy.watching : copy.watch}
        </Button>
      </HStack>
    </VStack>
  );
}

export type { ListingLotHeaderCopy, ListingLotHeaderProps };
export { ListingLotHeader };
