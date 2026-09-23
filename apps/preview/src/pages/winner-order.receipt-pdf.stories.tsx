import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@grade10/design-system/components/display/card";
import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Illustrative sketch of the Receipt PDF's content — not a `packages/ui`
 * block. `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_RECEIPT_PDF`); nothing renders the real document anywhere in
 * this repository. This composes only `@grade10/design-system` primitives to
 * stand in for that gap during design review. A committed block needs its
 * own OpenSpec change first — see
 * `docs/references/auction-invoice-and-receipt-contents.md` and
 * `openspec/specs/grade10-site/auction/winner-order/spec.md`. The full
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
    <VStack className="mx-auto w-full max-w-xl py-10" gap="md" hAlign="stretch">
      <Card>
        <CardHeader className="border-b border-border">
          <HStack hAlign="space-between" vAlign="start" wrap>
            <VStack gap="xs" hAlign="start">
              <Text as="h2" size="lg" weight="bold">
                Grade10
              </Text>
              <Text size="xs" tone="secondary">
                Fine Art &amp; Collectibles Auction
              </Text>
            </VStack>
            <VStack className="sm:items-end" gap="xs" hAlign="start">
              <Text
                className="uppercase tracking-wide"
                size="xs"
                tone="secondary"
              >
                Receipt
              </Text>
              <Text size="lg" weight="bold">
                REC-202609-LK7P2Q-01-P1
              </Text>
              <Badge variant={manual ? "warning" : "success"}>
                {manual ? "Manually Settled" : "Paid"}
              </Badge>
            </VStack>
          </HStack>
        </CardHeader>

        <CardContent>
          <VStack gap="md" hAlign="stretch">
            {manual ? (
              <Text size="sm">
                Supersedes invoice{" "}
                <Text weight="medium">INV-202609-LK7P2Q-01</Text>, reissued
                before settlement.
              </Text>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailFact
                label="Pays invoice"
                value={manual ? "INV-202609-LK7P2Q-02" : "INV-202609-LK7P2Q-01"}
              />
              <DetailFact
                label="Payment method"
                value={
                  manual
                    ? "Bank transfer — recorded manually, ref. OPS-3391"
                    : "Visa card ending 4242"
                }
              />
              <DetailFact label="Confirmed" value="16 Sep 2026 · 09:47 HKT" />
            </div>

            <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
              <AddressBlock heading="Bill to" />
              <AddressBlock heading="Ship to" />
            </div>

            <VStack
              className="border-t border-border pt-4"
              gap="sm"
              hAlign="stretch"
            >
              <LedgerRow label="Winning Bid" value="2,500.00" />
              <LedgerRow label="Buyer's Premium" value="500.00" />
              <LedgerRow label="Shipping & Handling" value="80.00" />
              <LedgerRow label="Insurance" value="40.00" />
              <Divider />
              <LedgerRow label="Subtotal" value="3,120.00" weight="bold" />
              <LedgerRow label="Payment Processing Fee" value="112.25" />
              <Divider />
              <LedgerRow
                label="Order Total"
                size="lg"
                value="3,232.25"
                weight="bold"
              />
            </VStack>

            <Card>
              <CardHeader className="border-b border-border">
                <Text
                  className="uppercase tracking-wide"
                  size="xs"
                  tone="secondary"
                >
                  Payment breakdown
                </Text>
              </CardHeader>
              <CardContent>
                <VStack gap="sm" hAlign="stretch">
                  <LedgerRow label="Original Invoice Total" value="3,232.25" />
                  <LedgerRow label="Previous Payments" value="0.00" />
                  <LedgerRow
                    label="Current Payment Received"
                    value="3,232.25"
                  />
                  <LedgerRow
                    label="Remaining Balance Due"
                    value="0.00"
                    weight="bold"
                  />
                </VStack>
              </CardContent>
            </Card>

            <Text size="xs" tone="secondary">
              No payment proof file appears on this receipt. Retained for at
              least 7 years, or the life of the account if longer.
            </Text>
          </VStack>
        </CardContent>
      </Card>
    </VStack>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <VStack gap="xs" hAlign="start">
      <Text className="uppercase tracking-wide" size="xs" tone="secondary">
        {label}
      </Text>
      <Text size="sm" weight="medium">
        {value}
      </Text>
    </VStack>
  );
}

function AddressBlock({ heading }: { heading: string }) {
  return (
    <VStack gap="xs" hAlign="start">
      <Text className="uppercase tracking-wide" size="xs" tone="secondary">
        {heading}
      </Text>
      <Text size="sm">Alexandra Tran</Text>
      <Text size="sm" tone="secondary">
        Vermilion Bay Holdings Ltd.
      </Text>
      <Text size="sm" tone="secondary">
        +852 9123 4567
      </Text>
      <Text size="sm" tone="secondary">
        21/F, One Harbour Square, 181 Java Road
      </Text>
      <Text size="sm" tone="secondary">
        North Point, Hong Kong SAR
      </Text>
    </VStack>
  );
}

function LedgerRow({
  label,
  value,
  size = "sm",
  weight = "medium",
}: {
  label: string;
  value: string;
  size?: "sm" | "lg";
  weight?: "medium" | "bold";
}) {
  return (
    <HStack
      className="w-full"
      gap="md"
      hAlign="space-between"
      vAlign="baseline"
    >
      <Text size={size} tone="secondary">
        {label}
      </Text>
      <Text size={size} weight={weight}>
        {value}
      </Text>
    </HStack>
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
