import { AuctionLetter } from "@/emails/auction/_components/auction-letter";
import { previewLot } from "@/emails/auction/_components/preview-lot";

export type SetupReminderProps = {
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
  /** Absolute datetime — Confirm by … (winner's zone). Setup window. */
  setupDeadline?: string;
  /** Second reminder uses stronger subject-facing copy. */
  urgency?: "first" | "second";
};

/**
 * Reminder while order setup is incomplete (delivery address, payment
 * method, and billing address).
 */
export default function SetupReminderEmail({
  brandName = previewLot.brandName,
  lotTitle = previewLot.lotTitle,
  orderUrl = previewLot.orderUrl,
  primaryImageUrl = previewLot.primaryImageUrl,
  winningBid = previewLot.winningBid,
  closedAt = previewLot.closedAt,
  setupDeadline = previewLot.setupDeadline,
  urgency = "first",
}: SetupReminderProps) {
  const isSecond = urgency === "second";

  return (
    <AuctionLetter
      afterPoints={
        isSecond ? undefined : "Nothing is due until the invoice is sent."
      }
      body={
        isSecond
          ? "Your won lot is still waiting on order setup. Confirm these by the deadline below so Grade10 can prepare the invoice."
          : "You won this lot. Grade10 still needs your order setup before it can prepare your invoice. Complete these by the deadline below."
      }
      brandName={brandName}
      campaign="setup_reminder"
      canUnsubscribe={false}
      ctaLabel="Complete order setup"
      details={[{ label: "Confirm by", value: setupDeadline }]}
      heading={
        isSecond
          ? "Still waiting on your order setup"
          : "Complete your order setup"
      }
      highlight={{
        label: "Winning bid",
        value: winningBid,
        subtext: `Ended ${closedAt}`,
      }}
      listingUrl={orderUrl}
      lotTitle={lotTitle}
      points={[...previewLot.setupFields]}
      preheader={`Complete order setup by ${setupDeadline}.`}
      primaryImageUrl={primaryImageUrl}
      whyYouGotThis="You won this auction lot and have not finished order setup yet."
    />
  );
}

SetupReminderEmail.PreviewProps = {
  brandName: previewLot.brandName,
  lotTitle: previewLot.lotTitle,
  orderUrl: previewLot.orderUrl,
  primaryImageUrl: previewLot.primaryImageUrl,
  winningBid: previewLot.winningBid,
  closedAt: previewLot.closedAt,
  setupDeadline: previewLot.setupDeadline,
  urgency: "first",
} satisfies SetupReminderProps;
