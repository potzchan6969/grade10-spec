import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  AddressLines,
  BankRailsSection,
  MetaRow,
  OrderValueSection,
  PartyBlock,
  PdfSheet,
} from "./pdf-document";
import type { InvoicePdfProps } from "./types";

function InvoicePdf({
  copy,
  invoiceId,
  paymentMethod,
  sentAt,
  paymentDeadline,
  bankReference,
  bankRails,
  issuer,
  billTo,
  shipTo,
  orderValue,
  replacedBy,
  className,
}: InvoicePdfProps) {
  return (
    <PdfSheet className={className} slot="invoice-pdf">
      <HStack hAlign="space-between" vAlign="start">
        <Text as="h2" size="xl" weight="bold">
          {copy.documentTitle}
        </Text>
        <G10LogoMono aria-hidden className="h-6 w-auto text-foreground" />
      </HStack>

      <HStack hAlign="space-between" vAlign="start">
        <VStack className="max-w-sm" gap="xs" hAlign="stretch">
          <MetaRow label={copy.invoiceIdLabel} value={invoiceId} />
          <MetaRow label={copy.paymentMethodLabel} value={paymentMethod} />
          <MetaRow label={copy.sentAtLabel} value={sentAt} />
          <MetaRow label={copy.paymentDeadlineLabel} value={paymentDeadline} />
          {bankReference !== undefined ? (
            <MetaRow label={copy.bankReferenceLabel} value={bankReference} />
          ) : null}
          {replacedBy !== undefined ? (
            <MetaRow label={copy.replacedByLabel} value={replacedBy} />
          ) : null}
        </VStack>
        {issuer}
      </HStack>

      <div className="grid gap-6 sm:grid-cols-2">
        <PartyBlock heading={copy.billToHeading}>
          <AddressLines address={billTo} />
        </PartyBlock>
        <PartyBlock heading={copy.shipToHeading}>
          <AddressLines address={shipTo} />
        </PartyBlock>
      </div>

      <OrderValueSection copy={copy.orderValue} orderValue={orderValue} />

      {bankRails !== undefined ? (
        <BankRailsSection label={copy.bankRailsLabel}>
          {bankRails}
        </BankRailsSection>
      ) : null}
    </PdfSheet>
  );
}

export type { InvoicePdfCopy, InvoicePdfProps } from "./types";
export { InvoicePdf };
