import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type AuctionWonProps = {
  brandName?: string;
  lotTitle?: string;
  /** Winner Order URL — confirm address. */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  winningBid?: string;
  closedAt?: string;
};

export default function AuctionWonEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
}: AuctionWonProps) {
  return (
    <AuctionLetter
      body="Bidding has ended and you won. Confirm where to ship this lot. Grade10 prepares the invoice after your address is confirmed — nothing is due yet."
      brandName={brandName}
      campaign="auction_won"
      canUnsubscribe={false}
      ctaLabel="Confirm delivery address"
      facts={[`Ended ${closedAt}`]}
      heading="You won this lot"
      highlight={{ label: "Winning bid", value: winningBid }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader="Confirm a delivery address so Grade10 can prepare your invoice."
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
} satisfies AuctionWonProps;
