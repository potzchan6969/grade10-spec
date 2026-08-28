import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type TableHeaderProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

/**
 * The header row of a table. Contains one or more `TableHead` instances.
 *
 * Figma set `Table Header` (`4969:4927`). The `heads` slot accepts `TableHead`
 * children only — min 1, no max. Maps to `<thead>` → `<tr>` semantically.
 */
function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center overflow-hidden rounded-full bg-muted",
        className,
      )}
      data-slot="table-header"
      role="rowgroup"
      {...props}
    >
      <div className="flex w-full min-w-0 items-center" role="row">
        {children}
      </div>
    </div>
  );
}

export type { TableHeaderProps };
export { TableHeader };
