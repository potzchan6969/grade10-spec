import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps } from "react";

type StepperProps = ComponentProps<"ol">;

/**
 * Horizontal multi-step progress indicator shell.
 *
 * Figma component `Stepper` (`5010:5637`). Non-interactive — compose one or
 * more `Step` children in order. The slot accepts as many steps as needed.
 *
 * It is the ordered list its `Step`s are items of, so a reader hears how many
 * stages there are, in which order, and which one is current.
 */
function Stepper({ className, children, ...props }: StepperProps) {
  return (
    <ol
      className={cn("m-0 flex w-full list-none items-start p-0", className)}
      data-slot="stepper"
      {...props}
    >
      {children}
    </ol>
  );
}

export type { StepperProps };
export { Stepper };
