export type WinnerOrderStatus =
  | "awaiting_address"
  | "awaiting_address_expired"
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
  awaiting_address_expired: "Awaiting Address (deadline passed)",
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
  /** Brief explanation shown in an info tooltip beside the label. */
  tooltip?: string;
};

/** Absolute datetimes / day-only strings for Order Progress step subtext. */
export type WinnerOrderProgressDates = {
  address?: string;
  invoice?: string;
  payment?: string;
  shipped?: string;
  completed?: string;
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
  invoiceLines: WinnerOrderInvoiceLine[] | null;
  /** Under Pay / Confirm CTAs, or the overdue alert title. */
  deadline?: string;
  overdue?: boolean;
  primaryCta: string | null;
  secondaryNote?: string;
  progressDates?: WinnerOrderProgressDates;
  /**
   * Inline Alert under the lot for terminal closed outcomes (Cancelled /
   * Refunded). Status matches design-system Alert variants.
   */
  outcomeAlert?: {
    title: string;
    status: "default" | "warning" | "success" | "error";
  };
  /** Paid receipt strip — method + masked number. */
  paymentMethod?: string;
  paymentMasked?: string;
};

const LOT = {
  lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
  winningBid: "HK$12,800",
  endedAt: "Ended 17 Sep 2026, 21:30 HKT",
} as const;

const ADDRESS = "12/F, Tower 1\nHarbour Road\nWan Chai, Hong Kong" as const;

/** Lot closed 17 Sep 2026, 21:30 HKT → confirm address within 48 hours. */
const ADDRESS_DEADLINE = "Confirm by 19 Sep 2026, 21:30 HKT" as const;
/** Brief overdue alert — past tense so the winner knows the window closed. */
const ADDRESS_DEADLINE_PASSED = "Missed address deadline: 19 Sep 2026" as const;

/**
 * Invoice sent 19 Sep 2026, 11:00 HKT → pay within 7 calendar days of send
 * (not of lot close).
 */
const PAYMENT_DEADLINE = "Pay by 26 Sep 2026, 11:00 HKT" as const;
const PAYMENT_DEADLINE_PASSED =
  "Payment deadline passed 26 Sep 2026, 11:00 HKT" as const;

/** Progress step subtext — day only so five columns do not overflow. */
const PROGRESS_DAY = {
  addressConfirmBy: "Confirm by 19 Sep 2026",
  addressConfirmed: "18 Sep 2026",
  addressExpired: "19 Sep 2026",
  invoiceSent: "19 Sep 2026",
  paymentDue: "Pay by 26 Sep 2026",
  paymentPaid: "20 Sep 2026",
  paymentExpired: "26 Sep 2026",
  shipped: "26 Sep 2026",
  completed: "28 Sep 2026",
} as const;

const LINE_TOOLTIPS = {
  buyersPremium:
    "20% of the winning bid, or the currency’s minimum charge when that is higher.",
  shippingHandling:
    "Quoted by Grade10 for your confirmed delivery address — packing, carrier, and handling.",
  processingFee: "Card and payment-processing costs on this order.",
} as const;

const INVOICE_LINES: WinnerOrderInvoiceLine[] = [
  { label: "Winning Bid", value: "HK$12,800" },
  {
    label: "Buyer’s Premium",
    value: "HK$2,560",
    tooltip: LINE_TOOLTIPS.buyersPremium,
  },
  {
    label: "Shipping & Handling",
    value: "HK$180",
    tooltip: LINE_TOOLTIPS.shippingHandling,
  },
  {
    label: "Payment Processing Fee",
    value: "HK$120",
    tooltip: LINE_TOOLTIPS.processingFee,
  },
  { label: "Order Total", value: "HK$15,660" },
];

/** Shared progress dates once each milestone has happened. */
const PROGRESS_AFTER_ADDRESS = {
  address: PROGRESS_DAY.addressConfirmed,
} as const;

const PROGRESS_AFTER_INVOICE = {
  ...PROGRESS_AFTER_ADDRESS,
  invoice: PROGRESS_DAY.invoiceSent,
  payment: PROGRESS_DAY.paymentDue,
} as const;

const PROGRESS_AFTER_PAYMENT = {
  address: PROGRESS_AFTER_ADDRESS.address,
  invoice: PROGRESS_AFTER_INVOICE.invoice,
  payment: PROGRESS_DAY.paymentPaid,
} as const;

const PROGRESS_SHIPPED = {
  ...PROGRESS_AFTER_PAYMENT,
  shipped: PROGRESS_DAY.shipped,
} as const;

