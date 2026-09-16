import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type LotClosedDidntWinProps = {
  brandName?: string;
  lotTitle?: string;
  listingUrl?: string;
  muteUrl?: string;
  primaryImageUrl?: string | null;
  winningBid?: string;
  yourBid?: string;
  closedAt?: string;
};

export default function LotClosedDidntWinEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  listingUrl = previewLot.listingUrl,
  muteUrl = previewLot.muteUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  yourBid = previewLot.yourBid,
  closedAt = previewLot.closedAt,
}: LotClosedDidntWinProps) {
  return (
    <AuctionLetter
      body="Bidding has ended. Someone else won this lot."
      brandName={brandName}
      campaign="lot_closed_didnt_win"
      canUnsubscribe
      ctaLabel="View lot"
      heading="This lot closed"
      highlight={{ label: "Winning bid", value: winningBid }}
      listingUrl={listingUrl}
      lotSubtext={`Ended ${closedAt}`}
      lotTitle={lotTitle}
      muteUrl={muteUrl}
      preheader={`Winning bid ${winningBid}. Your bid was ${yourBid}.`}
      primaryImageUrl={primaryImageUrl}
      secondary={{ label: "Your bid", value: yourBid }}
      whyYouGotThis="Email alerts are on for this lot."
    />
  );
}

LotClosedDidntWinEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  yourBid: previewLot.yourBid,
  closedAt: previewLot.closedAt,
} satisfies LotClosedDidntWinProps;
