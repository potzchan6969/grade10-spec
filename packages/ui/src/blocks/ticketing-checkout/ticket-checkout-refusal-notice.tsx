import { Button } from "@grade10/design-system/components/forms/button";
import { BookingNotice } from "../appointment-booking/booking-notice";

type TicketCheckoutRefusalNoticeCopy = {
  /** What happened, in the buyer's words: `They sold out just now.` */
  title: string;
  /** What it means, where it says more: `Press Pay again.` */
  body?: string;
};

type TicketCheckoutRefusalNoticeAction = {
  /** `Back to Passes`, `Pay`, `Sign In`, `Try Again`. */
  label: string;
  /** `primary` presses the same act again (Pay, Try Again); `outline` leads
   * elsewhere (Back to Passes, See the Event). */
  tone: "primary" | "outline";
  onClick: () => void;
};

type TicketCheckoutRefusalNoticeProps = {
  copy: TicketCheckoutRefusalNoticeCopy;
  /** The way on; a refusal with none (sales closed) omits it. */
  action?: TicketCheckoutRefusalNoticeAction;
  /** Bumped on each repeat of the same answer: the notice shakes once. */
  attempt?: number;
  className?: string;
};

/** What the checkout answered instead of a payment page, above Your Order:
 * its sentence and the way on. Announced as it lands; focus stays where it
 * was. */
function TicketCheckoutRefusalNotice({
  copy,
  action,
  attempt,
  className,
}: TicketCheckoutRefusalNoticeProps) {
  return (
    <BookingNotice
      actions={
        action ? (
          <Button
            onClick={action.onClick}
            size="sm"
            type="button"
            variant={action.tone === "primary" ? "default" : "outline"}
          >
            {action.label}
          </Button>
        ) : undefined
      }
      attempt={attempt}
      body={copy.body}
      className={className}
      title={copy.title}
    />
  );
}

export type {
  TicketCheckoutRefusalNoticeAction,
  TicketCheckoutRefusalNoticeCopy,
  TicketCheckoutRefusalNoticeProps,
};
export { TicketCheckoutRefusalNotice };
