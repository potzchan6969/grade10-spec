import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Link } from "@grade10/design-system/components/forms/link";
import { SearchInput } from "@grade10/design-system/components/forms/search-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { AsyncMessage } from "../shared/async-message";
import { CollectionMenu } from "./collection-menu";
import { CollectionMenuItem } from "./collection-menu-item";
import type { AsyncState, CollectionOption, UtilityLink } from "./types";

type FilterPanelProps = {
  /** Accessible name for the complementary landmark. */
  label: string;
  searchPlaceholder: ReactNode;
  /** Accessible name for the search field. Not shown visually. */
  searchLabel?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  collections: AsyncState<readonly CollectionOption[]>;
  activeCollection?: string;
  onCollectionChange?: (collectionId: string) => void;
  utilityLinks?: readonly UtilityLink[];
  className?: string;
};

const PANEL_CLASS =
  "sticky top-0 w-full shrink-0 overflow-hidden py-4 lg:w-64 lg:shrink-0";

/**
 * The listing sidebar: search, a collection menu, and optional utility links.
 * Figma frame `Filter Panel` (`4288:13952`) on the Product Listing page.
 *
 * Renderable on its own, so another surface can reuse it without the browse
 * root. The panel reports search and collection changes and displays what it
 * is given; it never holds those values.
 */
function FilterPanel({
  label,
  searchPlaceholder,
  searchLabel,
  searchValue,
  onSearchChange,
  onSearchClear,
  collections,
  activeCollection,
  onCollectionChange,
  utilityLinks = [],
  className,
}: FilterPanelProps) {
  const showClear = onSearchClear != null && (searchValue?.length ?? 0) > 0;

  return (
    <aside
      aria-label={label}
      className={cn(PANEL_CLASS, className)}
      data-slot="filter-panel"
    >
      <VStack gap="md">
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

        {collections.status === "loading" ? (
          <VStack data-slot="collection-loading" gap="xs">
            {[0, 1, 2, 3, 4].map((item) => (
              <Skeleton className="h-10 w-full" key={item} />
            ))}
          </VStack>
        ) : null}

        {collections.status === "empty" || collections.status === "error" ? (
          <AsyncMessage
            action={collections.action}
            message={collections.message}
            slot={`collection-${collections.status}`}
          />
        ) : null}

        {collections.status === "ready" && collections.data.length > 0 ? (
          <CollectionMenu>
            {collections.data.map((collection) => (
              <CollectionMenuItem
                active={collection.id === activeCollection}
                disabled={collection.disabled}
                key={collection.id}
                onClick={() => onCollectionChange?.(collection.id)}
              >
                {collection.label}
              </CollectionMenuItem>
            ))}
          </CollectionMenu>
        ) : null}

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
