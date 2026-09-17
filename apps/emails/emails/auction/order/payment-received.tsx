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
  receivedAt?: string;
  /**
   * How they paid — always under the label **Payment method**:
   * - Card: brand + masked number — e.g. `Visa •••• 4242`
   * - Bank transfer: `Bank Transfer` only (no bank name, account number,
   *   or account name)
   * - Manual settlement: method + reference as recorded
   */
  paymentMethod?: string;
  /**
   * Receipt ID — quiet body line (`Receipt ID: …`) and attached PDF file name
   * (e.g. `REC-202609-LK7P2Q-01-P1`).
   */
  receiptId?: string;
};

/**
 * After card payment, confirmed bank-transfer proof, or manual settlement.
 * The send path attaches the receipt PDF (same language as the letter,
 * named by `receiptId`). Proof files and the internal audit number never
 * appear in the letter or the attachment.
 *
 * Bank transfer: payment method value is `Bank Transfer`; subtext is
 * `Received {date}` — no bank, account number, or account name in the letter.
 */
export default function PaymentReceivedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  amountPaid = previewLot.orderTotal,
  receivedAt = previewLot.paidAt,
  paymentMethod = previewLot.paymentMethod,
  receiptId = previewLot.receiptId,
}: PaymentReceivedProps) {
  return (
    <AuctionLetter
      body="We have received your payment for this lot. Your order is now being processed."
      brandName={brandName}
      campaign="payment_received"
      canUnsubscribe={false}
      ctaLabel="View receipt"
      details={[
        {
          label: "Payment method",
          value: paymentMethod,
          subtext: `Received ${receivedAt}`,
        },
      ]}
      facts={[`Receipt ID: ${receiptId}`]}
      heading="Payment received"
      highlight={{ label: "Amount paid", value: amountPaid }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Payment of ${amountPaid} received. Your order is being processed.`}
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
  receivedAt: previewLot.paidAt,
  paymentMethod: previewLot.paymentMethod,
  receiptId: previewLot.receiptId,
} satisfies PaymentReceivedProps;
