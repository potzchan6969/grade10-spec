import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type BiddingOpensIn24hProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  unwatchUrl?: string;
  primaryImageUrl?: string | null;
  startsAt?: string;
};

export default function BiddingOpensIn24hEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  unwatchUrl = previewLot.unwatchUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  startsAt = previewLot.startsAt,
}: BiddingOpensIn24hProps) {
  return (
    <AuctionLetter
      body="The lot you are watching opens for bids soon."
      brandName={brandName}
      canUnsubscribe
      facts={[`Starts ${startsAt}`]}
      heading="Bidding opens in 24 hours"
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      preheader={`Starts ${startsAt}. Be ready to bid.`}
      primaryImageUrl={primaryImageUrl}
      unwatchUrl={unwatchUrl}
      whyYouGotThis="You receive this because you are watching this lot."
    />
  );
}

BiddingOpensIn24hEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  unwatchUrl: previewLot.unwatchUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  startsAt: previewLot.startsAt,
} satisfies BiddingOpensIn24hProps;
