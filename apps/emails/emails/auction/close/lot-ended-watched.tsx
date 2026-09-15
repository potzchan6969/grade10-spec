import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotEndedWatchedProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  /**
   * When set, the letter shows **Sold for**. Omit when the lot ends without a
   * winner — collector copy stays Ended-only (same language as lot status Ended).
   */
  winningBid?: string;
  closedAt?: string;
};

/**
 * Watcher — lot ended.
 * With `winningBid`: sold outcome. Without: Ended-only collector copy.
 */
export default function LotEndedWatchedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid,
  closedAt = previewLot.closedAt,
}: LotEndedWatchedProps) {
  const sold = Boolean(winningBid);

  return (
    <AuctionLetter
      body="Bidding has closed on a lot you were watching."
      brandName={brandName}
      campaign="lot_ended_watched"
      canUnsubscribe
      ctaLabel="View lot"
      facts={[`Ended ${closedAt}`]}
      heading="This lot has ended"
      highlight={
        sold && winningBid
          ? { label: "Sold for", value: winningBid }
          : undefined
      }
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={sold ? `Sold for ${winningBid}.` : "This lot has ended."}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

/** Default preview — sold path (Sold for). */
LotEndedWatchedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
} satisfies LotEndedWatchedProps;
