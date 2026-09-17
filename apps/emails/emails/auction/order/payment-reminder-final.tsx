import { previewLot } from "@/emails/auction/_components/preview-lot";
import PaymentReminderEmail, {
  type PaymentReminderProps,
} from "@/emails/auction/order/payment-reminder";

/** Preview variant — final payment reminder (3 days before due). */
export default function PaymentReminderFinalEmail(props: PaymentReminderProps) {
  return <PaymentReminderEmail {...props} urgency="final" />;
}

PaymentReminderFinalEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
  urgency: "final",
} satisfies PaymentReminderProps;
