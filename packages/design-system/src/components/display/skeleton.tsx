import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const skeletonVariants = cva("animate-pulse rounded-md bg-accent", {
  variants: {
    shape: {
      text: "h-4 w-18",
      line: "h-4 w-full",
      block: "h-40 w-full",
    },
  },
  defaultVariants: {
    shape: "block",
  },
});

type SkeletonProps = React.ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants>;

/**
 * A placeholder for content that has not resolved yet. It announces itself as a
 * busy status so a screen reader is not left on a silent region.
 */
function Skeleton({ className, shape = "block", ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-busy="true"
      aria-label="Loading"
      role="status"
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    />
  );
}

export type { SkeletonProps };
export { Skeleton, skeletonVariants };
