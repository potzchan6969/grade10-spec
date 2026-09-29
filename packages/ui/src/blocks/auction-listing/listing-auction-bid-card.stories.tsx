import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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

const { auctionListing, common } = getMessages("grade10", "en");

const COPY = {
  recentBids: auctionListing.recentBids,
  bidHistory: {
    you: auctionListing.bidHistoryYou,
    empty: auctionListing.noBidsYet,
  },
  auctionWon: auctionListing.auctionWon,
  completePurchase: auctionListing.completePurchase,
  completePurchaseBody: auctionListing.completePurchaseBody,
  completePurchaseAction: auctionListing.completePurchaseAction,
  paid: auctionListing.paid,
  paidBody: auctionListing.paidBody,
  viewOrderDetails: auctionListing.viewOrderDetails,
  didNotWin: auctionListing.youDidntWin,
  outbid: auctionListing.outbid,
  highestBid: auctionListing.highestBidder,
  yourMaximum: auctionListing.automaticMaximum,
  setMaximumLabel: auctionListing.setMaximumLabel,
  setMaximumCurrentLabel: auctionListing.setMaximumCurrentLabel,
  opensIn: auctionListing.opensIn,
  closed: auctionListing.closed,
  timeLeft: auctionListing.timeLeft,
  timeLeftAutoExtended: auctionListing.timeLeftExtended,
  autoExtendedTooltip: formatAutoExtendedTooltip(
    DEFAULT_LISTING_EXTENSION_POLICY,
  ),
  placeBidSection: auctionListing.placeBidTitle,
  placeBid: auctionListing.placeBid,
  signInToBid: auctionListing.signInToBid,
  linkACardToBid: auctionListing.linkACardToBid,
  confirmMaximum: common.confirm,
  raiseMaximum: auctionListing.automaticMaximumRaise,
  // Not catalogued: no confirmed production wiring found for these five.
  confirmMaximumTooltip:
    "The most we’ll bid for you. You may pay less if the auction ends below it.",
  confirmMaximumAriaLabel: "Confirm Maximum",
  raiseMaximumAriaLabel: "Raise Maximum",
  enableAutoBidding: "Enable auto-bidding",
  autoBiddingTooltip:
    "We bid for you as needed, up to your maximum. You may pay less if the auction ends below it.",
  setPrivateMaximum: auctionListing.setPrivateMaximum,
  raisePrivateMaximum: auctionListing.raisePrivateMaximum,
  currentMaximum: auctionListing.currentMaximum,
  reviewMaximum: auctionListing.setMaximumWithAmount,
  raiseMaximumReview: auctionListing.raiseMaximumWithAmount,
  bidNowReview: auctionListing.bidNowWithAmount,
  privateMaximumTooltip: auctionListing.privateMaximumTooltip,
  maximumMechanismSubtext: auctionListing.maximumMechanismSubtext,
  // Not catalogued: no confirmed production wiring found for these six.
  customAmountPlaceholder: "{amount} min.",
  stepperMessage: "Min.: {amount}",
  invalidAmount: auctionListing.invalidAmount,
  useMinimum: "Use minimum",
  bidImmediate: auctionListing.maximumChip,
  bidUpTo: auctionListing.maximumChip,
  nextEligibleBid: "Min. bid",
  amountAboveCurrent: "{amount} vs current",
  amountAboveMaximum: "{amount} vs max",
  minimumMaximumFloor: auctionListing.minimumMaximumFloor,
  minimumMaximumLeadingNudge: auctionListing.minimumMaximumLeadingNudge,
  minimumMaximumLeadingIncrement: auctionListing.minimumMaximumLeadingIncrement,
  // Not catalogued: no confirmed production wiring found.
  maximumBelowMinimum: "Enter at least {amount}",
  buyerFeeHint: auctionListing.buyerFeeHint,
  noBids: auctionListing.noBids,
  noBidsYet: auctionListing.noBidsYet,
  endsLabel: auctionListing.endsLabel,
  opensLabel: auctionListing.opensLabel,
  closedAt: auctionListing.closedAt,
  closedSummary: auctionListing.closedSummary,
  unsold: auctionListing.unsold,
  activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
} as const;

