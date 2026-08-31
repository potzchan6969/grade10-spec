import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

// Figma set `Chip` (`4396:5319`). VARIANT axes are `variant` (default / primary)
// and `state` (default / hover), the latter a CSS pseudo-state with no prop
// behind it. Geometry: `Size/size-8` (32) height, `Gap/gap-3` (12) horizontal
// padding, `Gap/gap-1-5` (6) between label and dismiss, `Radius/radius-full`.
// Type is `text-sm/medium` (14/20). The set always draws a dismiss X
// (Outline/Bold, 14) — nested instance, not a BOOLEAN.
//
// `default` is `Base/muted` fill with `Base/foreground` label and
// `Base/secondary-foreground` dismiss; hover swaps to `Base/background-subtle`.
// `primary` is `Base/primary` / `Base/primary-foreground` with the same inner
// glow on hover as Button (`#FFFFFF4D`, radius 20). There is no size,
// selected, or disabled axis.
const chipVariants = cva(
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-(--radius-full) border border-transparent bg-clip-padding px-3 text-sm leading-5 font-medium whitespace-nowrap [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] outline-none select-none transition-[background-color,box-shadow,transform] duration-150 ease-out focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px motion-reduce:transition-[background-color,box-shadow] motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-muted text-foreground hover:bg-background-subtle [&_svg]:text-secondary-foreground",
        primary:
          "bg-primary text-primary-foreground hover:shadow-[inset_0_0_20px_rgb(255_255_255_/_30%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ChipProps = ButtonPrimitive.Props &
  VariantProps<typeof chipVariants> & {
    children?: ReactNode;
  };

/**
 * Small, optionally removable tag for filters and selections.
 *
 * That is the Figma description; the set itself draws the dismiss X on every
 * variant with no BOOLEAN behind it, so nothing here can turn it off. Raise
 * that with the designer rather than adding a prop the set does not define.
 */
function Chip({
  className,
  variant = "default",
  type = "button",
  children,
  ...props
}: ChipProps) {
  return (
    <ButtonPrimitive
      className={cn(chipVariants({ variant }), className)}
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
