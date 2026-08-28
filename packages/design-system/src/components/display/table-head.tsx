import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type TableHeadAlign = "start" | "end";

type TableHeadProps = ComponentProps<"div"> & {
  children?: ReactNode;
  /** Horizontal alignment of header label or slot content. */
  align?: TableHeadAlign;
};

/**
 * A single column header cell within the table header row.
 *
 * Figma set `Table Head` (`4969:4912`). Default content is a text label;
 * replace with custom content via the slot. Maps to `<th scope="col">`
 * semantically; the flex row layout uses `role="columnheader"`.
 */
function TableHead({
  align = "start",
  className,
  children,
  ...props
}: TableHeadProps) {
  return (
    <div
      className={cn(
        "flex min-h-12 min-w-0 items-center px-4 py-3 text-sm leading-5 font-medium text-secondary-foreground",
        align === "end" && "justify-end text-right",
        className,
      )}
      data-align={align === "end" ? align : undefined}
      data-slot="table-head"
      role="columnheader"
      {...props}
    >
      {children}
    </div>
  );
}

export type { TableHeadAlign, TableHeadProps };
export { TableHead };
