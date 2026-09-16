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
  /** Absolute datetime — Confirm by … (winner's zone). */
  addressDeadline?: string;
};

export default function AuctionWonEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
  addressDeadline = previewLot.addressDeadline,
}: AuctionWonProps) {
  return (
    <AuctionLetter
      body="Bidding has ended and you won. Confirm where to ship this lot by the deadline below. Grade10 prepares the invoice after your address is confirmed — nothing is due yet."
      brandName={brandName}
      campaign="auction_won"
      canUnsubscribe={false}
      ctaLabel="Confirm delivery address"
      details={[{ label: "Confirm by", value: addressDeadline }]}
      heading="You won this lot"
      highlight={{
        label: "Winning bid",
        value: winningBid,
        subtext: `Ended ${closedAt}`,
      }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Confirm a delivery address by ${addressDeadline}.`}
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
  addressDeadline: previewLot.addressDeadline,
} satisfies AuctionWonProps;
