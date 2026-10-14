import { cn } from "@grade10/design-system/lib/utils";
import { Check } from "@phosphor-icons/react";

type BookingStepDotsCopy = {
  /** The list's name: `Booking steps`. */
  label: string;
  /** A done step's name: `Step {n}, {label}, done. Go back to it.` */
  doneAria: string;
};

type BookingStepDotsProps<Id extends string> = {
  copy: BookingStepDotsCopy;
  steps: readonly { id: Id; label: string }[];
  current: Id;
  /** Goes back to a done step. */
  onStep?: (id: Id) => void;
  /** A booking is in flight: done steps do not go back. */
  busy?: boolean;
  className?: string;
};

const STEP = "relative min-w-0 flex-1";

/**
 * The line from the step before's dot to this one's: centred on the 24px dots
 * below the 2px top pad, stopping 6px short of each.
 */
const LINE =
  "before:absolute before:top-[13px] before:right-[calc(50%+18px)] before:left-[calc(-50%+18px)] before:h-0.5 before:rounded-full before:content-['']";

/** A line reached: up to a done step or the current one. */
const INK = "before:bg-foreground";

/** A line still to walk. */
const HAIRLINE = "before:bg-border-strong";

/** The flow's steps as numbered dots, each a column joined to the one before
 * by a line: done steps tick and go back, the current one is the brand dot,
 * steps to come are rings. The line up to the current step is drawn in ink,
 * the rest in the hairline. */
function BookingStepDots<Id extends string>({
  copy,
  steps,
  current,
  onStep,
  busy = false,
  className,
}: BookingStepDotsProps<Id>) {
  const at = steps.findIndex((step) => step.id === current);
  return (
    <ol
      aria-label={copy.label}
      className={cn("m-0 flex list-none p-0", className)}
      data-slot="booking-steps"
    >
      {steps.map((step, index) => {
        const n = String(index + 1);
        if (index < at) {
          return (
            <li className={cn(STEP, index > 0 && LINE, INK)} key={step.id}>
              <button
                aria-label={copy.doneAria
                  .replace("{n}", n)
                  .replace("{label}", step.label)}
                className="group relative z-[1] flex min-h-12 w-full cursor-pointer flex-col items-center gap-1.5 bg-transparent py-0.5 outline-none disabled:cursor-not-allowed"
                disabled={busy || !onStep}
                onClick={() => onStep?.(step.id)}
                type="button"
              >
                <span className="grid size-6 place-items-center rounded-full bg-foreground text-background transition-[box-shadow,transform] duration-150 ease-out group-hover:shadow-[0_0_0_4px_var(--muted)] group-focus-visible:ring-3 group-focus-visible:ring-ring/50 group-active:scale-95 group-disabled:shadow-none group-disabled:scale-100 motion-reduce:transition-none">
                  <Check aria-hidden size={14} weight="bold" />
                </span>
                <span className="text-center text-xs leading-4 text-foreground decoration-border-strong underline-offset-[3px] group-hover:underline group-disabled:no-underline">
                  {step.label}
                </span>
              </button>
            </li>
          );
        }
        const now = index === at;
        return (
          <li
            className={cn(STEP, index > 0 && LINE, now ? INK : HAIRLINE)}
            key={step.id}
          >
            <span
              aria-current={now ? "step" : undefined}
              className="relative z-[1] flex min-h-12 flex-col items-center gap-1.5 py-0.5"
            >
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-[11px] font-bold tabular-nums",
                  now
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-secondary-foreground shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
                )}
              >
                {n}
              </span>
              <span
                className={cn(
                  "text-center text-xs leading-4",
                  now
                    ? "font-bold text-foreground"
                    : "text-secondary-foreground",
                )}
              >
                {step.label}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export type { BookingStepDotsCopy, BookingStepDotsProps };
export { BookingStepDots };
