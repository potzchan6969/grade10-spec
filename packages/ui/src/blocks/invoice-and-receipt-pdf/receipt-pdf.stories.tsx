import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  billToAddress,
  orderValue,
  orderValueCopy,
  readAddressLines,
  readBreakdownRows,
  readRows,
  shipToAddress,
} from "./fixtures";
import { ReceiptPdf } from "./receipt-pdf";
import type { PaymentBreakdown, ReceiptPdfCopy } from "./types";

const copy: ReceiptPdfCopy = {
  documentTitle: "Receipt",
  receiptIdLabel: "Receipt number",
  invoiceIdLabel: "Invoice number",
  paymentMethodLabel: "Payment method",
  manuallySettledLabel: "Manually settled",
  supersededInvoiceLabel: "Supersedes",
  billToHeading: "Bill to",
  shipToHeading: "Ship to",
  orderValue: orderValueCopy,
  paymentBreakdown: {
    originalInvoiceTotal: "Original Invoice Total",
    previousPayments: "Previous Payments",
    currentPaymentReceived: "Current Payment Received",
    remainingBalanceDue: "Remaining Balance Due",
  },
};

const paymentBreakdown: PaymentBreakdown = {
  originalInvoiceTotal: "3,232.25",
  previousPayments: "0.00",
  currentPaymentReceived: "3,232.25",
  remainingBalanceDue: "0.00",
};

/** The lot and every order-value label, lot first, in the fixed order `spec.md` requires. */
const ORDER_VALUE_LABELS = [
  orderValue.lot as string,
  copy.orderValue.winningBid,
  copy.orderValue.buyersPremium,
  copy.orderValue.shippingAndHandling,
  copy.orderValue.insurance,
];

const BREAKDOWN_LABELS = [
  copy.paymentBreakdown.originalInvoiceTotal,
  copy.paymentBreakdown.previousPayments,
  copy.paymentBreakdown.currentPaymentReceived,
  copy.paymentBreakdown.remainingBalanceDue,
];

const meta = {
  title: "Invoice And Receipt Pdf/ReceiptPdf",
  component: ReceiptPdf,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy,
    receiptId: "REC-202609-LK7P2Q-01-P1",
    invoiceId: "INV-202609-LK7P2Q-01",
    paymentMethod: "Visa card ending 4242",
    billTo: billToAddress,
    shipTo: shipToAddress,
    orderValue,
    paymentBreakdown,
  },
} satisfies Meta<typeof ReceiptPdf>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** SC-7: a receipt's meta rows and party blocks all render. SC-8: the payment breakdown renders in one fixed order. */
export const FullyPaid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("REC-202609-LK7P2Q-01-P1")).toBeVisible();
    expect(canvas.getByText("INV-202609-LK7P2Q-01")).toBeVisible();
    expect(canvas.getByText("Visa card ending 4242")).toBeVisible();
    expect(canvas.getByText("Bill to")).toBeVisible();
    expect(canvas.getByText("Ship to")).toBeVisible();

    const breakdownRows = readBreakdownRows(canvasElement);
    expect(breakdownRows).toHaveLength(4);
    BREAKDOWN_LABELS.forEach((label, index) => {
      expect(breakdownRows[index]).toContain(label);
    });
  },
};

/** SC-22: the payment breakdown keeps all four lines when Previous Payments and Remaining Balance Due read zero. */
export const SingleFullPayment: Story = {
  args: {
    paymentBreakdown: {
      originalInvoiceTotal: "3,232.25",
      previousPayments: "0.00",
      currentPaymentReceived: "3,232.25",
      remainingBalanceDue: "0.00",
    },
  },
  play: async ({ canvasElement }) => {
    const breakdownRows = readBreakdownRows(canvasElement);
    expect(breakdownRows).toHaveLength(4);
    expect(breakdownRows[0]).toContain(BREAKDOWN_LABELS[0]);
    expect(breakdownRows[0]).toContain("3,232.25");
    expect(breakdownRows[1]).toContain(BREAKDOWN_LABELS[1]);
    expect(breakdownRows[1]).toContain("0.00");
    expect(breakdownRows[2]).toContain(BREAKDOWN_LABELS[2]);
    expect(breakdownRows[2]).toContain("3,232.25");
    expect(breakdownRows[3]).toContain(BREAKDOWN_LABELS[3]);
    expect(breakdownRows[3]).toContain("0.00");
  },
};

