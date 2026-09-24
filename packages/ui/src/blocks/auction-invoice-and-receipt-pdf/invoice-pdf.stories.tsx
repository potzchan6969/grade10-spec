import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { InvoicePdf } from "./invoice-pdf";
import { PdfPreview } from "./pdf-preview";

const SAMPLE_INVOICE = {
  listingTitle: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
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
  issuerName: "Grade10",
  issuerEmail: "support@grade10.com",
  copy: {
    documentTitle: "Invoice",
    billToHeading: "Bill To",
    shipToHeading: "Ship To",
    descriptionLabel: "Description",
    amountLabel: "Amount",
    invoiceNumberLabel: "Invoice number",
    sentAtLabel: "Date of issue",
    paymentDeadlineLabel: "Date due",
    footer: "This invoice records the charges for the lot shown above.",
  },
} as const;

/** Generates the real PDF bytes once, on mount - a preview of what `InvoicePdf` actually draws, not a second guess at it. */
function InvoicePdfPreview() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    void InvoicePdf(SAMPLE_INVOICE).then((rendered) => {
      if (!cancelled) setBytes(rendered);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!bytes) return <p>Generating…</p>;
  return <PdfPreview bytes={bytes} />;
}

const meta = {
  title: "Auction Invoice And Receipt Pdf/InvoicePdf",
  component: InvoicePdfPreview,
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
