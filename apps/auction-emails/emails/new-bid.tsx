import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type NewBidProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  currentBid?: string;
  effectiveClosesAt?: string;
};

export default function NewBidEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  currentBid = previewLot.currentBid,
  effectiveClosesAt = previewLot.effectiveClosesAt,
}: NewBidProps) {
  return (
    <AuctionLetter
      body="Someone else bid on this lot."
      brandName={brandName}
      campaign="new_bid"
      canUnsubscribe
      facts={[`Closes ${effectiveClosesAt}`]}
      heading="A lot you bid on received a new bid"
      highlight={{ label: "Leading bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Leading bid is now ${currentBid}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

NewBidEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  currentBid: previewLot.currentBid,
  effectiveClosesAt: previewLot.effectiveClosesAt,
} satisfies NewBidProps;
