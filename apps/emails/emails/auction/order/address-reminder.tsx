import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type AddressReminderProps = {
  brandName?: string;
  lotTitle?: string;
  /** Winner Order URL — confirm address. */
  orderUrl?: string;
  primaryImageUrl?: string | null;
  winningBid?: string;
  closedAt?: string;
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
  urgency = "first",
}: AddressReminderProps) {
  const isSecond = urgency === "second";

  return (
    <AuctionLetter
      body={
        isSecond
          ? "Your won lot is still waiting on a delivery address. Confirm where to ship so Grade10 can prepare the invoice."
          : "You won this lot. Grade10 still needs a delivery address before it can prepare your invoice. Nothing is due until the invoice is sent."
      }
      brandName={brandName}
      campaign="address_reminder"
      canUnsubscribe={false}
      ctaLabel="Confirm delivery address"
      facts={[`Ended ${closedAt}`, "Waiting on address"]}
      heading={
        isSecond
          ? "Still waiting on your delivery address"
          : "Confirm your delivery address"
      }
      highlight={{ label: "Winning bid", value: winningBid }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      preheader={
        isSecond
          ? "Confirm an address so your invoice can be prepared."
          : "Your won lot is waiting on a shipping address."
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
  urgency: "first",
} satisfies AddressReminderProps;
