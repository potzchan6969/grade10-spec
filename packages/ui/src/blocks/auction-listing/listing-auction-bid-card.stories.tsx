import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  DEFAULT_LISTING_EXTENSION_POLICY,
  formatAutoExtendedTooltip,
} from "./listing-extension-policy";
import type { ListingAuctionBidView, ListingBidHistoryRow } from "./types";

const COPY = {
  recentBids: "Recent Bids",
  bidHistory: { you: "You", empty: "No bids yet" },
  auctionWon: "Auction won",
  paymentDue: "Payment due",
  paymentDueBody: "Please pay your invoice to complete this purchase.",
  payInvoice: "Pay Invoice",
  didNotWin: "Did not win",
  cardRelease: "Your card authorization will be released.",
  outbid: "Outbid",
  highestBid: "Highest bid",
  yourMaximum: "Your maximum",
  setMaximumLabel: "Set maximum",
  setMaximumCurrentLabel: "Set maximum (current: {amount})",
  opensIn: "Opens in",
  closed: "Closed",
  timeLeft: "Time left",
  timeLeftAutoExtended: "Time left (auto-extended)",
  autoExtendedTooltip: formatAutoExtendedTooltip(
    DEFAULT_LISTING_EXTENSION_POLICY,
  ),
  placeBidSection: "Place bid",
  placeBid: "Place Bid",
  signInToBid: "Sign In to Bid",
  confirmMaximum: "Confirm",
  raiseMaximum: "Raise",
  confirmMaximumTooltip:
    "The most we’ll bid for you. Authorizes a card hold for this amount—you may pay less if the auction ends below it.",
  confirmMaximumAriaLabel: "Confirm Maximum",
  raiseMaximumAriaLabel: "Raise Maximum",
  enableAutoBidding: "Enable auto-bidding",
  autoBiddingTooltip:
    "We bid for you as needed, up to your maximum. Your card hold matches that amount—you may pay less if the auction ends below it.",
  minimumMaximumFloor: "At least {amount} (current bid + {increment})",
  minimumMaximumLeadingNudge: "At least {amount} (your maximum + {increment})",
  minimumMaximumLeadingIncrement:
    "At least {amount} (your maximum + {increment})",
  maximumBelowMinimum: "Enter at least {amount}",
  buyerFeeHint: "Buyer fee is added on top of the winning bid",
  buyerFeeTooltip:
    "Winners pay a percentage of the hammer price as a buyer fee. The rate is confirmed at checkout.",
  noBidsYet: "No bids yet",
  endsLabel: "Ends",
  opensLabel: "Opens",
  closedAt: "Closed {when}",
  activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
} as const;

const NOW_MS = Date.now();
const CLOSES_AT_MS = NOW_MS + (6 * 60 + 9) * 1000;

const HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-480",
    initials: "john@example.com",
    amountMinor: 480_000,
    acceptedAtMs: NOW_MS - 2 * 60_000,
    isViewer: true,
  },
  {
    id: "bid-mike-455",
    initials: "mike@example.com",
    amountMinor: 455_000,
    acceptedAtMs: NOW_MS - 8 * 60_000,
  },
];

function liveView(
  overrides: Partial<ListingAuctionBidView> = {},
): ListingAuctionBidView {
  return {
    headerLabel: "Auction",
    live: true,
    opens: false,
    closed: false,
    hasBids: true,
    isUnsold: false,
    showBidActions: true,
    priceLabel: "Current Bid",
    currentBidMinor: 480_000,
    bidCount: 6,
    bidCountLabel: "6 bids",
    countdown: "6m 9s",
    countdownSeconds: 369,
    closesAtMs: CLOSES_AT_MS,
    countdownFormat: "short",
    extended: false,
    deadlineAtMs: CLOSES_AT_MS,
    standing: "none",
    minBidMinor: 505_000,
    incrementMinor: 25_000,
    suggestedMaxMinor: 800_000,
    ...overrides,
  };
}

const noop = () => undefined;

const meta = {
  title: "Auction Listing/ListingAuctionBidCard",
  component: ListingAuctionBidCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: COPY,
    history: HISTORY,
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    bidMode: "manual",
    bidEnrollment: "ready",
    onBidModeChange: noop,
    onCommitMaximum: noop,
    onPlaceBid: noop,
    view: liveView(),
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingAuctionBidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Current Bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Place Bid" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Recent Bids")).toBeInTheDocument();
  },
};

export const SignedOut: Story = {
  args: {
    bidEnrollment: "signed-out",
    history: HISTORY.map((row) => ({ ...row, isViewer: false })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Place Bid" }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText("Highest bid")).not.toBeInTheDocument();
    expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();
  },
};

export const Outbid: Story = {
  args: {
    bidMode: "auto",
    view: liveView({
      standing: "outbid",
      currentBidMinor: 825_000,
      minBidMinor: 850_000,
      viewerMaximumMinor: 800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Outbid")).toBeInTheDocument();
  },
};

export const Leading: Story = {
  args: {
    bidMode: "auto",
    view: liveView({
      standing: "leading-max",
      viewerMaximumMinor: 800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Highest bid")).toBeInTheDocument();
  },
};

export const LiveNoBids: Story = {
  args: {
    history: [],
    view: liveView({
      hasBids: false,
      priceLabel: "Starting bid",
      currentBidMinor: 120_000,
      bidCount: 0,
      bidCountLabel: "0 bids",
      standing: "none",
      minBidMinor: 120_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getByText("No bids yet")).toBeInTheDocument();
  },
};
