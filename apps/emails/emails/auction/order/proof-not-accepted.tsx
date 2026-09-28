import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type ProofNotAcceptedProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and primary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  /** The operator's reason for the winner — never the internal note. */
  reason?: string;
  /** Absolute datetime — the resumed payment deadline (winner's zone). */
  paymentDeadline?: string;
};

/**
 * When an operator returns bank transfer proof. The payment deadline resumes
 * with the time that was left at upload; each return sends its own letter.
 */
export default function ProofNotAcceptedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  reason = previewLot.proofReturnReason,
  paymentDeadline = previewLot.paymentDeadline,
}: ProofNotAcceptedProps) {
  return (
    <AuctionLetter
      body={[
        "We checked the payment proof you sent and couldn’t accept it.",
        "Your payment deadline has resumed. Send your payment proof again before it ends.",
      ]}
      brandName={brandName}
      campaign="proof_not_accepted"
      canUnsubscribe={false}
      ctaLabel="Submit payment proof again"
      details={[
        { label: "Reason", value: reason },
        { label: "Pay by", value: paymentDeadline },
      ]}
      heading="Your payment proof was not accepted"
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Pay by ${paymentDeadline}. Reason: ${reason}`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You sent payment proof for an auction order on Grade10."
    />
  );
}

ProofNotAcceptedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  reason: previewLot.proofReturnReason,
  paymentDeadline: previewLot.paymentDeadline,
} satisfies ProofNotAcceptedProps;
