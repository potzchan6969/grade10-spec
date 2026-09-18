import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type PaymentReceivedPartialProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and secondary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  /** Customer support — for questions about what remains. */
  contactUrl?: string;
  primaryImageUrl?: string | null;
  /** Amount of this payment only — not the invoice total. */
  amountReceived?: string;
  /** When this payment was recorded (winner's zone). */
  receivedAt?: string;
  /**
   * How they paid — always under the label **Payment method**:
   * - Bank transfer / manual settlement: method + reference as recorded
   * - Never invents a remaining-balance figure (that stays on the receipt PDF)
   */
  paymentMethod?: string;
  /**
   * Receipt ID for this payment — quiet body line (`Receipt ID: …`) and
   * attached PDF file name (e.g. `REC-202609-LK7P2Q-01-P1`).
   */
  receiptId?: string;
};

/**
 * Draft only — not yet a notifications-order letter kind.
 * `add-winner-partial-payment` currently non-goals a new letter; keep this
 * file as a preview if product later wants an acknowledgment per payment.
 *
 * Fires when an operator records a payment that leaves the invoice
 * Partially Paid (balance still owed). The send path attaches this
 * payment's receipt PDF (named by `receiptId`). Does not name the
 * remaining balance — that breakdown lives on the receipt PDF and with
 * customer support, matching Winner Order's locked / no-balance shape.
 *
 * When the invoice later closes as Paid, use `payment-received` instead.
 */
export default function PaymentReceivedPartialEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  contactUrl = previewLot.partialPaymentContactUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  amountReceived = "HK$8,000",
  receivedAt = previewLot.paidAt,
  paymentMethod = "Bank Transfer",
  receiptId = previewLot.receiptId,
}: PaymentReceivedPartialProps) {
  return (
    <AuctionLetter
      body={[
        "We have received this payment for this lot. Your order is not fully settled yet.",
        "Email support@grade10.com if you have questions about what remains.",
      ]}
      brandName={brandName}
      campaign="payment_received_partial"
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
      heading="Partial payment received"
      highlight={{ label: "Amount received", value: amountReceived }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Payment of ${amountReceived} received. Settlement is still in progress.`}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={contactUrl}
      secondaryCtaLabel="Contact customer support"
      whyYouGotThis="A payment was recorded against this auction order on Grade10."
    />
  );
}

PaymentReceivedPartialEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  contactUrl: previewLot.partialPaymentContactUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  amountReceived: "HK$8,000",
  receivedAt: previewLot.paidAt,
  paymentMethod: "Bank Transfer",
  receiptId: previewLot.receiptId,
} satisfies PaymentReceivedPartialProps;
