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
import { LiveBiddingDemo } from "./live-bidding-demo";

const meta = {
  title: "Auction Listing/ListingBidPanel",
  component: ListingBidPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "1999 Charizard, PSA 10",
    kicker: "Listing 12 · September Slabs",
    priceLabel: "Current bid",
    price: "HK$4,800.00",
    priceHint: "Buyer's premium is added at invoice.",
    bidCount: "1 bid",
    showHistoryLabel: "Show bid history",
    hideHistoryLabel: "Hide bid history",
    history: "Bidder 3 · HK$4,800.00",
    endsLabel: "Ends",
    remaining: "13D 11H 33M 47S",
    deadline: "1 Sep 2026, 18:00 UTC",
    extensionLabel: "Extended bidding interval",
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
    priceLabel: "Opening bid",
    price: "HK$1,200.00",
    bidCount: undefined,
    showHistoryLabel: undefined,
    hideHistoryLabel: undefined,
    history: undefined,
    endsLabel: "Opens",
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

/**
 * One live lot, several bidders. Step the ledger to see current bid, history,
 * and your standing flip between leading and outbid.
 */
export const LiveBidding: Story = {
  render: () => <LiveBiddingDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No bids yet")).toBeInTheDocument();
    expect(
      canvas.queryByText(/highest bidder|outbid/i),
    ).not.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Show bid history" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next bid" }));
    expect(canvas.getByText("HK$1,200.00")).toBeInTheDocument();
    expect(canvas.getAllByText(/Bidder 2/).length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole("button", { name: "Next bid" }));
    expect(canvas.getByText(/highest bidder/i)).toBeInTheDocument();
    expect(canvas.getByText("HK$1,300.00")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next bid" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getByText("HK$1,400.00")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next bid" }));
    expect(canvas.getByText(/highest bidder/i)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Next bid" }));
    expect(canvas.getAllByText(/outbid/i).length).toBeGreaterThan(0);
    expect(canvas.getByText("HK$1,600.00")).toBeInTheDocument();
    expect(canvas.getByText("5 bids")).toBeInTheDocument();
  },
};

export const HighestBidder: Story = {
  args: { standing: <HighestBidderStanding /> },
};

export const Outbid: Story = {
  args: { standing: <OutbidStanding /> },
};

export const OpensHistory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Show bid history" }),
    );
    expect(canvas.getByText(/Bidder 3/)).toBeInTheDocument();
  },
};

export const PostSold: Story = {
  args: {
    priceLabel: "Winning bid",
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
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
    priceLabel: "Winning bid",
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
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
    priceLabel: "Winning bid",
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
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
    priceLabel: "Winning bid",
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
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
    priceLabel: "Result",
    price: "Unsold",
    bidCount: "0 bids",
    history: "No bids yet.",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
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
    priceLabel: "Winning bid",
    price: "HK$3,100.00",
    remaining: "Closed 30 Aug 2026, 09:15 UTC",
    deadline: undefined,
    extensionLabel: undefined,
    extensionValue: undefined,
    actions: <PostAuctionActions />,
  },
};
