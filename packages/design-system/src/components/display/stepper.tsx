import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps } from "react";

type StepperProps = ComponentProps<"div">;

/**
 * Horizontal multi-step progress indicator shell.
 *
 * Figma component `Stepper` (`5010:5637`). Non-interactive — compose one or
 * more `Step` children in order. The slot accepts as many steps as needed.
 */
function Stepper({ className, children, ...props }: StepperProps) {
  return (
    <div
      className={cn("flex w-full items-start", className)}
      data-slot="stepper"
      {...props}
    >
      {children}
    </div>
  );
}

export type { StepperProps };
export { Stepper };
