import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IMAGE } from "./fixtures";

type AuctionListing = {
  id: string;
  title: string;
  lot: string;
  bidCount: string;
  price: string;
  remaining: string;
  status: string;
  statusVariant: "default" | "success" | "warning";
};

const LISTINGS: readonly AuctionListing[] = [
  {
    id: "1",
    title: "1999 Charizard, PSA 10",
    lot: "Lot 12",
    bidCount: "18 bids",
    price: "HK$48,000.00",
    remaining: "Ends in 13D 11H",
    status: "Live",
    statusVariant: "success",
  },
  {
    id: "2",
    title: "2000 Lugia, Neo Genesis, PSA 10",
    lot: "Lot 18",
    bidCount: "9 bids",
    price: "HK$22,500.00",
    remaining: "Ends in 13D 11H",
    status: "Live",
    statusVariant: "success",
  },
  {
    id: "3",
    title: "1998 Pikachu Trophy No. 3 Trainer, PSA 8",
    lot: "Lot 26",
    bidCount: "12 bids",
    price: "HK$31,000.00",
    remaining: "Ends in 13D 12H",
    status: "Live",
    statusVariant: "success",
  },
  {
    id: "4",
    title: "2002 Crystal Charizard, PSA 9",
    lot: "Lot 31",
    bidCount: "4 bids",
    price: "HK$14,800.00",
    remaining: "Ends in 13D 13H",
    status: "Live",
    statusVariant: "success",
  },
  {
    id: "5",
    title: "1999 Blastoise, PSA 9",
    lot: "Lot 34",
    bidCount: "0 bids",
    price: "HK$8,000.00",
    remaining: "Opens in 2D 4H",
    status: "Upcoming",
    statusVariant: "default",
  },
  {
    id: "6",
    title: "2000 Shining Mewtwo, PSA 10",
    lot: "Lot 42",
    bidCount: "27 bids",
    price: "HK$36,200.00",
    remaining: "Extended bidding",
    status: "Extended",
    statusVariant: "warning",
  },
];

function ListingCard({ listing }: { listing: AuctionListing }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square bg-muted p-4">
          <img
            alt={listing.title}
            className="size-full object-contain"
            src={IMAGE}
          />
        </div>
        <VStack className="p-4" gap="sm">
          <HStack hAlign="space-between" vAlign="center">
            <Text size="sm" tone="secondary">
              {listing.lot}
            </Text>
            <Badge size="sm" variant={listing.statusVariant}>
              {listing.status}
            </Badge>
          </HStack>
          <Text as="h2" className="min-h-12" weight="bold">
            {listing.title}
          </Text>
          <HStack hAlign="space-between" vAlign="end">
            <VStack gap="xs">
              <Text size="sm" tone="secondary">
                Current bid
              </Text>
              <Text weight="bold">{listing.price}</Text>
            </VStack>
            <Text size="sm" tone="secondary">
              {listing.bidCount}
            </Text>
          </HStack>
          <Text size="sm" tone="secondary">
            {listing.remaining}
          </Text>
        </VStack>
      </CardContent>
    </Card>
  );
}

/** Auction catalogue composition based on the Store Product List Page. */
function AuctionListingCatalogue() {
  return (
    <main className="mx-auto w-full max-w-7xl px-8 py-6">
      <VStack gap="lg">
        <VStack gap="xs">
          <h1 className="text-xl font-bold text-foreground">September Slabs</h1>
          <Text tone="secondary">
            Browse authenticated lots and place bids before the sale closes.
          </Text>
        </VStack>
        <div className="flex gap-16 max-lg:flex-col lg:items-start">
          <aside className="w-full shrink-0 lg:w-64">
            <VStack gap="md">
              <Button className="w-full justify-start" variant="secondary">
                Search lots
              </Button>
              <VStack gap="sm">
                <Text weight="bold">Filter</Text>
                <Button className="w-full justify-between" variant="ghost">
                  Status
                </Button>
                <Button className="w-full justify-between" variant="ghost">
                  Category
                </Button>
                <Button className="w-full justify-between" variant="ghost">
                  Grade
                </Button>
              </VStack>
            </VStack>
          </aside>
          <section className="min-w-0 flex-1" aria-label="Auction listings">
            <VStack gap="md">
              <HStack hAlign="space-between" vAlign="center" wrap>
                <Text as="h2" size="xl" weight="bold">
                  42 lots
                </Text>
                <HStack gap="sm">
                  <Button variant="ghost">All lots</Button>
                  <Button variant="ghost">Ending soon</Button>
                </HStack>
              </HStack>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-8">
                {LISTINGS.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </VStack>
          </section>
        </div>
      </VStack>
    </main>
  );
}

const meta = {
  title: "Auction Listing/Pages",
  component: AuctionListingCatalogue,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AuctionListingCatalogue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListingCatalogue: Story = {};
