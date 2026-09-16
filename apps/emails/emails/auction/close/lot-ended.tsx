import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotEndedProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  closedAt?: string;
};

/**
 * No-bids close — lot ended with no winner at close (unsold = no bids).
 * Collector copy stays Ended-only; does not disclose non-sale.
 * Not for winner default (走數); that is a later path.
 */
export default function LotEndedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  closedAt = previewLot.closedAt,
}: LotEndedProps) {
  return (
    <AuctionLetter
      body="Bidding has closed on this lot."
      brandName={brandName}
      campaign="lot_ended"
      canUnsubscribe
      ctaLabel="View lot"
      facts={[`Ended ${closedAt}`]}
      heading="This lot has ended"
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader="This lot has ended."
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

LotEndedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  closedAt: previewLot.closedAt,
} satisfies LotEndedProps;
