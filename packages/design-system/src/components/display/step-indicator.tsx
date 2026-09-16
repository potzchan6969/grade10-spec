import { CheckboxButton } from "@grade10/design-system/components/forms/checkbox-button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

// Figma set `Step Indicator` (`5010:5570`). Axis: `states`
// (`upcoming` | `progress` | `completed`). Upcoming and completed nest
// Checkbox Button (`2176:4089`); progress draws concentric rings with ping.
const stepIndicatorVariants = cva("relative shrink-0", {
  variants: {
    state: {
      upcoming: "inline-flex",
      progress: "size-4",
      completed: "inline-flex",
    },
  },
  defaultVariants: {
    state: "upcoming",
  },
});

type StepIndicatorState = NonNullable<
  VariantProps<typeof stepIndicatorVariants>["state"]
>;

type StepIndicatorProps = Omit<ComponentProps<"span">, "children"> &
  VariantProps<typeof stepIndicatorVariants>;

/**
 * Visual indicator for a single step's state within a stepper.
 *
 * Figma set `Step Indicator` (`5010:5570`). Decorative — the parent `Step`
 * carries the readable label and description. `progress` uses a subtle ping
 * on the outer ring instead of a static drop shadow.
 */
function StepIndicator({
  className,
  state = "upcoming",
  ...props
}: StepIndicatorProps) {
  if (state === "progress") {
    return (
      <span
        aria-hidden
        className={cn(stepIndicatorVariants({ state }), className)}
        data-slot="step-indicator"
        data-state={state}
        {...props}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-primary opacity-35 animate-ping motion-reduce:animate-none"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-primary bg-background"
        />
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        />
      </span>
    );
  }

  if (state === "completed") {
    return (
      <span
        aria-hidden
        className={cn(stepIndicatorVariants({ state }), className)}
        data-slot="step-indicator"
        data-state={state}
        {...props}
      >
        {/*
          Decorative only — do not use `disabled` here. CheckboxButton's
          disabled styles apply Opacity/opacity-50, which would wash out the
          check and the empty ring. Upcoming and completed both keep full-
          strength `border-border`, matching the Step connector line.
        */}
        <CheckboxButton checked className="pointer-events-none" tabIndex={-1} />
      </span>
    );
  }

  if (state === "upcoming") {
    return (
      <span
        aria-hidden
        className={cn(stepIndicatorVariants({ state }), className)}
        data-slot="step-indicator"
        data-state={state}
        {...props}
      >
        <CheckboxButton className="pointer-events-none" tabIndex={-1} />
      </span>
    );
  }
}

export type { StepIndicatorProps, StepIndicatorState };
export { StepIndicator, stepIndicatorVariants };
