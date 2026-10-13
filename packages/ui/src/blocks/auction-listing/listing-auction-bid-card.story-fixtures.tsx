/** Shared fixtures and meta pieces for the ListingAuctionBidCard story files. */
import { getMessages } from "@grade10/i18n";
import type { Meta } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { DEFAULT_LISTING_CURRENCY } from "../../lib/format-money";
import type { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  DEFAULT_LISTING_EXTENSION_POLICY,
  formatAutoExtendedTooltip,
} from "./listing-extension-policy";
import type { ListingAuctionBidView, ListingBidHistoryRow } from "./types";

const { auctionListing, common } = getMessages("grade10", "en");

export const COPY = {
  recentBids: auctionListing.recentBids,
  bidHistory: {
    you: auctionListing.bidHistoryYou,
    empty: auctionListing.noBidsYet,
    winner: auctionListing.bidHistoryWinner,
    samePricePriorityTip: auctionListing.samePricePriorityTip,
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
  maximumAtCeiling: auctionListing.maximumAtCeiling,
  biddingAtCeiling: auctionListing.biddingAtCeiling,
  ceilingChip: auctionListing.ceilingChip,
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

export const NOW_MS = Date.now();
export const CLOSES_AT_MS = NOW_MS + (6 * 60 + 9) * 1000;

export const HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-5800",
    initials: "john@example.com",
    amountMinor: 5_800_000,
    acceptedAtMs: NOW_MS - 2 * 60_000,
    isViewer: true,
  },
  {
    id: "bid-mike-5800",
    initials: "mike@example.com",
    amountMinor: 5_800_000,
    acceptedAtMs: NOW_MS - 3 * 60_000,
    samePricePriority: true,
  },
  {
    id: "bid-mike-5550",
    initials: "mike@example.com",
    amountMinor: 5_550_000,
    acceptedAtMs: NOW_MS - 8 * 60_000,
  },
];

export function liveView(
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
    ceilingMinor: 8_000_000_000,
    ...overrides,
    currency: overrides.currency ?? DEFAULT_LISTING_CURRENCY,
  };
}

export const noop = () => undefined;

/** The meta every bid-card story file spreads, under its own title. */
export const BID_CARD_META = {
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The listing bid card. The consumer owns product state and every action. Enrollment states, countdown, bidding flows, and callback contracts live on [Bid Panel Docs](?path=/docs/auction-bidding-screens-bid-panel--docs).",
      },
    },
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
} satisfies Partial<Meta<typeof ListingAuctionBidCard>>;

/** Shared args for a bid-card meta literal. */
export const BID_CARD_ARGS = {
  copy: COPY,
  history: HISTORY,
  locale: FIXTURE_SHIPPED_LOCALE,
  timeZone: FIXTURE_TIME_ZONE,
  bidEnrollment: "ready",
  onCommitMaximum: noop,
  onPlaceBid: noop,
} satisfies Partial<ComponentProps<typeof ListingAuctionBidCard>>;
