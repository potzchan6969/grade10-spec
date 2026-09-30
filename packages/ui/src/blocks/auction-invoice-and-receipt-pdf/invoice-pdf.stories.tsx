import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import type { InvoicePdfData } from "./invoice-pdf";
import { InvoicePdf } from "./invoice-pdf";
import { PdfPreview } from "./pdf-preview";

const { auctionInvoicePdf } = getMessages("grade10", "en");

const SAMPLE_INVOICE = {
  listingTitle: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
  invoiceNumber: "IN-202609-LK7P2Q01",
  sentAt: new Date("2026-09-15T11:04:00.000Z"),
  paymentDeadline: new Date("2026-09-22T11:04:00.000Z"),
  paymentMethod: "Card",
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
  copy: { ...auctionInvoicePdf.document, ...auctionInvoicePdf.invoice },
} as const;

/** Same order, its Payment Processing Fee showing Free per `winner-order/spec.md`'s bank-transfer pricing, and the Bank details section a bank-transfer invoice carries. */
const BANK_TRANSFER_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  paymentMethod: "Bank transfer",
  lineItems: [
    { label: "Winning Bid", amount: "HKD 2500.00" },
    { label: "Buyer's Premium", amount: "HKD 500.00" },
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { label: "Insurance", amount: "HKD 40.00" },
    { key: "subtotal", label: "Subtotal", amount: "HKD 3120.00" },
    {
      key: "paymentProcessingFee",
      label: "Payment Processing Fee",
      amount: "Free",
    },
    { key: "orderTotal", label: "Order Total", amount: "HKD 3120.00" },
  ],
  bankRails: {
    swift: {
      beneficiary: "Grade10 HK Ltd.",
      swiftBic: "TBC",
      account: "TBC",
    },
    fps: { fpsId: "TBC", beneficiary: "Grade10 HK Ltd." },
    hkLocalTransfer: {
      bankAndCode: "TBC",
      beneficiary: "Grade10 HK Ltd.",
      accountNo: "TBC",
    },
    reference: "LK7P2Q01",
  },
};

/** Same order with a Tax charge added, per `winner-order/spec.md`'s "Invoice fields" - an ordinary line like any other, in the order given, no dedicated prop. */
const WITH_TAX_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
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
};

/** Generates the real PDF bytes once, on mount - a preview of what `InvoicePdf` actually draws, not a second guess at it. */
function InvoicePdfPreview({
  data = SAMPLE_INVOICE,
}: {
  data?: InvoicePdfData;
}) {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    let cancelled = false;
    void InvoicePdf(data).then((rendered) => {
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
  title: "Auction Invoice And Receipt Pdf/InvoicePdf",
  component: InvoicePdfPreview,
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BankTransfer: Story = {
  args: { data: BANK_TRANSFER_INVOICE },
};

export const WithTax: Story = {
  args: { data: WITH_TAX_INVOICE },
};
