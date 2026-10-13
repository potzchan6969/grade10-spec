import { cn } from "@grade10/design-system/lib/utils";
import { Warning } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type BookingNoticeProps = {
  title: ReactNode;
  body?: ReactNode;
  /** Presses under the body: the way on. */
  actions?: ReactNode;
  /**
   * Bumped by the consumer on each repeat of what the notice answers: the
   * notice shakes once to say it heard the press again.
   */
  attempt?: number;
  className?: string;
};

/** What stopped the booking, in the warning tone: a time just taken, a visit
 * already held, too many tries. Slides in, and shakes on a repeat. */
function BookingNotice({
  title,
  body,
  actions,
  attempt = 0,
  className,
}: BookingNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl bg-warning-muted px-3.5 py-3 text-(--yellow-700)",
        attempt === 0
          ? "animate-in slide-in-from-top-1 duration-200"
          : "motion-safe:animate-[booking-shake_320ms_cubic-bezier(.2,0,0,1)_both]",
        className,
      )}
      data-slot="booking-notice"
      key={attempt}
      role="alert"
    >
      <style>
        {
          "@keyframes booking-shake{0%,100%{transform:none}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}"
        }
      </style>
      <Warning aria-hidden className="mt-px shrink-0" size={20} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm leading-5 font-bold tabular-nums">
          {title}
        </span>
        {body ? (
          <span className="text-sm leading-5 tabular-nums">{body}</span>
        ) : null}
        {actions ? (
          <div className="mt-2 flex flex-wrap gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

export type { BookingNoticeProps };
export { BookingNotice };
