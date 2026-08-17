// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4229-3273
// source=packages/ui/src/blocks/store-product-listing/filter-panel.tsx
// component=FilterPanel
import figma from "figma";

export default {
  // `Checkbox List Group` is a slot of nested lists the consumer assembles from
  // its catalog — same shape as the page instance at 4238:3996, not a prop on
  // the set. Selection and callbacks are always consumer-owned.
  example: figma.code`<FilterPanel
  label={label}
  groups={groups}
  selection={selection}
  onFilterChange={onFilterChange}
/>`,
  imports: ['import { FilterPanel } from "@grade10/ui"'],
  id: "filter-panel",
  metadata: { nestable: true },
};
