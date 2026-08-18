// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-13952
// source=packages/ui/src/blocks/store-product-listing/filter-panel.tsx
// component=FilterPanel
import figma from "figma";

export default {
  example: figma.code`<FilterPanel
  label={label}
  searchPlaceholder={searchPlaceholder}
  searchValue={searchValue}
  onSearchChange={onSearchChange}
  onSearchClear={onSearchClear}
  collections={collections}
  activeCollection={activeCollection}
  onCollectionChange={onCollectionChange}
  utilityLinks={utilityLinks}
/>`,
  imports: ['import { FilterPanel } from "@grade10/ui"'],
  id: "filter-panel",
  metadata: { nestable: true },
};
