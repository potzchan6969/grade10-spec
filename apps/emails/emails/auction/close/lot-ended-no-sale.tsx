import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotEndedNoSaleProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  highestBid?: string;
  yourBid?: string;
  closedAt?: string;
};

/** Bidder on an unsold lot — highest bid + their bid. */
export default function LotEndedNoSaleEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  highestBid = previewLot.highestBid,
  yourBid = previewLot.yourBid,
  closedAt = previewLot.closedAt,
}: LotEndedNoSaleProps) {
  return (
    <AuctionLetter
      body="Bidding has closed. This lot did not sell."
      brandName={brandName}
      campaign="lot_ended_no_sale"
      canUnsubscribe
      ctaLabel="View lot"
      facts={[`Ended ${closedAt}`]}
      heading="This lot has ended"
      highlight={{ label: "Highest bid", value: highestBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Highest bid ${highestBid}. Your bid was ${yourBid}.`}
      primaryImageUrl={primaryImageUrl}
      secondary={{ label: "Your bid", value: yourBid }}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

LotEndedNoSaleEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  highestBid: previewLot.highestBid,
  yourBid: previewLot.yourBid,
  closedAt: previewLot.closedAt,
} satisfies LotEndedNoSaleProps;
