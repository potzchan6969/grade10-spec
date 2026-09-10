// biome-ignore-all lint/a11y/useSemanticElements: the Figma table is a flex layout — a <table> element cannot carry the pill-shaped header row or the flex column sizing, so ARIA roles carry the semantics the elements would have given.
// biome-ignore-all lint/a11y/useFocusableInteractive: rows and column headers are static content inside a role="table", not a role="grid" — nothing in them is keyboard-interactive.
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
      {/*
        `contents` so a caller can put `display: grid` / `grid-cols-subgrid` on
        this header and have the heads participate as grid items. Default
        `flex` on the outer still lays the heads in a row.
      */}
      <div className="contents" role="row">
        {children}
      </div>
    </div>
  );
}

export type { TableHeaderProps };
export { TableHeader };
