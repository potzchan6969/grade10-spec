import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type ExtendedBiddingProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  effectiveClosesAt?: string;
  currentBid?: string;
  canUnsubscribe?: boolean;
};

export default function ExtendedBiddingEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  effectiveClosesAt = previewLot.effectiveClosesAt,
  currentBid = previewLot.currentBid,
  canUnsubscribe = false,
}: ExtendedBiddingProps) {
  return (
    <AuctionLetter
      body="A late bid moved this lot’s close. Bidding continues until no further bid lands in the extension window."
      brandName={brandName}
      campaign="extended_bidding"
      canUnsubscribe={canUnsubscribe}
      facts={[`Current close ${effectiveClosesAt}`]}
      heading="Extended bidding has started"
      highlight={{ label: "Current bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`The close has moved. Current close ${effectiveClosesAt}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

ExtendedBiddingEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  effectiveClosesAt: previewLot.effectiveClosesAt,
  currentBid: previewLot.currentBid,
  canUnsubscribe: true,
} satisfies ExtendedBiddingProps;
