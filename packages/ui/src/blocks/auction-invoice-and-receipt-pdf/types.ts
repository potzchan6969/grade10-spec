import type { ReactNode } from "react";

type OrderValueLines = {
  lot: ReactNode;
  winningBid: ReactNode;
  buyersPremium: ReactNode;
  shippingAndHandling: ReactNode;
  /** Omitted, not blank, when withheld. */
  insurance?: ReactNode;
  /** Reserved for the separate tax change — presence-gated, not truthiness-gated: a `taxLine` key that is supplied renders, even with empty content, and only an absent key renders nothing. */
  taxLine?: ReactNode;
  subtotal: ReactNode;
  paymentProcessingFee: ReactNode;
  orderTotal: ReactNode;
};

/**
 * One required label per `OrderValueLines` key except `lot`, which renders
 * as a bare heading with no label of its own. `-?` strips the optionality
 * `insurance`/`taxLine` would otherwise carry into their labels — a line
 * that may not render still owes a real label for when it does.
 * `descriptionLabel`/`amountLabel` head the table itself, above the lines.
 */
type OrderValueLinesCopy = {
  [K in keyof Omit<OrderValueLines, "lot">]-?: string;
} & {
  descriptionLabel: string;
  amountLabel: string;
};

/**
 * Bill To and Ship To's structured shape, shared by InvoicePdf and
 * ReceiptPdf. Renders as plain lines, no per-field label — only the party
 * block's own heading (`billToHeading`/`shipToHeading`) is a label.
 */
type PartyAddress = {
  fullName: ReactNode;
  /** Omitted, not blank, when withheld. */
  companyName?: ReactNode;
  addressLine1: ReactNode;
  /** Omitted, not blank, when withheld. */
  addressLine2?: ReactNode;
  city: ReactNode;
  /** Omitted, not blank, when withheld. */
  state?: ReactNode;
  postalCode: ReactNode;
  country: ReactNode;
  phone: ReactNode;
};

type InvoicePdfCopy = {
  documentTitle: string;
  invoiceIdLabel: string;
  paymentMethodLabel: string;
  sentAtLabel: string;
  paymentDeadlineLabel: string;
  bankRailsLabel: string;
  billToHeading: string;
  shipToHeading: string;
  orderValue: OrderValueLinesCopy;
};

type InvoicePdfProps = {
  copy: InvoicePdfCopy;
  invoiceId: ReactNode;
  paymentMethod: ReactNode;
  sentAt: ReactNode;
  paymentDeadline: ReactNode;
  /** A full-width section below the order value, not a meta row. */
  bankRails?: ReactNode;
  issuer: ReactNode;
  billTo: PartyAddress;
  shipTo: PartyAddress;
  orderValue: OrderValueLines;
  className?: string;
};

type PaymentBreakdown = {
  originalInvoiceTotal: ReactNode;
  previousPayments: ReactNode;
  currentPaymentReceived: ReactNode;
  /** All four lines render on every receipt — none is conditional on being given, unlike Insurance or the reserved slots. */
  remainingBalanceDue: ReactNode;
};

/** One required label per `PaymentBreakdown` key. */
type PaymentBreakdownCopy = { [K in keyof PaymentBreakdown]-?: string };

type ReceiptPdfCopy = {
  documentTitle: string;
  receiptIdLabel: string;
  invoiceIdLabel: string;
  paymentMethodLabel: string;
  manuallySettledLabel: string;
  supersededInvoiceLabel: string;
  billToHeading: string;
  shipToHeading: string;
  orderValue: OrderValueLinesCopy;
  paymentBreakdown: PaymentBreakdownCopy;
};

type ReceiptPdfProps = {
  copy: ReceiptPdfCopy;
  receiptId: ReactNode;
  invoiceId: ReactNode;
  paymentMethod: ReactNode;
  /** Gates a component-owned visual treatment, not presence-gated like the reserved slots — `false` and "not supplied" both mean no mark. */
  manuallySettled?: boolean;
  issuer: ReactNode;
  billTo: PartyAddress;
  shipTo: PartyAddress;
  orderValue: OrderValueLines;
  paymentBreakdown: PaymentBreakdown;
  /** On a settlement that supersedes an earlier invoice only. */
  supersededInvoice?: ReactNode;
  /** Reserved for the formal-tax-receipt question — presence-gated, like `taxLine`. */
  issuerTaxDetails?: ReactNode;
  className?: string;
};

export type {
  InvoicePdfCopy,
  InvoicePdfProps,
  OrderValueLines,
  OrderValueLinesCopy,
  PartyAddress,
  PaymentBreakdown,
  PaymentBreakdownCopy,
  ReceiptPdfCopy,
  ReceiptPdfProps,
};
