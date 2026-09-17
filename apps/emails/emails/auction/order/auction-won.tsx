import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type AuctionWonProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and (unless overridden) primary
   * CTA. Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  winningBid?: string;
  closedAt?: string;
  /** Absolute datetime — Confirm by … (winner's zone). Setup window. */
  setupDeadline?: string;
};

export default function AuctionWonEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
  setupDeadline = previewLot.setupDeadline,
}: AuctionWonProps) {
  return (
    <AuctionLetter
      afterPoints="Nothing is due yet."
      body="Bidding has ended and you won. Confirm these by the deadline below so Grade10 can prepare your invoice."
      brandName={brandName}
      campaign="auction_won"
      canUnsubscribe={false}
      ctaLabel="Complete order setup"
      details={[{ label: "Confirm by", value: setupDeadline }]}
      heading="You won this lot"
      highlight={{
        label: "Winning bid",
        value: winningBid,
        subtext: `Ended ${closedAt}`,
      }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      points={[...previewLot.setupFields]}
      preheader={`Complete order setup by ${setupDeadline}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You won this auction lot on Grade10."
    />
  );
}

AuctionWonEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
  setupDeadline: previewLot.setupDeadline,
} satisfies AuctionWonProps;
