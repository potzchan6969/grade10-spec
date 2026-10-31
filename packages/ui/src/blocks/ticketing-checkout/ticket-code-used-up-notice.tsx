import { Button } from "@grade10/design-system/components/forms/button";
import { BookingNotice } from "../appointment-booking/booking-notice";

type TicketCodeUsedUpNoticeCopy = {
  /** `The last use of SPRING20 was just taken.` */
  title: string;
  /** `The total is back to HK$1,150.00.` */
  body: string;
  /** Pays the full total: `Pay HK$1,150.00`. */
  payFull: string;
  /** `Remove Code`. */
  removeCode: string;
};

type TicketCodeUsedUpNoticeProps = {
  copy: TicketCodeUsedUpNoticeCopy;
  /** Bumped on each repeat: the notice shakes once. */
  attempt?: number;
  /** The full-price payment is on its way: Pay waits. */
  paying?: boolean;
  onPayFull: () => void;
  onRemoveCode: () => void;
  className?: string;
};

/** Pay found the code's last use gone to another buyer: pay the full total,
 * or take the code off. */
function TicketCodeUsedUpNotice({
  copy,
  attempt,
  paying = false,
  onPayFull,
  onRemoveCode,
  className,
}: TicketCodeUsedUpNoticeProps) {
  return (
    <BookingNotice
      actions={
        <>
          <Button loading={paying} onClick={onPayFull} size="sm" type="button">
            {copy.payFull}
          </Button>
          <Button
            disabled={paying}
            onClick={onRemoveCode}
            size="sm"
            type="button"
            variant="outline"
          >
            {copy.removeCode}
          </Button>
        </>
      }
      attempt={attempt}
      body={copy.body}
      className={className}
      title={copy.title}
    />
  );
}

export type { TicketCodeUsedUpNoticeCopy, TicketCodeUsedUpNoticeProps };
export { TicketCodeUsedUpNotice };
