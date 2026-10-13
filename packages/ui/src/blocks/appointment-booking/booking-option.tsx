import { RadioButton } from "@grade10/design-system/components/forms/radio-button";
import { cn } from "@grade10/design-system/lib/utils";
import { Check, Clock } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { INK_2 } from "./booking-look";

type BookingOptionProps = {
  value: string;
  title: ReactNode;
  /** The clock line under the title: a length or today's hours. */
  clock?: ReactNode;
  children?: ReactNode;
  /** Picking the picked card again reports it again. */
  onRepick?: () => void;
  picked: boolean;
};

/**
 * One tile of a booking picker: the name with its pick dot, a clock line, and
 * whatever the picker adds under it. A radio inside the picker's group, so
 * arrows move between tiles. Internal.
 */
function BookingOption({
  value,
  title,
  clock,
  children,
  onRepick,
  picked,
}: BookingOptionProps) {
  return (
    <RadioButton
      className={cn(
        "flex h-full w-full cursor-pointer flex-col items-stretch gap-1.5 rounded-xl bg-card px-4 py-3.5 text-left text-foreground transition-[box-shadow] duration-100 focus-visible:ring-3 focus-visible:ring-ring/50 [&>span:first-child]:hidden",
        picked
          ? "shadow-[inset_0_0_0_2px_var(--primary)]"
          : "shadow-[inset_0_0_0_1px_var(--border-strong)] hover:shadow-[inset_0_0_0_1px_var(--foreground)]",
      )}
      data-slot="booking-option"
      onClick={() => {
        if (picked) onRepick?.();
      }}
      value={value}
    >
      <span className="flex items-start gap-3">
        <span className="min-w-0 flex-1 text-[15px] leading-5 font-bold">
          {title}
        </span>
        <span
          aria-hidden
          className={cn(
            "grid size-5 flex-none place-items-center rounded-full",
            picked
              ? "bg-primary text-primary-foreground"
              : "shadow-[inset_0_0_0_1.5px_var(--border-strong)]",
          )}
        >
          {picked ? <Check size={12} weight="bold" /> : null}
        </span>
      </span>
      {clock ? (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] leading-[18px] tabular-nums",
            INK_2,
          )}
        >
          <Clock aria-hidden size={14} />
          {clock}
        </span>
      ) : null}
      {children}
    </RadioButton>
  );
}

export { BookingOption };
