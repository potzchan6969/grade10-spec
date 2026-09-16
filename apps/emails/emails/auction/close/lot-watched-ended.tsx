import {
  LotWatchedEmail,
  type LotWatchedProps,
} from "@/emails/auction/_components/lot-watched";
import { previewLot } from "@/emails/auction/_components/preview-lot";

/**
 * Preview — watcher when the lot ends with no bids.
 * Same letter as `lot-watched-sold`; omits `winningBid` so copy stays
 * Ended-only. Campaign `lot_ended_watched` only — `lot_ended` is retired.
 */
export default function LotWatchedEndedEmail(props: LotWatchedProps) {
  return <LotWatchedEmail {...props} winningBid={undefined} />;
}

LotWatchedEndedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  closedAt: previewLot.closedAt,
} satisfies LotWatchedProps;
