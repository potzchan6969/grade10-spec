import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type AddressReminderProps = {
  brandName?: string;
  lotTitle?: string;
  /**
   * Winner Order URL — lot image, lot title, and primary CTA.
   * Opens sign-in first when the collector is signed out.
   */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  winningBid?: string;
  closedAt?: string;
  /** Absolute datetime — Confirm by … (winner's zone). */
  addressDeadline?: string;
  /** Second reminder uses stronger subject-facing copy. */
  urgency?: "first" | "second";
};

export default function AddressReminderEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
  addressDeadline = previewLot.addressDeadline,
  urgency = "first",
}: AddressReminderProps) {
  const isSecond = urgency === "second";

  return (
    <AuctionLetter
      body={
        isSecond
          ? "Your won lot is still waiting on a delivery address. Confirm where to ship by the deadline below so Grade10 can prepare the invoice."
          : "You won this lot. Grade10 still needs a delivery address before it can prepare your invoice. Confirm by the deadline below — nothing is due until the invoice is sent."
      }
      brandName={brandName}
      campaign="address_reminder"
      canUnsubscribe={false}
      ctaLabel="Confirm delivery address"
      details={[{ label: "Confirm by", value: addressDeadline }]}
      heading={
        isSecond
          ? "Still waiting on your delivery address"
          : "Confirm your delivery address"
      }
      highlight={{
        label: "Winning bid",
        value: winningBid,
        subtext: `Ended ${closedAt}`,
      }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={
        isSecond
          ? `Confirm an address by ${addressDeadline}.`
          : `Confirm a delivery address by ${addressDeadline}.`
      }
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You won this auction lot and have not confirmed a delivery address yet."
    />
  );
}

AddressReminderEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
  addressDeadline: previewLot.addressDeadline,
  urgency: "first",
} satisfies AddressReminderProps;
