import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type PaymentReminderProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and primary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  /** Invoice total (same figure as Order Total on Winner Order). */
  invoiceTotal?: string;
  /** Absolute datetime — Pay by … (winner's zone). */
  paymentDeadline?: string;
  /**
   * Unpaid-invoice letters while `pending`, measured from invoice send:
   * - `first` — when the invoice is sent (payment window starts)
   * - `day3` — day 3 after send
   * - `day6` — day 6 after send
   * - `final` — 24 hours before the payment deadline (not at expiry)
   */
  urgency?: "first" | "day3" | "day6" | "final";
};

/**
 * Payment reminder / final notice for an unpaid invoice.
 * Cadence from invoice send; final notice is 24h before the deadline so Pay
 * is still offered when the mail arrives. No PDF attachment.
 */
export default function PaymentReminderEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  invoiceTotal = previewLot.orderTotal,
  paymentDeadline = previewLot.paymentDeadline,
  urgency = "first",
}: PaymentReminderProps) {
  const copy =
    urgency === "final"
      ? {
          heading: "Last chance to pay this invoice",
          body: "Your payment deadline is in 24 hours. Pay this invoice by the time below so Grade10 can process your order.",
          preheader: `Pay ${invoiceTotal} by ${paymentDeadline}.`,
          whyYouGotThis: "You have an unpaid auction invoice on Grade10.",
        }
      : urgency === "day6"
        ? {
            heading: "Your invoice is still unpaid",
            body: "This invoice is still waiting on payment. Pay by the deadline below so Grade10 can process your order.",
            preheader: `Pay ${invoiceTotal} by ${paymentDeadline}.`,
            whyYouGotThis: "You have an unpaid auction invoice on Grade10.",
          }
        : urgency === "day3"
          ? {
              heading: "Reminder: pay your invoice",
              body: "This invoice is still unpaid. Open Winner Order to pay by the deadline below.",
              preheader: `Pay ${invoiceTotal} by ${paymentDeadline}.`,
              whyYouGotThis: "You have an unpaid auction invoice on Grade10.",
            }
          : {
              heading: "Your invoice is ready",
              body: "Your invoice is ready. Open Winner Order to check the full invoice and pay. The payment window starts now.",
              preheader: `Pay ${invoiceTotal} by ${paymentDeadline}.`,
              whyYouGotThis:
                "You won this auction lot and confirmed a delivery address.",
            };

  return (
    <AuctionLetter
      body={copy.body}
      brandName={brandName}
      campaign="payment_reminder"
      canUnsubscribe={false}
      ctaLabel="View invoice and pay"
      details={[{ label: "Pay by", value: paymentDeadline }]}
      heading={copy.heading}
      highlight={{ label: "Invoice total", value: invoiceTotal }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={copy.preheader}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis={copy.whyYouGotThis}
    />
  );
}

PaymentReminderEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  invoiceTotal: previewLot.orderTotal,
  paymentDeadline: previewLot.paymentDeadline,
  urgency: "first",
} satisfies PaymentReminderProps;
