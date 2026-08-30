import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { LOT } from "../fixtures";

type SidebarHeaderProps = {
  watched?: boolean;
  onWatchToggle?: () => void;
};

function SidebarHeader({ watched = false, onWatchToggle }: SidebarHeaderProps) {
  return (
    <VStack className="w-full" gap="md">
      <Breadcrumbs>
        <BreadcrumbItem href="#auction">Auction</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href="#sale">{LOT.saleName}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Lot {LOT.listingNumber}</BreadcrumbItem>
      </Breadcrumbs>
      <HStack className="w-full" gap="md" hAlign="space-between" vAlign="start">
        <h1 className="text-3xl font-semibold leading-9 text-foreground">
          {LOT.title}
        </h1>
        <Button onClick={onWatchToggle} size="sm" variant="outline">
          {watched ? "Watching" : "Watch"}
        </Button>
      </HStack>
    </VStack>
  );
}

export { SidebarHeader };
