import { cn } from "@grade10/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const centerVariants = cva("flex", {
  variants: {
    axis: {
      both: "items-center justify-center",
      horizontal: "justify-center",
      vertical: "items-center",
    },
    // The rungs are Stack's gap scale, so a padding and a gap named `md` are
    // the same distance. No default: an unset padding emits no class at all.
    paddingInline: {
      none: "px-0",
      xs: "px-1",
      sm: "px-2",
      md: "px-4",
      lg: "px-6",
    },
    paddingBlock: {
      none: "py-0",
      xs: "py-1",
      sm: "py-2",
      md: "py-4",
      lg: "py-6",
    },
  },
  defaultVariants: {
    axis: "both",
  },
});

type SpacingRung = NonNullable<
  VariantProps<typeof centerVariants>["paddingInline"]
>;

type CenterProps = React.ComponentProps<"div"> &
  VariantProps<typeof centerVariants> & {
    /** Both axes at once. `paddingInline` and `paddingBlock` win on their own axis. */
    padding?: SpacingRung;
    /** `inline-flex` instead of `flex`, for centring inside a run of text. */
    inline?: boolean;
    /** Passed through as a style so callers keep arbitrary values. A number is px. */
    width?: React.CSSProperties["width"];
    /** Passed through as a style so callers keep arbitrary values. A number is px. */
    height?: React.CSSProperties["height"];
    /** Passed through as a style so callers keep arbitrary values. A number is px. */
    maxWidth?: React.CSSProperties["maxWidth"];
    /** Passed through as a style so callers keep arbitrary values. A number is px. */
    minHeight?: React.CSSProperties["minHeight"];
  };

/**
 * Centres its children on one axis or both.
 *
 * `axis` reads in page terms rather than flex terms: `horizontal` centres
 * left-to-right and `vertical` centres top-to-bottom, whichever one flexbox
 * happens to call the main axis.
 *
 * It centres but does not stack — reach for `VStack` or `HStack` when the
 * children need a gap between them. Like `Stack` it draws nothing of its own,
 * so it has no Figma component set; the sizing props exist because centring
 * vertically is meaningless until something gives the box a height.
 *
 * The per-axis padding is resolved here rather than left to two competing
 * class strings: `padding` sets both axes, and a `paddingInline` or
 * `paddingBlock` replaces it on that axis instead of layering over it.
 */
function Center({
  axis = "both",
  className,
  height,
  inline = false,
  maxWidth,
  minHeight,
  padding,
  paddingBlock,
  paddingInline,
  style,
  width,
  ...props
}: CenterProps) {
  return (
    <div
      data-slot="center"
      className={cn(
        centerVariants({
          axis,
          paddingBlock: paddingBlock ?? padding,
          paddingInline: paddingInline ?? padding,
        }),
        inline && "inline-flex",
        className,
      )}
      style={{ height, maxWidth, minHeight, width, ...style }}
      {...props}
    />
  );
}

export type { CenterProps };
export { Center, centerVariants };
