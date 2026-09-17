import { previewLot } from "@/emails/auction/_components/preview-lot";
import PaymentReminderEmail, {
  type PaymentReminderProps,
} from "@/emails/auction/order/payment-reminder";

/** Preview variant — second payment reminder (5 days before due). */
export default function PaymentReminderSecondEmail(
  props: PaymentReminderProps,
) {
  return <PaymentReminderEmail {...props} urgency="second" />;
}

PaymentReminderSecondEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
  urgency: "second",
} satisfies PaymentReminderProps;
