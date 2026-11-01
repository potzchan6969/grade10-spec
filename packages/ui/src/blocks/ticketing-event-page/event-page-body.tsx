import { cn } from "@grade10/design-system/lib/utils";
import { Info } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type EventPageBodyCopy = {
  /** The passes' region name: `Passes`. */
  passes: string;
};

type EventPageBodyProps = {
  copy: EventPageBodyCopy;
  /** The `EventHeader`. */
  header: ReactNode;
  /** At the email's limit, above the passes: `One email can buy up to 8
   * tickets for this event.` */
  limitNote?: string;
  /** The `EventPassCard`s, VIP first; none on a canceled event. */
  passes?: ReactNode;
  /** The `EventGoodToKnow` under the passes. */
  goodToKnow?: ReactNode;
  /** The `EventOrderSummary`; none once the event stopped selling. */
  order?: ReactNode;
  /** The `EventPhoneOrderBar`, once a ticket is chosen: pinned to the foot,
   * on a phone only. */
  phoneBar?: ReactNode;
  className?: string;
};

/**
 * The event page under the site header: the event's header, then the passes
 * and what to know beside Your Order. Your Order moves under them on a
 * phone, where the order bar pins to the foot instead. The body lays out by
 * its own width, so it reads as a phone inside any narrow frame.
 */
function EventPageBody({
  copy,
  header,
  limitNote,
  passes,
  goodToKnow,
  order,
  phoneBar,
  className,
}: EventPageBodyProps) {
  return (
    <div
      className={cn("@container/page w-full", className)}
      data-slot="event-page-body"
    >
      <div className="mx-auto box-border flex w-full max-w-[1200px] flex-col gap-6 px-4 pt-5 pb-8 @min-[40rem]/page:gap-8 @min-[40rem]/page:px-5 @min-[40rem]/page:pt-8 @min-[40rem]/page:pb-16">
        {header}
        <div className="flex flex-wrap items-start gap-8">
          <section
            aria-label={copy.passes}
            className="flex min-w-0 flex-[999_1_560px] flex-col gap-4"
          >
            {limitNote ? (
              <p
                className="m-0 flex items-start gap-2 text-sm leading-5"
                role="status"
              >
                <span
                  aria-hidden
                  className="inline-flex mt-0.5 shrink-0 text-primary"
                >
                  <Info size={16} />
                </span>
                {limitNote}
              </p>
            ) : null}
            {passes}
            {goodToKnow ? <div className="mt-2">{goodToKnow}</div> : null}
          </section>
          {order ? (
            <div className="box-border max-w-full flex-[1_1_340px] @min-[40rem]/page:sticky @min-[40rem]/page:top-6">
              {order}
            </div>
          ) : null}
        </div>
        {phoneBar ? (
          <div className="sticky bottom-0 z-[5] -mx-4 -mb-8 @min-[40rem]/page:hidden">
            {phoneBar}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type { EventPageBodyCopy, EventPageBodyProps };
export { EventPageBody };
