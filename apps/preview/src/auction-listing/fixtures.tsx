import { Card } from "@grade10/design-system/components/display/card";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";

export const IMAGE = new URL("../pages/product.fixture.png", import.meta.url)
  .href;

export const TITLE = "1999 Charizard, PSA 10";
export const DESCRIPTION = "Shadowless 1st Ed. Authenticated and vaulted.";

export const GALLERY_IMAGES = [
  { src: IMAGE, alt: TITLE, thumbLabel: "front" },
  { src: IMAGE, alt: `${TITLE} back`, thumbLabel: "back" },
] as const;

export const BASE_FACTS = [
  { label: "Lot", value: "12" },
  { label: "Sale", value: "September Slabs" },
  { label: "Category", value: "Pokémon" },
] as const;

export const VAULT_SECTION = {
  heading: "Vault shipping",
  body: "Stored in Grade10 Vault — ships from our facility within 1 business day of payment.",
} as const;

/** Gallery column while the listing payload loads. */
export function ListingGalleryLoading() {
  return (
    <VStack className="w-full" gap="sm">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <HStack gap="sm">
        <Skeleton className="h-16 w-12 rounded-sm" />
        <Skeleton className="h-16 w-12 rounded-sm" />
        <Skeleton className="h-16 w-12 rounded-sm" />
      </HStack>
    </VStack>
  );
}

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

/** Details column while the listing payload loads. */
export function ListingDetailsLoading() {
  return (
    <VStack className="w-full" gap="md">
      <VStack gap="sm">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </VStack>
      <VStack gap="sm">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </VStack>
      <VStack gap="sm">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
      </VStack>
    </VStack>
  );
}
