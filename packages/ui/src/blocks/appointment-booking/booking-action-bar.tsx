import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { INK_2, PILL_OUTLINE, PILL_PRIMARY } from "./booking-look";

type BookingActionBarProps = {
  /** Back to the step before; omitted on the first step. */
  back?: { label: string; onClick: () => void };
  /**
   * The step's one act. With `form` it submits that form, so a form drawn
   * above the bar is sent by the bar's press.
   */
  primary: { label: ReactNode; onClick?: () => void; form?: string };
  /** What is missing before the act can run: drawn over the presses. */
  error?: ReactNode;
  /** Under the primary press: a slow write. */
  note?: ReactNode;
  /**
   * The bar's last lines, under both presses, in small print: what a paid
   * booking refunds and where it is paid. One line per entry.
   */
  footnotes?: readonly ReactNode[];
  /** A booking is in flight: the press spins and Back stays put. */
  busy?: boolean;
  /** Announces the note: a slow write says so as it happens. */
  noteLive?: boolean;
  className?: string;
};

/** The bar at the foot of every step: Back on the left, the step's act on
 * the right, what stops it above, a note under it and footnotes under all.
 * Sticks to the bottom. */
function BookingActionBar({
  back,
  primary,
  error,
  note,
  footnotes = [],
  busy = false,
  noteLive = false,
  className,
}: BookingActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-[4] mt-2 flex flex-col gap-2 border-t border-border bg-card pt-3 pb-4",
        className,
      )}
      data-slot="booking-action-bar"
    >
      {error ? (
        <span
          className="flex animate-in items-center gap-1.5 text-[13px] leading-[18px] text-destructive slide-in-from-top-1 duration-200"
          role="alert"
        >
          <span aria-hidden className="inline-flex shrink-0">
            <WarningCircle size={14} />
          </span>
          {error}
        </span>
      ) : null}
      <div className="flex items-start gap-2">
        {back ? (
          <button
            className={cn(PILL_OUTLINE, "flex-none pr-4 pl-2.5 text-[15px]")}
            disabled={busy}
            onClick={back.onClick}
            type="button"
          >
            <CaretLeft aria-hidden size={16} />
            {back.label}
          </button>
        ) : null}
        <div className="ml-auto flex max-w-[400px] flex-auto flex-col gap-1.5">
          <button
            aria-busy={busy || undefined}
            aria-disabled={busy || undefined}
            className={PILL_PRIMARY}
            form={primary.form}
            // A press that switches the step into a form's must not submit that
            // form: a new button per mode leaves the pressed one detached.
            key={primary.form ? "submit" : "button"}
            onClick={(event) => {
              if (busy) {
                event.preventDefault();
                return;
              }
              primary.onClick?.();
            }}
            type={primary.form ? "submit" : "button"}
          >
            {busy ? (
              <span aria-hidden className="inline-flex animate-spin">
                <CircleNotch size={16} />
              </span>
            ) : null}
            {primary.label}
          </button>
          {note ? (
            <span
              className={cn(
                "text-center text-[13px] leading-[18px] tabular-nums",
                INK_2,
              )}
              role={noteLive ? "status" : undefined}
            >
              {note}
            </span>
          ) : null}
        </div>
      </div>
      {footnotes.length > 0 ? (
        <div
          className="flex flex-col gap-0.5 text-[12px] leading-4 text-secondary-foreground"
          data-slot="booking-footnotes"
        >
          {footnotes.map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed lines in a fixed order
            <p className="m-0" key={index}>
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export type { BookingActionBarProps };
export { BookingActionBar };
