import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ProductFilterCopy } from "./product-filter";
import { ProductFilter } from "./product-filter";
import type {
  AsyncState,
  FilterGroup,
  FilterSelection,
  SearchSuggestion,
  SearchSuggestionGroup,
  UtilityLink,
} from "./types";

/**
 * The words the panel renders: its own, and the filter's beneath it.
 */
type FilterPanelCopy = ProductFilterCopy & {
  /** Accessible name for the complementary landmark. */
  label: string;
  /** Clears the open narrow facet drawer’s draft. */
  drawerClear: string;
  /** Applies the open narrow facet drawer’s draft and closes. */
  showResults: string;
};

type FilterPanelProps = {
  copy: FilterPanelCopy;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  searchSuggestions?: readonly SearchSuggestionGroup[];
  onSearchCommit?: (value: string) => void;
  onSearchSuggestionSelect?: (
    suggestion: SearchSuggestion,
    groupId: string,
  ) => void;
  groups: AsyncState<readonly FilterGroup[]>;
  selection?: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onGroupExpand?: (groupId: string) => void;
  onGroupCollapse?: (groupId: string) => void;
  utilityLinks?: readonly UtilityLink[];
  showHeading?: boolean;
  showSearch?: boolean;
  showGroups?: boolean;
  showGroupExpand?: boolean;
  facetLayout?: "stack" | "tabs";
  className?: string;
};

const PANEL_CLASS =
  "sticky top-0 w-full shrink-0 self-stretch lg:w-64 lg:shrink-0";

/**
 * The listing sidebar: product filter and optional utility links. Figma
 * frame `Filter Panel` (`4288:13952`) on the Product List page.
 *
 * It has no Code Connect template, and that is deliberate: the Figma side is
 * a page-level frame composing a `Product / Product Filter` instance with the
 * utility links, not a published component, and Code Connect maps components.
 * A template aimed at the frame resolved to nothing. If design publishes a
 * Filter Panel component set, add `filter-panel.figma.ts` then — the props it
 * would emit are in this file's git history. Until then the block's link to
 * the frame is its `audit.json` entry, which compares values and does not
 * care what kind of node it reads.
 *
 * Renderable on its own, so another surface can reuse it without the browse
 * root. The panel reports search and filter changes and displays what it is
 * given; it never holds those values.
 */
function FilterPanel({
  copy,
  searchValue,
  onSearchChange,
  onSearchClear,
  searchSuggestions,
  onSearchCommit,
  onSearchSuggestionSelect,
  groups,
  selection,
  onFilterChange,
  onGroupExpand,
  onGroupCollapse,
  utilityLinks = [],
  showHeading = true,
  showSearch = true,
  showGroups = true,
  showGroupExpand = true,
  facetLayout = "stack",
  className,
}: FilterPanelProps) {
  return (
    <aside
      aria-label={copy.label}
      className={cn(PANEL_CLASS, className)}
      data-slot="filter-panel"
    >
      <VStack className="gap-8" gap="none">
        <ProductFilter
          copy={copy}
          facetLayout={facetLayout}
          groups={groups}
          onFilterChange={onFilterChange}
          onGroupCollapse={onGroupCollapse}
          onGroupExpand={onGroupExpand}
          onSearchChange={onSearchChange}
          onSearchClear={onSearchClear}
          onSearchCommit={onSearchCommit}
          onSearchSuggestionSelect={onSearchSuggestionSelect}
          searchSuggestions={searchSuggestions}
          searchValue={searchValue}
          selection={selection}
          showGroupExpand={showGroupExpand}
          showGroups={showGroups}
          showHeading={showHeading}
          showSearch={showSearch}
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

export type { FilterPanelCopy, FilterPanelProps };
export { FilterPanel };
