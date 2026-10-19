import { cn } from "@grade10/design-system/lib/utils";
import { PILL_OUTLINE } from "../appointment-booking/booking-look";
import { BookingNotice } from "../appointment-booking/booking-notice";

/** Why a Book press was refused: too many tries today, or a visit already
 * held — shown to its signed-in owner, or only said to a signed-out one. */
type VisitRefusal = "tries" | "held" | "heldOut";

type VisitRefusedBookCopy = {
  title: string;
  body?: string;
  /** The way on: call the shop, open the visit, or sign in. */
  action?: string;
};

type VisitRefusedBookProps = {
  copy: VisitRefusedBookCopy;
  refusal: VisitRefusal;
  /** Where the action leads, when it is a link. */
  actionHref?: string;
  /** What the action does, when it is a press. */
  onAction?: () => void;
  /** Bumped on each repeat press the refusal answers again: it shakes. */
  attempt?: number;
  className?: string;
};

/** What a refused Book press says, in the warning tone whatever the cause.
 * Email is not identity: signed out, a held visit only says its link went to
 * that inbox. */
function VisitRefusedBook({
  copy,
  refusal,
  actionHref,
  onAction,
  attempt,
  className,
}: VisitRefusedBookProps) {
  const action = !copy.action ? undefined : actionHref ? (
    <a className={cn(PILL_OUTLINE, "no-underline")} href={actionHref}>
      {copy.action}
    </a>
  ) : onAction ? (
    <button className={PILL_OUTLINE} onClick={onAction} type="button">
      {copy.action}
    </button>
  ) : undefined;
  return (
    <div className="contents" data-refusal={refusal}>
      <BookingNotice
        actions={action}
        attempt={attempt}
        body={copy.body}
        className={className}
        title={copy.title}
      />
    </div>
  );
}

export type { VisitRefusal, VisitRefusedBookCopy, VisitRefusedBookProps };
export { VisitRefusedBook };
