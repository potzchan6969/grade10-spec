import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

// Figma set `Status Indicator` (`4174:37`). Axes: `type` (`dot` | `count`) and
// `variant` (`default` | `error` | `brand`). Every rung is
// `Radius/radius-full` with a 2px `Base/background` outside stroke. The root
// is `inline-flex` so `size-*` / `min-w-*` apply (a bare inline span ignores
// them). The stroke is `ring-2 ring-background` so the fill keeps Figma's box;
// `border-background` claims that stroke for design-sync without insetting it.
// Dot is `Size/size-2` (8). Count is `Size/size-4` (16) min — `h-4 min-w-4` —
// with `Gap/gap-1` horizontal padding inside the box and `text-xs/medium`.
// Fills: default `Base/muted` + `Base/foreground` label; error
// `Status/destructive` + `Status/destructive-foreground`; brand
// `Base/accent-foreground` + `Base/primary-foreground`.
const statusIndicatorVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-(--radius-full) border-background ring-2 ring-background",
  {
    variants: {
      type: {
        dot: "size-2",
        count:
          "h-4 min-w-4 px-1 text-center text-xs/4 font-medium whitespace-nowrap",
      },
      variant: {
        default: "bg-muted text-foreground",
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
 * Status pip or count overlay for notifications and presence.
 *
 * Figma (`4174:37`) has no set description — this is the written stand-in.
 * `type` is `dot` | `count`; `variant` is `default` | `error` | `brand`. Count
 * contents are consumer-supplied (Figma's `label`); the pip has none. Count
 * is at least `Size/size-4` wide (`min-w-4`) so a single digit stays circular.
 *
 * `default` draws `Base/muted` over `Base/foreground`, following Badge off
 * `Base/primary` once primary became the brand orange. The ring is
 * `Base/background`, so a pip stays legible on any surface it overlays.
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
