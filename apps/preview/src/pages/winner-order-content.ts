export type WinnerOrderStatus =
  | "awaiting_address"
  | "awaiting_address_expired"
  | "preparing_invoice"
  | "pending_payment"
  | "pending_payment_expired"
  | "payment_verifying"
  | "partially_paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export const WINNER_ORDER_STATUS_LABELS: Record<WinnerOrderStatus, string> = {
  awaiting_address: "Awaiting Setup",
  awaiting_address_expired: "Awaiting Setup (deadline passed)",
  preparing_invoice: "Preparing Invoice",
  pending_payment: "Pending Payment",
  pending_payment_expired: "Pending Payment (expired invoice)",
  payment_verifying: "Payment Verifying",
  partially_paid: "Partially Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/** One download on the Receipt PDF row (oldest first when several). */
export type WinnerOrderReceipt = {
  /** Link label — e.g. `Receipt` or `Receipt · P1`. */
  label: string;
  /** Placeholder download file name. */
  fileName?: string;
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
  /** Chosen during setup — card or bank transfer label. */
  setupPaymentMethod?: string | null;
  billingLabel?: string;
  billingValue?: string | null;
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
  /** Paid / recorded payment strip — method + optional masked number. */
  paymentMethod?: string;
  paymentMasked?: string;
  /**
   * Receipt PDF row — one entry per payment (`-P1`, `-P2`, …), oldest first.
   * Omit when no payment has been recorded yet.
   */
  receipts?: WinnerOrderReceipt[];
};

const LOT = {
  lotTitle: "1999 Pokémon Base Set Charizard PSA 9",
  winningBid: "HK$12,800",
  endedAt: "Ended 17 Sep 2026, 21:30 HKT",
} as const;

const ADDRESS = "12/F, Tower 1\nHarbour Road\nWan Chai, Hong Kong" as const;

/** Lot closed 17 Sep 2026, 21:30 HKT → complete setup within 48 hours. */
const ADDRESS_DEADLINE = "Confirm by 19 Sep 2026, 21:30 HKT" as const;
/** Brief overdue alert — past tense so the winner knows the window closed. */
const ADDRESS_DEADLINE_PASSED = "Missed setup deadline: 19 Sep 2026" as const;

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
    "20% of your winning bid, or the currency minimum if that is higher.",
  shippingHandling:
    "Packing, carrier, and handling for your confirmed delivery address.",
  processingFee: "Set by your payment method when this invoice was sent.",
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

/**
 * Bank transfer invoice — operator fee may be zero; zero reads Free
 * (`winner-order-SC-111`). Order total is the card fixture less the card fee.
 */
export const BANK_TRANSFER_INVOICE_LINES: WinnerOrderInvoiceLine[] = [
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
    value: "Free",
    tooltip: LINE_TOOLTIPS.processingFee,
  },
  { label: "Order Total", value: "HK$15,540" },
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
        body: "Complete Order Setup so Grade10 can prepare the invoice: delivery address, payment method, and billing. Nothing is due yet.",
        addressLabel: "Delivery address",
        addressValue: null,
        setupPaymentMethod: null,
        billingLabel: "Billing address",
        billingValue: null,
        invoiceLines: null,
        deadline: ADDRESS_DEADLINE,
        primaryCta: "Complete Order Setup",
        progressDates: {
          address: PROGRESS_DAY.addressConfirmBy,
        },
        overdue: false,
      };
    case "awaiting_address_expired":
      return {
        ...base,
        body: "The setup deadline has passed. Contact Grade10 if you still want this lot.",
        addressLabel: "Delivery address",
        addressValue: null,
        setupPaymentMethod: null,
        billingLabel: "Billing address",
        billingValue: null,
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
        body: "Order setup complete. Grade10 is preparing your invoice for this destination.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        setupPaymentMethod: "Card",
        billingLabel: "Billing address",
        billingValue: ADDRESS,
        invoiceLines: null,
        primaryCta: null,
        progressDates: {
          ...PROGRESS_AFTER_ADDRESS,
        },
        secondaryNote:
          "We generate your invoice from this setup. We email you when it is ready.",
        overdue: false,
      };
    case "pending_payment":
      return {
        ...base,
        body: "Your invoice is ready. Pay by card before the deadline.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        billingLabel: "Billing address",
        billingValue: ADDRESS,
        setupPaymentMethod: "Card",
        invoiceLines: INVOICE_LINES,
        deadline: PAYMENT_DEADLINE,
        primaryCta: "Pay with Card",
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
        billingLabel: "Billing address",
        billingValue: ADDRESS,
        setupPaymentMethod: "Card",
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
    case "payment_verifying":
      return {
        ...base,
        body: "Proof received. Grade10 is verifying your bank transfer. The payment deadline is paused while we check.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        billingLabel: "Billing address",
        billingValue: ADDRESS,
        paymentMethod: "Bank transfer",
        invoiceLines: BANK_TRANSFER_INVOICE_LINES,
        primaryCta: null,
        progressDates: {
          address: PROGRESS_AFTER_ADDRESS.address,
          invoice: PROGRESS_AFTER_INVOICE.invoice,
          // No pay-by date while verification is in progress.
        },
        secondaryNote:
          "We’re verifying your transfer. We’ll email you when payment is confirmed.",
        overdue: false,
      };
    case "partially_paid":
      return {
        ...base,
        body: "Only part of this invoice is settled. Grade10 is collecting the rest — contact customer support if you have questions. Your receipts stay on this order.",
        addressLabel: "Delivery address",
        addressValue: ADDRESS,
        billingLabel: "Billing address",
        billingValue: ADDRESS,
        paymentMethod: "Bank transfer",
        invoiceLines: BANK_TRANSFER_INVOICE_LINES,
        primaryCta: null,
        progressDates: {
          address: PROGRESS_AFTER_ADDRESS.address,
          invoice: PROGRESS_AFTER_INVOICE.invoice,
          // Deadline stopped for good — no pay-by date.
        },
        // No remaining-balance figure — Contact Us covers questions.
        secondaryNote:
          "Only part of this invoice is settled. Contact Grade10 about what remains.",
        overdue: false,
        receipts: [
          {
            label: "Receipt · P1",
            fileName: "REC-202609-LK7P2Q-01-P1.pdf",
          },
          {
            label: "Receipt · P2",
            fileName: "REC-202609-LK7P2Q-01-P2.pdf",
          },
        ],
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
        receipts: [{ label: "Receipt" }],
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
        receipts: [{ label: "Receipt" }],
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
        receipts: [{ label: "Receipt" }],
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
        paymentMethod: "Visa",
        paymentMasked: "···· 4242",
        receipts: [{ label: "Receipt" }],
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
  payment_verifying: contentFor("payment_verifying"),
  partially_paid: contentFor("partially_paid"),
  processing: contentFor("processing"),
  shipped: contentFor("shipped"),
  delivered: contentFor("delivered"),
  cancelled: contentFor("cancelled"),
  refunded: contentFor("refunded"),
};

export { LINE_TOOLTIPS };
