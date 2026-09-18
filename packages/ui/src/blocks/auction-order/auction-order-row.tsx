import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { AuctionOrderRowProps } from "./types";

function AuctionOrderRow({
  copy,
  title,
  auction,
  winningBid,
  status,
  imageSrc,
  imageAlt,
  lotHref,
  onViewLot,
  onAction,
  className,
}: AuctionOrderRowProps) {
  const viewLot = lotHref ? (
    <Link href={lotHref} size="sm">
      {copy.viewLot}
    </Link>
  ) : onViewLot ? (
    <Link onClick={onViewLot} render={<button type="button" />} size="sm">
      {copy.viewLot}
    </Link>
  ) : (
    <Link aria-disabled="true" disabled size="sm">
      {copy.viewLot}
    </Link>
  );

  return (
    <Card
      className={cn("w-full p-4 sm:p-5", className)}
      data-slot="auction-order-row"
    >
      <HStack className="w-full gap-4" vAlign="center" wrap>
        <div
          aria-hidden={imageSrc ? undefined : true}
          className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-background-subtle to-muted"
          data-slot="auction-order-row-image"
        >
          {imageSrc ? (
            <img
              alt={imageAlt ?? ""}
              className="absolute inset-0 size-full object-cover"
              src={imageSrc}
            />
          ) : null}
        </div>
        <VStack className="min-w-0 flex-1" gap="xs" hAlign="stretch">
          <Text as="h3" size="sm" weight="medium" truncate>
            {title}
          </Text>
          <Text size="sm" tone="secondary" truncate>
            {auction}
          </Text>
          <HStack className="flex-wrap" gap="sm" vAlign="center">
            <Text size="sm">{winningBid}</Text>
            <Badge variant="outline">{status}</Badge>
          </HStack>
        </VStack>
        <HStack className="w-full shrink-0 sm:w-auto" gap="sm" vAlign="center">
          {viewLot}
          <Button onClick={onAction} size="md">
            {copy.nextAction}
          </Button>
        </HStack>
      </HStack>
    </Card>
  );
}

export type { AuctionOrderRowCopy, AuctionOrderRowProps } from "./types";
export { AuctionOrderRow };
