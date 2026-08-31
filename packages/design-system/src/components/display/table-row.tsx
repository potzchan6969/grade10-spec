// biome-ignore-all lint/a11y/useSemanticElements: the Figma table is a flex layout — a <table> element cannot carry the pill-shaped header row or the flex column sizing, so ARIA roles carry the semantics the elements would have given.
// biome-ignore-all lint/a11y/useFocusableInteractive: rows and column headers are static content inside a role="table", not a role="grid" — nothing in them is keyboard-interactive.
import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type TableRowProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

/**
 * A single data row in the table body. Contains one or more `TableCell`
 * instances.
 *
 * Figma set `Table Row` (`4969:4960`). The `cells` slot accepts `TableCell`
 * children only — min 1, no max. The bottom border acts as a row divider; the
 * last row omits it. Maps to `<tr>` semantically.
 */
function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center overflow-hidden border-b border-border last:border-b-0",
        className,
      )}
      data-slot="table-row"
      role="row"
      {...props}
    >
      {children}
    </div>
  );
}

export type { TableRowProps };
export { TableRow };
