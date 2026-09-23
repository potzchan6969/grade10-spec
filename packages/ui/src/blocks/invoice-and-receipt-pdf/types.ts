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
 */
type OrderValueLinesCopy = {
  [K in keyof Omit<OrderValueLines, "lot">]-?: string;
};

type InvoicePdfCopy = {
  documentTitle: string;
  invoiceIdLabel: string;
  paymentMethodLabel: string;
  sentAtLabel: string;
  paymentDeadlineLabel: string;
  bankReferenceLabel: string;
  bankRailsLabel: string;
  replacedByLabel: string;
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
  /** Independent of `bankRails` — either may be given without the other. */
  bankReference?: ReactNode;
  /** Independent of `bankReference` — either may be given without the other. */
  bankRails?: ReactNode;
  issuer: ReactNode;
  billTo: ReactNode;
  shipTo: ReactNode;
  orderValue: OrderValueLines;
  /** On a replaced invoice only. */
  replacedBy?: ReactNode;
  className?: string;
};

export type {
  InvoicePdfCopy,
  InvoicePdfProps,
  OrderValueLines,
  OrderValueLinesCopy,
};
