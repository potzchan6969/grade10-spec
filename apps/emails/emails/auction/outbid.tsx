import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type OutbidProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
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
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  currentBid = previewLot.currentBid,
  yourBid = previewLot.yourBid,
  effectiveClosesAt = previewLot.effectiveClosesAt,
}: OutbidProps) {
  return (
    <AuctionLetter
      body="Another bid took the lead on this lot."
      brandName={brandName}
      campaign="outbid"
      canUnsubscribe
      ctaLabel="Bid again"
      facts={[`Closes ${effectiveClosesAt}`]}
      heading="You have been outbid"
      highlight={{ label: "Leading bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Leading bid is now ${currentBid}. Closes ${effectiveClosesAt}.`}
      primaryImageUrl={primaryImageUrl}
      secondary={yourBid ? { label: "Your bid", value: yourBid } : undefined}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

OutbidEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  currentBid: previewLot.currentBid,
  yourBid: previewLot.yourBid,
  effectiveClosesAt: previewLot.effectiveClosesAt,
} satisfies OutbidProps;
