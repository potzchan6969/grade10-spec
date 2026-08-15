import {
  Stack,
  type StackProps,
} from "@grade10/design-system/components/layout/stack";
import type * as React from "react";

type VStackProps = Omit<StackProps, "direction"> & {
  /**
   * Horizontal alignment — the cross axis of a vertical stack. Aliases
   * `align`, and wins when both are given.
   */
  hAlign?: React.CSSProperties["alignItems"];
  /**
   * Vertical alignment — the main axis of a vertical stack. Aliases
   * `justify`, and wins when both are given.
   */
  vAlign?: React.CSSProperties["justifyContent"];
};

/**
 * A `Stack` fixed to `direction="vertical"`.
 *
 * It adds no rung to the gap scale and draws nothing `Stack` does not, so it
 * has no Figma set of its own; it is an ergonomic preset of `Stack`'s existing
 * `direction` axis, and renders the same element with `data-slot="stack"`.
 *
 * `hAlign` and `vAlign` name the axis the caller can see rather than the flex
 * axis, so a reader does not have to know which direction is the main one to
 * know which edge moves. `align` and `justify` still work and mean exactly what
 * they mean on `Stack`.
 */
function VStack({ align, hAlign, justify, vAlign, ...props }: VStackProps) {
  return (
    <Stack
      {...props}
      direction="vertical"
      align={hAlign ?? align}
      justify={vAlign ?? justify}
    />
  );
}

export type { VStackProps };
export { VStack };
