import {
  type PartyAddress,
  ReceiptPdf,
  type ReceiptPdfCopy,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const copy: ReceiptPdfCopy = {
  documentTitle: "Receipt",
  receiptIdLabel: "Receipt number",
  invoiceIdLabel: "Invoice number",
  paymentMethodLabel: "Paid by",
  manuallySettledLabel: "Manually settled",
  supersededInvoiceLabel: "Supersedes",
  billToHeading: "Bill to",
  shipToHeading: "Ship to",
  orderValue: {
    winningBid: "Winning Bid",
    buyersPremium: "Buyer’s Premium",
    shippingAndHandling: "Shipping & Handling",
    insurance: "Insurance",
    taxLine: "Tax",
    subtotal: "Subtotal",
    paymentProcessingFee: "Payment Processing Fee",
    orderTotal: "Order Total",
  },
  paymentBreakdown: {
    originalInvoiceTotal: "Original Invoice Total",
    previousPayments: "Previous Payments",
    currentPaymentReceived: "Current Payment Received",
    remainingBalanceDue: "Remaining Balance Due",
  },
};

const address: PartyAddress = {
  fullName: "Alexandra Tran",
  addressLine1: "Flat A, 21/F, One Harbour Square",
  addressLine2: "181 Java Road",
  city: "North Point",
  postalCode: "999077",
  country: "Hong Kong SAR",
  phone: "+852 9123 4567",
};

/**
 * The Receipt PDF, composed from the real `@grade10/ui` export.
 * `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_RECEIPT_PDF`); wiring the real component into that page is
 * `grade10`'s own task (`add-invoice-and-receipt-pdf-blocks` group 3), not
 * built here. This page supplies sample props only. Every receipt itemises
 * the invoice it pays — see `winner-order.invoice-pdf.stories.tsx` and
 * `docs/references/auction-invoice-and-receipt-contents.md`.
 */
function ReceiptPdfPreview({
  settlement = "card",
  tax = false,
}: {
  settlement?: "card" | "manual";
  tax?: boolean;
}) {
  const manual = settlement === "manual";
  const total = tax ? "3,412.25" : "3,232.25";

  return (
    <ReceiptPdf
      billTo={address}
      copy={copy}
      invoiceId={manual ? "INV-202609-LK7P2Q-02" : "INV-202609-LK7P2Q-01"}
      manuallySettled={manual}
      orderValue={{
        lot: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
        winningBid: "2,500.00",
        buyersPremium: "500.00",
        shippingAndHandling: "80.00",
        insurance: "40.00",
        ...(tax ? { taxLine: "9% GST: 280.80" } : {}),
        subtotal: "3,120.00",
        paymentProcessingFee: "112.25",
        orderTotal: total,
      }}
      paymentBreakdown={{
        originalInvoiceTotal: total,
        previousPayments: "0.00",
        currentPaymentReceived: total,
        remainingBalanceDue: "0.00",
      }}
      paymentMethod={
        manual
          ? "Bank transfer, recorded manually by admin"
          : "Visa card ending 4242"
      }
      receiptId="REC-202609-LK7P2Q-01-P1"
      shipTo={address}
    />
  );
}

const meta = {
  title: "Pages/Winner Order/Receipt PDF",
  component: ReceiptPdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    settlement: { control: "inline-radio", options: ["card", "manual"] },
    tax: { control: "boolean" },
  },
  args: { settlement: "card", tax: false },
} satisfies Meta<typeof ReceiptPdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardSettled: Story = {};

export const ManuallySettled: Story = { args: { settlement: "manual" } };

export const WithTax: Story = { args: { tax: true } };
