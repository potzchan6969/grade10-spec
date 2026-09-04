import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  ListingAuctionBidCard,
  ListingDetails,
  ListingGallery,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  BASE_FACTS,
  DESCRIPTION,
  GALLERY_IMAGES,
  ListingAuctionBidCardLoading,
  ListingDetailsLoading,
  ListingGalleryLoading,
  VAULT_SECTION,
} from "./fixtures";
import {
  type BiddingState,
  bidHistoryForState,
  buildListingAuctionBidView,
  LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY,
} from "./listing-auction-bid-fixtures";

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

const GALLERY_COPY = {
  next: "Next image",
  previous: "Previous image",
  zoom: "Click to zoom",
} as const;

const noop = () => undefined;

const pageShell = (main: ReactNode, details: ReactNode) => (
  <VStack className="mx-auto w-full max-w-5xl" gap="lg">
    <div className="grid w-full gap-8 lg:grid-cols-2 lg:items-start">
      {main}
    </div>
    {details}
  </VStack>
);

function bidCard(state: BiddingState) {
  return (
    <ListingAuctionBidCard
      copy={LISTING_AUCTION_BID_DEMO_SIDEBAR_COPY}
      history={bidHistoryForState(state)}
      locale="en"
      onCommitMaximum={noop}
      onPlaceBid={noop}
      timeZone="Asia/Hong_Kong"
      view={buildListingAuctionBidView(state)}
    />
  );
}

const defaultDetails = (
  <ListingDetails
    body={DESCRIPTION}
    facts={[...BASE_FACTS]}
    copy={{ heading: "Description" }}
    sections={[VAULT_SECTION]}
  />
);

function lotPage(state: BiddingState, details: ReactNode = defaultDetails) {
  return pageShell(
    <>
      <ListingGallery copy={GALLERY_COPY} images={[...GALLERY_IMAGES]} />
      {bidCard(state)}
    </>,
    details,
  );
}

const soldDetails = (
  <ListingDetails
    body={DESCRIPTION}
    facts={[...BASE_FACTS, { label: "Result", value: "Sold · US$3,100" }]}
    copy={{ heading: "Description" }}
    sections={[VAULT_SECTION]}
  />
);

export const Loading: Story = {
  render: () =>
    pageShell(
      <>
        <ListingGalleryLoading />
        <ListingAuctionBidCardLoading />
      </>,
      <ListingDetailsLoading />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: /^Set Maximum/ })).toBeNull();
  },
};

export const PreAuction: Story = {
  render: () => lotPage("opens"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /^Set Maximum/ })).toBeNull();
  },
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: /Charizard/ })).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: "Description" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Set your private maximum")).toBeInTheDocument();
    expect(canvas.getByText("Min. bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Set Maximum/ }),
    ).toBeInTheDocument();
  },
  render: () => lotPage("live-manual"),
};

export const PostSold: Story = {
  render: () => lotPage("closed-sold", soldDetails),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /^Set Maximum/ })).toBeNull();
  },
};

export const PostWonPaymentDue: Story = {
  render: () => lotPage("closed-won-payment-due", soldDetails),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeVisible();
  },
};

export const PostWonSettled: Story = {
  render: () => lotPage("closed-won-settled", soldDetails),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Pay Invoice" })).toBeNull();
  },
};

export const PostLost: Story = {
  render: () => lotPage("closed-lost", soldDetails),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/did not win/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /^Set Maximum/ })).toBeNull();
  },
};

export const PostUnsold: Story = {
  render: () =>
    lotPage(
      "closed-unsold",
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
