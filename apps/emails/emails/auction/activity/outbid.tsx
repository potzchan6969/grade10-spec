import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type OutbidProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  /** Their maximum bid, shown outbid. Omit to hide the highlight. */
  yourBid?: string;
  effectiveClosesAt?: string;
};

export default function OutbidEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  yourBid = previewLot.yourBid,
  effectiveClosesAt = previewLot.effectiveClosesAt,
}: OutbidProps) {
  return (
    <AuctionLetter
      body="Another bid took the lead on this auction."
      brandName={brandName}
      campaign="outbid"
      canUnsubscribe
      ctaLabel="Bid again"
      heading="You have been outbid"
      highlight={
        yourBid
          ? { label: "Your max. bid (outbid)", value: yourBid }
          : undefined
      }
      listingUrl={listingUrl}
      lotSubtext={`Closes ${effectiveClosesAt}`}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Closes ${effectiveClosesAt}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="Email alerts are on for this auction."
    />
  );
}

OutbidEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  yourBid: previewLot.yourBid,
  effectiveClosesAt: previewLot.effectiveClosesAt,
} satisfies OutbidProps;
