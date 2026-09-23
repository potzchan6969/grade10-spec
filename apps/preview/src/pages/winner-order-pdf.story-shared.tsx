import { Divider } from "@grade10/design-system/components/display/divider";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

/**
 * Shared layout for the Invoice and Receipt PDF sketches
 * (`winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx`).
 * Both lay out the same A4-width sheet, the same order-value lines — a
 * receipt itemises the invoice it pays the same way, per
 * `docs/references/auction-invoice-and-receipt-contents.md` — and the same
 * meta, party, and summary rows. Only the header, the big statement line,
 * and what follows the summary panel differ per document.
 */
function PdfSheet({ children }: { children: ReactNode }) {
  return (
    <VStack
      className="mx-auto w-full max-w-[210mm] py-10"
      gap="lg"
      hAlign="stretch"
    >
      <div className="rounded-lg border border-border bg-background p-10 shadow-sm">
        <VStack gap="lg" hAlign="stretch">
          {children}
        </VStack>
      </div>
    </VStack>
  );
}

/** The tax rate both sketches use when their `tax` control is on — nothing
 * the store has committed to; see `docs/references/auction-invoice-and-receipt-contents.md`. */
const TAX_RATE = 0.09;

/** Formats a number the way every amount on these sketches reads: no
 * currency symbol, thousands-separated, two decimal places. */
function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap="md" hAlign="start" vAlign="baseline">
      <Text className="w-36 shrink-0" size="sm" weight="medium">
        {label}
      </Text>
      <Text className="min-w-0 flex-1" size="sm" weight="medium">
        {value}
      </Text>
    </HStack>
  );
}

function PartyBlock({
  heading,
  issuer = false,
}: {
  heading: string;
  issuer?: boolean;
}) {
  return (
    <VStack gap="xs" hAlign="start">
      <Text size="sm" weight="bold">
        {heading}
      </Text>
      {issuer ? <Text size="sm">support@grade10.com</Text> : null}
    </VStack>
  );
}

function AddressBlock({ heading }: { heading: string }) {
  return (
    <VStack gap="xs" hAlign="start">
      <Text size="sm" weight="bold">
        {heading}
      </Text>
      <Text size="sm">Alexandra Tran</Text>
      <Text size="sm">Flat A, 21/F, One Harbour Square, 181 Java Road</Text>
      <Text size="sm">North Point, Hong Kong SAR</Text>
      <Text size="sm">+852 9123 4567</Text>
    </VStack>
  );
}

/** The winner's snapshot — billing and shipping addresses. The issuer's
 * `PartyBlock` sits beside the meta rows instead, not in this grid. */
function PartiesSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <AddressBlock heading="Bill to" />
      <AddressBlock heading="Ship to" />
    </div>
  );
}

type MultiColumnTableColumn = {
  label: string;
  align?: "start" | "end";
};

type MultiColumnTableProps = {
  columns: MultiColumnTableColumn[];
  rows: string[][];
};

/** A borderless, flex-column table: a medium-weight header row, a black
 * divider, then plain data rows — the shape both the order-value lines and
 * the receipt's payment breakdown share. */
function MultiColumnTable({ columns, rows }: MultiColumnTableProps) {
  return (
    <VStack gap="sm" hAlign="stretch">
      <HStack
        className="w-full"
        gap="md"
        hAlign="space-between"
        vAlign="baseline"
      >
        {columns.map((column) => (
          <Text
            className={cn(
              "min-w-0 flex-1",
              column.align === "end" && "text-right",
            )}
            key={column.label}
            size="sm"
            weight="medium"
          >
            {column.label}
          </Text>
        ))}
      </HStack>
      <Divider className="bg-foreground" />
      <VStack gap="xs" hAlign="stretch">
        {rows.map((row) => (
          <HStack
            className="w-full"
            gap="md"
            hAlign="space-between"
            key={row.join("|")}
            vAlign="baseline"
          >
            {row.map((cell, columnIndex) => (
              <Text
                className={cn(
                  "min-w-0 flex-1",
                  columns[columnIndex]?.align === "end" && "text-right",
                )}
                key={columns[columnIndex]?.label ?? columnIndex}
                size="sm"
              >
                {cell}
              </Text>
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

/** The order value lines — identical on both PDFs, since a receipt itemises
 * the invoice it pays rather than re-pricing it. */
function OrderValueTable() {
  return (
    <MultiColumnTable
      columns={[{ label: "Description" }, { label: "Amount", align: "end" }]}
      rows={[
        ["Winning Bid", "2,500.00"],
        ["Buyer's Premium", "500.00"],
        ["Shipping & Handling", "80.00"],
        ["Insurance", "40.00"],
      ]}
    />
  );
}

function SummaryRow({
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
        <Text size={size} tone="primary" weight={weight}>
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

export {
  formatAmount,
  MetaRow,
  MultiColumnTable,
  OrderValueTable,
  PartiesSection,
  PartyBlock,
  PdfSheet,
  SummaryRow,
  TAX_RATE,
};
