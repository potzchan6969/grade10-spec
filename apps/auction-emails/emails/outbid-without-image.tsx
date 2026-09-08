import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

/** Preview fixture: letter with no primary image (SC-30). */
export default function OutbidWithoutImageEmail() {
  return (
    <AuctionLetter
      body="Another bid took the lead on this lot."
      brandName={previewLot.brandName}
      ctaLabel="Bid again"
      facts={[`Closes ${previewLot.effectiveClosesAt}`]}
      heading="You have been outbid"
      highlight={{
        label: "Leading bid",
        value: previewLot.currentBid,
      }}
      listingUrl={previewLot.listingUrl}
      lotTitle={previewLot.lotTitle}
      preheader={`Leading bid is now ${previewLot.currentBid}. Closes ${previewLot.effectiveClosesAt}.`}
      primaryImageUrl={null}
      secondary={{
        label: "Your bid",
        value: previewLot.yourBid,
      }}
      whyYouGotThis="You receive this because you have bid on this lot."
    />
  );
}

OutbidWithoutImageEmail.PreviewProps = {};
