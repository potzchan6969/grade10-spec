import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { Minus, Plus } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

type StepperProps = Omit<ComponentProps<"div">, "onChange"> & {
  /** Displayed quantity. The consumer owns the value. */
  value: number;
  onValueChange?: (value: number) => void;
  /** Inclusive lower bound. The decrement control disables at this value. */
  min?: number;
  /** Inclusive upper bound. The increment control disables at this value. */
  max?: number;
  disabled?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
};

/**
 * Quantity stepper. Figma (`4208:2122`) has one axis, `isDisabled`. The minus
 * and plus buttons disable independently when `value` sits on `min` or `max`.
 */
function Stepper({
  className,
  value,
  onValueChange,
  min = 1,
  max,
  disabled = false,
  decrementLabel = "Decrease quantity",
  incrementLabel = "Increase quantity",
  ...props
}: StepperProps) {
  const atMin = value <= min;
  const atMax = max != null && value >= max;

  return (
    <div
      data-slot="stepper"
      data-disabled={disabled || undefined}
      className={cn(
        "flex h-8 w-full items-center justify-between rounded-(--radius-sm) px-1",
        disabled
          ? "bg-disabled text-disabled-foreground"
          : "bg-foreground text-primary-foreground",
        className,
      )}
      {...props}
    >
      <IconButton
        aria-label={decrementLabel}
        className={
          disabled ? "text-disabled-foreground" : "text-primary-foreground"
        }
        disabled={disabled || atMin}
        onClick={() => onValueChange?.(value - 1)}
        size="xs"
        variant="ghost"
      >
        <Minus aria-hidden size={12} weight="bold" />
      </IconButton>
      <span
        data-slot="stepper-value"
        className="min-w-px flex-1 text-center text-sm font-medium"
      >
        {value}
      </span>
      <IconButton
        aria-label={incrementLabel}
        className={
          disabled ? "text-disabled-foreground" : "text-primary-foreground"
        }
        disabled={disabled || atMax}
        onClick={() => onValueChange?.(value + 1)}
        size="xs"
        variant="ghost"
      >
        <Plus aria-hidden size={12} weight="bold" />
      </IconButton>
    </div>
  );
}

export type { StepperProps };
export { Stepper };
