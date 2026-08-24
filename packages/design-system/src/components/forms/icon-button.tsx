import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Figma's Icon Button (`2159:3195`) sits on the Button page but is a separate
// published set: a square box that binds `Radius/radius-full` (a circle),
// rungs at `lg` (48 / 16px glyph), `md` (40 / 14px glyph) and `sm` (32 / 12px
// glyph), and a `primary` fill alongside secondary / outline / ghost. `xs`
// remains for in-tree callers the set no longer draws.
//
// Disabled is the variant's own colours at `Opacity/opacity-50` — same rule as
// Button, including primary. Hover is `Custom/muted-hover` on the borderless
// and outline rungs, and an inset overlay on secondary; primary keeps
// `Base/primary` and the same inner glow Button uses.
const iconButtonVariants = cva(
  "group/icon-button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-(--radius-full) border border-transparent bg-clip-padding transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-[background-color,border-color,color,box-shadow,opacity] motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:shadow-[inset_0_0_20px_rgb(255_255_255_/_30%)]",
        secondary:
          "bg-muted text-muted-foreground hover:shadow-[inset_0_0_0_100vmax_var(--muted-hover)] aria-expanded:shadow-[inset_0_0_0_100vmax_var(--muted-hover)]",
        outline:
          "border-border text-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover",
        ghost:
          "text-muted-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover",
      },
      size: {
        lg: "size-12 [&_svg:not([class*='size-'])]:size-4",
        md: "size-10 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "size-8 [&_svg:not([class*='size-'])]:size-3",
        xs: "size-6 [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  },
);

type IconButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof iconButtonVariants>;

/**
 * An icon-only button. It has no visible label, so give it an accessible name —
 * either `aria-label`, or a visually hidden child alongside the icon.
 */
function IconButton({
  className,
  variant = "outline",
  size = "sm",
  ...props
}: IconButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="icon-button"
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export type { IconButtonProps };
export { IconButton, iconButtonVariants };
