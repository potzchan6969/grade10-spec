## 1. Listing contract (grade10-spec)

- [x] 1.1 Replace the public listing exports so "An application imports the surface" and "A part is reused alone" pass: add `ProductFilter` / `ProductFilterProps` / `AppliedFilter`, remove `CollectionMenu`, `CollectionMenuItem`, and `CollectionOption`
- [x] 1.2 Make "A control does not move on its own", "The consumer drives the display", and "Every state is reachable from props" pass for filter-group selection instead of an active collection
- [x] 1.3 Make "Results fail while filter groups stand", "Filter groups load while results are ready", and "One boundary is not inferred from the other" pass

Verify: `pnpm run typecheck`.

## 2. Product filter sidebar (grade10-spec)

Depends on group 1.

- [x] 2.1 Make "Search is displayed and reported as supplied", "Search clear is offered only when appropriate", and "No clear affordance without a handler" pass on `ProductFilter` / `FilterPanel`
- [x] 2.2 Make "No filter selected is unrestricted", "A sidebar filter is reported", "Two filter options selected", "An empty filter group", and "A group expand is reported" pass
- [x] 2.3 Make "No utility links" pass
- [x] 2.4 Add a Code Connect template for `ProductFilter` against `4357:527` and retarget `FilterPanel`

Verify: `pnpm run test:stories:ui`, `pnpm run typecheck`.

## 3. Product list header (grade10-spec)

Depends on group 1.

- [x] 3.1 Make "The count is not derived" and "No sort options supplied" pass
- [x] 3.2 Make "Sorting is reported" pass with the sort dropdown and `sortTriggerLabel`
- [x] 3.3 Make "No applied filters", "An applied filter is removed", "Applied filters are cleared", and "Sort and applied filters combine" pass
- [x] 3.4 Update the `ProductListHeader` Code Connect template against `4288:14117`

Verify: `pnpm run test:stories:ui`, `pnpm run typecheck`.

## 4. Product list, card, and footer (grade10-spec)

- [x] 4.1 Make "Narrow viewport", "Wide viewport", and "No metadata badges on a tile" pass; set list gaps to 24px × 32px
- [x] 4.2 Reconcile `Footer` to `Base/background`

Verify: `pnpm run test:stories:ui`, `pnpm run test:stories:design-system`, `pnpm run typecheck`.

## 5. Preview assembly (grade10-spec)

Depends on groups 2, 3, and 4.

- [x] 5.1 Update the product list page so "Nothing renders unsupplied copy" still passes: supply worlds/types groups, applied-filter chips, and `sortTriggerLabel`; drop collection navigation and the header title

Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories`.

## 6. Figma value reconciliation (grade10-spec)

- [x] 6.1 Match ProductBrowse padding and sidebar gap, ProductFilter and header rhythm, selected applied-filter chips, 32px list gaps with a 240px min tile, and ProductCard type/image well to `4098:1868`
- [x] 6.2 Match nested Chip, Badge (brand SALE, default SOLD OUT, pill corners), DropdownMenu popover chrome, and the selected sort check to the page instances
- [x] 6.3 Reconcile DropdownMenuItem selected (no fill), `popover-foreground` label, `muted-hover` highlight, trigger chevron rotation, and keyboard/a11y annotations on `2132:1693`
- [x] 6.4 Reconcile `ProductCard` to set `4200:155` (`soldOut` axis, gradient image well, hover scale and in-cart quantity annotations)
- [x] 6.5 Reconcile the product-card cart control to `IconButton` `primary` `md` on `Product / Product Card Image` (`4274:10074`)

Verify: `pnpm run test:stories:ui`, `pnpm run test:stories:design-system`, `pnpm run check:design-system`, `pnpm run typecheck`.
