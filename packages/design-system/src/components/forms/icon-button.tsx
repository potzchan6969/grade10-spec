import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Figma's Icon Button (`2159:3195`) sits on the Button page but is a separate
// published set with its own axes: a square box, and rungs at `md` (40) and
// `sm` (32). `xs` remains for in-tree callers the set no longer draws.
const iconButtonVariants = cva(
  // Both rungs bind `Radius/radius-sm` (4px), which the `rounded-sm` utility
  // cannot express — theme.preamble.css derives that scale from `--radius`.
  // Bind the Foundation primitive directly, as button.tsx does.
  "group/icon-button inline-flex shrink-0 items-center justify-center rounded-(--radius-sm) border border-transparent bg-clip-padding text-accent-foreground transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary),white_5%)] aria-expanded:bg-[color-mix(in_oklab,var(--secondary),white_5%)] disabled:bg-disabled",
        outline: "border-border hover:bg-accent aria-expanded:bg-accent",
        ghost: "hover:bg-accent aria-expanded:bg-accent",
      },
      size: {
        md: "size-10 [&_svg:not([class*='size-'])]:size-4",
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
