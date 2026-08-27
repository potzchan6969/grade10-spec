import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { X } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

// Figma set `Chip` (`4396:5319`). The only VARIANT axis is `state` (default /
// hover), which is a CSS pseudo-state, so there is no cva option behind it.
//
// Geometry: `Size/size-8` (32) height, `Gap/gap-3` (12) horizontal padding,
// `Gap/gap-1-5` (6) between label and dismiss, `Radius/radius-full`. Fill is
// `Base/primary` with `Base/primary-foreground` label; type is `text-sm/medium`
// (14/20). The set always draws a dismiss X (Outline/Bold, 14) — nested
// instance, not a BOOLEAN — and hover adds the same primary inner glow as
// Button (`#FFFFFF4D`, radius 20). There is no size, selected, or disabled
// axis; selectable chips previously lived as Figma `ChipSelectable` /
// `FilterChip`, which has been removed from the file.
const chipVariants = cva(
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-(--radius-full) border border-transparent bg-primary bg-clip-padding px-3 text-sm leading-5 font-medium text-primary-foreground whitespace-nowrap [text-box-trim:trim-both] [text-box-edge:cap_alphabetic] outline-none select-none transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[inset_0_0_20px_rgb(255_255_255_/_30%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px motion-reduce:transition-[box-shadow] motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
);

type ChipProps = ButtonPrimitive.Props & {
  children?: ReactNode;
};

/**
 * Small, optionally removable tag for filters and selections.
 *
 * That is the Figma description; the set itself draws the dismiss X on every
 * variant with no BOOLEAN behind it, so nothing here can turn it off. Raise
 * that with the designer rather than adding a prop the set does not define.
 */
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
