import { cn } from "@acetrader/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: "md",
  },
});

type StackProps = React.ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & {
    /** `align-items`. Passed through as a style so callers keep arbitrary values. */
    align?: React.CSSProperties["alignItems"];
    /** `justify-content`. Passed through as a style so callers keep arbitrary values. */
    justify?: React.CSSProperties["justifyContent"];
    wrap?: boolean;
  };

/** One-dimensional layout with a gap rung from the spacing scale. */
function Stack({
  className,
  direction = "vertical",
  gap = "md",
  align,
  justify,
  wrap = false,
  style,
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      className={cn(stackVariants({ direction, gap }), className)}
      style={{
        alignItems: align,
        flexWrap: wrap ? "wrap" : undefined,
        justifyContent: justify,
        ...style,
      }}
      {...props}
    />
  );
}

export type { StackProps };
export { Stack, stackVariants };
