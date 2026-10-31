import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { fillCopy } from "./event-page-copy";

type EventPhoneOrderBarCopy = {
  /** The bar's region name: `Order total`. */
  region: string;
  /** `Continue`. */
  continue: string;
  /** `You save {amount}`. */
  youSave: string;
};

type EventPhoneOrderBarProps = {
  copy: EventPhoneOrderBarCopy;
  /** `HK$950.00`, or `Free`. */
  total: string;
  /** The early-bird saving: `HK$250.00`. */
  saving?: string;
  /** The jump to Your Order: `3 tickets, see order`. */
  seeOrder: string;
  /** Where `seeOrder` jumps: Your Order's anchor. */
  orderHref?: string;
  onContinue: () => void;
  busy?: boolean;
  className?: string;
};

/**
 * The bar pinned to the foot of a phone once a ticket is chosen: the total,
 * the early-bird saving under it, `N tickets, see order` (a jump to Your
 * Order) and Continue. The page pins it; it draws nothing wider than a
 * phone on the event page.
 */
function EventPhoneOrderBar({
  copy,
  total,
  saving,
  seeOrder,
  orderHref = "#order",
  onContinue,
  busy,
  className,
}: EventPhoneOrderBarProps) {
  return (
    <section
      aria-label={copy.region}
      className={cn(
        "flex items-center gap-3 border-t border-border bg-card px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-16px_color-mix(in_oklab,var(--foreground)_35%,transparent)]",
        className,
      )}
      data-slot="event-phone-order-bar"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="inline-flex flex-wrap items-baseline gap-x-2">
          <span className="text-xl leading-7 font-bold">{total}</span>
          {saving ? (
            <span className="text-[13px] leading-[18px] font-semibold tabular-nums">
              {fillCopy(copy.youSave, { amount: saving })}
            </span>
          ) : null}
        </span>
        <a
          className="text-sm leading-5 text-secondary-foreground underline underline-offset-3"
          href={orderHref}
        >
          {seeOrder}
        </a>
      </div>
      <Button loading={busy} onClick={onContinue} size="lg">
        {copy.continue}
      </Button>
    </section>
  );
}

export type { EventPhoneOrderBarCopy, EventPhoneOrderBarProps };
export { EventPhoneOrderBar };
