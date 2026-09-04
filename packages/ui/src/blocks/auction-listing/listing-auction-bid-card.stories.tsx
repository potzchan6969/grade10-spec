import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { DEFAULT_LISTING_CURRENCY } from "../../lib/format-money";
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
  setMaximumLabel: "Set Maximum",
  setMaximumCurrentLabel: "Set Maximum (current: {amount})",
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
  setPrivateMaximum: "Set your private maximum",
  raisePrivateMaximum: "Raise your private maximum (current: {amount})",
  reviewMaximum: "Set Maximum · {amount}",
  raiseMaximumReview: "Raise Maximum · {amount}",
  bidNowReview: "Bid Now · {amount}",
  privateMaximumTooltip:
    "Your maximum is the most you are willing to pay before buyer fees. Other bidders cannot see it. We only bid as needed to keep you leading.",
  maximumMechanismSubtext:
    "We bid only as needed up to your maximum. Hold matches it; you can raise, not lower or cancel.",
  customAmountPlaceholder: "Custom amount (min. {amount})",
  stepperMessage: "Min.: {amount}",
  useMinimum: "Use minimum",
  bidImmediate: "Maximum {amount}",
  bidUpTo: "Maximum {amount}",
  nextEligibleBid: "Min. bid",
  amountAboveCurrent: "{amount} vs current",
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
    currency: overrides.currency ?? DEFAULT_LISTING_CURRENCY,
  };
}

const noop = () => undefined;

const meta = {
  title: "Auction Listing/ListingAuctionBidCard",
  component: ListingAuctionBidCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The listing bid card. The consumer owns product state and every action. Enrollment states, countdown, bidding flows, and callback contracts live on [Bid Panel Docs](?path=/docs/auction-listing-bid-panel--docs).",
      },
    },
  },
  args: {
    copy: COPY,
    history: HISTORY,
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    bidEnrollment: "ready",
    onCommitMaximum: noop,
    onPlaceBid: noop,
    view: liveView(),
  },
  argTypes: {
    copy: { table: { disable: true } },
    view: { table: { disable: true } },
    history: { table: { disable: true } },
    historyResetKey: { table: { disable: true } },
    recentBidsAccessory: { table: { disable: true } },
    locale: { table: { disable: true } },
    timeZone: { table: { disable: true } },
    bidEnrollment: {
      control: "select",
      options: ["signed-out", "ready"],
      description:
        "signed-out replaces Set Maximum with Sign In to Bid and hides standing.",
    },
    onPlaceBid: {
      control: false,
      description:
        "Fires on Sign In to Bid when signed out. The consumer opens sign-in.",
    },
    onCommitMaximum: {
      control: false,
      description:
        "Fires when Bid Now / Set Maximum / Raise Maximum commits the selected preset or custom amount. The consumer validates the maximum, takes the hold, and writes the cap.",
    },
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
    expect(canvas.getByText("Set your private maximum")).toBeInTheDocument();
    expect(canvas.getByText("Min. bid")).toBeInTheDocument();
    expect(
      canvas.getByPlaceholderText(/Custom amount \(min\./),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Set Maximum ·/ }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Maximum /, pressed: true }),
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
    expect(canvas.queryByText("Min. bid")).not.toBeInTheDocument();
    expect(canvas.queryByText("Highest bid")).not.toBeInTheDocument();
    expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();
  },
};

export const Outbid: Story = {
  args: {
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
    view: liveView({
      standing: "leading-max",
      viewerMaximumMinor: 800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Highest bid")).toBeInTheDocument();
    expect(
      canvas.getByText(/Raise your private maximum \(current: HK\$8,000\)/),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Raise Maximum ·/ }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText(/vs current/)).toHaveLength(2);
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
    expect(canvas.getAllByText("No bids yet").length).toBeGreaterThan(0);
  },
};
