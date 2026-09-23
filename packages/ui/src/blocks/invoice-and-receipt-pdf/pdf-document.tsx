import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import type { PartyAddress } from "./types";

type PdfDocumentSlot = "invoice-pdf" | "receipt-pdf";

/**
 * The A4-width sheet frame both InvoicePdf and ReceiptPdf render into. The
 * root `data-slot` names which document it is, since both share this frame.
 */
function PdfSheet({
  children,
  className,
  slot,
}: {
  children: ReactNode;
  className?: string;
  slot: PdfDocumentSlot;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[210mm] rounded-lg border border-border bg-background p-10 shadow-sm",
        className,
      )}
      data-slot={slot}
    >
      <VStack gap="lg" hAlign="stretch">
        {children}
      </VStack>
    </div>
  );
}

function MetaRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <HStack data-slot="pdf-meta-row" gap="md" hAlign="start" vAlign="baseline">
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
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  return (
    <VStack data-slot="pdf-party-block" gap="xs" hAlign="start">
      <Text size="sm" weight="bold">
        {heading}
      </Text>
      {children}
    </VStack>
  );
}

/**
 * Bill To/Ship To's nine fields, one per line, in the fixed order
 * `spec.md`'s "Party address fields" names — full name, company name when
 * given, address line 1, address line 2 when given, city, state when
 * given, postal code, country, phone number.
 */
function AddressLines({ address }: { address: PartyAddress }) {
  return (
    <VStack data-slot="pdf-address-lines" gap="none" hAlign="start">
      <Text data-slot="pdf-address-line" size="sm">
        {address.fullName}
      </Text>
      {address.companyName !== undefined ? (
        <Text data-slot="pdf-address-line" size="sm">
          {address.companyName}
        </Text>
      ) : null}
      <Text data-slot="pdf-address-line" size="sm">
        {address.addressLine1}
      </Text>
      {address.addressLine2 !== undefined ? (
        <Text data-slot="pdf-address-line" size="sm">
          {address.addressLine2}
        </Text>
      ) : null}
      <Text data-slot="pdf-address-line" size="sm">
        {address.city}
      </Text>
      {address.state !== undefined ? (
        <Text data-slot="pdf-address-line" size="sm">
          {address.state}
        </Text>
      ) : null}
      <Text data-slot="pdf-address-line" size="sm">
        {address.postalCode}
      </Text>
      <Text data-slot="pdf-address-line" size="sm">
        {address.country}
      </Text>
      <Text data-slot="pdf-address-line" size="sm">
        {address.phone}
      </Text>
    </VStack>
  );
}

/** The lot's title, the one order-value line styled apart from the rest. */
function LotHeading({ children }: { children: ReactNode }) {
  return (
    <Text
      as="h3"
      data-slot="pdf-lot-heading"
      size="xl"
      tone="primary"
      weight="bold"
    >
      {children}
    </Text>
  );
}

/** One label/value row of a fixed two-column table — the order-value lines use this. */
function ValueRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <HStack
      className="w-full"
      data-slot="pdf-value-row"
      gap="md"
      hAlign="space-between"
      vAlign="baseline"
    >
      <Text className="min-w-0 flex-1" size="sm">
        {label}
      </Text>
      <Text className="min-w-0 flex-1 text-right" size="sm">
        {value}
      </Text>
    </HStack>
  );
}

/** One label/value row of the summary section — subtotal, fee and total lines, and the receipt's payment breakdown. */
function SummaryRow({
  label,
  value,
  size = "sm",
  weight = "medium",
}: {
  label: ReactNode;
  value: ReactNode;
  size?: "sm" | "lg";
  weight?: "medium" | "bold";
}) {
  return (
    <HStack
      className="w-full"
      data-slot="pdf-summary-row"
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
  );
}

export type { PdfDocumentSlot };
export {
  AddressLines,
  LotHeading,
  MetaRow,
  PartyBlock,
  PdfSheet,
  SummaryRow,
  ValueRow,
};
