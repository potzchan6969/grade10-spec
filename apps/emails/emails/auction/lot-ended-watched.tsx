import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotEndedWatchedProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  winningBid?: string;
  closedAt?: string;
};

/** Watcher, sold — lot ended with a winning bid. */
export default function LotEndedWatchedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
}: LotEndedWatchedProps) {
  return (
    <AuctionLetter
      body="Bidding has closed on a lot you were watching."
      brandName={brandName}
      campaign="lot_ended_watched"
      canUnsubscribe
      ctaLabel="View lot"
      facts={[`Ended ${closedAt}`]}
      heading="This lot has ended"
      highlight={{ label: "Sold for", value: winningBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Sold for ${winningBid}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

LotEndedWatchedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
} satisfies LotEndedWatchedProps;
