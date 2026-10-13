import { cn } from "@grade10/design-system/lib/utils";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { type ReactNode, useId } from "react";
import { INK_2 } from "./booking-look";

type BookingPayNoticeCopy = {
  /** `Pay now`. */
  title: string;
  /** Where the money is taken: `You pay on a secure Stripe page…`. */
  via: string;
};

type BookingPayNoticeProps = {
  copy: BookingPayNoticeCopy;
  /** What is charged now, worded: `HK$100.00 deposit`. */
  amount: ReactNode;
  /** When it comes back, in one sentence. */
  refund: ReactNode;
  className?: string;
};

/** What a paid service takes at booking, and when it is given back: drawn
 * over the consent line before the collector leaves to pay. */
function BookingPayNotice({
  copy,
  amount,
  refund,
  className,
}: BookingPayNoticeProps) {
  const headingId = useId();
  return (
    // biome-ignore lint/a11y/useSemanticElements: a box of facts under its heading, not form controls
    <div
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-1.5 rounded-xl bg-primary-muted p-4 shadow-[inset_0_0_0_1px_var(--primary-muted-hover)]",
        className,
      )}
      data-slot="booking-pay-notice"
      role="group"
    >
      <h3 className="m-0 text-[15px] leading-5 font-bold" id={headingId}>
        {copy.title}
      </h3>
      <span className="text-xl leading-[26px] font-bold tabular-nums">
        {amount}
      </span>
      <span className={cn("flex items-start gap-2 text-sm leading-5", INK_2)}>
        <ArrowCounterClockwise
          aria-hidden
          className="mt-[3px] shrink-0"
          size={14}
        />
        {refund}
      </span>
      <span className="text-[13px] leading-[18px] text-secondary-foreground">
        {copy.via}
      </span>
    </div>
  );
}

export type { BookingPayNoticeCopy, BookingPayNoticeProps };
export { BookingPayNotice };
