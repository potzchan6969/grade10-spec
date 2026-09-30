import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { PdfPreview } from "./pdf-preview";
import type { ReceiptPdfData } from "./receipt-pdf";
import { ReceiptPdf } from "./receipt-pdf";

const { auctionInvoicePdf } = getMessages("grade10", "en");

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
    { label: "Winning Bid", amount: "HKD 2500.00" },
    { label: "Buyer's Premium", amount: "HKD 500.00" },
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { label: "Insurance", amount: "HKD 40.00" },
    { key: "subtotal", label: "Subtotal", amount: "HKD 3120.00" },
    {
      key: "paymentProcessingFee",
      label: "Payment Processing Fee",
      amount: "HKD 112.25",
    },
    { key: "orderTotal", label: "Order Total", amount: "HKD 3232.25" },
  ],
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 3232.25",
    previousPayments: "HKD 0.00",
    currentPaymentReceived: "HKD 3232.25",
    remainingBalanceDue: "HKD 0.00",
  },
  paymentMethod: "Visa card ending 4242",
  paymentReference: null,
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: { ...auctionInvoicePdf.document, ...auctionInvoicePdf.receipt },
} as const;

/** Same payment, paid by bank transfer - no separate transfer reference, since `paymentReferenceCode` above already names it once. */
const BANK_TRANSFER_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  paymentMethod: "Bank transfer, recorded manually by admin",
};

/** Same payment with a Tax charge added, per `winner-order/spec.md`'s "Invoice fields" - an ordinary line like any other, in the order given, no dedicated prop. */
const WITH_TAX_RECEIPT: ReceiptPdfData = {
  ...SAMPLE_RECEIPT,
  lineItems: [
    { label: "Winning Bid", amount: "HKD 2500.00" },
    { label: "Buyer's Premium", amount: "HKD 500.00" },
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { label: "Insurance", amount: "HKD 40.00" },
    { label: "Tax", amount: "HKD 156.00" },
    { key: "subtotal", label: "Subtotal", amount: "HKD 3276.00" },
    {
      key: "paymentProcessingFee",
      label: "Payment Processing Fee",
      amount: "HKD 118.00",
    },
    { key: "orderTotal", label: "Order Total", amount: "HKD 3394.00" },
  ],
  paymentBreakdown: {
    originalInvoiceTotal: "HKD 3394.00",
    previousPayments: "HKD 0.00",
    currentPaymentReceived: "HKD 3394.00",
    remainingBalanceDue: "HKD 0.00",
  },
};

/** Generates the real PDF bytes once, on mount - a preview of what `ReceiptPdf` actually draws, not a second guess at it. */
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
  title: "Auction Invoice And Receipt Pdf/ReceiptPdf",
  component: ReceiptPdfPreview,
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
