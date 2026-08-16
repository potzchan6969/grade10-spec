# Tasks: the store product-listing surface

## 1. Remove store content from the design-system chrome

Lands first and stands alone as its own pull request.

- [x] 1.1 Remove `DEFAULT_UTILITY`, `DEFAULT_NAV`, and the `logo`, `promo`, and `localeLabel` default values from `StoreHeader`, and make those props required
- [x] 1.2 Remove `DEFAULT_SOCIAL`, `DEFAULT_COLUMNS`, and `DEFAULT_LEGAL` from `Footer`, and make `logo`, `description`, `attribution`, `socialLinks`, `columns`, `copyright`, `legalLinks`, and `locale` required
- [x] 1.3 Update `store-header.stories.tsx` and `footer.stories.tsx` to supply Grade10's content explicitly, so each story reads as the example a consumer copies
- [x] 1.4 Update `store-header.figma.ts` and `footer.figma.ts` to emit the required props, so the Dev Mode snippet compiles
- [ ] 1.5 Confirm no markup, class, or `cva` axis changed: run `pnpm run check:design-system` and verify the templates for `4171:9937` and `4171:9653` still resolve — BLOCKED, needs `FIGMA_TOKEN`; the `~/Downloads/figma-dump.json` fallback is from 2026-08-12 and predates these components
- [x] 1.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test:stories:design-system`
- [x] 1.7 Make `PaginationEllipsis`'s screen-reader string an overridable prop, keeping the English default, so the carve-out for a standard control's accessible name is actually true

## 2. Shared types for the surface

- [x] 2.1 Add `AsyncState` with its `loading`, `empty`, `error`, and `ready` members, `empty` carrying a message and an optional action
- [x] 2.2 Add `ProductSummary`, `FilterOption`, `FilterGroup`, `FilterSelection`, and `SortOption` as the design records them, with prices, counts, and labels typed as display-ready strings
- [x] 2.3 Add the four prop types and export every name the capability spec lists from `packages/ui/src/index.ts`
- [x] 2.4 Verify the export set against the spec's export requirement — exactly those names, nothing more

## 3. The independently renderable parts

- [x] 3.1 Build `ProductGrid`: tiles in supplied order, four/two/one columns at the token breakpoints, every action reported with its product ID
- [x] 3.2 Build `ProductFilterPanel`: groups and options in supplied order, counts displayed as supplied, multi-select within a group, empty groups omitted, optional price summary line
- [x] 3.3 Build `ProductListingToolbar`: supplied result count, sort control naming the active option, sort control omitted when no options are supplied
- [x] 3.4 Add stories for each part covering loading, empty, error, and resolved, plus a narrow-viewport story for the grid
- [x] 3.5 Add play interactions asserting each control reports its change once and does not move its own display

## 4. The listing root

- [x] 4.1 Build `ProductListing` composing the three parts, a `header` slot, and pagination, with filters and results as independent async boundaries
- [x] 4.2 Implement the empty and no-match distinction, including the optional clear-filters action
- [x] 4.3 Implement pagination display and reporting, hidden at a page count of one or zero, with previous and next unavailable at the ends
- [x] 4.4 Add the complementary landmark, the named results region, and the result-count announcement that does not move focus
- [x] 4.5 Add stories for filters-loading-with-results-ready, results-error-with-filters-ready, no-match, empty catalog, and a narrow viewport
- [x] 4.6 Verify no default, fallback, or built-in copy exists anywhere in the directory, and that nothing imports `@grade10/i18n`

## 5. Retire the interim page story

- [x] 5.1 Rewrite the surface story in `packages/ui/src/components/store-product-listing/` against the new exports, supplying Grade10 content explicitly
- [x] 5.2 Move `product-card.fixture.png` usage to a fixture the new story owns, and delete `packages/design-system/src/pages/`
- [x] 5.3 Run `pnpm run test:stories` and confirm the accessibility checks pass on every new story

## 6. Records and handoff

- [x] 6.1 Add the `store-product-listing` capability to `openspec/specs/shared-ui/README.md` as incoming, alongside `component-package`
- [x] 6.2 Record the shared-versus-application boundary test from `design.md` in `docs/governance/ui-component-contracts.md`, since it applies beyond this feature
- [x] 6.3 Run `openspec validate --specs` and `openspec validate store-product-listing-surface`
- [ ] 6.4 Confirm each consuming application builds against the moved submodule SHA and supplies the chrome content the removed defaults used to provide
- [x] 6.5 After delivery is confirmed, fold the accepted deltas into `openspec/specs/` and archive this change
