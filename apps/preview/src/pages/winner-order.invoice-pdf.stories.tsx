import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  InvoicePdf,
  type InvoicePdfCopy,
  type PartyAddress,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const copy: InvoicePdfCopy = {
  documentTitle: "Invoice",
  invoiceIdLabel: "Invoice number",
  paymentMethodLabel: "Payment method",
  sentAtLabel: "Date of issue",
  paymentDeadlineLabel: "Date due",
  bankReferenceLabel: "Bank reference",
  bankRailsLabel: "Bank details",
  replacedByLabel: "Replaced by",
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

function BankRails() {
  return (
    <VStack className="border-t border-border pt-4" gap="sm" hAlign="stretch">
      <Text size="sm" weight="bold">
        Payment Information
      </Text>
      <div className="grid gap-4 sm:grid-cols-3">
        <BankWay
          heading="SWIFT"
          lines={[
            "Beneficiary: Grade10 HK Ltd.",
            "SWIFT/BIC: TBC",
            "Account/IBAN: TBC",
          ]}
        />
        <BankWay
          heading="FPS"
          lines={["FPS ID: TBC", "Beneficiary: Grade10 HK Ltd."]}
        />
        <BankWay
          heading="HK local transfer"
          lines={[
            "Bank & code: TBC",
            "Beneficiary: Grade10 HK Ltd.",
            "Account no.: TBC",
          ]}
        />
      </div>
      <Divider />
      <Text size="sm">
        Enter this reference in your bank app’s Memo or Remarks field. Missing
        it delays verification. Quote this reference on your transfer:{" "}
        <Text weight="medium">LK7P2Q01</Text>
      </Text>
    </VStack>
  );
}

function BankWay({ heading, lines }: { heading: string; lines: string[] }) {
  return (
    <VStack gap="xs" hAlign="start">
      <Text size="xs" tone="primary" weight="medium">
        {heading}
      </Text>
      {lines.map((line) => (
        <Text key={line} size="xs" tone="primary">
          {line}
        </Text>
      ))}
    </VStack>
  );
}

/**
 * The Invoice PDF, composed from the real `@grade10/ui` export.
 * `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_INVOICE_PDF`); wiring the real component into that page is
 * `grade10`'s own task (`add-invoice-and-receipt-pdf-blocks` group 3), not
 * built here. This page supplies sample props only.
 */
function InvoicePdfPreview({
  method = "card",
  tax = false,
}: {
  method?: "card" | "bank";
  tax?: boolean;
}) {
  return (
    <InvoicePdf
      billTo={address}
      bankRails={method === "bank" ? <BankRails /> : undefined}
      bankReference={method === "bank" ? "LK7P2Q01" : undefined}
      copy={copy}
      invoiceId="INV-202609-LK7P2Q-01"
      issuer={
        <VStack gap="xs" hAlign="start">
          <Text size="sm" weight="bold">
            Grade10
          </Text>
          <Text size="sm">support@grade10.com</Text>
        </VStack>
      }
      orderValue={{
        lot: "2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10",
        winningBid: "2,500.00",
        buyersPremium: "500.00",
        shippingAndHandling: "80.00",
        insurance: "40.00",
        ...(tax ? { taxLine: "9% GST: 280.80" } : {}),
        subtotal: "3,120.00",
        paymentProcessingFee: method === "card" ? "112.25" : "50.00",
        orderTotal: method === "card" ? "3,232.25" : "3,170.00",
      }}
      paymentDeadline="September 22, 2026, 11:04 HKT"
      paymentMethod={method === "card" ? "Card" : "Bank transfer"}
      sentAt="September 15, 2026, 11:04 HKT"
      shipTo={address}
    />
  );
}

const meta = {
  title: "Pages/Winner Order/Invoice PDF",
  component: InvoicePdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    method: { control: "inline-radio", options: ["card", "bank"] },
    tax: { control: "boolean" },
  },
  args: { method: "card", tax: false },
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardPayment: Story = {};

export const BankTransfer: Story = { args: { method: "bank" } };

export const WithTax: Story = { args: { tax: true } };
