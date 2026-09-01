import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_AUCTION_CLOSED,
  FIXTURE_AUCTION_DEADLINE,
  FIXTURE_AUCTION_OPENS_DEADLINE,
} from "../../lib/datetime-fixtures";
import {
  HighestBidderStanding,
  ListingBidPanelLoading,
  LiveActions,
  LostStanding,
  OutbidStanding,
  PostAuctionActions,
  WatchingAction,
  WatchOnlyActions,
  WonPaymentDueStanding,
  WonSettledStanding,
} from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";

const meta = {
  title: "Auction Listing/ListingBidPanel",
  component: ListingBidPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      price: "Current bid",
      maximum: "Your maximum",
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
    },
    title: "1999 Charizard, PSA 10",
    watching: false,
    kicker: "Listing 12 · September Slabs",
    price: "HK$4,800.00",
    priceHint: "Buyer's premium is added at invoice.",
    bidCount: "1 Bid",
    history: "Bidder 3 · HK$4,800.00",
    remaining: "13D 11H 33M 47S",
    deadline: FIXTURE_AUCTION_DEADLINE,
    extensionValue: "30 minutes",
    extensionTooltip:
      "Bids placed in the final 30 minutes extend the auction by 30 minutes.",
    watchAction: <WatchOnlyActions />,
    actions: <LiveActions />,
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingBidPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => <ListingBidPanelLoading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PreAuction: Story = {
  args: {
    copy: { price: "Starting bid", maximum: "Your maximum", ends: "Opens" },
    price: "HK$1,200.00",
    bidCount: undefined,
    history: undefined,
    remaining: "2D 4H 12M 0S",
    deadline: FIXTURE_AUCTION_OPENS_DEADLINE,
    standing: undefined,
    actions: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getByText("Opens")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
    expect(canvas.getByRole("button", { name: "Watch" })).toBeInTheDocument();
  },
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: /Charizard/ }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Current bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();
  },
};

export const LeadingMaximum: Story = {
  args: {
    copy: {
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
      maximum: "Your maximum",
      price: "Current bid",
    },
    maximum: "HK$8,000.00",
    price: "HK$4,800.00",
    standing: <HighestBidderStanding />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your maximum")).toBeInTheDocument();
    expect(canvas.getByText("HK$8,000.00")).toBeInTheDocument();
    expect(canvas.getByText("Current bid")).toBeInTheDocument();
    expect(canvas.getByText("HK$4,800.00")).toBeInTheDocument();
  },
};

export const OvertakenMaximum: Story = {
  args: {
    copy: {
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
      maximum: "Your maximum",
      price: "Current bid",
    },
    maximum: "HK$8,000.00",
    price: "HK$8,250.00",
    standing: <OutbidStanding />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your maximum")).toBeInTheDocument();
    expect(canvas.getByText("HK$8,000.00")).toBeInTheDocument();
    expect(canvas.getByText("Outbid")).toBeInTheDocument();
  },
};

export const NoMaximum: Story = {
  args: {
    copy: {
      ends: "Ends",
      extension: "Extended bidding",
      extensionTooltip: "Extended bidding rules",
      maximum: "Your maximum",
      price: "Current bid",
    },
    maximum: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Your maximum")).toBeNull();
  },
};

export const LiveNoBids: Story = {
  args: {
    copy: { price: "Starting bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$1,200.00",
    bidCount: "0 Bids",
    history: "No bids yet.",
    actions: <LiveActions />,
  },
};

export const HighestBidder: Story = {
  args: {
    standing: <HighestBidderStanding />,
    watchAction: <WatchingAction />,
    watching: true,
  },
};

export const Outbid: Story = {
  args: { standing: <OutbidStanding /> },
};

export const ShowsBidHistory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "1 Bid" })).toBeInTheDocument();
    expect(canvas.getByText(/Bidder 3/)).toBeInTheDocument();
  },
};

export const PostSold: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: undefined,
    actions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeInTheDocument();
    expect(canvas.getByText(/Closed 30 Aug/)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
  },
};

export const PostWonPaymentDue: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: <WonPaymentDueStanding />,
    actions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pay Invoice" })).toBeDisabled();
  },
};

export const PostWonSettled: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: <WonSettledStanding />,
    actions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Pay Invoice" })).toBeNull();
  },
};

export const PostLost: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: <LostStanding />,
    actions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/didn't win/i)).toBeInTheDocument();
  },
};

export const PostUnsold: Story = {
  args: {
    copy: { price: "Result", maximum: "Your maximum", ends: "Ends" },
    price: "Unsold",
    bidCount: "0 Bids",
    history: "No bids yet.",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    standing: undefined,
    actions: <PostAuctionActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Result")).toBeInTheDocument();
    expect(canvas.getByText("Unsold")).toBeInTheDocument();
  },
};

/** @deprecated Use PostSold — kept as alias for existing links. */
export const Closed: Story = {
  args: {
    copy: { price: "Winning bid", maximum: "Your maximum", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: FIXTURE_AUCTION_CLOSED,
    deadline: undefined,
    extensionValue: undefined,
    actions: <PostAuctionActions />,
  },
};
