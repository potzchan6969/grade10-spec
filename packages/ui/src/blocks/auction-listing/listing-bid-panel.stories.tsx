import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  HighestBidderStanding,
  ListingBidPanelLoading,
  LiveActions,
  LostStanding,
  OutbidStanding,
  PostAuctionActions,
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
      ends: "Ends",
      extension: "Extended bidding interval",
    },
    title: "1999 Charizard, PSA 10",
    kicker: "Listing 12 · September Slabs",
    price: "HK$4,800.00",
    priceHint: "Buyer's premium is added at invoice.",
    bidCount: "1 bid",
    history: "Bidder 3 · HK$4,800.00",
    remaining: "13D 11H 33M 47S",
    deadline: "1 Sep 2026, 18:00 UTC",
    extensionValue: "30 minutes",
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
    copy: { price: "Opening bid", ends: "Opens" },
    price: "HK$1,200.00",
    bidCount: undefined,
    history: undefined,
    remaining: "2D 4H 12M 0S",
    deadline: "22 Aug 2026, 18:00 UTC",
    standing: undefined,
    actions: <WatchOnlyActions />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Opening bid")).toBeInTheDocument();
    expect(canvas.getByText("Opens")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Place Bid" })).toBeNull();
    expect(
      canvas.getByRole("button", { name: "Add to Watch List" }),
    ).toBeInTheDocument();
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

export const LiveNoBids: Story = {
  args: {
    price: "No bids yet",
    bidCount: "0 bids",
    history: "No bids yet.",
    actions: <LiveActions />,
  },
};

export const HighestBidder: Story = {
  args: { standing: <HighestBidderStanding /> },
};

export const Outbid: Story = {
  args: { standing: <OutbidStanding /> },
};

/** Bid history is what the panel was given, shown: there is nothing to open,
 * and nothing to press to see it. */
export const ShowsHistory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText(/Bidder 3/)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /bid history/i })).toBeNull();
  },
};

export const PostSold: Story = {
  args: {
    copy: { price: "Winning bid", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
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
    copy: { price: "Winning bid", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
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
    copy: { price: "Winning bid", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
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
    copy: { price: "Winning bid", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
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
    copy: { price: "Result", ends: "Ends" },
    price: "Unsold",
    bidCount: "0 bids",
    history: "No bids yet.",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
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
    copy: { price: "Winning bid", ends: "Ends" },
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionValue: undefined,
    actions: <PostAuctionActions />,
  },
};
