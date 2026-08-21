import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

/**
 * Figma set `Chip` (`4396:5319`). The only VARIANT axis is `state` (default /
 * hover), which is a CSS pseudo-state, so there is no cva option behind it.
 *
 * The set always draws a dismiss X — it is a nested instance, not a BOOLEAN —
 * and hover uses the same primary inner glow as Button. There is no size or
 * selected axis; `FilterChip` remains the selectable chip.
 */
const chipVariants = cva(
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary px-3 font-medium text-sm text-primary-foreground whitespace-nowrap outline-none select-none transition-[box-shadow] duration-150 ease-out hover:shadow-[inset_0_0_20px_rgb(255_255_255_/_30%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
);

type ChipProps = ButtonPrimitive.Props & {
  children?: ReactNode;
};

function Chip({ className, type = "button", children, ...props }: ChipProps) {
  return (
    <ButtonPrimitive
      className={cn(chipVariants(), className)}
      data-slot="chip"
      type={type}
      {...props}
    >
      {children}
      <X aria-hidden size={14} weight="bold" />
    </ButtonPrimitive>
  );
}

export type { ChipProps };
export { Chip, chipVariants };
