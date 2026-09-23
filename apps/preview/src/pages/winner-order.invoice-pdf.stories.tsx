import { Divider } from "@grade10/design-system/components/display/divider";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MetaRow,
  OrderValueTable,
  PartiesSection,
  PartyBlock,
  PdfSheet,
  SummaryRow,
} from "./winner-order-pdf.story-shared";

/**
 * Illustrative sketch of the Invoice PDF's content — not a `packages/ui`
 * block. `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_INVOICE_PDF`); nothing renders the real document anywhere in
 * this repository. This composes only `@grade10/design-system` primitives to
 * stand in for that gap during design review, laid out as a flat document
 * page rather than a bordered card. A committed block needs its own OpenSpec
 * change first — see `docs/references/auction-invoice-and-receipt-contents.md`
 * and `openspec/specs/grade10-site/auction/winner-order/spec.md`. Figures
 * trace to `winner-order-SC-62` (card fee gross-up) and `SC-110` (bank
 * transfer fee); the bank-rails account values are TBC per the spec itself.
 */
function InvoicePdfPreview({
  method = "card",
  tax = false,
}: {
  method?: "card" | "bank";
  tax?: boolean;
}) {
  const total = method === "card" ? "3,232.25" : "3,170.00";

  return (
    <PdfSheet>
      <HStack hAlign="space-between" vAlign="start">
        <Text as="h2" size="xl" weight="bold">
          Invoice
        </Text>
        <G10LogoMono aria-hidden className="h-6 w-auto text-foreground" />
      </HStack>

      <HStack hAlign="space-between" vAlign="start">
        <VStack className="max-w-sm" gap="xs" hAlign="stretch">
          <MetaRow label="Invoice number" value="INV-202609-LK7P2Q-01" />
          <MetaRow
            label="Payment method"
            value={method === "card" ? "Card" : "Bank transfer"}
          />
          <MetaRow
            label="Date of issue"
            value="September 15, 2026 · 11:04 HKT"
          />
          <MetaRow label="Date due" value="September 22, 2026 · 11:04 HKT" />
        </VStack>
        <PartyBlock heading="Grade10" issuer />
      </HStack>

      <PartiesSection />

      <Text as="h3" size="xl" weight="bold" tone="primary">
        2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10
      </Text>

      <Text as="h3" size="xl" weight="bold">
        HK${total} due September 22, 2026
      </Text>

      <OrderValueTable />

      <VStack className="ml-auto w-full max-w-xs" gap="xs" hAlign="stretch">
        <SummaryRow label="Subtotal" value="2,500.00" />
        {tax ? (
          <SummaryRow
            label="GST - Singapore (9% on $2,500.00) "
            value="$225.00"
          />
        ) : null}
        <Divider />
        <SummaryRow label="Order Total" size="lg" value={total} weight="bold" />
      </VStack>

      {method === "bank" ? <BankRailsSection /> : null}
    </PdfSheet>
  );
}

function BankRailsSection() {
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
        it delays verification. Quote this reference on your transfer —{" "}
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
