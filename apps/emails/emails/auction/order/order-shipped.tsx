import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type OrderShippedProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and secondary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  /** Carrier track-and-trace URL — primary CTA. */
  trackingUrl?: string;
  primaryImageUrl?: string | null;
  carrierName?: string;
  trackingNumber?: string;
  shippedAt?: string;
  /** Confirmed delivery address (may include newlines). */
  deliveryAddress?: string;
};

/**
 * When fulfilment becomes shipped with a tracking number attached.
 * Primary action is the carrier tracker; Winner Order is secondary.
 */
export default function OrderShippedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  trackingUrl = previewLot.trackingUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  carrierName = previewLot.carrierName,
  trackingNumber = previewLot.trackingNumber,
  shippedAt = previewLot.shippedAt,
  deliveryAddress = previewLot.deliveryAddress,
}: OrderShippedProps) {
  return (
    <AuctionLetter
      body="Your lot is on its way. Track the parcel with the carrier, or open Winner Order for the full order."
      brandName={brandName}
      campaign="shipped"
      canUnsubscribe={false}
      ctaHref={trackingUrl}
      ctaLabel="Track shipment"
      details={[
        {
          label: "Tracking",
          value: `${carrierName}: ${trackingNumber}`,
          subtext: `Shipped ${shippedAt}`,
        },
      ]}
      heading="Your order has shipped"
      highlight={{ label: "Delivery address", value: deliveryAddress }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={`${carrierName}: ${trackingNumber}`}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={orderUrl}
      secondaryCtaLabel="View order"
      whyYouGotThis="You won this auction lot and paid for it on Grade10."
    />
  );
}

OrderShippedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  trackingUrl: previewLot.trackingUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  carrierName: previewLot.carrierName,
  trackingNumber: previewLot.trackingNumber,
  shippedAt: previewLot.shippedAt,
  deliveryAddress: previewLot.deliveryAddress,
} satisfies OrderShippedProps;
