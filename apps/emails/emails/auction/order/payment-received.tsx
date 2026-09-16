import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type PaymentReceivedProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and primary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  /** Amount paid (invoice / order total). */
  amountPaid?: string;
  /** When payment was confirmed (winner's zone). */
  paidAt?: string;
  /**
   * How they paid — e.g. `Visa •••• 4242`, `Mastercard •••• 4444`,
   * or `Bank transfer · HSBC · ••••5678`.
   */
  paymentMethod?: string;
};

/**
 * After card payment or manual settlement is confirmed.
 * No receipt PDF attachment — the PDF lives on Winner Order.
 */
export default function PaymentReceivedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  amountPaid = previewLot.orderTotal,
  paidAt = previewLot.paidAt,
  paymentMethod = previewLot.paymentMethod,
}: PaymentReceivedProps) {
  return (
    <AuctionLetter
      body="We have received your payment for this lot. Open Winner Order to view your receipt."
      brandName={brandName}
      campaign="payment_received"
      canUnsubscribe={false}
      ctaLabel="View receipt"
      details={[
        {
          label: "Payment method",
          value: paymentMethod,
          subtext: `Paid ${paidAt}`,
        },
      ]}
      heading="Payment received"
      highlight={{ label: "Amount paid", value: amountPaid }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Payment of ${amountPaid} received.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You paid for this auction order on Grade10."
    />
  );
}

PaymentReceivedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  amountPaid: previewLot.orderTotal,
  paidAt: previewLot.paidAt,
  paymentMethod: previewLot.paymentMethod,
} satisfies PaymentReceivedProps;