const NOW_MS = Date.now();
const CLOSES_AT_MS = NOW_MS + (6 * 60 + 9) * 1000;

const HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-5800",
    initials: "john@example.com",
    amountMinor: 5_800_000,
    acceptedAtMs: NOW_MS - 2 * 60_000,
    isViewer: true,
  },
  {
    id: "bid-mike-5550",
    initials: "mike@example.com",
    amountMinor: 5_550_000,
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
    currentBidMinor: 5_800_000,
    bidCount: 6,
    bidCountLabel: "6 bids",
    countdown: "6m 9s",
    countdownSeconds: 369,
    closesAtMs: CLOSES_AT_MS,
    countdownFormat: "short",
    extended: false,
    deadlineAtMs: CLOSES_AT_MS,
    standing: "none",
    minBidMinor: 6_050_000,
    incrementMinor: 250_000,
    suggestedMaxMinor: 9_500_000,
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
      options: ["signed-out", "needs-card", "ready"],
      description:
        "signed-out → Sign In to Bid; needs-card → disabled amount entry and Link a card to bid; ready → commit maximum.",
    },
    onPlaceBid: {
      control: false,
      description:
        "Fires on Sign In to Bid when signed out, or Link a card to bid when needs-card.",
    },
    onCommitMaximum: {
      control: false,
      description:
        "Fires when Bid now / Set maximum / Raise maximum commits the selected preset or custom amount. The consumer validates the maximum and writes the cap. First launch does not take a bid-time hold.",
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
    expect(canvas.getByPlaceholderText("60,500 min.")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Set maximum to/ }),
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
    expect(canvas.queryByText("Leading")).not.toBeInTheDocument();
    expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();
  },
};

const openSetupFromNeedsCard = fn();
const commitMaximumFromNeedsCard = fn();

export const NeedsCard: Story = {
  args: {
    bidEnrollment: "needs-card",
    onCommitMaximum: commitMaximumFromNeedsCard,
    onPlaceBid: openSetupFromNeedsCard,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const amountGroup = canvas.getByRole("group");
    for (const preset of within(amountGroup).getAllByRole("button")) {
      expect(preset).toBeDisabled();
    }
    expect(
      canvas.getByRole("spinbutton", { name: "60,500 min." }),
    ).toBeDisabled();

    await userEvent.click(
      canvas.getByRole("button", { name: "Link a card to bid" }),
    );
    expect(openSetupFromNeedsCard).toHaveBeenCalledOnce();
    expect(commitMaximumFromNeedsCard).not.toHaveBeenCalled();
  },
};

const commitMaximumWhenReady = fn();

export const Ready: Story = {
  args: {
    bidEnrollment: "ready",
    onCommitMaximum: commitMaximumWhenReady,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const commitButton = canvas.getByRole("button", {
      name: /^Set maximum to/,
    });
    expect(commitButton).toBeEnabled();
    await userEvent.click(commitButton);
    expect(commitMaximumWhenReady).toHaveBeenCalledOnce();
    expect(commitMaximumWhenReady).toHaveBeenCalledWith(6_300_000);
  },
};

export const Outbid: Story = {
  args: {
    view: liveView({
      standing: "outbid",
      currentBidMinor: 9_750_000,
      minBidMinor: 10_000_000,
      viewerMaximumMinor: 9_500_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Outbid · HK\$95,000/)).toBeInTheDocument();
  },
};

