## 1. Design-system names

- [x] 1.1 Rename `StoreHeader` to `Nav` (implementation, stories, Code Connect template, package export)
- [x] 1.2 Add `CollectionBanner` in `packages/ui` listing blocks, with stories and a Code Connect template against `4248:5104`
- [x] 1.3 Move `ProductCard` from the design system into the same listing-block folder
- [x] 1.4 Match Figma names that use a `Group / Name` prefix to the local name after ` / ` in `check-components.mjs`

## 2. Listing compounds

- [x] 2.1 Rename `ProductFilterPanel` to `FilterPanel`
- [x] 2.2 Rename `ProductListingToolbar` to `ProductListHeader`
- [x] 2.3 Rename `ProductGrid` to `ProductList`
- [x] 2.4 Point `ProductBrowse` at the new names and drop the `header` slot
- [x] 2.5 Rename `ProductListing` to `ProductBrowse`
- [x] 2.6 Sync `FilterPanel` with Figma set `Filter Panel` (`4229:3273`) and add Code Connect

## 3. Preview and contract

- [x] 3.1 Assemble the page story as `Nav`, `CollectionBanner`, `ProductBrowse`, `Footer`
- [x] 3.2 Fold the export rename into `openspec/specs/shared-ui/store-product-listing/spec.md`
- [x] 3.3 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run check:design-system`, and the listing story tests
