import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { CheckboxList } from "@grade10/design-system/components/forms/checkbox-list";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { SearchInput } from "@grade10/design-system/components/forms/search-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { AsyncMessage } from "../shared/async-message";
import type { AsyncState, FilterGroup, FilterSelection } from "./types";

type ProductFilterProps = {
  /** Filter heading. Figma's `Header Text`. */
  heading: ReactNode;
  searchPlaceholder: ReactNode;
  /** Accessible name for the search field. Not shown visually. */
  searchLabel?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  groups: AsyncState<readonly FilterGroup[]>;
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onGroupExpand?: (groupId: string) => void;
  className?: string;
};

/**
 * Heading, search, and stacked checkbox groups. Figma set
 * `Product / Product Filter` (`4357:527`).
 *
 * Renderable on its own, so another surface can reuse it without the filter
 * panel's landmark or utility links. The filter reports a change and displays
 * what it is given; it never holds the selection.
 */
function ProductFilter({
  heading,
  searchPlaceholder,
  searchLabel,
  searchValue,
  onSearchChange,
  onSearchClear,
  groups,
  selection = {},
  onFilterChange,
  onGroupExpand,
  className,
}: ProductFilterProps) {
  const showClear = onSearchClear != null && (searchValue?.length ?? 0) > 0;
  const visibleGroups =
    groups.status === "ready"
      ? groups.data.filter((group) => group.options.length > 0)
      : [];

  return (
    <VStack
      className={cn("w-full gap-8", className)}
      data-slot="product-filter"
      gap="none"
    >
      <VStack className="w-full gap-3" gap="none">
        <h2 className="w-full text-2xl font-bold text-foreground">{heading}</h2>
        <SearchInput
          aria-label={
            searchLabel != null && typeof searchLabel === "string"
              ? searchLabel
              : undefined
          }
          onChange={(event) => onSearchChange?.(event.currentTarget.value)}
          onClear={showClear ? onSearchClear : undefined}
          placeholder={
            typeof searchPlaceholder === "string"
              ? searchPlaceholder
              : undefined
          }
          value={searchValue}
        />
      </VStack>

      {groups.status === "loading" ? (
        <VStack data-slot="filter-group-loading" gap="sm">
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton className="h-5 w-full" key={item} />
          ))}
        </VStack>
      ) : null}

      {groups.status === "empty" || groups.status === "error" ? (
        <AsyncMessage
          action={groups.action}
          message={groups.message}
          slot={`filter-groups-${groups.status}`}
        />
      ) : null}

      {visibleGroups.map((group) => (
        <CheckboxList key={group.id} label={group.label}>
          {group.options.map((option) => {
            const selected = (selection[group.id] ?? []).includes(option.id);
            return (
              <CheckboxListInput
                checked={selected}
                count={option.count}
                disabled={option.disabled}
                key={option.id}
                onCheckedChange={(next) =>
                  onFilterChange?.(group.id, option.id, next === true)
                }
                size="sm"
              >
                {option.label}
              </CheckboxListInput>
            );
          })}
          {group.expandLabel != null ? (
            <Link
              onClick={() => onGroupExpand?.(group.id)}
              render={<button type="button" />}
              size="sm"
            >
              {group.expandLabel}
            </Link>
          ) : null}
        </CheckboxList>
      ))}
    </VStack>
  );
}

export type { ProductFilterProps };
export { ProductFilter };
