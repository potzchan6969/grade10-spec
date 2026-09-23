import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@grade10/design-system/components/display/card";
import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Illustrative sketch of the Invoice PDF's content — not a `packages/ui`
 * block. `winner-order-page.tsx` opens a hardcoded placeholder PDF today
 * (`PLACEHOLDER_INVOICE_PDF`); nothing renders the real document anywhere in
 * this repository. This composes only `@grade10/design-system` primitives to
 * stand in for that gap during design review. A committed block needs its
 * own OpenSpec change first — see
 * `docs/references/auction-invoice-and-receipt-contents.md` and
 * `openspec/specs/grade10-site/auction/winner-order/spec.md`. Figures trace
 * to `winner-order-SC-62` (card fee gross-up) and `SC-110` (bank transfer
 * fee); the bank-rails account values are TBC per the spec itself.
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
                Invoice
              </Text>
              <Text size="lg" weight="bold">
                INV-202609-LK7P2Q-01
              </Text>
              {replaced ? <Badge variant="error">Replaced</Badge> : null}
            </VStack>
          </HStack>
        </CardHeader>

        <CardContent>
          <VStack gap="md" hAlign="stretch">
            {replaced ? (
              <Text size="sm" tone="error">
                Replaced — superseded by INV-202610-LK7P2Q-02. Kept for the
                record only; it carries no invoice status.
              </Text>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <DetailFact
                label="Payment method"
                value={method === "card" ? "Card" : "Bank transfer"}
              />
              <DetailFact label="Sent" value="15 Sep 2026 · 11:04 HKT" />
              <DetailFact
                label="Payment deadline"
                value="22 Sep 2026 · 11:04 HKT"
              />
            </div>

            <Text size="sm">
              Lot 14 — <Text weight="medium">Qianlong-Mark Famille Rose</Text>{" "}
              Moon Flask, Qing Dynasty, circa 1750 · Grade10 Autumn Fine Art
              Auction
            </Text>

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
              <LedgerRow
                label="Payment Processing Fee"
                note={
                  method === "card"
                    ? "Card gross-up at send — provider fee 235 + 3.4% of the charge"
                    : "Bank transfer fee entered by the operator at send"
                }
                value={fee}
              />
              <Divider />
              <LedgerRow
                label="Order Total"
                size="lg"
                value={total}
                weight="bold"
              />
            </VStack>

            {method === "bank" ? <BankRailsPanel /> : null}

            <Text size="xs" tone="secondary">
              Amounts are integer minor units of HKD, rounded to the cent. No
              line above is an estimate.
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
  note,
  size = "sm",
  weight = "medium",
}: {
  label: string;
  value: string;
  note?: string;
  size?: "sm" | "lg";
  weight?: "medium" | "bold";
}) {
  return (
    <VStack gap="none" hAlign="stretch">
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
      {note ? (
        <Text size="xs" tone="secondary">
          {note}
        </Text>
      ) : null}
    </VStack>
  );
}

function BankRailsPanel() {
  return (
    <Card>
      <CardContent>
        <VStack gap="sm" hAlign="stretch">
          <Text className="uppercase tracking-wide" size="xs" tone="secondary">
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
      </CardContent>
    </Card>
  );
}

function BankWay({ heading, lines }: { heading: string; lines: string[] }) {
  return (
    <VStack gap="xs" hAlign="start">
      <Text className="uppercase tracking-wide" size="xs" tone="secondary">
        {heading}
      </Text>
      {lines.map((line) => (
        <Text key={line} size="xs" tone="secondary">
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
