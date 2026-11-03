import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const pageFrameVariants = cva(
  "mx-auto flex w-full flex-col gap-8 px-4 pt-6 sm:gap-12 sm:px-8 sm:pt-8",
  {
    variants: {
      size: {
        default: "max-w-7xl",
        narrow: "max-w-5xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type PageFrameProps = React.ComponentProps<"div"> &
  VariantProps<typeof pageFrameVariants>;

/**
 * The column a detail page sits in under the nav: centred, width-capped, with
 * the side padding, top padding and section gap every detail page shares.
 *
 * It owns no bottom padding, because that follows the page's own footer or
 * actions; a caller adds it through `className`. A page's loading and error
 * states render the same frame, so its content does not move when the data
 * arrives.
 */
function PageFrame({ className, size, ...props }: PageFrameProps) {
  return (
    <div
      data-slot="page-frame"
      className={cn(pageFrameVariants({ size }), className)}
      {...props}
    />
  );
}

export type { PageFrameProps };
export { PageFrame, pageFrameVariants };
