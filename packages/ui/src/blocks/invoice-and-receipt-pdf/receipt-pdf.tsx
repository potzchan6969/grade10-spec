import { Badge } from "@grade10/design-system/components/display/badge";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  AddressLines,
  MetaRow,
  OrderValueSection,
  PartyBlock,
  PdfSheet,
  SummaryRow,
} from "./pdf-document";
import type { ReceiptPdfProps } from "./types";

function ReceiptPdf(props: ReceiptPdfProps) {
  const {
    copy,
    receiptId,
    invoiceId,
    paymentMethod,
    manuallySettled,
    billTo,
    shipTo,
    orderValue,
    paymentBreakdown,
    supersededInvoice,
    issuerTaxDetails,
    className,
  } = props;
  // Checked on `props` itself, not the value alone: `issuerTaxDetails` can
  // be a *supplied* `undefined` (SC-15/SC-24/SC-30 — the block still
  // renders), which only key presence on the props object can tell apart
  // from the key never being passed.
  const hasIssuerTaxDetails = "issuerTaxDetails" in props;

  return (
    <PdfSheet className={className} slot="receipt-pdf">
      <HStack hAlign="space-between" vAlign="start">
        <Text as="h2" size="xl" weight="bold">
          {copy.documentTitle}
        </Text>
        <G10LogoMono aria-hidden className="h-6 w-auto text-foreground" />
      </HStack>

      <HStack hAlign="space-between" vAlign="start">
        <VStack className="max-w-sm" gap="xs" hAlign="stretch">
          <MetaRow label={copy.receiptIdLabel} value={receiptId} />
          <MetaRow label={copy.invoiceIdLabel} value={invoiceId} />
          <MetaRow
            label={copy.paymentMethodLabel}
            mark={
              manuallySettled ? (
                <Badge data-slot="pdf-manually-settled-mark" variant="outline">
                  {copy.manuallySettledLabel}
                </Badge>
              ) : null
            }
            value={paymentMethod}
          />
          {supersededInvoice !== undefined ? (
            <MetaRow
              label={copy.supersededInvoiceLabel}
              value={supersededInvoice}
            />
          ) : null}
        </VStack>
        {hasIssuerTaxDetails ? (
          <div data-slot="pdf-issuer-tax-details">{issuerTaxDetails}</div>
        ) : null}
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

      <VStack
        className="ml-auto w-full max-w-xs"
        data-slot="pdf-payment-breakdown"
        gap="xs"
        hAlign="stretch"
      >
        <SummaryRow
          label={copy.paymentBreakdown.originalInvoiceTotal}
          value={paymentBreakdown.originalInvoiceTotal}
        />
        <SummaryRow
          label={copy.paymentBreakdown.previousPayments}
          value={paymentBreakdown.previousPayments}
        />
        <SummaryRow
          label={copy.paymentBreakdown.currentPaymentReceived}
          value={paymentBreakdown.currentPaymentReceived}
        />
        <SummaryRow
          label={copy.paymentBreakdown.remainingBalanceDue}
          value={paymentBreakdown.remainingBalanceDue}
        />
      </VStack>
    </PdfSheet>
  );
}

export type { ReceiptPdfCopy, ReceiptPdfProps } from "./types";
export { ReceiptPdf };
