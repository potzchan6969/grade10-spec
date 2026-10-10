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
 * A recorded tracker link leads; otherwise Winner Order is the primary action.
 */
export default function OrderShippedEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  trackingUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  carrierName = previewLot.carrierName,
  trackingNumber = previewLot.trackingNumber,
  shippedAt = previewLot.shippedAt,
  deliveryAddress = previewLot.deliveryAddress,
}: OrderShippedProps) {
  const trackerUrl = trackingUrl?.trim() || undefined;
  const trackingSummary = `${carrierName}: ${trackingNumber}`;

  return (
    <AuctionLetter
      body={
        trackerUrl
          ? "Your auction is on its way. Track the parcel with the carrier, or open Winner Order for the full order."
          : "Your auction is on its way. Open Winner Order for the full order."
      }
      brandName={brandName}
      campaign="shipped"
      canUnsubscribe={false}
      ctaHref={trackerUrl ?? orderUrl}
      ctaLabel={trackerUrl ? "Track shipment" : "View order"}
      details={[
        {
          label: "Tracking",
          value: trackingSummary,
          subtext: `Shipped ${shippedAt}`,
        },
      ]}
      heading="Your order has shipped"
      highlight={{ label: "Delivery address", value: deliveryAddress }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={trackingSummary}
      primaryImageUrl={primaryImageUrl}
      secondaryCtaHref={trackerUrl ? orderUrl : undefined}
      secondaryCtaLabel={trackerUrl ? "View order" : undefined}
      whyYouGotThis="You won this auction and paid for it on Grade10."
    />
  );
}

OrderShippedEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  carrierName: previewLot.carrierName,
  trackingNumber: previewLot.trackingNumber,
  shippedAt: previewLot.shippedAt,
  deliveryAddress: previewLot.deliveryAddress,
} satisfies OrderShippedProps;
