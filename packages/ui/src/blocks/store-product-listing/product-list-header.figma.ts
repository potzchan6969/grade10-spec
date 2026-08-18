// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-14117
// source=packages/ui/src/blocks/store-product-listing/product-list-header.tsx
// component=ProductListHeader
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("title");
const resultCount = instance.getString("resultCount");

export default {
  // Sort, type, and series options are nested instances the consumer
  // assembles from its catalog — not TEXT properties on the set.
  example: figma.code`<ProductListHeader
  title="${title}"
  resultCount="${resultCount}"
  sortOptions={sortOptions}
  sortValue={sortValue}
  chipFilters={chipFilters}
  selectFilters={selectFilters}
  selection={selection}
  selectFilterValues={selectFilterValues}
  onSortChange={onSortChange}
  onFilterChange={onFilterChange}
  onSelectFilterChange={onSelectFilterChange}
/>`,
  imports: ['import { ProductListHeader } from "@grade10/ui"'],
  id: "product-list-header",
  metadata: { nestable: true },
};
