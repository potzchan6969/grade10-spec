import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

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
      body="Each new bid resets the timer. The auction ends only when a full extension window passes with no new bids."
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
      whyYouGotThis="Email alerts are on for this auction."
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