export const Leading: Story = {
  args: {
    view: liveView({
      standing: "leading-max",
      viewerMaximumMinor: 9_500_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Leading · HK\$58,000/)).toBeInTheDocument();
    expect(canvas.getByText("Raise your private maximum")).toBeInTheDocument();
    expect(canvas.getByText(/Max: HK\$95,000/)).toBeInTheDocument();
    expect(canvas.queryByText("Min. bid")).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to/ }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText(/vs max/)).toHaveLength(3);
    expect(canvas.queryByText(/vs current/)).not.toBeInTheDocument();
    expect(canvas.getByText("HK$97,500")).toBeInTheDocument();
    expect(canvas.getByText("HK$100,000")).toBeInTheDocument();
    expect(canvas.getByText("HK$105,000")).toBeInTheDocument();
    expect(canvas.queryByText("HK$95,001")).not.toBeInTheDocument();
    expect(canvas.getByPlaceholderText("95,001 min.")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to HK\$100,000/ }),
    ).toBeInTheDocument();
  },
};

export const ExtendedBidding: Story = {
  args: {
    view: liveView({
      extended: true,
      countdown: "29m 58s",
      countdownSeconds: 1798,
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Past scheduled close with extended bidding on. Time left label reads Time left (extended); the info tooltip explains the post-close timer restart.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Time left (extended)").length).toBeGreaterThan(
      0,
    );
    expect(
      canvas.getAllByLabelText(
        /After the scheduled close, each bid restarts a 30-minute timer/,
      ).length,
    ).toBeGreaterThan(0);
  },
};

export const Opens: Story = {
  args: {
    history: [],
    bidEnrollment: undefined,
    view: liveView({
      headerLabel: "Opens soon",
      live: false,
      opens: true,
      hasBids: false,
      showBidActions: false,
      priceLabel: "",
      currentBidMinor: 4_800_000,
      bidCount: 0,
      bidCountLabel: "0 bids",
      countdown: "2D 4H 12M 0S",
      countdownSeconds: 2 * 24 * 60 * 60 + 4 * 60 * 60 + 12 * 60,
      countdownFormat: "long",
      closesAtMs: null,
      deadlineAtMs: NOW_MS + 2 * 24 * 60 * 60 * 1000,
      standing: "none",
      minBidMinor: 4_800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Opens soon")).not.toBeInTheDocument();
    expect(canvas.getByText("Opens in")).toBeInTheDocument();
    expect(canvas.queryByText("Starting bid")).not.toBeInTheDocument();
    const reachable = canvas
      .queryAllByText("No bids yet")
      .filter((element) => element.closest("[inert]") == null);
    expect(reachable).toHaveLength(0);
  },
};

export const LiveNoBids: Story = {
  args: {
    history: [],
    view: liveView({
      hasBids: false,
      priceLabel: "Starting bid",
      currentBidMinor: 4_800_000,
      bidCount: 0,
      bidCountLabel: "0 bids",
      standing: "none",
      minBidMinor: 4_800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getAllByText("No bids yet").length).toBeGreaterThan(0);
  },
};

/**
 * Seeds the custom field at 500. Paste (or select-all + paste) a value above
 * 9,999,999,999 — the draft restores to 500. Typing digit-by-digit restores
 * one keystroke at a time (e.g. 10000000000 → 1000000000), not the seed.
 */
export const CustomMaximumCeiling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Custom amount starts at 500. Paste above 9,999,999,999 to see restore to 500. Digit-by-digit typing restores the previous keystroke only.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("spinbutton", {
      name: "60,500 min.",
    });
    await userEvent.clear(field);
    await userEvent.type(field, "500");
    expect(field).toHaveValue(500);
  },
};

export const SuspendedBidderRefusal: Story = {
  name: "Suspended bidder refusal (TBC)",
  args: {
    authorizationStatus: "error",
    authorizationMessage:
      "Your account remains suspended from auction bidding. Contact Grade10 support if you need help.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Your account remains suspended from auction bidding. Contact Grade10 support if you need help.",
      ),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /^Set maximum to/ }),
    ).toBeVisible();
    expect(canvas.getByText("Recent Bids")).toBeVisible();
  },
};
