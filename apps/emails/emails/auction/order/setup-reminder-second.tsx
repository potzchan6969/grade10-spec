import { previewLot } from "@/emails/auction/_components/preview-lot";
import SetupReminderEmail, {
  type SetupReminderProps,
} from "@/emails/auction/order/setup-reminder";

/** Preview variant — second setup reminder (draft 72h). */
export default function SetupReminderSecondEmail(props: SetupReminderProps) {
  return <SetupReminderEmail {...props} urgency="second" />;
}

SetupReminderSecondEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
  setupDeadline: previewLot.setupDeadline,
  urgency: "second",
} satisfies SetupReminderProps;
