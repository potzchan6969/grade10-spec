import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps } from "react";

type StepperProps = ComponentProps<"div">;

/**
 * Horizontal multi-step progress indicator shell.
 *
 * Figma component `Stepper` (`5010:5637`). Non-interactive — compose one or
 * more `Step` children in order. The slot accepts as many steps as needed.
 *
 * It is the list its `Step`s are items of, so a reader hears how many stages
 * there are and which one is current.
 */
function Stepper({ className, children, ...props }: StepperProps) {
  return (
    <div
      className={cn("flex w-full items-start", className)}
      data-slot="stepper"
      role="list"
      {...props}
    >
      {children}
    </div>
  );
}

export type { StepperProps };
export { Stepper };
