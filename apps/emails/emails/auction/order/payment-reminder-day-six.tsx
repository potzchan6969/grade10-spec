import { previewLot } from "@/emails/auction/_components/preview-lot";
import PaymentReminderEmail, {
  type PaymentReminderProps,
} from "@/emails/auction/order/payment-reminder";

/** Preview variant — day 6 after invoice send. */
export default function PaymentReminderDaySixEmail(
  props: PaymentReminderProps,
) {
  return <PaymentReminderEmail {...props} urgency="day6" />;
}

PaymentReminderDaySixEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
  urgency: "day6",
} satisfies PaymentReminderProps;
