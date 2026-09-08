import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type OutbidProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  primaryImageUrl?: string | null;
  currentBid?: string;
  /** Standing bid when they lost the lead. Omit to hide the secondary line. */
  yourBid?: string;
  effectiveClosesAt?: string;
};

export default function OutbidEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  currentBid = previewLot.currentBid,
  yourBid = previewLot.yourBid,
  effectiveClosesAt = previewLot.effectiveClosesAt,
}: OutbidProps) {
  return (
    <AuctionLetter
      body="Another bid took the lead on this lot."
      brandName={brandName}
      ctaLabel="Bid again"
      facts={[`Closes ${effectiveClosesAt}`]}
      heading="You have been outbid"
      highlight={{ label: "Leading bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      preheader={`Leading bid is now ${currentBid}. Closes ${effectiveClosesAt}.`}
      primaryImageUrl={primaryImageUrl}
      secondary={
        yourBid ? { label: "Your bid", value: yourBid } : undefined
      }
      whyYouGotThis="You receive this because you have bid on this lot."
    />
  );
}

OutbidEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  currentBid: previewLot.currentBid,
  yourBid: previewLot.yourBid,
  effectiveClosesAt: previewLot.effectiveClosesAt,
} satisfies OutbidProps;
