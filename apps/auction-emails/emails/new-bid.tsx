import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type NewBidProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  primaryImageUrl?: string | null;
  currentBid?: string;
  effectiveClosesAt?: string;
};

export default function NewBidEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  currentBid = previewLot.currentBid,
  effectiveClosesAt = previewLot.effectiveClosesAt,
}: NewBidProps) {
  return (
    <AuctionLetter
      body="Someone else bid on this lot."
      brandName={brandName}
      facts={[`Closes ${effectiveClosesAt}`]}
      heading="A lot you bid on received a new bid"
      highlight={{ label: "Leading bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      preheader={`Leading bid is now ${currentBid}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You receive this because you have bid on this lot."
    />
  );
}

NewBidEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  currentBid: previewLot.currentBid,
  effectiveClosesAt: previewLot.effectiveClosesAt,
} satisfies NewBidProps;
