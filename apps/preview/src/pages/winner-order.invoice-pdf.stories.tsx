import { Badge } from "@grade10/design-system/components/display/badge";
import { Divider } from "@grade10/design-system/components/display/divider";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  MetaRow,
  OrderValueTable,
  PartiesSection,
  PdfPageFooter,
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
  replaced = false,
}: {
  method?: "card" | "bank";
  replaced?: boolean;
}) {
  const fee = method === "card" ? "112.25" : "50.00";
  const total = method === "card" ? "3,232.25" : "3,170.00";

  return (
    <PdfSheet>
      <HStack hAlign="space-between" vAlign="start">
        <VStack gap="xs" hAlign="start">
          <Text as="h2" size="xl" weight="bold">
            Invoice
          </Text>
          {replaced ? <Badge variant="error">Replaced</Badge> : null}
        </VStack>
        <G10LogoMono aria-hidden className="h-6 w-auto text-foreground" />
      </HStack>

      {replaced ? (
        <Text size="sm" tone="error">
          Replaced — superseded by INV-202610-LK7P2Q-02. Kept for the record
          only; it carries no invoice status.
        </Text>
      ) : null}

      <VStack className="max-w-sm" gap="xs" hAlign="stretch">
        <MetaRow label="Invoice number" value="INV-202609-LK7P2Q-01" />
        <MetaRow
          label="Payment method"
          value={method === "card" ? "Card" : "Bank transfer"}
        />
        <MetaRow label="Sent" value="September 15, 2026 · 11:04 HKT" />
        <MetaRow
          label="Payment deadline"
          value="September 22, 2026 · 23:59 HKT"
        />
      </VStack>

      <PartiesSection />

      <Text as="h3" size="xl" weight="bold" tone="primary">
        2025 POKEMON JAPANESE M-P PROMO #020 PIKACHU McDONALD'S
      </Text>

      <Text as="h3" size="xl" weight="bold">
        HK${total} due September 22, 2026
      </Text>

      <OrderValueTable />

      <VStack className="ml-auto w-full max-w-xs" gap="xs" hAlign="stretch">
        <SummaryRow label="Subtotal" value="3,120.00" />
        <SummaryRow
          label="Payment Processing Fee"
          note={
            method === "card"
              ? "Card gross-up at send — provider fee 235 + 3.4% of the charge"
              : "Bank transfer fee entered by the operator at send"
          }
          value={fee}
        />
        <Divider />
        <SummaryRow label="Order Total" size="lg" value={total} weight="bold" />
      </VStack>

      {method === "bank" ? <BankRailsSection /> : null}

      <PdfPageFooter note="Amounts are integer minor units of HKD, rounded to the cent. No line above is an estimate." />
    </PdfSheet>
  );
}

function BankRailsSection() {
  return (
    <VStack className="border-t border-border pt-4" gap="sm" hAlign="stretch">
      <Text size="sm" weight="bold">
        Three ways to pay
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
      <HStack hAlign="space-between" vAlign="center" wrap>
        <Text size="sm">
          Quote this reference on your transfer —{" "}
          <Text weight="medium">LK7P2Q01</Text>
        </Text>
        <Button size="sm" variant="outline">
          Copy
        </Button>
      </HStack>
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
  title: "Pages/Winner Order/Invoice PDF (sketch)",
  component: InvoicePdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    method: { control: "inline-radio", options: ["card", "bank"] },
    replaced: { control: "boolean" },
  },
  args: { method: "card", replaced: false },
} satisfies Meta<typeof InvoicePdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardPayment: Story = {};

export const BankTransfer: Story = { args: { method: "bank" } };

export const Replaced: Story = { args: { replaced: true } };
