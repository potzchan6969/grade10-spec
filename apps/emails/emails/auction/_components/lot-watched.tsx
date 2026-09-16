import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotWatchedProps = {
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
 * Preview entry points: `close/lot-watched-sold`, `close/lot-watched-ended`.
 */
export function LotWatchedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid,
  closedAt = previewLot.closedAt,
}: LotWatchedProps) {
  const sold = Boolean(winningBid);

  return (
    <AuctionLetter
      body="Bidding has closed on a lot you were watching."
      brandName={brandName}
      campaign="lot_ended_watched"
      canUnsubscribe
      ctaLabel="View lot"
      heading="This lot has ended"
      highlight={
        sold && winningBid
          ? { label: "Sold for", value: winningBid }
          : undefined
      }
      listingUrl={listingUrl}
      lotSubtext={`Ended ${closedAt}`}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={sold ? `Sold for ${winningBid}.` : "This lot has ended."}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}
