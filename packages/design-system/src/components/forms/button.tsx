import { cn } from "@acetrader/design-system/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:text-disabled-foreground aria-invalid:border-destructive-border aria-invalid:ring-3 aria-invalid:ring-destructive-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary-muted text-primary-muted-foreground hover:bg-primary-muted-hover disabled:bg-disabled",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        secondary:
          "bg-muted text-muted-foreground hover:bg-muted-hover aria-expanded:bg-muted-hover disabled:bg-disabled",
        ghost:
          "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "bg-destructive-muted text-destructive-foreground hover:bg-destructive-muted-hover disabled:bg-disabled",
      },
      size: {
        // Figma binds both small rungs to `Radius/radius-sm` (4px). The
        // `rounded-sm`/`rounded-md` utilities cannot express that: theme.preamble.css
        // derives the whole scale proportionally from `--radius`, so they compile to
        // calc(--radius * 0.6) and calc(--radius * 0.8) — 4.8px and 6.4px against the
        // acetrader `--radius` of 8px. Bind the Foundation primitive directly instead.
        xs: "h-6 gap-1 rounded-(--radius-sm) px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-2 rounded-(--radius-sm) px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-12 gap-2 rounded-lg px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
  size = "default",
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
