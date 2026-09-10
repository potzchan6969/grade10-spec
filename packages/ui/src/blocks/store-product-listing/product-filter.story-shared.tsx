import { useState } from "react";
import { FILTER_GROUPS, SEARCH_SUGGESTIONS } from "./fixtures";
import { ProductFilter, type ProductFilterProps } from "./product-filter";

export function InteractiveSearchFilter(args: ProductFilterProps) {
  const [searchValue, setSearchValue] = useState(args.searchValue ?? "");
  const showSuggestions = searchValue.trim().length >= 2;

  return (
    <ProductFilter
      {...args}
      onSearchChange={(value) => {
        setSearchValue(value);
        args.onSearchChange?.(value);
      }}
      onSearchClear={() => {
        setSearchValue("");
        args.onSearchClear?.();
      }}
      onSearchCommit={(value) => {
        setSearchValue("");
        args.onSearchCommit?.(value);
      }}
      onSearchSuggestionSelect={(suggestion, groupId) => {
        setSearchValue("");
        args.onSearchSuggestionSelect?.(suggestion, groupId);
      }}
      searchSuggestions={showSuggestions ? SEARCH_SUGGESTIONS : undefined}
      searchValue={searchValue}
    />
  );
}

export const productFilterArgs = {
  copy: {
    heading: "Filter",
    searchPlaceholder: "Find product",
    searchLabel: "Search products",
  },
  groups: { status: "ready" as const, data: FILTER_GROUPS },
  selection: {},
};
