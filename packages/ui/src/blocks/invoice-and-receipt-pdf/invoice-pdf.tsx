import { Divider } from "@grade10/design-system/components/display/divider";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  AddressLines,
  LotHeading,
  MetaRow,
  PartyBlock,
  PdfSheet,
  SummaryRow,
  ValueRow,
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
  const hasTaxLine = "taxLine" in orderValue;

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
          {bankRails !== undefined ? (
            <MetaRow label={copy.bankRailsLabel} value={bankRails} />
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

      <LotHeading>{orderValue.lot}</LotHeading>

      <VStack gap="xs" hAlign="stretch">
        <ValueRow
          label={copy.orderValue.winningBid}
          value={orderValue.winningBid}
        />
        <ValueRow
          label={copy.orderValue.buyersPremium}
          value={orderValue.buyersPremium}
        />
        <ValueRow
          label={copy.orderValue.shippingAndHandling}
          value={orderValue.shippingAndHandling}
        />
        {orderValue.insurance !== undefined ? (
          <ValueRow
            label={copy.orderValue.insurance}
            value={orderValue.insurance}
          />
        ) : null}
        {hasTaxLine ? (
          <ValueRow
            label={copy.orderValue.taxLine}
            value={orderValue.taxLine}
          />
        ) : null}
      </VStack>

      <VStack className="ml-auto w-full max-w-xs" gap="xs" hAlign="stretch">
        <SummaryRow
          label={copy.orderValue.subtotal}
          value={orderValue.subtotal}
        />
        <SummaryRow
          label={copy.orderValue.paymentProcessingFee}
          value={orderValue.paymentProcessingFee}
        />
        <Divider className="bg-foreground" />
        <SummaryRow
          label={copy.orderValue.orderTotal}
          size="lg"
          value={orderValue.orderTotal}
          weight="bold"
        />
      </VStack>
    </PdfSheet>
  );
}

export type { InvoicePdfCopy, InvoicePdfProps } from "./types";
export { InvoicePdf };
