import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type InvoiceSentProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and primary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  /** Invoice total (same figure as Order Total on Winner Order). */
  invoiceTotal?: string;
  /** Absolute datetime — Pay by … (winner's zone). */
  paymentDeadline?: string;
};

/**
 * After the winner confirms an address and an operator sends the invoice.
 * No invoice PDF attachment — the PDF lives on Winner Order.
 */
export default function InvoiceSentEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  invoiceTotal = previewLot.orderTotal,
  paymentDeadline = previewLot.paymentDeadline,
}: InvoiceSentProps) {
  return (
    <AuctionLetter
      body="Your invoice is ready. Open Winner Order to check the full invoice and pay. The payment window starts now."
      brandName={brandName}
      campaign="invoice_sent"
      canUnsubscribe={false}
      ctaLabel="View invoice and pay"
      details={[{ label: "Pay by", value: paymentDeadline }]}
      heading="Your invoice is ready"
      highlight={{ label: "Invoice total", value: invoiceTotal }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Pay ${invoiceTotal} by ${paymentDeadline}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You won this auction lot and confirmed a delivery address."
    />
  );
}

InvoiceSentEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
} satisfies InvoiceSentProps;
