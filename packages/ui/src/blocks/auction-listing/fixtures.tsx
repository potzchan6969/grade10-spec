import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Eye } from "@phosphor-icons/react";
import { FIXTURE_BID_LANDED_AT } from "../../lib/datetime-fixtures";

export const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

export const TITLE = "1999 Charizard, PSA 10";
export const KICKER = "Listing 12 · September Slabs";
export const DESCRIPTION = "Shadowless 1st Ed. Authenticated and vaulted.";
export const BUYER_FEE_HINT = "Buyer fee is added on top of the winning bid";

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

/** Bid panel column while the listing payload loads. */
export function ListingBidPanelLoading() {
  return (
    <Card className="min-w-0 w-full">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <CardAction>
          <Skeleton className="h-8 w-16" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          <VStack className="rounded-lg bg-muted/40 p-4" gap="sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
          </VStack>
          <Skeleton className="h-px w-full" />
          <VStack gap="sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-56" />
          </VStack>
        </VStack>
      </CardContent>
      <CardFooter className="items-stretch">
        <VStack className="w-full" gap="sm">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </VStack>
      </CardFooter>
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

export function WatchOnlyActions() {
  return (
    <Button leading={<Eye />} size="sm" variant="ghost">
      Watch
    </Button>
  );
}

export function WatchingAction() {
  return (
    <Button leading={<Eye weight="fill" />} size="sm" variant="ghost">
      Watching
    </Button>
  );
}

export function LiveActions({ onPlaceBid }: { onPlaceBid?: () => void } = {}) {
  return (
    <VStack className="w-full" gap="sm">
      <Button className="w-full" onClick={onPlaceBid}>
        Place Bid
      </Button>
    </VStack>
  );
}

export function PostAuctionActions() {
  return null;
}

export function HighestBidderStanding() {
  return (
    <HStack className="w-full" gap="sm" hAlign="space-between" vAlign="center">
      <VStack gap="xs">
        <Text size="sm">Your bid: HK$4,800.00</Text>
        <Text size="xs" tone="secondary">
          {FIXTURE_BID_LANDED_AT}
        </Text>
      </VStack>
      <Badge variant="success">Highest Bid</Badge>
    </HStack>
  );
}

export function OutbidStanding() {
  return (
    <HStack className="w-full" gap="sm" hAlign="space-between" vAlign="center">
      <VStack gap="xs">
        <Text size="sm">Your bid: HK$4,800.00</Text>
        <Text size="xs" tone="secondary">
          {FIXTURE_BID_LANDED_AT}
        </Text>
      </VStack>
      <Badge variant="warning">Outbid</Badge>
    </HStack>
  );
}

export function WonPaymentDueStanding() {
  return (
    <Card>
      <CardHeader>
        <Badge variant="success">Auction won</Badge>
        <CardTitle>Payment due</CardTitle>
        <CardDescription>
          Please pay your invoice to complete this purchase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled>Pay Invoice</Button>
      </CardContent>
    </Card>
  );
}

export function WonSettledStanding() {
  return (
    <HStack gap="sm" vAlign="center">
      <Badge variant="success">Auction won</Badge>
    </HStack>
  );
}

export function LostStanding() {
  return (
    <HStack gap="sm" vAlign="center">
      <Badge variant="default">You didn’t win</Badge>
    </HStack>
  );
}
