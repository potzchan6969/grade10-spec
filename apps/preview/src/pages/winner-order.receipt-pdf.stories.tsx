import { Badge } from "@grade10/design-system/components/display/badge";
import { Divider } from "@grade10/design-system/components/display/divider";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import { TableCell } from "@grade10/design-system/components/display/table-cell";
import { TableHead } from "@grade10/design-system/components/display/table-head";
import { TableHeader } from "@grade10/design-system/components/display/table-header";
import { TableRow } from "@grade10/design-system/components/display/table-row";
import { Text } from "@grade10/design-system/components/display/text";
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
}: {
  settlement?: "card" | "manual";
}) {
  const manual = settlement === "manual";

  return (
    <PdfSheet>
      <HStack hAlign="space-between" vAlign="start">
        <VStack gap="xs" hAlign="start">
          <Text as="h2" size="xl" weight="bold">
            Receipt
          </Text>
          <Badge variant={manual ? "warning" : "success"}>
            {manual ? "Manually Settled" : "Paid"}
          </Badge>
        </VStack>
        <G10LogoMono aria-hidden className="h-6 w-auto text-foreground" />
      </HStack>

      {manual ? (
        <Text size="sm">
          Supersedes invoice <Text weight="medium">INV-202609-LK7P2Q-01</Text>,
          reissued before settlement.
        </Text>
      ) : null}

      <VStack className="max-w-full" gap="xs" hAlign="stretch">
        <MetaRow label="Receipt number" value="REC-202609-LK7P2Q-01-P1" />
        <MetaRow
          label="Pays invoice"
          value={manual ? "INV-202609-LK7P2Q-02" : "INV-202609-LK7P2Q-01"}
        />
        <MetaRow
          label="Payment method"
          value={
            manual
              ? "Bank transfer — recorded manually, ref. OPS-3391"
              : "Visa card ending 4242"
          }
        />
        <MetaRow label="Confirmed" value="September 16, 2026 · 09:47 HKT" />
      </VStack>

      <PartiesSection />

      <Text as="h3" size="xl" weight="bold">
        HK$3,232.25 paid on September 16, 2026
      </Text>

      <OrderValueTable />

      <VStack className="ml-auto w-full max-w-xs" gap="xs" hAlign="stretch">
        <SummaryRow label="Subtotal" value="3,120.00" />
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
        <Table>
          <TableHeader>
            <TableHead className="min-w-0 flex-1">
              Original Invoice Total
            </TableHead>
            <TableHead className="min-w-0 flex-1">Previous Payments</TableHead>
            <TableHead className="min-w-0 flex-1">
              Current Payment Received
            </TableHead>
            <TableHead align="end" className="min-w-0 flex-1">
              Remaining Balance Due
            </TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="min-w-0 flex-1">3,232.25</TableCell>
              <TableCell className="min-w-0 flex-1">0.00</TableCell>
              <TableCell className="min-w-0 flex-1">3,232.25</TableCell>
              <TableCell align="end" className="min-w-0 flex-1">
                0.00
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </VStack>

      <PdfPageFooter note="No payment proof file appears on this receipt. Retained for at least 7 years, or the life of the account if longer." />
    </PdfSheet>
  );
}

const meta = {
  title: "Pages/Winner Order/Receipt PDF (sketch)",
  component: ReceiptPdfPreview,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    settlement: { control: "inline-radio", options: ["card", "manual"] },
  },
  args: { settlement: "card" },
} satisfies Meta<typeof ReceiptPdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardSettled: Story = {};

export const ManuallySettled: Story = { args: { settlement: "manual" } };
