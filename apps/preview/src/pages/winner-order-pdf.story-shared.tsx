import { Divider } from "@grade10/design-system/components/display/divider";
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
import type { ReactNode } from "react";

/**
 * Shared layout for the Invoice and Receipt PDF sketches
 * (`winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx`).
 * Both lay out the same A4-width sheet, the same order-value lines — a
 * receipt itemises the invoice it pays the same way, per
 * `docs/references/auction-invoice-and-receipt-contents.md` — and the same
 * meta, party, summary, and footer rows. Only the header, the big statement
 * line, and what follows the summary panel differ per document.
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
      {issuer ? (
        <>
          <Text size="sm">Fine Art &amp; Collectibles Auction</Text>
          <Text size="sm">support@grade10.com</Text>
        </>
      ) : null}
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
      <Text size="sm">21/F, One Harbour Square, 181 Java Road</Text>
      <Text size="sm">North Point, Hong Kong SAR</Text>
      <Text size="sm">+852 9123 4567</Text>
    </VStack>
  );
}

/** The winner's snapshot — issuer, billing and shipping addresses — the same
 * three columns on both PDFs. */
function PartiesSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <PartyBlock heading="Grade10" issuer />
      <AddressBlock heading="Bill to" />
      <AddressBlock heading="Ship to" />
    </div>
  );
}

/** The order value lines — identical on both PDFs, since a receipt itemises
 * the invoice it pays rather than re-pricing it. */
const ORDER_VALUE_AMOUNT_COLUMN_CLASS =
  "w-32 shrink-0 whitespace-nowrap tabular-nums";

function OrderValueTable() {
  return (
    <Table>
      <TableHeader>
        <TableHead className="min-w-0 flex-1">Description</TableHead>
        <TableHead align="end" className={ORDER_VALUE_AMOUNT_COLUMN_CLASS}>
          Amount
        </TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="min-w-0 flex-1">Winning Bid</TableCell>
          <TableCell align="end" className={ORDER_VALUE_AMOUNT_COLUMN_CLASS}>
            2,500.00
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="min-w-0 flex-1">Buyer's Premium</TableCell>
          <TableCell align="end" className={ORDER_VALUE_AMOUNT_COLUMN_CLASS}>
            500.00
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="min-w-0 flex-1">Shipping & Handling</TableCell>
          <TableCell align="end" className={ORDER_VALUE_AMOUNT_COLUMN_CLASS}>
            80.00
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="min-w-0 flex-1">Insurance</TableCell>
          <TableCell align="end" className={ORDER_VALUE_AMOUNT_COLUMN_CLASS}>
            40.00
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
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
        <Text
          size={size}
          tone={"primary"}
          weight={weight === "bold" ? "bold" : "regular"}
        >
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

/** The disclaimer line and the print-style page marker every sketch closes
 * on. */
function PdfPageFooter({ note }: { note: ReactNode }) {
  return (
    <>
      <Divider />
      <HStack hAlign="space-between" vAlign="baseline" wrap>
        <Text size="xs" tone="primary">
          {note}
        </Text>
        <Text size="xs" tone="primary">
          Page 1 of 1
        </Text>
      </HStack>
    </>
  );
}

export {
  AddressBlock,
  MetaRow,
  OrderValueTable,
  PartiesSection,
  PartyBlock,
  PdfPageFooter,
  PdfSheet,
  SummaryRow,
};
