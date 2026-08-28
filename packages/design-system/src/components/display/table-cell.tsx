// biome-ignore-all lint/a11y/useSemanticElements: the Figma table is a flex layout — a <table> element cannot carry the pill-shaped header row or the flex column sizing, so ARIA roles carry the semantics the elements would have given.
import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type TableCellAlign = "start" | "end";

type TableCellProps = ComponentProps<"div"> & {
  children?: ReactNode;
  /** Horizontal alignment of slot content. */
  align?: TableCellAlign;
};

/**
 * A single data cell within a table row. Renders arbitrary content via a slot.
 *
 * Figma set `Table Cell` (`4969:4888`). Maps to `<td>` semantically; the flex
 * row layout uses `role="cell"` on the outer element.
 */
function TableCell({
  align = "start",
  className,
  children,
  ...props
}: TableCellProps) {
  return (
    <div
      className={cn(
        "flex min-h-12 items-center px-4 py-3 text-sm leading-5 text-foreground",
        align === "end" && "justify-end",
        className,
      )}
      data-align={align === "end" ? align : undefined}
      data-slot="table-cell"
      role="cell"
      {...props}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 gap-4 overflow-clip",
          align === "end" ? "justify-end text-right" : "items-start",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export type { TableCellAlign, TableCellProps };
export { TableCell };
