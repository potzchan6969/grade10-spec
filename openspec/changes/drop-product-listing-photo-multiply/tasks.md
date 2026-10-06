## 1. The photo as supplied (grade10-spec)

The `<img>` in `packages/ui/src/blocks/store-product-listing/product-card-image.tsx`
lost `mix-blend-multiply` in 44d8d1afa, ahead of acceptance. No story fails
when it comes back: `Sale` and `SoldOut` read only the photo's opacity, and
`Default`, `InCart` and `SoldOutWithHandler` read nothing of the photo. No other
block, story or Code Connect template in the store blends a photo.

- [ ] 1.1 The tests this group's scenarios name, in their own commit, ticked last, each citing its scenario id in its doc comment: in `product-card-image.stories.tsx`, a play test on `Default`, `Sale` and `InCart` reads `getComputedStyle(img).mixBlendMode` as `normal` and the opacity as `1`, and on `SoldOut` and `SoldOutWithHandler` reads `normal`, the opacity as `0.5` and the sold-out label as shown - `shared-ui-store-product-listing-SC-64`, `shared-ui-store-product-listing-SC-64a`; the same commit flips `shared-ui-store-product-listing-US1-TC15-1` and `shared-ui-store-product-listing-US1-TC16-1` with `pnpm run tcs:automated <case> --decided-by packages/ui/src/blocks/store-product-listing/product-card-image.stories.tsx`
- [ ] 1.2 Prove 1.1 guards the outcome: with `mix-blend-multiply` put back on the `<img>` locally, every story 1.1 touched fails; without it, every one passes. No product code changes
- [ ] 1.3 Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories:ui`, `pnpm run tcs:validate`

## 2. The manual (grade10-spec)

- [ ] 2.1 After group 1 is verified, take the 🚧 off **Photo as supplied** under `Product Tile` in `docs/prds/products/shared/ui/store-product-listing.md`, restating no requirement
- [ ] 2.2 Verify: `pnpm check:manual`

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment
(`/tcs-review drop-product-listing-photo-multiply`), and `/tcs-run-sheet` executes
manual cases when needed. The pin already holds the code, so the group needs
no bump. The three surfaces draw the tile through `@grade10/ui` and add no
class of their own; the guard catches one that wraps or restyles it later.

- [ ] 3.1 The test this group's scenario names, in its own commit, citing its scenario id, end to end on the isolated stack's fixture catalogue and kept as the change's end-to-end guard: `expectPhotosAsSupplied(root)` in `apps/frontend/grade10/e2e/helpers/storefront.ts` reads every `[data-slot="product-card-image"] img` under `root` and expects at least one, each with a computed `mix-blend-mode` of `normal`; it runs on the listing in `e2e/tests/catalog.spec.ts`, on the home row in `e2e/tests/store/home.spec.ts`, and on You May Also Like in `e2e/tests/store/cross-sell.spec.ts` after its rail reads - `shared-ui-store-product-listing-SC-64`; each of the three tests is linked once, from the grade10 root: `pnpm --dir external/grade10-spec run trace -- link --file "$PWD/apps/frontend/grade10/e2e/tests/<its spec file>" --target '<exact line of the test>' --acceptance g10.shared-store-product-listing.TC-5u0@1`; a commit in this store flips `shared-ui-store-product-listing-US1-TC17-1` with `pnpm run tcs:automated <case> --decided-by grade10:apps/frontend/grade10/e2e/tests/catalog.spec.ts,grade10:apps/frontend/grade10/e2e/tests/store/home.spec.ts,grade10:apps/frontend/grade10/e2e/tests/store/cross-sell.spec.ts`
- [ ] 3.2 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/catalog.spec.ts e2e/tests/store/home.spec.ts e2e/tests/store/cross-sell.spec.ts`, then walk the draft cases on the listing, the home row and You May Also Like
