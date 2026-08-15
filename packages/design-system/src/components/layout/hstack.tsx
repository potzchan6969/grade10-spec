import {
  Stack,
  type StackProps,
} from "@grade10/design-system/components/layout/stack";
import type * as React from "react";

type HStackProps = Omit<StackProps, "direction"> & {
  /**
   * Horizontal alignment — the main axis of a horizontal stack. Aliases
   * `justify`, and wins when both are given.
   */
  hAlign?: React.CSSProperties["justifyContent"];
  /**
   * Vertical alignment — the cross axis of a horizontal stack. Aliases
   * `align`, and wins when both are given.
   */
  vAlign?: React.CSSProperties["alignItems"];
};

/**
 * A `Stack` fixed to `direction="horizontal"`.
 *
 * It adds no rung to the gap scale and draws nothing `Stack` does not, so it
 * has no Figma set of its own; it is an ergonomic preset of `Stack`'s existing
 * `direction` axis, and renders the same element with `data-slot="stack"`.
 *
 * `hAlign` and `vAlign` name the axis the caller can see rather than the flex
 * axis, so the same prop moves the same edge here as it does on `VStack` —
 * which is the whole reason to reach for these over `Stack` with a `direction`.
 */
function HStack({ align, hAlign, justify, vAlign, ...props }: HStackProps) {
  return (
    <Stack
      {...props}
      direction="horizontal"
      align={vAlign ?? align}
      justify={hAlign ?? justify}
    />
  );
}

export type { HStackProps };
export { HStack };
