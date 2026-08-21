// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117
// source=packages/ui/src/blocks/store-product-listing/product-list-header.tsx
// component=ProductListHeader
import figma from "figma";

const instance = figma.selectedInstance;

const resultCount = instance.getString("resultCount");

export default {
  example: figma.code`<ProductListHeader
  copy={copy}
  resultCount="${resultCount}"
  sortOptions={sortOptions}
  sortValue={sortValue}
  appliedFilters={appliedFilters}
  onSortChange={onSortChange}
  onFilterChange={onFilterChange}
  onClearFilters={onClearFilters}
/>`,
  imports: ['import { ProductListHeader } from "@grade10/ui"'],
  id: "product-list-header",
  metadata: { nestable: true },
};
