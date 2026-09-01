import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ListingBidPanel, ListingDetails, ListingGallery } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_AUCTION_CLOSED,
  FIXTURE_AUCTION_DEADLINE,
} from "../../../../packages/ui/src/lib/datetime-fixtures";
import { STORE_FOOTER, STORE_NAV } from "./store-content";
import { WorkbenchAccountNav } from "./workbench-account-nav";

const IMAGE = new URL(
  "../../../../packages/ui/src/blocks/store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

type ListingState = "loading" | "preAuction" | "live" | "sold" | "unsold";

function AuctionListingPage({ state = "live" }: { state?: ListingState }) {
  const isLoading = state === "loading";
  const isPreAuction = state === "preAuction";
  const isSold = state === "sold";
  const isUnsold = state === "unsold";
  const title = isUnsold ? "1999 Blastoise, PSA 9" : "1999 Charizard, PSA 10";
  const closed = isSold || isUnsold;

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <WorkbenchAccountNav {...STORE_NAV} promo={null} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-8 py-12">
        <VStack gap="lg">
          <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
            {isLoading ? (
              <div className="aspect-square animate-pulse rounded-lg bg-muted" />
            ) : (
              <ListingGallery
                copy={{
                  next: "Next image",
                  previous: "Previous image",
                  zoom: "Click to zoom",
                }}
                images={[
                  { src: IMAGE, alt: title, thumbLabel: "front" },
                  { src: IMAGE, alt: `${title} back`, thumbLabel: "back" },
                ]}
              />
            )}
            {isLoading ? (
              <div className="h-96 animate-pulse rounded-lg bg-muted" />
            ) : (
              <ListingBidPanel
                actions={
                  isPreAuction || closed ? null : (
                    <Button className="w-full">Place Bid</Button>
                  )
                }
                bidCount={isUnsold ? "0 Bids" : "1 Bid"}
                copy={{
                  ends: isPreAuction ? "Opens" : "Ends",
                  extension: "Extended bidding",
                  maximum: "Your maximum",
                  price: isUnsold
                    ? "Result"
                    : closed
                      ? "Winning bid"
                      : isPreAuction
                        ? "Opening bid"
                        : "Current bid",
                }}
                deadline={closed ? undefined : FIXTURE_AUCTION_DEADLINE}
                extensionValue={closed ? undefined : "30 minutes"}
                history={isUnsold ? "No bids yet." : "Bidder 3 · HK$4,800.00"}
                kicker="Listing 12 · September Slabs"
                price={
                  isUnsold
                    ? "Unsold"
                    : isPreAuction
                      ? "HK$1,200.00"
                      : "HK$4,800.00"
                }
                priceHint="Buyer's premium is added at invoice."
                remaining={
                  closed
                    ? FIXTURE_AUCTION_CLOSED
                    : isPreAuction
                      ? "2D 4H 12M 0S"
                      : "13D 11H 33M 47S"
                }
                title={title}
                watchAction={
                  <Button size="sm" variant="outline">
                    Watch
                  </Button>
                }
              />
            )}
          </div>
          {isLoading ? (
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
          ) : (
            <ListingDetails
              body="Shadowless 1st Ed. Authenticated and vaulted."
              copy={{ heading: "Description" }}
              facts={[
                { label: "Lot", value: "12" },
                { label: "Sale", value: "September Slabs" },
                ...(closed
                  ? [
                      {
                        label: "Result",
                        value: isUnsold ? "Unsold" : "Sold · HK$4,800.00",
                      },
                    ]
                  : []),
              ]}
              sections={[
                {
                  heading: "Vault shipping",
                  body: "Stored in Grade10 Vault — ships within one business day of payment.",
                },
              ]}
            />
          )}
        </VStack>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/Auction Listing Page",
  component: AuctionListingPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AuctionListingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const PreAuction: Story = { args: { state: "preAuction" } };
export const Live: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="nav"]'),
    ).toBeInTheDocument();
    expect(canvas.getByRole("heading", { name: /Charizard/ })).toBeVisible();
    expect(canvas.getByRole("button", { name: "Place Bid" })).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeInTheDocument();
  },
};
export const Sold: Story = { args: { state: "sold" } };
export const Unsold: Story = { args: { state: "unsold" } };
