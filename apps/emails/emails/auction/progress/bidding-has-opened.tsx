import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

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
      body="This auction is now open for bids."
      brandName={brandName}
      campaign="bidding_has_opened"
      canUnsubscribe
      facts={[`Open now. Closes ${scheduledClosesAt}`]}
      heading="Bidding has opened"
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader="Place a bid while the auction is live."
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this auction."
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
