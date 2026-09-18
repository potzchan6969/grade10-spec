import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import type { AuctionEmailCampaign } from "@/emails/auction/_components/campaign-tags";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotWatchedProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  /**
   * When set, the letter is the sold outcome (`lot_watched_sold`) with
   * **Sold for**. Omit for the no-bids ended letter (`lot_watched_ended`).
   */
  winningBid?: string;
  closedAt?: string;
};

/**
 * Watcher close-outcome letter.
 * With `winningBid`: sold (`lot-watched-sold`, campaign `lot_watched_sold`).
 * Without: Ended-only (`lot-watched-ended`, campaign `lot_watched_ended`).
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
  const campaign: AuctionEmailCampaign = sold
    ? "lot_watched_sold"
    : "lot_watched_ended";

  return (
    <AuctionLetter
      body="Bidding has closed on a lot you were watching."
      brandName={brandName}
      campaign={campaign}
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
