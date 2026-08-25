import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const statusIndicatorVariants = cva(
  "relative shrink-0 rounded-full border-2 border-background",
  {
    variants: {
      type: {
        dot: "size-2",
        count:
          "inline-flex h-4 min-w-4 items-center justify-center px-1 text-center text-xs/4 font-medium whitespace-nowrap",
      },
      variant: {
        default: "bg-primary text-primary-foreground",
        error: "bg-destructive text-destructive-foreground",
        brand: "bg-accent-foreground text-primary-foreground",
      },
    },
    defaultVariants: {
      type: "dot",
      variant: "default",
    },
  },
);

type StatusIndicatorProps = Omit<ComponentProps<"span">, "children"> &
  VariantProps<typeof statusIndicatorVariants> & {
    children?: ReactNode;
  };

/**
 * Status pip or count overlay. Figma set `StatusIndicator` (`4174:37`) has
 * `type` (`dot` | `count`) and `variant` (`default` | `error` | `brand`). The
 * count contents are consumer-supplied; the pip has none.
 */
function StatusIndicator({
  className,
  type = "dot",
  variant = "default",
  children,
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      data-slot="status-indicator"
      data-type={type}
      data-variant={variant}
      className={cn(statusIndicatorVariants({ type, variant }), className)}
      {...props}
    >
      {type === "count" ? children : null}
    </span>
  );
}

export type { StatusIndicatorProps };
export { StatusIndicator, statusIndicatorVariants };
