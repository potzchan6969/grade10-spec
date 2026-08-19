import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { ProductFilter } from "./product-filter";
import type {
  AsyncState,
  FilterGroup,
  FilterSelection,
  UtilityLink,
} from "./types";

type FilterPanelProps = {
  /** Accessible name for the complementary landmark. */
  label: string;
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
  utilityLinks?: readonly UtilityLink[];
  className?: string;
};

const PANEL_CLASS =
  "sticky top-0 w-full shrink-0 self-stretch overflow-hidden lg:w-64 lg:shrink-0";

/**
 * The listing sidebar: product filter and optional utility links. Figma
 * frame `Filter Panel` (`4288:13952`) on the Product List page.
 *
 * Renderable on its own, so another surface can reuse it without the browse
 * root. The panel reports search and filter changes and displays what it is
 * given; it never holds those values.
 */
function FilterPanel({
  label,
  heading,
  searchPlaceholder,
  searchLabel,
  searchValue,
  onSearchChange,
  onSearchClear,
  groups,
  selection,
  onFilterChange,
  onGroupExpand,
  utilityLinks = [],
  className,
}: FilterPanelProps) {
  return (
    <aside
      aria-label={label}
      className={cn(PANEL_CLASS, className)}
      data-slot="filter-panel"
    >
      <VStack className="gap-8" gap="none">
        <ProductFilter
          groups={groups}
          heading={heading}
          onFilterChange={onFilterChange}
          onGroupExpand={onGroupExpand}
          onSearchChange={onSearchChange}
          onSearchClear={onSearchClear}
          searchLabel={searchLabel}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          selection={selection}
        />

        {utilityLinks.length > 0 ? (
          <HStack
            className="flex-wrap"
            data-slot="filter-panel-utility-links"
            gap="md"
            wrap
          >
            {utilityLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                size="xs"
                variant="secondary"
              >
                {link.label}
              </Link>
            ))}
          </HStack>
        ) : null}
      </VStack>
    </aside>
  );
}

export type { FilterPanelProps };
export { FilterPanel };
