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
 * When an operator cancels the order. Names no reason and no amount; Contact
 * Us is the path to ask about it. Says nothing about payment until paid-order
 * cancellation is confirmed.
 */
export default function OrderCancelledEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  contactUrl = previewLot.contactUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  cancelledAt = previewLot.cancelledAt,
}: OrderCancelledProps) {
  return (
    <AuctionLetter
      body="We have cancelled your order for this lot. If you have questions, contact customer support."
      brandName={brandName}
      campaign="order_cancelled"
      canUnsubscribe={false}
      ctaHref={contactUrl}
      ctaLabel="Contact customer support"
      details={[{ label: "Cancelled", value: cancelledAt }]}
      heading="Your order has been cancelled"
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Order cancelled ${cancelledAt}.`}
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
  contactUrl: previewLot.contactUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  cancelledAt: previewLot.cancelledAt,
} satisfies OrderCancelledProps;
