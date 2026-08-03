import { cn } from "@acetrader/design-system/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

// Figma's Icon Button (`2159:3195`) sits on the Button page but is a separate
// published set with its own axes: a square box, only two tones, and only the
// two smaller rungs. It closes the icon-button gap `adopt-figma-button-styling`
// recorded when it deleted Button's `icon-*` rungs as undesigned.
const iconButtonVariants = cva(
  // Both rungs bind `Radius/radius-sm` (4px), which the `rounded-sm` utility
  // cannot express — theme.preamble.css derives that scale from `--radius`.
  // Bind the Foundation primitive directly, as button.tsx does.
  "group/icon-button inline-flex shrink-0 items-center justify-center rounded-(--radius-sm) border border-transparent bg-clip-padding text-accent-foreground transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // Neither tone carries a fill at rest; they differ only by the border,
      // and both take `Base/accent` on hover.
      variant: {
        outline: "border-border hover:bg-accent aria-expanded:bg-accent",
        ghost: "hover:bg-accent aria-expanded:bg-accent",
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-3.5",
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
