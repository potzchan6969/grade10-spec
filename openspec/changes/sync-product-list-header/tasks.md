## 1. FilterChip primitive

- [ ] 1.1 Add `FilterChip` under `packages/design-system/src/components/forms/` with size `md` / `sm`, a selected boolean gate, and stories covering both sizes plus selected and disabled
- [ ] 1.2 Add the Code Connect template against `4313:28` mapping every option of every VARIANT property
- [ ] 1.3 Export `FilterChip` from the design-system package entry

Verify: `pnpm run check:design-system`, `pnpm run test:stories:design-system`, `pnpm run typecheck`.

## 2. Product list header contract

Depends on group 1.

- [ ] 2.1 Extend `SortOption` with optional `toggleId` and `trailing`, and add `chipFilters` / `selectFilters` props on `ProductListHeader` and `ProductBrowse`
- [ ] 2.2 Make "The title is displayed as supplied" and "The count is not derived" pass
- [ ] 2.3 Make "Sorting is reported", "A paired sort option reverses on a second activation", and "No sort options supplied" pass
- [ ] 2.4 Make "No chip filter selected", "A chip filter is reported", "Two chip filter options selected", "An exclusive filter is reported", "An exclusive filter with no options", and "Sort and filters combine" pass
- [ ] 2.5 Add a Code Connect template for `ProductListHeader` against `4288:14117`

Verify: `pnpm run test:stories:ui`, `pnpm run typecheck`.

## 3. Preview assembly

Depends on group 2.

- [ ] 3.1 Update the product list page to supply `title`, drop `sortTriggerLabel`, and pass header sort and filter groups

Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories`.
