import { Card } from "@grade10/design-system/components/display/card";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";

/** Bid-card column while the listing payload loads. */
export function ListingAuctionBidCardLoading() {
  return (
    <Card className="w-full gap-0" padding={false}>
      <HStack
        className="w-full border-b border-border px-4 py-2"
        hAlign="space-between"
        vAlign="center"
      >
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16" />
      </HStack>
      <div className="grid w-full grid-cols-2 border-b border-border">
        <div className="border-r border-border px-4 py-3">
          <VStack gap="sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-16" />
          </VStack>
        </div>
        <div className="px-4 py-3">
          <VStack gap="sm">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-24" />
          </VStack>
        </div>
      </div>
      <div className="px-4 py-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}
