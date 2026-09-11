import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@grade10/design-system/components/forms/autocomplete";
import { CheckboxList } from "@grade10/design-system/components/forms/checkbox-list";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AsyncMessage } from "../shared/async-message";
import type {
  AsyncState,
  FilterGroup,
  FilterSelection,
  SearchSuggestion,
  SearchSuggestionGroup,
} from "./types";

/** The words the filter renders, whatever it is filtering. */
type ProductFilterCopy = {
  /** Filter heading. Figma's `Header Text`. */
  heading: string;
  searchPlaceholder: string;
  /** Accessible name for the search field. Not shown visually. */
  searchLabel?: string;
  /** Empty suggestion panel. Defaults to Figma Autocomplete copy. */
  searchEmpty?: string;
};

type SuggestionItem = {
  groupId: string;
  suggestion: SearchSuggestion;
};

type SuggestionListGroup = {
  value: string;
  label: ReactNode;
  items: SuggestionItem[];
};

type ProductFilterProps = {
  copy: ProductFilterCopy;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  /**
   * Suggestion groups under the search field. Omit and the panel stays
   * closed; pass an empty list with a draft to show the empty state.
   * Commit still reports either way.
   */
  searchSuggestions?: readonly SearchSuggestionGroup[];
  /** Enter with no row highlighted — free-text commit. */
  onSearchCommit?: (value: string) => void;
  /** Activating a suggestion row. */
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
  /** When false, the heading is omitted (e.g. drawer title already names it). */
  showHeading?: boolean;
  /** When false, the search field is omitted (e.g. mounted on a toolbar). */
  showSearch?: boolean;
  /** When false, facet groups are omitted (e.g. search-only toolbar). */
  showGroups?: boolean;
  /** When false, group expand affordances are omitted (e.g. filter drawer). */
  showGroupExpand?: boolean;
  /**
   * How facet groups lay out. `stack` (default) matches the wide sidebar;
   * `tabs` is for the narrow filter drawer so one expanded list does not bury
   * another.
   */
  facetLayout?: "stack" | "tabs";
  className?: string;
};

function toAutocompleteGroups(
  groups: readonly SearchSuggestionGroup[] | undefined,
): SuggestionListGroup[] {
  if (groups == null) return [];
  return groups
    .filter((group) => group.suggestions.length > 0)
    .map((group) => ({
      value: group.id,
      label: group.label,
      items: group.suggestions.map((suggestion) => ({
        groupId: group.id,
        suggestion,
      })),
    }));
}

/**
 * Heading, search, and facet groups. Figma set
 * `Product / Product Filter` (`4357:527`).
 *
 * On a wide viewport groups stack. In the narrow filter drawer they can be
 * tabs (`facetLayout="tabs"`) so expanding one list does not push another
 * down the scroll. Search suggestions use the design-system Autocomplete.
 * The filter reports a change and displays what it is given; it never holds
 * the selection.
 */