const PROGRESS_DELIVERED = {
  ...PROGRESS_SHIPPED,
  completed: PROGRESS_DAY.completed,
} as const;

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
        body: "Confirm where we ship this lot. Grade10 uses the address to prepare the invoice — nothing is due yet.",
        addressLabel: "Delivery address",
        addressValue: null,
        invoiceLines: null,
        deadline: ADDRESS_DEADLINE,
        primaryCta: "Confirm delivery address",
        progressDates: {
          address: PROGRESS_DAY.addressConfirmBy,
        },
        overdue: false,
      };
    case "awaiting_address_expired":
      return {
        ...base,
        body: "The address deadline has passed. Contact Grade10 if you still want this lot.",
        addressLabel: "Delivery address",
        addressValue: null,
        invoiceLines: null,
        deadline: ADDRESS_DEADLINE_PASSED,
        primaryCta: null,
        progressDates: {
          address: PROGRESS_DAY.addressExpired,
        },
        overdue: true,
      };
    case "preparing_invoice":
      return {
        ...base,
        body: "Address confirmed. Grade10 is preparing your invoice for this destination.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: null,
        primaryCta: null,
        progressDates: {
          ...PROGRESS_AFTER_ADDRESS,
        },
        secondaryNote:
          "We generate your invoice from this shipping address. We email you when it is ready.",
        overdue: false,
      };
    case "pending_payment":
      return {
        ...base,
        body: "Your invoice is ready. Pay by card before the deadline.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        deadline: PAYMENT_DEADLINE,
        primaryCta: "Pay with card",
        progressDates: {
          ...PROGRESS_AFTER_INVOICE,
        },
        overdue: false,
      };
    case "pending_payment_expired":
      return {
        ...base,
        body: "The payment deadline has passed. Contact Grade10 if you need a reissue.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        deadline: PAYMENT_DEADLINE_PASSED,
        primaryCta: null,
        progressDates: {
          address: PROGRESS_AFTER_ADDRESS.address,
          invoice: PROGRESS_AFTER_INVOICE.invoice,
          payment: PROGRESS_DAY.paymentExpired,
        },
        overdue: true,
      };
    case "processing":
      return {
        ...base,
        body: "Payment received. Grade10 is preparing this lot to ship.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: null,
        progressDates: {
          ...PROGRESS_AFTER_PAYMENT,
        },
        paymentMethod: "Visa",
        paymentMasked: "···· 4242",
      };
    case "shipped":
      return {
        ...base,
        body: "Your lot is on the way.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: "Track shipment",
        progressDates: {
          ...PROGRESS_SHIPPED,
        },
        secondaryNote: "SF Express · SF1234567890",
        paymentMethod: "Visa",
        paymentMasked: "···· 4242",
      };
    case "delivered":
      return {
        ...base,
        body: "Delivered. Delivery proof is on this order.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: null,
        progressDates: {
          ...PROGRESS_DELIVERED,
        },
        paymentMethod: "Visa",
        paymentMasked: "···· 4242",
      };
    case "cancelled":
      return {
        ...base,
        body: "This order was cancelled. The lot returned to available stock.",
        addressLabel: "Delivery address",
        addressValue: null,
        invoiceLines: null,
        primaryCta: null,
        outcomeAlert: {
          // Unpaid cancel path — operator cancelled a pending invoice.
          title: "Order cancelled. The lot returned to available stock.",
          status: "warning",
        },
      };
    case "refunded":
      return {
        ...base,
        body: "This order was refunded after payment.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        invoiceLines: INVOICE_LINES,
        primaryCta: null,
        outcomeAlert: {
          // Paid then refunded — success CheckCircle (not Bell/default).
          title: "Order refunded. Payment on this order was returned.",
          status: "success",
        },
      };
  }
}

export const WINNER_ORDER_CONTENTS: Record<
  WinnerOrderStatus,
  WinnerOrderContent
> = {
  awaiting_address: contentFor("awaiting_address"),
  awaiting_address_expired: contentFor("awaiting_address_expired"),
  preparing_invoice: contentFor("preparing_invoice"),
  pending_payment: contentFor("pending_payment"),
  pending_payment_expired: contentFor("pending_payment_expired"),
  processing: contentFor("processing"),
  shipped: contentFor("shipped"),
  delivered: contentFor("delivered"),
  cancelled: contentFor("cancelled"),
  refunded: contentFor("refunded"),
};

export { LINE_TOOLTIPS };
