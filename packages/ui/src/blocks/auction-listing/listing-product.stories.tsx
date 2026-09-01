import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  FIXTURE_AUCTION_CLOSED,
  FIXTURE_AUCTION_DEADLINE,
  FIXTURE_AUCTION_OPENS_DEADLINE,
} from "../../lib/datetime-fixtures";
import {
  BASE_FACTS,
  DESCRIPTION,
  GALLERY_IMAGES,
  KICKER,
  ListingBidPanelLoading,
  ListingDetailsLoading,
  ListingGalleryLoading,
  LiveActions,
  LostStanding,
  PostAuctionActions,
  BUYER_FEE_HINT,
  TITLE,
  VAULT_SECTION,
  WatchOnlyActions,
  WonPaymentDueStanding,
  WonSettledStanding,
} from "./fixtures";
import { ListingBidPanel as ListingBidPanelComponent } from "./listing-bid-panel";
import { ListingDetails } from "./listing-details";
import { ListingGallery } from "./listing-gallery";

/**
 * The three listing blocks together. The preview app owns the complete page
 * assembly, including its header and footer.
 */
const meta = {
  title: "Auction Listing/Listing Product",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const pageShell = (main: ReactNode, details: ReactNode) => (
  <VStack className="mx-auto w-full max-w-5xl" gap="lg">
    <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
      {main}
    </div>
    {details}
  </VStack>
);

const liveBidPanel = (
  <ListingBidPanelComponent
    copy={{
      ends: "Ends",
      extension: "Extended bidding",
      maximum: "Your maximum",
      price: "Current bid",
    }}
    actions={<LiveActions />}
    watchAction={<WatchOnlyActions />}
    bidCount="1 Bid"
    deadline={FIXTURE_AUCTION_DEADLINE}
    extensionValue="30 minutes"
    history="Bidder 3 · HK$4,800.00"
    kicker={KICKER}
    price="HK$4,800.00"
    buyerFeeHint={BUYER_FEE_HINT}
    remaining="13D 11H 33M 47S"
    title={TITLE}
  />
);

const defaultDetails = (
  <ListingDetails
    body={DESCRIPTION}
    facts={[...BASE_FACTS]}
    copy={{ heading: "Description" }}
    sections={[VAULT_SECTION]}
  />
);

export const Loading: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGalleryLoading />
        <ListingBidPanelLoading />
      </>,
      <ListingDetailsLoading />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PreAuction: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        <ListingBidPanelComponent
          copy={{
            ends: "Opens",
            extension: "Extended bidding",
            maximum: "Your maximum",
            price: "Opening bid",
          }}
          actions={null}
          watchAction={<WatchOnlyActions />}
          deadline={FIXTURE_AUCTION_OPENS_DEADLINE}
          extensionValue="30 minutes"
          kicker={KICKER}
          price="HK$1,200.00"
          buyerFeeHint={BUYER_FEE_HINT}
          remaining="2D 4H 12M 0S"
          title={TITLE}
        />
      </>,
      defaultDetails,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Opens")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const ListingBidPanel: Story = {
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
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        {liveBidPanel}
      </>,
      defaultDetails,
    ),
};

/** @deprecated Use ListingBidPanel — kept as alias for existing links. */
export const Default: Story = ListingBidPanel;

export const PostSold: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        <ListingBidPanelComponent
          copy={{ ends: "Ends", maximum: "Your maximum", price: "Winning bid" }}
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 Bid"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          buyerFeeHint={BUYER_FEE_HINT}
          remaining={FIXTURE_AUCTION_CLOSED}
          title={TITLE}
        />
      </>,
      <ListingDetails
        body={DESCRIPTION}
        facts={[
          ...BASE_FACTS,
          { label: "Result", value: "Sold · HK$3,100.00" },
        ]}
        copy={{ heading: "Description" }}
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PostWonPaymentDue: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        <ListingBidPanelComponent
          copy={{ ends: "Ends", maximum: "Your maximum", price: "Winning bid" }}
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 Bid"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          buyerFeeHint={BUYER_FEE_HINT}
          remaining={FIXTURE_AUCTION_CLOSED}
          standing={<WonPaymentDueStanding />}
          title={TITLE}
        />
      </>,
      <ListingDetails
        body={DESCRIPTION}
        facts={[
          ...BASE_FACTS,
          { label: "Result", value: "Sold · HK$3,100.00" },
        ]}
        copy={{ heading: "Description" }}
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeDisabled();
  },
};

export const PostWonSettled: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        <ListingBidPanelComponent
          copy={{ ends: "Ends", maximum: "Your maximum", price: "Winning bid" }}
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 Bid"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          buyerFeeHint={BUYER_FEE_HINT}
          remaining={FIXTURE_AUCTION_CLOSED}
          standing={<WonSettledStanding />}
          title={TITLE}
        />
      </>,
      <ListingDetails
        body={DESCRIPTION}
        facts={[
          ...BASE_FACTS,
          { label: "Result", value: "Sold · HK$3,100.00" },
        ]}
        copy={{ heading: "Description" }}
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Pay Invoice" })).toBeNull();
  },
};

export const PostLost: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        <ListingBidPanelComponent
          copy={{ ends: "Ends", maximum: "Your maximum", price: "Winning bid" }}
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 bid"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          buyerFeeHint={BUYER_FEE_HINT}
          remaining={FIXTURE_AUCTION_CLOSED}
          standing={<LostStanding />}
          title={TITLE}
        />
      </>,
      <ListingDetails
        body={DESCRIPTION}
        facts={[
          ...BASE_FACTS,
          { label: "Result", value: "Sold · HK$3,100.00" },
        ]}
        copy={{ heading: "Description" }}
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/didn’t win/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PostUnsold: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          copy={{
            next: "Next image",
            previous: "Previous image",
            zoom: "Click to zoom",
          }}
          images={[...GALLERY_IMAGES]}
        />
        <ListingBidPanelComponent
          copy={{ ends: "Ends", maximum: "Your maximum", price: "Result" }}
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="0 Bids"
          history="No bids yet."
          kicker={KICKER}
          price="Unsold"
          buyerFeeHint={BUYER_FEE_HINT}
          remaining={FIXTURE_AUCTION_CLOSED}
          title="1999 Blastoise, PSA 9"
        />
      </>,
      <ListingDetails
        body="Authenticated listing."
        facts={[
          { label: "Lot", value: "13" },
          { label: "Sale", value: "September Slabs" },
          { label: "Result", value: "Unsold" },
        ]}
        copy={{ heading: "Description" }}
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Unsold").length).toBeGreaterThan(0);
  },
};
