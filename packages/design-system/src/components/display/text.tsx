import { cn } from "@acetrader/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const textVariants = cva("leading-snug", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
    },
    tone: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      muted: "text-disabled-foreground",
      success: "text-success-foreground",
      error: "text-error-foreground",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "regular",
    tone: "primary",
  },
});

type TextElement = "span" | "p" | "div" | "h2" | "h3";

// `HTMLAttributes<HTMLElement>` rather than `ComponentProps<"span">`: the tag is
// caller-chosen, and a span-specific ref type will not spread onto an h2.
type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    /** The rendered tag. Semantics stay with the caller; styling does not follow it. */
    as?: TextElement;
    /** Clamps to a single line with an ellipsis. */
    truncate?: boolean;
  };

/**
 * The typographic primitive the product components read from. Size, weight, and
 * tone are independent axes so a heading tag never implies a type scale.
 */
function Text({
  as: Tag = "span",
  className,
  size = "base",
  weight = "regular",
  tone = "primary",
  truncate = false,
  ...props
}: TextProps) {
  return (
    <Tag
      data-slot="text"
      data-truncate={truncate || undefined}
      className={cn(
        textVariants({ size, weight, tone }),
        truncate && "block truncate",
        className,
      )}
      {...props}
    />
  );
}

export type { TextProps };
export { Text, textVariants };
