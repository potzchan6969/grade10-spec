import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type FlowArgs,
  flowParameter,
  flowScreen,
  flowStory,
  walkFlow,
} from "../../flow-screens";

/**
 * The bidder's and winner's critical journeys, each a tree of the screens
 * that already draw its steps: the Canvas lays them out, and the Screen
 * control focuses one. No screen state sits in two flows; each flow starts
 * where the one before it stops.
 */
const meta = {
  title: "Auction/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta<FlowArgs>;

export default meta;
type Story = StoryObj<FlowArgs>;

const BID_AND_WIN = [
  flowScreen(
    "1",
    "Read the live lot, signed out",
    "live-lot",
    "auction-display-screens-lot-details--live-no-bids",
  ),
  flowScreen(
    "2",
    "Link a card to bid",
    "link-card",
    "auction-bidding-screens-bid-panel-dialogs--setup-modal",
  ),
  flowScreen(
    "3",
    "Ready to bid",
    "ready",
    "auction-bidding-screens-bid-panel--ready",
  ),
  flowScreen(
    "4",
    "Outbid, raise the maximum",
    "outbid",
    "auction-display-screens-lot-details--live-auto-outbid",
  ),
  flowScreen(
    "5",
    "Won, payment due",
    "won",
    "auction-display-screens-lot-details--closed-won-payment-due",
  ),
];

const PAY_BY_CARD = [
  flowScreen(
    "1",
    "Awaiting setup",
    "awaiting-setup",
    "auction-post-bidding-screens-winner-order-setup--awaiting-setup",
  ),
  flowScreen(
    "2",
    "Confirm address, currency and method",
    "complete-setup",
    "auction-post-bidding-screens-winner-order-setup--complete-setup-flow",
  ),
  flowScreen(
    "3",
    "Invoice to pay",
    "pending-payment",
    "auction-post-bidding-screens-winner-order-payment--pending-payment",
  ),
  flowScreen(
    "4",
    "Pay by card",
    "pay-with-card",
    "auction-post-bidding-screens-winner-order-payment--pay-with-card-checkout",
  ),
];

const PAY_BY_BANK_TRANSFER = [
  flowScreen(
    "1",
    "Bank-transfer invoice",
    "bank-invoice",
    "auction-post-bidding-screens-winner-order-payment--pending-payment-bank-transfer",
  ),
  flowScreen(
    "2",
    "Bank details",
    "bank-details",
    "auction-post-bidding-screens-winner-order-payment-view-bank-details--hkd-fps-rail",
  ),
  flowScreen(
    "3",
    "Send proof of payment",
    "submit-proof",
    "auction-post-bidding-screens-winner-order-payment--submit-bank-payment-proof",
  ),
];

const MISS_A_DEADLINE = [
  flowScreen(
    "1",
    "Setup overdue",
    "setup-overdue",
    "auction-post-bidding-screens-winner-order-setup--expired-setup",
  ),
  flowScreen(
    "2",
    "Email Grade10 about setup",
    "email-setup",
    "auction-post-bidding-screens-winner-order-email-grade10--setup-overdue",
  ),
  flowScreen(
    "3",
    "Email Grade10 about payment",
    "email-payment",
    "auction-post-bidding-screens-winner-order-email-grade10--payment-overdue",
  ),
];

const FOLLOW_TO_DELIVERY = [
  flowScreen(
    "1",
    "Where I stand",
    "my-auctions",
    "auction-bidding-screens-my-auctions--post-auction",
  ),
  flowScreen(
    "2",
    "Shipped",
    "shipped",
    "auction-post-bidding-screens-winner-order-delivery--shipped",
  ),
  flowScreen(
    "3",
    "Delivered",
    "delivered",
    "auction-post-bidding-screens-winner-order-delivery--delivered",
  ),
];

/** A bidder reads a live lot, links a card, bids, is outbid and wins. */
export const BidAndWinALot: Story = {
  ...flowStory(BID_AND_WIN),
  parameters: {
    verification: { caseId: "vc_a8339044-015d-46ce-9354-e6285c867ef7" },
    journeys: [
      "grade10-site-auction-listing-page-US-01",
      "grade10-site-auction-bid-panel-enrollment-US-01",
      "grade10-site-auction-bid-panel-enrollment-US-02",
      "grade10-site-auction-bid-panel-enrollment-US-04",
      "grade10-site-auction-bid-payment-method-US-01",
      "grade10-site-auction-auto-bidding-US-01",
      "grade10-site-auction-auto-bidding-US-03",
      "grade10-site-auction-listing-page-US-12",
      "grade10-site-auction-listing-page-US-14",
      "grade10-site-auction-auction-US-11",
      "grade10-site-auction-lot-status-US-01",
    ],
    flow: flowParameter(BID_AND_WIN),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, BID_AND_WIN),
};

/** A winner confirms where the lot goes and how they pay, then pays by card. */
export const SetUpAndPayByCard: Story = {
  ...flowStory(PAY_BY_CARD),
  parameters: {
    verification: { caseId: "vc_7763b4b8-5875-42fb-995c-f60660204970" },
    journeys: [
      "winner-order-US-01",
      "winner-order-US-03",
      "winner-order-US-04",
      "winner-order-US-19",
      "winner-order-US-22",
      "winner-order-US-24",
      "winner-order-US-25",
    ],
    flow: flowParameter(PAY_BY_CARD),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, PAY_BY_CARD),
};

/** A winner pays by bank transfer and sends proof for Grade10 to check. */
export const PayByBankTransfer: Story = {
  ...flowStory(PAY_BY_BANK_TRANSFER),
  parameters: {
    verification: { caseId: "vc_105300d4-a7b6-4a86-bd3a-956a90018fd5" },
    journeys: ["winner-order-US-09"],
    flow: flowParameter(PAY_BY_BANK_TRANSFER),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, PAY_BY_BANK_TRANSFER),
};

/** A winner misses a deadline and can only contact Grade10. */
export const MissADeadline: Story = {
  ...flowStory(MISS_A_DEADLINE),
  parameters: {
    verification: { caseId: "vc_d17fcf70-f009-4791-9b17-ca602fc10091" },
    journeys: [
      "winner-order-US-05",
      "winner-order-US-07",
      "winner-order-US-16",
      "auction-status-US-03",
      "auction-status-US-04",
      "auction-status-US-05",
    ],
    flow: flowParameter(MISS_A_DEADLINE),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, MISS_A_DEADLINE),
};

/** A paid winner follows the lot from My Auctions to their door. */
export const FollowToDelivery: Story = {
  ...flowStory(FOLLOW_TO_DELIVERY),
  parameters: {
    verification: { caseId: "vc_d68565a9-3889-4777-b044-613e14e55821" },
    journeys: [
      "grade10-site-auction-account-record-US-02",
      "grade10-site-auction-account-record-US-03",
      "grade10-site-auction-account-record-US-04",
      "grade10-site-auction-account-record-US-07",
      "grade10-site-auction-account-record-US-10",
      "winner-order-US-02",
    ],
    flow: flowParameter(FOLLOW_TO_DELIVERY),
  },
  play: ({ canvasElement }) => walkFlow(canvasElement, FOLLOW_TO_DELIVERY),
};
