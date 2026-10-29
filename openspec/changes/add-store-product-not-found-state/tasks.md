# Tasks: Store product not-found state

## 1. Contract and catalog (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Add failing catalog-resolution coverage for the three product-specific unknown-state messages required by `grade10-site-store-product-page-SC-03` in every supported Grade10 locale.
- [x] 1.2 Update `docs/prds/products/grade10-site/store/product-page.md` to record the shipped-scope Store product unknown state, its preserved 404 response, and its listing recovery action.
- [x] 1.3 Add the localized title, explanation, and browse-action messages to the existing Grade10 `product` catalogs for `en`, `zh-Hant`, and `zh-Hans`, leaving the shared generic `notFound` messages unchanged.
- [x] 1.4 Run the catalog and manual contract checks and verify that the modified requirement still serves `grade10-site-store-product-page-US-01` and the Storybook state has no missing locale copy.

## 2. Product route presentation (grade10) (owner: @kinisworking)

- [x] 2.1 Add failing prerender and navigation regression coverage for `grade10-site-store-product-page-SC-03`: a missing product keeps status 404, renders the localized product-specific heading/explanation/action inside the existing header and footer, links to the locale-aware product listing in the same tab, has no product or cart controls in the unknown-state content, and leaves an arbitrary unknown address on the generic site-wide not-found surface.
- [x] 2.2 Implement the route-local unknown-product presentation at the existing Store product `404` error boundary, preserving the loader's server/response boundary and non-404 rethrow behavior; use the existing design-system `Button`, Grade10 product catalog, and locale-aware listing address without adding a shared UI export, token, provider, or redirect.
- [x] 2.3 Run the focused serving/navigation tests, the frontend typecheck, and the relevant quality checks; confirm the existing product success path and generic catch-all not-found path remain unchanged.

## 3. The walk (grade10) (owner: @kinisworking)

- [x] 3.1 Walk the Store product route using the current PRD cases `g10.store-product-page.TC-48a` (unknown product and unrelated address) and `g10.store-product-page.TC-xpc` (product success); verify `grade10-site-store-product-page-SC-03` and `grade10-site-store-product-page-SC-04`, the missing-product 404/UI contract, generic unrelated-route boundary and existing success path, leaving manual QA for the later human walk. — verified 2026-10-29 by @kinisworking: current product TCS identifiers replace the retired `US1-TC1`, `US1-TC2` and `g10.store-dmn.US11-TC2` references; the current domain suite has no equivalent missing-product journey. Product route E2E, prerender and success-path assertions pass.
- [x] 3.2 Mark only cases selected for automation with `pnpm run tcs:automated <case-id…> --decided-by grade10:openspec/changes/add-store-product-not-found-state/tasks.md`; keep remaining cases manual for human QA. — decided 2026-10-29 by @kinisworking: no manual case promoted; current PRD case `TC-48a` stays manual for human QA. `tcs:automated` refused that PRD case because it is not in the registered OpenSpec test-suite index, so no automation classification was changed.
- [x] 3.3 Verify: the Store product-page and current route walk results, `pnpm run tcs:validate`, `pnpm run validate:changes add-store-product-not-found-state`, and `pnpm check:manual`. — verified 2026-10-29 by @kinisworking: product-page E2E 5/5 and prerender 33/33 passed; manual check had 0 failures, `validate:changes` validated 1 change with 0 waiting on input, and `tcs:validate` had no errors (740 warnings). The former domain case is absent from the current r7 suite.
