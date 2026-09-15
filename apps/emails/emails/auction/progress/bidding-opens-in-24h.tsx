import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type BiddingOpensIn24hProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  startsAt?: string;
};

export default function BiddingOpensIn24hEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  startsAt = previewLot.startsAt,
}: BiddingOpensIn24hProps) {
  return (
    <AuctionLetter
      body="This lot opens for bids soon."
      brandName={brandName}
      campaign="bidding_opens_in_24h"
      canUnsubscribe
      facts={[`Starts ${startsAt}`]}
      heading="Bidding opens in 24 hours"
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Starts ${startsAt}. Be ready to bid.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

BiddingOpensIn24hEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  startsAt: previewLot.startsAt,
} satisfies BiddingOpensIn24hProps;
