import { APPLIED_FILTERS, SORT_OPTIONS } from "./fixtures";

export const SORT_TRIGGER = "Sort by latest product";

export const productListHeaderArgs = {
  copy: { sortTrigger: SORT_TRIGGER, clearFilters: "Clear filters" },
  resultCount: "100 Products",
  sortOptions: SORT_OPTIONS,
  sortValue: "new",
  appliedFilters: APPLIED_FILTERS,
};
