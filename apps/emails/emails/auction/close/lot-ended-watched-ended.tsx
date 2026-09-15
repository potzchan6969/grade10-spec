import { previewLot } from "@/emails/auction/_components/preview-lot";
import LotEndedWatchedEmail, {
  type LotEndedWatchedProps,
} from "@/emails/auction/close/lot-ended-watched";

/**
 * Preview variant — watcher when the lot ends without a winner.
 * Same letter as `lot-ended-watched`; omits `winningBid` so copy stays
 * Ended-only.
 */
export default function LotEndedWatchedEndedEmail(props: LotEndedWatchedProps) {
  return <LotEndedWatchedEmail {...props} winningBid={undefined} />;
}

LotEndedWatchedEndedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  listingUrl: previewLot.listingUrl,
  muteUrl: previewLot.muteUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  closedAt: previewLot.closedAt,
} satisfies LotEndedWatchedProps;
