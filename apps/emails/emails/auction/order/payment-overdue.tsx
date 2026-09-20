import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type PaymentOverdueProps = {
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
  /** Invoice total (same figure as Order Total on Winner Order). */
  invoiceTotal?: string;
  /** Absolute datetime — the payment deadline that has passed (winner's zone). */
  paymentDeadline?: string;
};

/**
 * When the payment deadline passes and the invoice expires. Self-service Pay
 * is closed; Contact Us is the path to ask Grade10 to review the order by
 * hand. Maps to the invoice-expired letter kind in Order Notifications.
 */
export default function PaymentOverdueEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  contactUrl = previewLot.paymentOverdueContactUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  invoiceTotal = previewLot.orderTotal,
  paymentDeadline = previewLot.paymentDeadline,
}: PaymentOverdueProps) {
  return (
    <AuctionLetter
      body="The payment deadline has passed. This order has expired. You can no longer pay on Grade10. Email support@grade10.com if you still want to claim this lot."
      brandName={brandName}
      campaign="payment_overdue"
      canUnsubscribe={false}
      ctaHref={contactUrl}
      ctaLabel="Contact customer support"
      details={[{ label: "Deadline was", value: paymentDeadline }]}
      heading="Your payment deadline has passed"
      highlight={{ label: "Amount owed", value: invoiceTotal }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      points={[
        "We review your requests manually and decide whether the order can still be completed.",
        "Your account may face penalties or extra charges.",
        "If we do not hear from you soon, the order may be cancelled permanently and the lot re-listed.",
      ]}
      preheader={`Payment deadline passed on ${paymentDeadline}. ${invoiceTotal} still owed.`}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={orderUrl}
      secondaryCtaLabel="View order"
      whyYouGotThis="You have an unpaid auction invoice on Grade10 whose payment deadline has passed."
    />
  );
}

PaymentOverdueEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  contactUrl: previewLot.paymentOverdueContactUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
} satisfies PaymentOverdueProps;
