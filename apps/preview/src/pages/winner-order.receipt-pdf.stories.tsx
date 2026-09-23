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
  PdfSheet,
  SummaryRow,
} from "./winner-order-pdf.story-shared";

/**
 * Illustrative sketch of the Receipt PDF's content — not a `packages/ui`
 * block. `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_RECEIPT_PDF`); nothing renders the real document anywhere in
 * this repository. This composes only `@grade10/design-system` primitives to
 * stand in for that gap during design review, laid out as a flat document
 * page rather than a bordered card. A committed block needs its own OpenSpec
 * change first — see `docs/references/auction-invoice-and-receipt-contents.md`
 * and `openspec/specs/grade10-site/auction/winner-order/spec.md`. The full
 * Payment breakdown panel is 🚧 per that spec — today only Current Payment
 * Received is real, the other three lines ship with
 * `carry-receipt-payment-breakdown`.
 */
function ReceiptPdfPreview({
  settlement = "card",
  tax = false,
}: {
  settlement?: "card" | "manual";
  tax?: boolean;
}) {
  const manual = settlement === "manual";

  return (
    <PdfSheet>
      <HStack hAlign="space-between" vAlign="start">
        <Text as="h2" size="xl" weight="bold">
          Receipt
        </Text>
        <G10LogoMono aria-hidden className="h-6 w-auto text-foreground" />
      </HStack>

      <VStack className="max-w-full" gap="xs" hAlign="stretch">
        <MetaRow
          label="Invoice number"
          value={manual ? "INV-202609-LK7P2Q-02" : "INV-202609-LK7P2Q-01"}
        />
        <MetaRow label="Receipt number" value="REC-202609-LK7P2Q-01-P1" />
        <MetaRow
          label="Paid by"
          value={
            manual
              ? "Bank transfer — recorded manually by admin"
              : "Visa card ending 4242"
          }
        />
        <MetaRow label="Confirmed" value="September 16, 2026 · 09:47 HKT" />
      </VStack>

      <PartiesSection />

      <Text as="h3" size="xl" weight="bold" tone="primary">
        2024 TOPPS 50/50 SHOHEI OHTANI #74 SHOHEI OHTANI SSP PSA-10
      </Text>

      <Text as="h3" size="xl" weight="bold">
        HK$3,232.25 paid on September 16, 2026
      </Text>

      <OrderValueTable />

      <VStack className="ml-auto w-full max-w-xs" gap="xs" hAlign="stretch">
        <SummaryRow label="Subtotal" value="3,120.00" />
        {tax ? (
          <SummaryRow
            label="GST - Singapore (9% on $2,500.00)"
            value="$225.00"
          />
        ) : null}
        <SummaryRow label="Payment Processing Fee" value="112.25" />
        <Divider />
        <SummaryRow
          label="Order Total"
          size="lg"
          value="3,232.25"
          weight="bold"
        />
      </VStack>

      <VStack gap="sm" hAlign="stretch">
        <Text size="sm" weight="bold">
          Payment breakdown
        </Text>
        <VStack gap="sm" hAlign="stretch">
          <HStack
            className="w-full"
            gap="md"
            hAlign="space-between"
            vAlign="baseline"
          >
            <Text className="min-w-0 flex-1" size="sm" weight="medium">
              Original Invoice Total
            </Text>
            <Text className="min-w-0 flex-1" size="sm" weight="medium">
              Previous Payments
            </Text>
            <Text className="min-w-0 flex-1" size="sm" weight="medium">
              Current Payment Received
            </Text>
            <Text
              className="min-w-0 flex-1 text-right"
              size="sm"
              weight="medium"
            >
              Remaining Balance Due
            </Text>
          </HStack>
          <Divider className="bg-foreground" />
          <HStack
            className="w-full"
            gap="md"
            hAlign="space-between"
            vAlign="baseline"
          >
            <Text className="min-w-0 flex-1" size="sm">
              3,232.25
            </Text>
            <Text className="min-w-0 flex-1" size="sm">
              0.00
            </Text>
            <Text className="min-w-0 flex-1" size="sm">
              3,232.25
            </Text>
            <Text className="min-w-0 flex-1 text-right" size="sm">
              0.00
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </PdfSheet>
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