/** SC-9: a manually settled receipt carries a distinguishable mark. */
export const ManuallySettled: Story = {
  args: { manuallySettled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Manually settled")).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="pdf-manually-settled-mark"]'),
    ).not.toBeNull();
  },
};

/** SC-10: a card- or bank-transfer-settled receipt carries no mark. SC-12: no superseded invoice line either. */
export const CardSettled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Manually settled")).not.toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="pdf-manually-settled-mark"]'),
    ).toBeNull();
    expect(canvas.queryByText("Supersedes")).not.toBeInTheDocument();
  },
};

/** SC-11: a settlement that supersedes an invoice names it. */
export const Superseded: Story = {
  args: { supersededInvoice: "INV-202609-LK7P2Q-02" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Supersedes")).toBeVisible();
    expect(canvas.getByText("INV-202609-LK7P2Q-02")).toBeVisible();
  },
};

/** SC-20: receipt ID and the invoice ID it pays never conflate — each meta row pairs its own label with its own value. */
export const ReceiptIdAndInvoiceIdDistinct: Story = {
  play: async ({ canvasElement }) => {
    const [receiptRow, invoiceRow] = canvasElement.querySelectorAll(
      '[data-slot="pdf-meta-row"]',
    );
    expect(receiptRow.textContent).toContain(copy.receiptIdLabel);
    expect(receiptRow.textContent).toContain("REC-202609-LK7P2Q-01-P1");
    expect(invoiceRow.textContent).toContain(copy.invoiceIdLabel);
    expect(invoiceRow.textContent).toContain("INV-202609-LK7P2Q-01");
    expect(receiptRow.textContent).not.toContain("INV-202609-LK7P2Q-01");
    expect(invoiceRow.textContent).not.toContain("REC-202609-LK7P2Q-01-P1");
  },
};

/** SC-21: a receipt's order-value lines render in the same fixed order as InvoicePdf's, every label in position. */
export const OrderValueOrder: Story = {
  play: async ({ canvasElement }) => {
    const rows = readRows(canvasElement);
    const expected = ORDER_VALUE_LABELS.concat([
      copy.orderValue.subtotal,
      copy.orderValue.paymentProcessingFee,
      copy.orderValue.orderTotal,
    ]);
    expect(rows).toHaveLength(expected.length);
    expected.forEach((label, index) => {
      expect(rows[index]).toContain(label);
    });
  },
};

/** SC-21: a receipt with no insurance skips the line without disturbing the order. */
export const NoInsurance: Story = {
  args: { orderValue: { ...orderValue, insurance: undefined } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Insurance")).not.toBeInTheDocument();
    const rows = readRows(canvasElement);
    expect(rows).toHaveLength(7);
    const [, summarySubtotal, summaryFee, summaryTotal] = rows.slice(-4);
    expect(summarySubtotal).toContain(copy.orderValue.subtotal);
    expect(summaryFee).toContain(copy.orderValue.paymentProcessingFee);
    expect(summaryTotal).toContain(copy.orderValue.orderTotal);
  },
};

/** SC-29: a receipt's Bill To and Ship To never echo each other. SC-33: a company address renders every field. SC-34: a personal address omits company name, address line 2 and state. */
export const PartyAddresses: Story = {
  play: async ({ canvasElement }) => {
    const [bill, ship] = canvasElement.querySelectorAll(
      '[data-slot="pdf-party-block"]',
    );
    expect(readAddressLines(bill as HTMLElement)).toEqual([
      billToAddress.fullName,
      billToAddress.companyName,
      billToAddress.addressLine1,
      billToAddress.addressLine2,
      billToAddress.city,
      billToAddress.state,
      billToAddress.postalCode,
      billToAddress.country,
      billToAddress.phone,
    ]);
    expect(readAddressLines(ship as HTMLElement)).toEqual([
      shipToAddress.fullName,
      shipToAddress.addressLine1,
      shipToAddress.city,
      shipToAddress.postalCode,
      shipToAddress.country,
      shipToAddress.phone,
    ]);
    expect(readAddressLines(bill as HTMLElement)).not.toEqual(
      readAddressLines(ship as HTMLElement),
    );
  },
};

