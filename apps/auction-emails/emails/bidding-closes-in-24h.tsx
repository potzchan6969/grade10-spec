import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type BiddingClosesIn24hProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  unwatchUrl?: string;
  primaryImageUrl?: string | null;
  scheduledClosesAt?: string;
  currentBid?: string;
  canUnsubscribe?: boolean;
};

export default function BiddingClosesIn24hEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  unwatchUrl = previewLot.unwatchUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  scheduledClosesAt = previewLot.scheduledClosesAt,
  currentBid = previewLot.currentBid,
  canUnsubscribe = false,
}: BiddingClosesIn24hProps) {
  return (
    <AuctionLetter
      body="This lot’s scheduled close is about a day away. If bidding extends, the close may move later. You will get a separate notice when extended bidding starts."
      brandName={brandName}
      canUnsubscribe={canUnsubscribe}
      facts={[`Scheduled close ${scheduledClosesAt}`]}
      heading="Bidding closes in 24 hours"
      highlight={{ label: "Current bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      preheader={`Scheduled close ${scheduledClosesAt}. The close can still move.`}
      primaryImageUrl={primaryImageUrl}
      unwatchUrl={unwatchUrl}
      whyYouGotThis="You receive this because you are watching or have bid on this lot."
    />
  );
}

BiddingClosesIn24hEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  unwatchUrl: previewLot.unwatchUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  scheduledClosesAt: previewLot.scheduledClosesAt,
  currentBid: previewLot.currentBid,
  canUnsubscribe: true,
} satisfies BiddingClosesIn24hProps;
