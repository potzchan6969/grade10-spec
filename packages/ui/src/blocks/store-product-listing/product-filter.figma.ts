// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4357-527
// source=packages/ui/src/blocks/store-product-listing/product-filter.tsx
// component=ProductFilter
import figma from "figma";

export default {
  example: figma.code`<ProductFilter
  heading={heading}
  searchPlaceholder={searchPlaceholder}
  searchValue={searchValue}
  onSearchChange={onSearchChange}
  onSearchClear={onSearchClear}
  groups={groups}
  selection={selection}
  onFilterChange={onFilterChange}
  onGroupExpand={onGroupExpand}
/>`,
  imports: ['import { ProductFilter } from "@grade10/ui"'],
  id: "product-filter",
  metadata: { nestable: true },
};
