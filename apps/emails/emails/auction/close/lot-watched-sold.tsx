import {
  LotWatchedEmail,
  type LotWatchedProps,
} from "@/emails/auction/_components/lot-watched";
import { previewLot } from "@/emails/auction/_components/preview-lot";

/**
 * Preview — watcher when the lot sold (pass `winningBid` → **Sold for**).
 * Campaign `lot_watched_sold`. Letter: `LotWatchedEmail` in `_components/lot-watched`.
 */
export default function LotWatchedSoldEmail(props: LotWatchedProps) {
  return <LotWatchedEmail {...props} />;
}

LotWatchedSoldEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
} satisfies LotWatchedProps;
