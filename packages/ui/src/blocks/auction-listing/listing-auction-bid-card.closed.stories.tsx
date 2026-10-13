import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  BID_CARD_ARGS,
  BID_CARD_META,
  COPY,
  liveView,
  NOW_MS,
} from "./listing-auction-bid-card.story-fixtures";
import type { ListingBidHistoryRow } from "./types";

const meta = {
  component: ListingAuctionBidCard,
  title: "Auction/Bidding/Blocks/ListingAuctionBidCard/Closed",
  ...BID_CARD_META,
  args: { ...BID_CARD_ARGS, view: liveView() },
} satisfies Meta<typeof ListingAuctionBidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const CLOSED_EQUAL_MAX_HISTORY: ListingBidHistoryRow[] = [
  {
    id: "bid-john-won-5800",
    initials: "john@example.com",
    amountMinor: 5_800_000,
    acceptedAtMs: NOW_MS - 60 * 60_000,
    isViewer: true,
    isWinner: true,
  },
  {
    id: "bid-mike-tie-5800",
    initials: "mike@example.com",
    amountMinor: 5_800_000,
    acceptedAtMs: NOW_MS - 61 * 60_000,
    samePricePriority: true,
  },
  {
    id: "bid-mike-5550",
    initials: "mike@example.com",
    amountMinor: 5_550_000,
    acceptedAtMs: NOW_MS - 90 * 60_000,
  },
];

/**
 * Closed sold with equal maxima: winning row shows a crown; the same-price
 * non-leader carries the equal-max Info tip.
 *
 * Scenario: shared-ui-auction-listing-SC-50 - Closed sold Recent bids show a winner crown
 * Scenario: shared-ui-auction-listing-SC-51 - Equal-max non-leader shows earlier-leads tip
 */
export const ClosedSoldEqualMax: Story = {
  args: {
    history: CLOSED_EQUAL_MAX_HISTORY,
    view: liveView({
      live: false,
      closed: true,
      showBidActions: false,
      priceLabel: "Winning bid",
      standing: "won-payment-due",
      countdown: "",
      countdownSeconds: null,
      closesAtMs: null,
      deadlineAtMs: NOW_MS - 60 * 60_000,
      opensAtMs: NOW_MS - 3 * 24 * 60 * 60 * 1000,
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "After close, the winning public row shows a primary crown after the amount. The equal-max challenger shows an Info tip in the amount tone.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText("Winner")).toBeInTheDocument();
    expect(
      canvas.getByLabelText("When maximums match, the earlier one leads."),
    ).toBeInTheDocument();
  },
};

/**
 * ClosedSoldEqualMax with bid history copy that leaves `winner` unset: the
 * won row is flagged, but no crown draws without its name.
 *
 * Scenario: shared-ui-auction-listing-SC-54 - No crown without its name
 */
export const ClosedSoldEqualMaxWithoutWinnerCopy: Story = {
  args: {
    ...ClosedSoldEqualMax.args,
    copy: { ...COPY, bidHistory: { ...COPY.bidHistory, winner: undefined } },
  },
  parameters: {
    docs: {
      description: {
        story:
          "ClosedSoldEqualMax without `winner` copy. The won row carries `isWinner`, yet no crown shows, because the list draws none without the consumer's name for it.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByText("Recent Bids");
    const recentBids = within(heading.parentElement as HTMLElement);
    expect(recentBids.queryByRole("img")).not.toBeInTheDocument();
    expect(canvas.queryByLabelText("Winner")).not.toBeInTheDocument();
    expect(canvas.queryByText("Winner")).not.toBeInTheDocument();
  },
};
