import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type TableProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

/**
 * Table shell for composing `TableHeader`, `TableBody`, and `TableRow`
 * instances.
 *
 * Figma frame `Table` (`4969:4934`) is a composition example, not a published
 * component set — this wrapper matches its border, radius, and padding.
 */
function Table({ className, children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-background p-1",
        className,
      )}
      data-slot="table"
      role="table"
      {...props}
    >
      {children}
    </div>
  );
}

type TableBodyProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

/** Body slot for `TableRow` instances. Maps to `<tbody>` semantically. */
function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <div
      className={cn("flex w-full flex-col", className)}
      data-slot="table-body"
      role="rowgroup"
      {...props}
    >
      {children}
    </div>
  );
}

export type { TableBodyProps, TableProps };
export { Table, TableBody };
