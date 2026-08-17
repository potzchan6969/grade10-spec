import { Button } from "@grade10/design-system/components/forms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretDown } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { SortOption } from "./types";

type ProductListHeaderProps = {
  /** Formatted result total, displayed as supplied. Never derived from the
   * number of products on the page. */
  resultCount: ReactNode;
  sortOptions: readonly SortOption[];
  /** ID of the active sort option. */
  sortValue?: string;
  /** Text on the sort trigger, such as `Sort by popularity`. Supplied whole so
   * the package never assembles a sentence a translator cannot reorder. */
  sortTriggerLabel?: ReactNode;
  onSortChange?: (optionId: string) => void;
  className?: string;
};

/**
 * Result count and sort control. Renderable on its own, so another results
 * surface can reuse it without the browse root.
 */
function ProductListHeader({
  resultCount,
  sortOptions,
  sortValue,
  sortTriggerLabel,
  onSortChange,
  className,
}: ProductListHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border py-2",
        className,
      )}
      data-slot="product-list-header"
    >
      {/* `status` makes the count a polite live region, so a filter change is
       * announced where it is already displayed — no duplicate sr-only node,
       * and no focus move. */}
      <p className="text-base font-medium text-foreground" role="status">
        {resultCount}
      </p>
      {sortOptions.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="sm"
                trailing={<CaretDown aria-hidden size={14} />}
                variant="ghost"
              />
            }
          >
            {sortTriggerLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[158px]">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => onSortChange?.(option.id)}
                selected={option.id === sortValue}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

export type { ProductListHeaderProps };
export { ProductListHeader };
