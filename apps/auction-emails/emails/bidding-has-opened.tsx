import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type BiddingHasOpenedProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  unwatchUrl?: string;
  primaryImageUrl?: string | null;
  scheduledClosesAt?: string;
};

export default function BiddingHasOpenedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  unwatchUrl = previewLot.unwatchUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  scheduledClosesAt = previewLot.scheduledClosesAt,
}: BiddingHasOpenedProps) {
  return (
    <AuctionLetter
      body="The lot you are watching is now open for bids."
      brandName={brandName}
      canUnsubscribe
      facts={[`Open now. Closes ${scheduledClosesAt}`]}
      heading="Bidding has opened"
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      preheader="Place a bid while the lot is live."
      primaryImageUrl={primaryImageUrl}
      unwatchUrl={unwatchUrl}
      whyYouGotThis="You receive this because you are watching this lot."
    />
  );
}

BiddingHasOpenedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  unwatchUrl: previewLot.unwatchUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  scheduledClosesAt: previewLot.scheduledClosesAt,
} satisfies BiddingHasOpenedProps;
