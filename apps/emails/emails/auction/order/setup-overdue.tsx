import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type SetupOverdueProps = {
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
  winningBid?: string;
  closedAt?: string;
  /** Absolute datetime — the setup deadline that has passed (winner's zone). */
  setupDeadline?: string;
};

/**
 * When the winner misses the setup window (delivery address, payment method,
 * and billing address). Self-service setup is closed; Contact Us is the path
 * to ask Grade10 to review the order by hand.
 */
export default function SetupOverdueEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  contactUrl = previewLot.contactUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
  setupDeadline = previewLot.setupDeadline,
}: SetupOverdueProps) {
  return (
    <AuctionLetter
      body="The deadline to complete order setup has passed. This order has expired. You can no longer finish setup on Grade10. Contact customer support promptly if you still want to claim this lot."
      brandName={brandName}
      campaign="setup_overdue"
      canUnsubscribe={false}
      ctaHref={contactUrl}
      ctaLabel="Contact customer support"
      details={[{ label: "Deadline was", value: setupDeadline }]}
      heading="Your order setup has expired"
      highlight={{
        label: "Winning bid",
        value: winningBid,
        subtext: `Ended ${closedAt}`,
      }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      points={[
        "We review your requests manually and decide whether the order can still be completed.",
        "Your account may face penalties or extra charges.",
        "If we do not hear from you soon, the order may be cancelled permanently and the lot re-listed.",
      ]}
      preheader={`Setup deadline passed on ${setupDeadline}. Contact Grade10 to claim this lot.`}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={orderUrl}
      secondaryCtaLabel="View order"
      whyYouGotThis="You won this auction lot and did not finish order setup before the deadline."
    />
  );
}

SetupOverdueEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  contactUrl: previewLot.contactUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
  setupDeadline: previewLot.setupDeadline,
} satisfies SetupOverdueProps;
