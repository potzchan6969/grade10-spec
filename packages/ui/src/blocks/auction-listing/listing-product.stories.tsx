import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
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
  PREMIUM_HINT,
  TITLE,
  VAULT_SECTION,
  WatchOnlyActions,
  WonPaymentDueStanding,
  WonSettledStanding,
} from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";
import { ListingDetails } from "./listing-details";
import { ListingGallery } from "./listing-gallery";

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

const pageShell = (main: ReactNode, details: ReactNode) => (
  <VStack className="mx-auto w-full max-w-5xl" gap="lg">
    <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
      {main}
    </div>
    {details}
  </VStack>
);

const liveBidPanel = (
  <ListingBidPanel
    actions={<LiveActions />}
    watchAction={<WatchOnlyActions />}
    bidCount="1 Bid"
    deadline="1 Sep 2026, 18:00 UTC"
    endsLabel="Ends"
    extensionLabel="Extended bidding"
    extensionValue="30 minutes"
    hideHistoryLabel="Hide bid history"
    history="Bidder 3 · HK$4,800.00"
    kicker={KICKER}
    price="HK$4,800.00"
    priceHint={PREMIUM_HINT}
    priceLabel="Current bid"
    remaining="13D 11H 33M 47S"
    showHistoryLabel="Show bid history"
    title={TITLE}
  />
);

const defaultDetails = (
  <ListingDetails
    body={DESCRIPTION}
    facts={[...BASE_FACTS]}
    heading="Description"
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
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={null}
          watchAction={<WatchOnlyActions />}
          deadline="22 Aug 2026, 18:00 UTC"
          endsLabel="Opens"
          extensionLabel="Extended bidding"
          extensionValue="30 minutes"
          kicker={KICKER}
          price="HK$1,200.00"
          priceHint={PREMIUM_HINT}
          priceLabel="Opening bid"
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

export const Live: Story = {
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
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        {liveBidPanel}
      </>,
      defaultDetails,
    ),
};

/** @deprecated Use Live — kept as alias for existing links. */
export const Default: Story = Live;

export const PostSold: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 Bid"
          endsLabel="Ends"
          hideHistoryLabel="Hide bid history"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          priceHint={PREMIUM_HINT}
          priceLabel="Winning bid"
          remaining="Closed 30 Aug 2026, 09:15 UTC"
          showHistoryLabel="Show bid history"
          title={TITLE}
        />
      </>,
      <ListingDetails
        body={DESCRIPTION}
        facts={[
          ...BASE_FACTS,
          { label: "Result", value: "Sold · HK$3,100.00" },
        ]}
        heading="Description"
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
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 Bid"
          endsLabel="Ends"
          hideHistoryLabel="Hide bid history"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          priceHint={PREMIUM_HINT}
          priceLabel="Winning bid"
          remaining="Closed 30 Aug 2026, 09:15 UTC"
          showHistoryLabel="Show bid history"
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
        heading="Description"
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
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 Bid"
          endsLabel="Ends"
          hideHistoryLabel="Hide bid history"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          priceHint={PREMIUM_HINT}
          priceLabel="Winning bid"
          remaining="Closed 30 Aug 2026, 09:15 UTC"
          showHistoryLabel="Show bid history"
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
        heading="Description"
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
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="1 bid"
          endsLabel="Ends"
          hideHistoryLabel="Hide bid history"
          history="Bidder 1 · HK$3,100.00"
          kicker={KICKER}
          price="HK$3,100.00"
          priceHint={PREMIUM_HINT}
          priceLabel="Winning bid"
          remaining="Closed 30 Aug 2026, 09:15 UTC"
          showHistoryLabel="Show bid history"
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
        heading="Description"
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/didn't win/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PostUnsold: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGallery
          images={[...GALLERY_IMAGES]}
          nextLabel="Next image"
          previousLabel="Previous image"
          zoomLabel="Click to zoom"
        />
        <ListingBidPanel
          actions={<PostAuctionActions />}
          watchAction={<WatchOnlyActions />}
          bidCount="0 Bids"
          endsLabel="Ends"
          hideHistoryLabel="Hide bid history"
          history="No bids yet."
          kicker={KICKER}
          price="Unsold"
          priceHint={PREMIUM_HINT}
          priceLabel="Result"
          remaining="Closed 30 Aug 2026, 09:15 UTC"
          showHistoryLabel="Show bid history"
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
        heading="Description"
        sections={[VAULT_SECTION]}
      />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Unsold").length).toBeGreaterThan(0);
  },
};
