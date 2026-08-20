import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingBidPanel } from "./listing-bid-panel";
import { ListingDetails } from "./listing-details";
import { ListingGallery } from "./listing-gallery";

const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

/**
 * The three product-page panels together: photo left, bid box right,
 * description below — a regular ecommerce layout.
 */
const meta = {
  title: "Auction Listing/Product page",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: /Charizard/ })).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /Charizard/ }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: "Description" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();
  },
  render: () => (
    <VStack className="mx-auto w-full max-w-5xl" gap="lg">
      <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
        <ListingGallery
          images={[
            { src: IMAGE, alt: "1999 Charizard, PSA 10", thumbLabel: "front" },
            {
              src: IMAGE,
              alt: "1999 Charizard, PSA 10 back",
              thumbLabel: "back",
            },
          ]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={
            <VStack className="w-full" gap="sm">
              <Button className="w-full">Place Bid</Button>
              <Button className="w-full" variant="outline">
                Add to Watch List
              </Button>
            </VStack>
          }
          bidCount="1 bid"
          deadline="1 Sep 2026, 18:00 UTC"
          endsLabel="Ends"
          extensionLabel="Extended bidding interval"
          extensionValue="30 minutes"
          hideHistoryLabel="Hide bid history"
          history="Bidder 3 · HK$4,800.00"
          kicker="Listing 12 · September Slabs"
          price="HK$4,800.00"
          priceHint="Buyer's premium is added at invoice."
          priceLabel="Current bid"
          remaining="13D 11H 33M 47S"
          showHistoryLabel="Show bid history"
          title="1999 Charizard, PSA 10"
        />
      </div>
      <ListingDetails
        body="Shadowless 1st Ed. Authenticated and vaulted."
        facts={[
          { label: "Lot", value: "12" },
          { label: "Sale", value: "September Slabs" },
          { label: "Category", value: "Pokémon" },
        ]}
        heading="Description"
        sections={[
          {
            heading: "Vault shipping",
            body: "Stored in Grade10 Vault — ships from our facility within 1 business day of payment.",
          },
        ]}
      />
    </VStack>
  ),
};
