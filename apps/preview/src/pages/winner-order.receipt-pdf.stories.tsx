import type { ReceiptPdfData } from "@grade10/ui";
import { ReceiptPdf } from "@grade10/ui";
import { PdfPreview } from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

const SAMPLE_RECEIPT = {
  listingTitle: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
  receiptNumber: "REC-202609-LK7P2Q-01-P1",
  paidAt: new Date("2026-09-15T11:04:00.000Z"),
  invoiceId: "INV-202609-LK7P2Q-01",
  paymentReferenceCode: "LK7P2Q01",
  billTo: {
    recipient: "Alexandra Tran",
    company: null,
    line1: "Flat A, 21/F, One Harbour Square",
    line2: "181 Java Road",
    city: "North Point",
    region: null,
    postalCode: "999077",
    countryCode: "Hong Kong SAR",
  },
  shipTo: {
    recipient: "Alexandra Tran",
    company: null,
    line1: "Flat A, 21/F, One Harbour Square",
    line2: null,
    city: "North Point",
    region: null,
    postalCode: "999077",
    countryCode: "Hong Kong SAR",
  },
  lineItems: [
    { label: "Winning Bid", amount: "HKD 2,500.00" },
    { label: "Buyer's Premium", amount: "HKD 500.00" },
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { label: "Insurance", amount: "HKD 40.00" },
    { key: "subtotal" as const, label: "Subtotal", amount: "HKD 3,120.00" },
    {
      key: "paymentProcessingFee" as const,
      label: "Payment Processing Fee",
      amount: "HKD 112.25",
    },
    {
      key: "orderTotal" as const,
      label: "Order Total",
      amount: "HKD 3,232.25",
    },
  ],
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 3,232.25",
    previousPayments: "HKD 0.00",
    currentPaymentReceived: "HKD 3,232.25",
    remainingBalanceDue: "HKD 0.00",
  },
  paymentMethod: "Visa card ending 4242",
  paymentReference: null,
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: {
    documentTitle: "Receipt",
    billToHeading: "Bill To",
    shipToHeading: "Ship To",
    descriptionLabel: "Description",
    amountLabel: "Amount",
    receiptNumberLabel: "Receipt number",
    invoiceNumberLabel: "Invoice number",
    datePaidLabel: "Date paid",
    paymentMethodLabel: "Payment method",
    paymentReferenceLabel: "Payment reference",
    paymentSectionLabel: "Payment",
    transferReferenceLabel: "Transfer reference",
    paymentBreakdownLabel: "Payment breakdown",
    originalInvoiceTotalLabel: "Original Invoice Total",
    previousPaymentsLabel: "Previous Payments",
    currentPaymentReceivedLabel: "Current Payment Received",
    remainingBalanceDueLabel: "Remaining Balance Due",
  },
};

/** Same payment, paid by bank transfer - no separate transfer reference, since `paymentReferenceCode` above already names it once. */
const BANK_TRANSFER_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  paymentMethod: "Bank transfer, recorded manually by admin",
};

/** Same payment with a Tax charge added, per `winner-order/spec.md`'s "Invoice fields" - an ordinary line like any other, in the order given, no dedicated prop. */
const WITH_TAX_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  lineItems: [
    { label: "Winning Bid", amount: "HKD 2,500.00" },
    { label: "Buyer's Premium", amount: "HKD 500.00" },
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { label: "Insurance", amount: "HKD 40.00" },
    { label: "Tax", amount: "HKD 156.00" },
    { key: "subtotal" as const, label: "Subtotal", amount: "HKD 3,276.00" },
    {
      key: "paymentProcessingFee" as const,
      label: "Payment Processing Fee",
      amount: "HKD 118.00",
    },
    {
      key: "orderTotal" as const,
      label: "Order Total",
      amount: "HKD 3,394.00",
    },
  ],
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 3,394.00",
    previousPayments: "HKD 0.00",
    currentPaymentReceived: "HKD 3,394.00",
    remainingBalanceDue: "HKD 0.00",
  },
};

/**
 * The Receipt PDF, previewing the real bytes the `@grade10/ui` renderer
 * produces. `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_RECEIPT_PDF`); wiring the real renderer into that page is
 * `grade10`'s own task (`add-invoice-and-receipt-pdf-blocks` group 5), not
 * built here. This page supplies sample data only. Every receipt itemises
 * the invoice it pays — see `winner-order.invoice-pdf.stories.tsx` and
 * `docs/references/auction-invoice-and-receipt-contents.md`.
 */
function ReceiptPdfPreview({
  data = SAMPLE_RECEIPT,
}: {
  data?: ReceiptPdfData;
}) {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    void ReceiptPdf(data).then((rendered) => {
      if (!cancelled) setBytes(rendered);
    });
    return () => {
      cancelled = true;
    };
  }, [data]);

  if (!bytes) return <p>Generating…</p>;
  return <PdfPreview bytes={bytes} />;
}

const meta = {
  title: "My Auctions/Winner Order/PDF/Receipt",
  component: ReceiptPdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ReceiptPdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BankTransfer: Story = {
  args: { data: BANK_TRANSFER_RECEIPT },
};

export const WithTax: Story = {
  args: { data: WITH_TAX_RECEIPT },
};
