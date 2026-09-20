import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type OrderCancelledProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and secondary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  /** Customer support — primary CTA (matches Winner Order Contact Us). */
  contactUrl?: string;
  primaryImageUrl?: string | null;
  /** When an operator cancelled the order (winner's zone). */
  cancelledAt?: string;
};

/**
 * When an operator cancels the order. Names when it was cancelled only —
 * no operator reason and nothing about payment (paid-order cancellation is
 * still open). Contact Us first, View order second.
 *
 * Settled in `email-trigger-revision` and Post-Bidding · Winner Order.
 */
export default function OrderCancelledEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  contactUrl = previewLot.cancelledContactUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  cancelledAt = previewLot.cancelledAt,
}: OrderCancelledProps) {
  return (
    <AuctionLetter
      body="Your order for this lot has been cancelled. If you have questions, email support@grade10.com."
      brandName={brandName}
      campaign="order_cancelled"
      canUnsubscribe={false}
      ctaHref={contactUrl}
      ctaLabel="Contact customer support"
      details={[{ label: "Cancelled on", value: cancelledAt }]}
      heading="Your order has been cancelled"
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Order cancelled on ${cancelledAt}.`}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={orderUrl}
      secondaryCtaLabel="View order"
      whyYouGotThis="You won this auction lot on Grade10."
    />
  );
}

OrderCancelledEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  contactUrl: previewLot.cancelledContactUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  cancelledAt: previewLot.cancelledAt,
} satisfies OrderCancelledProps;
