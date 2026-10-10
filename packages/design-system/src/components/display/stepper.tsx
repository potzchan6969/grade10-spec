import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps } from "react";

type StepperOrientation = "horizontal" | "vertical";

type StepperProps = ComponentProps<"ol"> & {
  orientation?: StepperOrientation;
};

/**
 * Multi-step progress indicator shell.
 *
 * Figma set `Stepper` (`7046:5420`). Axis: `orientation` (`horizontal` |
 * `vertical`). Non-interactive — compose one or more `Step` children in order.
 * The slot accepts as many steps as needed.
 *
 * It is the ordered list its `Step`s are items of, so a reader hears how many
 * stages there are, in which order, and which one is current.
 */
function Stepper({
  className,
  orientation = "horizontal",
  children,
  ...props
}: StepperProps) {
  return (
    <ol
      className={cn(
        "m-0 flex w-full list-none items-start p-0",
        orientation === "vertical" && "flex-col",
        className,
      )}
      data-slot="stepper"
      data-orientation={orientation}
      {...props}
    >
      {children}
    </ol>
  );
}

export type { StepperProps };
export { Stepper };
