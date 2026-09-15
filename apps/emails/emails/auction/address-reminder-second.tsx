import AddressReminderEmail, {
  type AddressReminderProps,
} from "@/emails/auction/address-reminder";
import { previewLot } from "@/emails/auction/_components/preview-lot";

/** Preview variant — second address reminder (draft 72h). */
export default function AddressReminderSecondEmail(
  props: AddressReminderProps,
) {
  return <AddressReminderEmail {...props} urgency="second" />;
}

AddressReminderSecondEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
  urgency: "second",
} satisfies AddressReminderProps;
