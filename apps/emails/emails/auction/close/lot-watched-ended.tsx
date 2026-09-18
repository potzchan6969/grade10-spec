import {
  LotWatchedEmail,
  type LotWatchedProps,
} from "@/emails/auction/_components/lot-watched";
import { previewLot } from "@/emails/auction/_components/preview-lot";

/**
 * Preview — watcher when the lot ends with no bids.
 * Campaign `lot_watched_ended`. Omit `winningBid` so copy stays Ended-only.
 * Former campaign `lot_ended_watched` is retired for this path.
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
