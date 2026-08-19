import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

// Figma draws every disabled variant as that variant's own fill and text at
// `Opacity/opacity-50` — node `86:3694` (primary), `86:3690` (secondary) and
// `86:3592` (ghost) each bind their normal colour pair plus `Opacity/opacity-50`
// and bind no grey. So disabled is one base rule, not a per-variant colour swap;
// the older `disabled:bg-disabled` / `disabled:text-disabled-foreground` pair
// painted slate-700 that the component set never draws.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive-border aria-invalid:ring-3 aria-invalid:ring-destructive-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklab,var(--primary),black_10%)]",
        outline:
          "border-border text-accent-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary),white_5%)] aria-expanded:bg-[color-mix(in_oklab,var(--secondary),white_5%)]",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[color-mix(in_oklab,var(--destructive),black_10%)]",
      },
      size: {
        // Figma binds sm and md to `Radius/radius-sm` (4px). The `rounded-sm`
        // utility cannot express that: theme.preamble.css derives the whole scale
        // proportionally from `--radius`, so it compiles to calc(--radius * 0.6) —
        // 4.8px against the grade10 `--radius` of 8px. Bind the Foundation
        // primitive directly instead. `lg` binds `Radius/radius-lg`, which is
        // `--radius` itself, so `rounded-lg` is exact.
        sm: "h-8 gap-1 rounded-(--radius-sm) px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        md: "h-10 gap-2 rounded-(--radius-sm) px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 rounded-lg px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Shows a leading spinner and disables the button. Replaces `leading` and suppresses `trailing`, matching Figma's Loading state. */
    loading?: boolean;
    /** Icon rendered before `children`. */
    leading?: ReactNode;
    /** Icon rendered after `children`. */
    trailing?: ReactNode;
  };

function Button({
  className,
  variant = "default",
  size = "lg",
  loading = false,
  leading,
  trailing,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
      ) : (
        leading
      )}
      {children}
      {loading ? null : trailing}
    </ButtonPrimitive>
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