/** SC-23: a given tax line renders on the receipt too, positioned among the order-value lines. */
export const WithTaxLine: Story = {
  args: { orderValue: { ...orderValue, taxLine: "9% GST: 280.80" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Tax")).toBeVisible();
    expect(canvas.getByText("9% GST: 280.80")).toBeVisible();
    const rows = readRows(canvasElement);
    const taxIndex = rows.findIndex((row) => row.includes("Tax"));
    const firstSummaryIndex = rows.findIndex((row) =>
      row.includes(copy.orderValue.subtotal),
    );
    expect(taxIndex).toBeGreaterThan(0);
    expect(taxIndex).toBeLessThan(firstSummaryIndex);
  },
};

/** SC-14: withholding the tax line changes nothing else — proven on ReceiptPdf, matching InvoicePdf's half of the same scenario. */
export const WithoutTaxLine: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Tax")).not.toBeInTheDocument();
    const rows = readRows(canvasElement);
    const expected = ORDER_VALUE_LABELS.concat([
      copy.orderValue.subtotal,
      copy.orderValue.paymentProcessingFee,
      copy.orderValue.orderTotal,
    ]);
    expect(rows).toHaveLength(expected.length);
    expected.forEach((label, index) => {
      expect(rows[index]).toContain(label);
    });
  },
};

/** SC-15: a given issuer tax-details block renders on the receipt. SC-24: the tax line and the issuer tax-details block render independently. */
export const WithIssuerTaxDetails: Story = {
  args: { issuerTaxDetails: "Grade10 HK Ltd., Tax ID 12345678" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Grade10 HK Ltd., Tax ID 12345678")).toBeVisible();
    expect(canvas.queryByText("Tax")).not.toBeInTheDocument();
  },
};

/**
 * SC-24/SC-30's discriminator itself: `issuerTaxDetails: undefined` is
 * still a *supplied* key — the block renders — distinct from the key never
 * being passed at all (`WithoutIssuerTaxDetails`). Proves the presence
 * check is `"issuerTaxDetails" in props`, not `!== undefined`.
 */
export const WithUndefinedIssuerTaxDetails: Story = {
  args: { issuerTaxDetails: undefined },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="pdf-issuer-tax-details"]'),
    ).not.toBeNull();
  },
};

/** SC-30: withholding the issuer tax-details block changes nothing else. */
export const WithoutIssuerTaxDetails: Story = {
  play: async ({ canvasElement }) => {
    const issuerTaxDetails = canvasElement.querySelector(
      '[data-slot="pdf-issuer-tax-details"]',
    );
    expect(issuerTaxDetails).toBeNull();
    const canvas = within(canvasElement);
    expect(canvas.getByText("Bill to")).toBeVisible();
    expect(canvas.getByText("Ship to")).toBeVisible();
  },
};

/** SC-17: every label reads the copy prop, with no catalog fallback — proven on ReceiptPdf; InvoicePdf's half is `invoice-pdf.stories.tsx`'s `LabelsFromCopy`. */
export const LabelsFromCopy: Story = {
  args: {
    copy: {
      ...copy,
      receiptIdLabel: "Numéro de reçu",
      billToHeading: "Facturé à",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Numéro de reçu")).toBeVisible();
    expect(canvas.getByText("Facturé à")).toBeVisible();
  },
};

/** SC-28: neither component shows a loading or error state — proven on ReceiptPdf; InvoicePdf's half is `invoice-pdf.stories.tsx`'s `RendersImmediately`. */
export const RendersImmediately: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("REC-202609-LK7P2Q-01-P1")).toBeVisible();
  },
};
