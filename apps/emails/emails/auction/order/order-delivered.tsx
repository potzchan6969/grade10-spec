import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type OrderDeliveredProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and primary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  /** Customer support — secondary CTA (matches Winner Order Contact Us). */
  contactUrl?: string;
  primaryImageUrl?: string | null;
  /** When the carrier confirmed delivery (winner's zone). */
  deliveredAt?: string;
  /** Confirmed delivery address (may include newlines). */
  deliveryAddress?: string;
};

/** When the carrier confirms delivery. */
export default function OrderDeliveredEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  contactUrl = previewLot.contactUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  deliveredAt = previewLot.deliveredAt,
  deliveryAddress = previewLot.deliveryAddress,
}: OrderDeliveredProps) {
  return (
    <AuctionLetter
      body="The carrier says your lot has been delivered. If it has not reached you, or something is wrong, contact customer support."
      brandName={brandName}
      campaign="delivered"
      canUnsubscribe={false}
      ctaLabel="View order"
      heading="Your order has been delivered"
      highlight={{
        label: "Delivered to",
        value: deliveryAddress,
        subtext: `Delivered ${deliveredAt}`,
      }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`Delivered ${deliveredAt}.`}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={contactUrl}
      secondaryCtaLabel="Contact customer support"
      whyYouGotThis="You won this auction lot and it was shipped to you by Grade10."
    />
  );
}

OrderDeliveredEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  contactUrl: previewLot.contactUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  deliveredAt: previewLot.deliveredAt,
  deliveryAddress: previewLot.deliveryAddress,
} satisfies OrderDeliveredProps;
