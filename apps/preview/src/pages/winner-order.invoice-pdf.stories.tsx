import type { InvoicePdfData } from "@grade10/ui";
import { InvoicePdf } from "@grade10/ui";
import { PdfPreview } from "@grade10/ui/blocks/auction-invoice-and-receipt-pdf/pdf-preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

const SAMPLE_INVOICE = {
  listingTitle: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
  invoiceNumber: "INV-202609-LK7P2Q-01",
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
    paymentMethodLabel: "Payment method",
    bankDetailsHeading: "Bank details",
    swiftLabel: "SWIFT",
    fpsLabel: "FPS",
    hkLocalTransferLabel: "HK local transfer",
    beneficiaryLabel: "Beneficiary",
    swiftBicLabel: "SWIFT/BIC",
    accountIbanLabel: "Account/IBAN",
    fpsIdLabel: "FPS ID",
    bankAndCodeLabel: "Bank & code",
    accountNoLabel: "Account no.",
    bankReferenceNoteLabel:
      "Enter this reference in your bank app's Memo or Remarks field. Missing it delays verification. Quote this reference on your transfer:",
  },
};

/** Same order, its Payment Processing Fee showing Free per `winner-order/spec.md`'s bank-transfer pricing, and the Bank details section a bank-transfer invoice carries. */
const BANK_TRANSFER_INVOICE: InvoicePdfData = {
  ...SAMPLE_INVOICE,
  paymentMethod: "Bank transfer",
  lineItems: [
    { label: "Winning Bid", amount: "HKD 2,500.00" },
    { label: "Buyer's Premium", amount: "HKD 500.00" },
    { label: "Shipping & Handling", amount: "HKD 80.00" },
    { label: "Insurance", amount: "HKD 40.00" },
    { key: "subtotal" as const, label: "Subtotal", amount: "HKD 3,120.00" },
    {
      key: "paymentProcessingFee" as const,
      label: "Payment Processing Fee",
      amount: "Free",
    },
    {
      key: "orderTotal" as const,
      label: "Order Total",
      amount: "HKD 3,120.00",
    },
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
};

/**
 * The Invoice PDF, previewing the real bytes the `@grade10/ui` renderer
 * produces. `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_INVOICE_PDF`); wiring the real renderer into that page is
 * `grade10`'s own task (`add-invoice-and-receipt-pdf-blocks` group 5), not
 * built here. This page supplies sample data only.
 */
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
  title: "My Auctions/Winner Order/PDF/Invoice",
  component: InvoicePdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
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
