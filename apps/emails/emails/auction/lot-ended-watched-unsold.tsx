import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotEndedWatchedUnsoldProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  highestBid?: string;
  closedAt?: string;
};

/** Watcher, unsold — lot ended with no sale. */
export default function LotEndedWatchedUnsoldEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  highestBid = previewLot.highestBid,
  closedAt = previewLot.closedAt,
}: LotEndedWatchedUnsoldProps) {
  return (
    <AuctionLetter
      body="Bidding has closed. This lot did not sell."
      brandName={brandName}
      campaign="lot_ended_watched"
      canUnsubscribe
      ctaLabel="View lot"
      facts={[`Ended ${closedAt}`]}
      heading="This lot has ended"
      highlight={{ label: "Highest bid", value: highestBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`No sale. Highest bid ${highestBid}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

LotEndedWatchedUnsoldEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  highestBid: previewLot.highestBid,
  closedAt: previewLot.closedAt,
} satisfies LotEndedWatchedUnsoldProps;
