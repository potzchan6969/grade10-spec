export type WinnerOrderStatus =
  | "awaiting_address"
  | "preparing_invoice"
  | "pending_payment"
  | "pending_payment_expired"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const WINNER_ORDER_STATUS_LABELS: Record<WinnerOrderStatus, string> = {
  awaiting_address: "Awaiting Address",
  preparing_invoice: "Preparing Invoice",
  pending_payment: "Pending Payment",
  pending_payment_expired: "Pending Payment (expired invoice)",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export type WinnerOrderInvoiceLine = {
  label: string;
  value: string;
  muted?: boolean;
};

export type WinnerOrderContent = {
  status: WinnerOrderStatus;
  statusLabel: string;
  title: string;
  lotTitle: string;
  winningBid: string;
  endedAt: string;
  body: string;
  addressLabel: string;
  addressValue: string | null;
  addressHint?: string;
  invoiceLines: WinnerOrderInvoiceLine[] | null;
  deadline?: string;
  overdue?: boolean;
  primaryCta: string | null;
  secondaryNote?: string;
};

const LOT = {
  lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
  winningBid: "HK$12,800",
  endedAt: "Ended 17 Sep 2026, 21:30 HKT",
} as const;

const ADDRESS = "12/F, Tower 1\nHarbour Road\nWan Chai, Hong Kong" as const;

const INVOICE_LINES: WinnerOrderInvoiceLine[] = [
  { label: "Winning Bid", value: "HK$12,800" },
  { label: "Buyer's Premium", value: "HK$2,560" },
  { label: "Shipping & Handling", value: "HK$180" },
  { label: "Insurance", value: "HK$120" },
  { label: "Order Total", value: "HK$15,660" },
];

function contentFor(status: WinnerOrderStatus): WinnerOrderContent {
  const statusLabel = WINNER_ORDER_STATUS_LABELS[status];
  const base = {
    status,
    statusLabel,
    title: "Winner Order",
    ...LOT,
  };

  switch (status) {
    case "awaiting_address":
      return {
        ...base,
        body: "Confirm where we ship this lot. Grade10 uses the address to calculate the shipping fee on the invoice — nothing is due yet.",
        addressLabel: "Delivery address",
        addressValue: null,
        addressHint: "Choose a saved address or add one, then confirm.",
        invoiceLines: null,
        primaryCta: "Confirm delivery address",
        overdue: false,
      };
    case "preparing_invoice":
      return {
        ...base,
        body: "Address confirmed. Grade10 is preparing your invoice for this destination.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        addressHint: "You can change this until the invoice is sent.",
        invoiceLines: null,
        primaryCta: null,
        secondaryNote: "No payment yet — waiting on the operator quote.",
        overdue: false,
      };
    case "pending_payment":
      return {
        ...base,
        body: "Your invoice is ready. Pay by card before the deadline.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        addressHint: "Locked after invoice send. Contact Grade10 to change it.",
        invoiceLines: INVOICE_LINES,
        deadline: "Pay by 24 Sep 2026, 21:30 HKT",
        primaryCta: "Pay with card",
        overdue: false,
      };
    case "pending_payment_expired":
      return {
        ...base,
        body: "The payment deadline has passed. The invoice stays payable — contact Grade10 if you need a reissue.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        deadline: "Deadline passed 24 Sep 2026, 21:30 HKT",
        primaryCta: "Pay with card",
        secondaryNote: "How to reach Grade10: support@grade10.com",
        overdue: false,
      };
    case "processing":
      return {
        ...base,
        body: "Payment received. Grade10 is preparing this lot to ship.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: null,
        secondaryNote: "Paid with Visa ···· 4242",
      };
    case "shipped":
      return {
        ...base,
        body: "Your lot is on the way.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: "Track shipment",
        secondaryNote: "SF Express · SF1234567890",
      };
    case "delivered":
      return {
        ...base,
        body: "Delivered. Delivery proof is on this order.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: null,
        secondaryNote: "Delivered 28 Sep 2026, 14:12 HKT",
      };
    case "cancelled":
      return {
        ...base,
        body: "This order was cancelled. The lot returned to available stock.",
        addressLabel: "Delivery address",
        addressValue: null,
        invoiceLines: null,
        primaryCta: null,
      };
    case "refunded":
      return {
        ...base,
        body: "This order was refunded.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: null,
      };
  }
}

export const WINNER_ORDER_CONTENTS: Record<
  WinnerOrderStatus,
  WinnerOrderContent
> = {
  awaiting_address: contentFor("awaiting_address"),
  preparing_invoice: contentFor("preparing_invoice"),
  pending_payment: contentFor("pending_payment"),
  pending_payment_expired: contentFor("pending_payment_expired"),
  processing: contentFor("processing"),
  shipped: contentFor("shipped"),
  delivered: contentFor("delivered"),
  cancelled: contentFor("cancelled"),
  refunded: contentFor("refunded"),
};
