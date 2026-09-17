import { previewLot } from "@/emails/auction/_components/preview-lot";
import PaymentReminderEmail, {
  type PaymentReminderProps,
} from "@/emails/auction/order/payment-reminder";

/** Preview variant — day 3 after invoice send. */
export default function PaymentReminderDayThreeEmail(
  props: PaymentReminderProps,
) {
  return <PaymentReminderEmail {...props} urgency="day3" />;
}

PaymentReminderDayThreeEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
  urgency: "day3",
} satisfies PaymentReminderProps;
