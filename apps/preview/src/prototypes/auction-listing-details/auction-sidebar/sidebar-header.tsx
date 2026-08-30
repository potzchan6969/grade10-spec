import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Bell, BellSlash } from "@phosphor-icons/react";
import { LOT } from "../fixtures";

type SidebarHeaderProps = {
  watched?: boolean;
  onWatchToggle?: () => void;
};

function SidebarHeader({ watched = false, onWatchToggle }: SidebarHeaderProps) {
  return (
    <VStack className="w-full" data-slot="lot-page-header" gap="md">
      <Breadcrumbs>
        <BreadcrumbItem href="#auction">Auction</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Lot {LOT.listingNumber}</BreadcrumbItem>
      </Breadcrumbs>
      <HStack
        className="w-full"
        gap="md"
        hAlign="space-between"
        vAlign="center"
      >
        <h1 className="min-w-0 text-3xl font-semibold leading-9 text-foreground">
          {LOT.title}
        </h1>
        <Button
          aria-label={watched ? "Unwatch this lot" : "Watch this lot"}
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
          {watched ? "Watching" : "Watch"}
        </Button>
      </HStack>
    </VStack>
  );
}

export { SidebarHeader };
