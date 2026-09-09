import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type BiddingHasOpenedProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  scheduledClosesAt?: string;
};

export default function BiddingHasOpenedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  scheduledClosesAt = previewLot.scheduledClosesAt,
}: BiddingHasOpenedProps) {
  return (
    <AuctionLetter
      body="This lot is now open for bids."
      brandName={brandName}
      canUnsubscribe
      facts={[`Open now. Closes ${scheduledClosesAt}`]}
      heading="Bidding has opened"
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader="Place a bid while the lot is live."
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

BiddingHasOpenedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  scheduledClosesAt: previewLot.scheduledClosesAt,
} satisfies BiddingHasOpenedProps;
