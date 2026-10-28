import { FlowContainer } from "@grade10/ui/blocks/shared/flow-container";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import {
  type FlowStep,
  FlowStepFrame,
  flowStep,
  walkSteps,
} from "../../flow-steps";

/**
 * The bidder's and winner's critical journeys, each played through the screens
 * that already draw its steps. No screen state sits in two flows: each flow
 * starts where the one before it stops.
 */
const meta = {
  title: "Auction/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Steps = readonly (readonly [string, FlowStep])[];

const BID_AND_WIN: Steps = [
  flowStep(
    "Read the live lot, signed out",
    "live-lot",
    "auction-display-screens-lot-details--live-no-bids",
  ),
  flowStep(
    "Signed in, no card yet",
    "need-card",
    "auction-bidding-screens-bid-panel--need-card",
  ),
  flowStep(
    "Link a card to bid",
    "link-card",
    "auction-bidding-screens-bid-panel-dialogs--setup-modal",
  ),
  flowStep("Ready to bid", "ready", "auction-bidding-screens-bid-panel--ready"),
  flowStep(
    "Outbid, raise the maximum",
    "outbid",
    "auction-display-screens-lot-details--live-auto-outbid",
  ),
  flowStep(
    "Won, payment due",
    "won",
    "auction-display-screens-lot-details--closed-won-payment-due",
  ),
];

const PAY_BY_CARD: Steps = [
  flowStep(
    "Awaiting setup",
    "awaiting-setup",
    "auction-post-bidding-screens-winner-order-setup--awaiting-setup",
  ),
  flowStep(
    "Confirm address, currency and method",
    "complete-setup",
    "auction-post-bidding-screens-winner-order-setup--complete-setup-flow",
  ),
  flowStep(
    "Invoice to pay",
    "pending-payment",
    "auction-post-bidding-screens-winner-order-payment--pending-payment",
  ),
  flowStep(
    "Pay by card",
    "pay-with-card",
    "auction-post-bidding-screens-winner-order-payment--pay-with-card-checkout",
  ),
];

const PAY_BY_BANK_TRANSFER: Steps = [
  flowStep(
    "Bank-transfer invoice",
    "bank-invoice",
    "auction-post-bidding-screens-winner-order-payment--pending-payment-bank-transfer",
  ),
  flowStep(
    "Bank details",
    "bank-details",
    "auction-post-bidding-screens-winner-order-payment-view-bank-details--hkd-fps-rail",
  ),
  flowStep(
    "Send proof of payment",
    "submit-proof",
    "auction-post-bidding-screens-winner-order-payment--submit-bank-payment-proof",
  ),
];

const MISS_A_DEADLINE: Steps = [
  flowStep(
    "Setup overdue",
    "setup-overdue",
    "auction-post-bidding-screens-winner-order-setup--expired-setup",
  ),
  flowStep(
    "Email Grade10 about setup",
    "email-setup",
    "auction-post-bidding-screens-winner-order-email-grade10--setup-overdue",
  ),
  flowStep(
    "Email Grade10 about payment",
    "email-payment",
    "auction-post-bidding-screens-winner-order-email-grade10--payment-overdue",
  ),
];

const FOLLOW_TO_DELIVERY: Steps = [
  flowStep(
    "Where I stand",
    "my-auctions",
    "auction-bidding-screens-my-auctions--post-auction",
  ),
  flowStep(
    "Shipped",
    "shipped",
    "auction-post-bidding-screens-winner-order-delivery--shipped",
  ),
  flowStep(
    "Delivered",
    "delivered",
    "auction-post-bidding-screens-winner-order-delivery--delivered",
  ),
];

function Flow({ steps, children }: { steps: Steps; children: ReactNode }) {
  return (
    <FlowContainer cases={steps} description={children}>
      {(step, title) => <FlowStepFrame step={step} title={title} />}
    </FlowContainer>
  );
}

/** A bidder reads a live lot, links a card, bids, is outbid and wins. */
export const BidAndWinALot: Story = {
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
  },
  render: () => (
    <Flow steps={BID_AND_WIN}>
      <p>
        A signed-out bidder can read the lot but must sign in and link a card
        before the bid panel takes a maximum. Being outbid moves the panel to
        raise; the lot closes on the bidder's maximum and asks for payment.
      </p>
    </Flow>
  ),
  play: ({ canvasElement }) => walkSteps(canvasElement, BID_AND_WIN),
};

/** A winner confirms where the lot goes and how they pay, then pays by card. */
export const SetUpAndPayByCard: Story = {
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
  },
  render: () => (
    <Flow steps={PAY_BY_CARD}>
      <p>
        Setup confirms the delivery address, the settlement currency and the
        method inside its deadline, and leaves the invoice being prepared. The
        invoice follows; paying it by card ends with the payment received.
      </p>
    </Flow>
  ),
  play: ({ canvasElement }) => walkSteps(canvasElement, PAY_BY_CARD),
};

/** A winner pays by bank transfer and sends proof for Grade10 to check. */
export const PayByBankTransfer: Story = {
  parameters: {
    verification: { caseId: "vc_105300d4-a7b6-4a86-bd3a-956a90018fd5" },
    journeys: ["winner-order-US-09"],
  },
  render: () => (
    <Flow steps={PAY_BY_BANK_TRANSFER}>
      <p>
        A bank-transfer invoice shows where to send the money and the reference
        to quote. Sending proof leaves the order being checked, and stops the
        deadline while Grade10 checks it.
      </p>
    </Flow>
  ),
  play: ({ canvasElement }) => walkSteps(canvasElement, PAY_BY_BANK_TRANSFER),
};

/** A winner misses a deadline and can only contact Grade10. */
export const MissADeadline: Story = {
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
  },
  render: () => (
    <Flow steps={MISS_A_DEADLINE}>
      <p>
        Past the setup or the payment deadline, self-service stops: the order
        offers Contact Us, which opens an email to Grade10 naming the order.
      </p>
    </Flow>
  ),
  play: ({ canvasElement }) => walkSteps(canvasElement, MISS_A_DEADLINE),
};

/** A paid winner follows the lot from My Auctions to their door. */
export const FollowToDelivery: Story = {
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
  },
  render: () => (
    <Flow steps={FOLLOW_TO_DELIVERY}>
      <p>
        My Auctions shows where each lot stands. A paid order is shipped, with
        its tracker, and ends delivered.
      </p>
    </Flow>
  ),
  play: ({ canvasElement }) => walkSteps(canvasElement, FOLLOW_TO_DELIVERY),
};
