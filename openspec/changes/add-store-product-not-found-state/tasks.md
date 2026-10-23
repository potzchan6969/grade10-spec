# Tasks: Store product not-found state

## 1. Contract and catalog (grade10-spec) (owner: @kinisworking)

- [ ] 1.1 Add failing catalog-resolution coverage for the three product-specific unknown-state messages required by `grade10-site-store-product-page-SC-03` in every supported Grade10 locale.
- [ ] 1.2 Update `docs/prds/products/grade10-site/store/product-page.md` to record the shipped-scope Store product unknown state, its preserved 404 response, and its listing recovery action.
- [ ] 1.3 Add the localized title, explanation, and browse-action messages to the existing Grade10 `product` catalogs for `en`, `zh-Hant`, and `zh-Hans`, leaving the shared generic `notFound` messages unchanged.
- [ ] 1.4 Run the catalog and manual contract checks and verify that the modified requirement still serves `grade10-site-store-product-page-US-01` and the Storybook state has no missing locale copy.

## 2. Product route presentation (grade10) (owner: @kinisworking)

- [ ] 2.1 Add failing prerender and navigation regression coverage for `grade10-site-store-product-page-SC-03`: a missing product keeps status 404, renders the localized product-specific heading/explanation/action inside the existing header and footer, links to the locale-aware product listing in the same tab, has no product or cart controls in the unknown-state content, and leaves an arbitrary unknown address on the generic site-wide not-found surface.
- [ ] 2.2 Implement the route-local unknown-product presentation at the existing Store product `404` error boundary, preserving the loader's server/response boundary and non-404 rethrow behavior; use the existing design-system `Button`, Grade10 product catalog, and locale-aware listing address without adding a shared UI export, token, provider, or redirect.
- [ ] 2.3 Run the focused serving/navigation tests, the frontend typecheck, and the relevant quality checks; confirm the existing product success path and generic catch-all not-found path remain unchanged.

## 3. The walk (grade10)

- [ ] 3.1 Walk `grade10-site-store-product-page-US-01` end to end through the implemented product route using `g10.store-product-page.US1-TC1`, `g10.store-product-page.US1-TC2` and the composed `g10.store-dmn.US11-TC2`; verify `grade10-site-store-product-page-SC-03`, `grade10-site-store-product-page-SC-04`, the missing-product 404/UI contract, the generic unrelated-route boundary and the existing product success path, leaving draft manual cases for the later human QA walk.
- [ ] 3.2 Mark only the cases the walk decides to automate with `pnpm run tcs:automated <case-id…> --decided-by grade10:openspec/changes/add-store-product-not-found-state/tasks.md` in the walk's own commit; keep the remaining cases manual for human QA.
- [ ] 3.3 Verify: the Store product-page and domain walk results, `pnpm run tcs:validate`, `pnpm run validate:changes add-store-product-not-found-state`, and `pnpm check:manual`.
