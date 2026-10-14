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

/** The flow's steps as numbered dots, each a column: done steps tick and go
 * back, the current one is the brand dot, steps to come are rings. */
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
      className={cn("m-0 flex list-none gap-1 p-0", className)}
      data-slot="booking-steps"
    >
      {steps.map((step, index) => {
        const n = String(index + 1);
        if (index < at) {
          return (
            <li className="min-w-0 flex-1" key={step.id}>
              <button
                aria-label={copy.doneAria
                  .replace("{n}", n)
                  .replace("{label}", step.label)}
                className="flex min-h-12 w-full cursor-pointer flex-col items-center gap-1.5 rounded-lg bg-transparent py-0.5 transition-colors duration-100 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed"
                disabled={busy || !onStep}
                onClick={() => onStep?.(step.id)}
                type="button"
              >
                <span className="grid size-6 place-items-center rounded-full bg-foreground text-background">
                  <Check aria-hidden size={14} weight="bold" />
                </span>
                <span className="text-center text-xs leading-4 text-foreground">
                  {step.label}
                </span>
              </button>
            </li>
          );
        }
        const now = index === at;
        return (
          <li className="min-w-0 flex-1" key={step.id}>
            <span
              aria-current={now ? "step" : undefined}
              className="flex min-h-12 flex-col items-center gap-1.5 py-0.5"
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
