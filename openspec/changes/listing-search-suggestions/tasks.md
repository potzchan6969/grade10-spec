## 1. Searching state on the listing search field (grade10-spec) (owner: @sean)

- [x] 1.1 Give `ProductFilter` a pending indication and `ProductFilterCopy` its searching copy, rendering the design-system `AutocompleteLoading` row and inventing no suggestion row, so `shared-ui-store-product-listing-SC-74` passes; stand a `Store Product Listing/ProductFilter/Search` → `Pending` story behind it.
- [x] 1.2 Pass the pending indication through `FilterPanel` and `ProductBrowse` and hold the public entry to the export and type set `shared-ui-store-product-listing-SC-01` names, adding nothing beside it.
- [x] 1.3 Answer the listing search vocabulary in the shared `store` catalog for `en`, `zh-Hant`, `zh-Hans` and `ko` — the empty-suggestions line, the searching line, and the free-text chip label that carries the committed words.
- [x] 1.4 Carry the search stories into the Product Listing page's Designs block — the browse commit and the filter pick — so the manual shows what `grade10-site-store-product-listing-SC-32` and `-SC-34` deliver; make `pnpm check:manual` pass.
- [x] 1.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:stories:ui`, `pnpm check:manual`.

## 2. Suggestion hits from the catalogue (grade10) (owner: @sean)

This group touches only the catalog feature in `@grade10/store-frontend` and
needs nothing from group 1. It adds no endpoint: both hits come from reads the
catalogue already answers.

- [x] 2.1 Add `facetChoicesMatching` to the catalog feature's `CatalogFilters` domain model, folding a draft the way `CatalogQuery` folds free text and cutting each group to five, so the world and collectible-type hits `grade10-site-store-product-listing-SC-31` names are decided by a pure function.
- [x] 2.2 Add a suggestions read to the catalog feature's presentation layer composing `listProducts` with the draft as `search`, `pageSize: 5` and no facets, and the unnarrowed `listFilters` taxonomy through 2.1 — reporting the two groups and whether hits are still resolving, so `grade10-site-store-product-listing-SC-31`, `-SC-37` and `-SC-38` have their data. Export it from the feature's public entry; the DI module is unchanged.
- [x] 2.3 Verify: focused catalog feature tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`.

## 3. The listing search field on the page (grade10) (owner: @sean)

This group needs group 1 landed for the pending prop and group 2 for the
suggestion read.

- [ ] 3.1 Advance `external/grade10-spec` to the landed group 1 commit, preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [x] 3.2 Supply the suggestion groups and the pending indication to `ProductBrowse` from 2.2, and delete the settle timer that writes the typed words into the address — moving the settle constant onto the suggestion read — so typing changes neither the address nor the listed cards and `grade10-site-store-product-listing-SC-31`, `-SC-37` and `-SC-38` pass.
- [x] 3.3 Commit the typed words on submit: narrow the whole catalogue by them, carry them in the address, show them among the applied narrowings as a dismissible chip under the `search` group, and clear the field — routing the dismissal through the existing filter-change handler so `grade10-site-store-product-listing-SC-32`, `-SC-35` and `-SC-36` pass.
- [x] 3.4 Act on a suggestion: a product hit navigates to that product's address and clears the field, a filter hit applies that facet choice as the panel would, clears the field, and puts no free text in force — `grade10-site-store-product-listing-SC-33` and `-SC-34`.
- [x] 3.5 Verify: focused `ProductListingPage` tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`; do not run `pnpm run test:backend` — this change has no backend files.
