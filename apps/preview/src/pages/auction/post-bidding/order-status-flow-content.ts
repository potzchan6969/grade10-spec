import type {
  AuctionRecordCopy,
  AuctionRecordRowProps,
  AuctionRecordRowState,
} from "@grade10/ui";

const ORDER_STATUS_RECORD_COPY: AuctionRecordCopy = {
  title: "My Auctions",
  auctionColumn: "Auction",
  currentBidColumn: "Current Bid",
  standingColumn: "Status",
  emailAlertsColumn: "Email Alerts",
  noStanding: "--",
  emptyTitle: "No auctions yet",
  emptyDescription: "Watch an auction to come back to it here, or place a bid.",
  browseCatalogue: "Browse auctions",
  openListing: "Open listing",
  openBidding: "Bid",
  viewOrder: "View order",
};

const ORDER_STATUS_ROW_COPY = {
  openListing: "Open listing",
  openBidding: "Bid",
  noStanding: "--",
  viewOrder: "View order",
} as const;

const IMAGE = new URL("../../product.fixture.png", import.meta.url).href;

/** One won lot as My Auctions lists it, labelled with the state it is in. */
function wonRow(
  id: string,
  state: AuctionRecordRowState,
  stateLabel: string,
  title: string,
): AuctionRecordRowProps {
  return {
    id,
    title,
    state,
    stateLabel,
    currentBid: "US$12,800",
    bidPlaced: true,
    imageSrc: IMAGE,
    imageAlt: title,
    copy: ORDER_STATUS_ROW_COPY,
    onOpen: () => undefined,
  };
}

export const ORDER_STATUS_ROWS = {
  awaitingSetup: [
    wonRow(
      "order-awaiting-setup",
      "awaiting_address",
      "Awaiting Setup",
      "1999 Base Set Charizard PSA 9",
    ),
  ],
  setupOverdue: [
    wonRow(
      "order-setup-overdue",
      "awaiting_address_expired",
      "Setup Overdue",
      "1999 Base Set Venusaur PSA 8",
    ),
  ],
  pendingPayment: [
    wonRow(
      "order-pending-payment",
      "pending_payment",
      "Pending Payment",
      "2000 Skyridge Crystal Charizard PSA 9",
    ),
  ],
  paymentOverdue: [
    wonRow(
      "order-payment-overdue",
      "expired",
      "Payment Overdue",
      "1999 Fossil Dragonite Holo PSA 8",
    ),
  ],
  partiallyPaid: [
    wonRow(
      "order-partially-paid",
      "partially_paid",
      "Partially Paid",
      "1999 Jungle Vaporeon Holo PSA 9",
    ),
  ],
} as const satisfies Record<string, readonly AuctionRecordRowProps[]>;

export { ORDER_STATUS_RECORD_COPY };