function ProductFilter({
  copy,
  searchValue,
  onSearchChange,
  onSearchClear,
  searchSuggestions,
  onSearchCommit,
  onSearchSuggestionSelect,
  groups,
  selection = {},
  onFilterChange,
  onGroupExpand,
  showHeading = true,
  showSearch = true,
  showGroups = true,
  showGroupExpand = true,
  facetLayout = "stack",
  className,
}: ProductFilterProps) {
  const showClear = onSearchClear != null && (searchValue?.length ?? 0) > 0;
  const visibleGroups =
    groups.status === "ready"
      ? groups.data.filter((group) => group.options.length > 0)
      : [];
  const defaultTab = visibleGroups[0]?.id;
  const useTabs = facetLayout === "tabs" && visibleGroups.length > 1;

  const suggestionGroups = useMemo(
    () => toAutocompleteGroups(searchSuggestions),
    [searchSuggestions],
  );
  const suggestionsProvided = searchSuggestions != null;
  const hasSuggestionRows = suggestionGroups.length > 0;
  const draft = searchValue ?? "";

  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const highlightedRef = useRef<SuggestionItem | null>(null);
  /** Suppresses free-text commit when Enter also selects a highlighted row. */
  const selectingSuggestionRef = useRef(false);

  useEffect(() => {
    if (!suggestionsProvided || draft.length === 0) {
      setSuggestionsOpen(false);
      highlightedRef.current = null;
      return;
    }
    setSuggestionsOpen(true);
  }, [suggestionsProvided, draft, hasSuggestionRows]);

  const selectItem = (item: SuggestionItem) => {
    selectingSuggestionRef.current = true;
    onSearchSuggestionSelect?.(item.suggestion, item.groupId);
    setSuggestionsOpen(false);
    highlightedRef.current = null;
    queueMicrotask(() => {
      selectingSuggestionRef.current = false;
    });
  };

  const commitDraft = () => {
    if (selectingSuggestionRef.current) return;
    if (draft.length === 0) return;
    onSearchCommit?.(draft);
    setSuggestionsOpen(false);
    highlightedRef.current = null;
  };

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const highlighted = highlightedRef.current;
    if (highlighted != null) {
      event.preventDefault();
      selectItem(highlighted);
      return;
    }
    event.preventDefault();
    commitDraft();
  };

  return (
    <VStack
      className={cn("w-full gap-6", className)}
      data-slot="product-filter"
      gap="none"
    >
      {showHeading || showSearch ? (
        <VStack className="w-full gap-2" gap="none">
          {showHeading ? (
            <h2 className="flex h-10 w-full items-center text-2xl font-bold text-foreground">
              {copy.heading}
            </h2>
          ) : null}
          {showSearch ? (
            <Autocomplete
              itemToStringValue={(item: SuggestionItem) =>
                typeof item.suggestion.label === "string"
                  ? item.suggestion.label
                  : item.suggestion.id
              }
              items={suggestionGroups}
              mode="none"
              onItemHighlighted={(item: SuggestionItem | undefined) => {
                highlightedRef.current = item ?? null;
              }}
              onOpenChange={(open) => {
                if (!suggestionsProvided || draft.length === 0) {
                  setSuggestionsOpen(false);
                  return;
                }
                setSuggestionsOpen(open);
              }}
              onValueChange={(value, eventDetails) => {
                // Base UI fills the input with the item label on press. Listing
                // search must not absorb that as draft — selection is reported
                // through the item handler, and the consumer clears the field.
                if (eventDetails.reason === "item-press") {
                  onSearchChange?.("");
                  return;
                }
                onSearchChange?.(value);
              }}
              open={
                suggestionsOpen && suggestionsProvided && draft.length > 0
              }
              value={draft}
            >
              <AutocompleteInput
                aria-label={copy.searchLabel}
                onClear={
                  showClear
                    ? () => {
                        onSearchClear?.();
                        setSuggestionsOpen(false);
                        highlightedRef.current = null;
                      }
                    : undefined
                }
                onFocus={() => {
                  if (suggestionsProvided && draft.length > 0) {
                    setSuggestionsOpen(true);
                  }
                }}
                onKeyDown={onSearchKeyDown}
                placeholder={copy.searchPlaceholder}
              />
              {suggestionsProvided ? (
                <AutocompleteContent data-slot="product-filter-search-suggestions">
                  <AutocompleteEmpty>
                    {copy.searchEmpty ?? "No results found."}
                  </AutocompleteEmpty>
                  <AutocompleteList>
                    {(group: SuggestionListGroup) => (
                      <AutocompleteGroup key={group.value} items={group.items}>
                        <AutocompleteGroupLabel>
                          {group.label}
                        </AutocompleteGroupLabel>
                        <AutocompleteCollection>
                          {(item: SuggestionItem) => (
                            <AutocompleteItem
                              key={`${item.groupId}:${item.suggestion.id}`}
                              leading={
                                item.suggestion.imageSrc != null ? (
                                  <img
                                    alt={item.suggestion.imageAlt ?? ""}
                                    className="size-6 shrink-0 rounded-sm object-cover"
                                    src={item.suggestion.imageSrc}
                                  />
                                ) : undefined
                              }
                              onClick={() => selectItem(item)}
                              trailing={item.suggestion.trailing}
                              value={item}
                            >
                              {item.suggestion.label}
                            </AutocompleteItem>
                          )}
                        </AutocompleteCollection>
                      </AutocompleteGroup>
                    )}
                  </AutocompleteList>
                </AutocompleteContent>
              ) : null}
            </Autocomplete>
          ) : null}
        </VStack>
      ) : null}

      {showGroups && groups.status === "loading" ? (
        <VStack data-slot="filter-group-loading" gap="sm">
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton className="h-5 w-full" key={item} />
          ))}
        </VStack>
      ) : null}

      {showGroups &&
      (groups.status === "empty" || groups.status === "error") ? (
        <AsyncMessage
          action={groups.action}
          message={groups.message}
          slot={`filter-groups-${groups.status}`}
        />
      ) : null}

      {showGroups && visibleGroups.length > 0 && !useTabs
        ? visibleGroups.map((group) => (
            <FacetGroupOptions
              group={group}
              key={group.id}
              onFilterChange={onFilterChange}
              onGroupExpand={onGroupExpand}
              selection={selection}
              showGroupExpand={showGroupExpand}
              showLabel
            />
          ))
        : null}

      {showGroups && useTabs && defaultTab != null ? (
        <Tabs
          className="w-full gap-4"
          data-slot="product-filter-group-tabs"
          defaultValue={defaultTab}
        >
          <TabsList fullWidth>
            {visibleGroups.map((group) => (
              <TabsTrigger key={group.id} value={group.id}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {visibleGroups.map((group) => (
            <TabsContent key={group.id} value={group.id}>
              <FacetGroupOptions
                group={group}
                onFilterChange={onFilterChange}
                onGroupExpand={onGroupExpand}
                selection={selection}
                showGroupExpand={showGroupExpand}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : null}
    </VStack>
  );
}

function FacetGroupOptions({
  group,
  selection,
  onFilterChange,
  onGroupExpand,
  showLabel = false,
  showGroupExpand = true,
}: {
  group: FilterGroup;
  selection: FilterSelection;
  onFilterChange?: (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => void;
  onGroupExpand?: (groupId: string) => void;
  showLabel?: boolean;
  showGroupExpand?: boolean;
}) {
  return (
    <CheckboxList label={showLabel ? group.label : undefined}>
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
      {showGroupExpand && group.expandLabel != null ? (
        <Link
          onClick={() => onGroupExpand?.(group.id)}
          render={<button type="button" />}
          size="sm"
        >
          {group.expandLabel}
        </Link>
      ) : null}
    </CheckboxList>
  );
}

export type { ProductFilterCopy, ProductFilterProps };
export { ProductFilter };
