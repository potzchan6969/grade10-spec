import { AuctionLetter } from "@/emails/_components/auction-letter";
import { previewLot } from "@/emails/_components/preview-lot";

export type ExtendedBiddingProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  unwatchUrl?: string;
  primaryImageUrl?: string | null;
  effectiveClosesAt?: string;
  currentBid?: string;
  canUnsubscribe?: boolean;
};

export default function ExtendedBiddingEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  unwatchUrl = previewLot.unwatchUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  effectiveClosesAt = previewLot.effectiveClosesAt,
  currentBid = previewLot.currentBid,
  canUnsubscribe = false,
}: ExtendedBiddingProps) {
  return (
    <AuctionLetter
      body="A late bid moved this lot’s close. Bidding continues until no further bid lands in the extension window."
      brandName={brandName}
      canUnsubscribe={canUnsubscribe}
      facts={[`Current close ${effectiveClosesAt}`]}
      heading="Extended bidding has started"
      highlight={{ label: "Current bid", value: currentBid }}
      listingUrl={listingUrl}
      lotTitle={lotTitle}
      preheader={`The close has moved. Current close ${effectiveClosesAt}.`}
      primaryImageUrl={primaryImageUrl}
      unwatchUrl={unwatchUrl}
      whyYouGotThis="You receive this because you are watching or have bid on this lot."
    />
  );
}

ExtendedBiddingEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  unwatchUrl: previewLot.unwatchUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  effectiveClosesAt: previewLot.effectiveClosesAt,
  currentBid: previewLot.currentBid,
  canUnsubscribe: true,
} satisfies ExtendedBiddingProps;
