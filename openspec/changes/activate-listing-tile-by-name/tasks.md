## 1. The name control (grade10-spec)

`ProductCard` already draws the name as a control wherever the tile opens
(`packages/ui/src/blocks/store-product-listing/product-card.tsx`), landed with
`add-store-cross-sell`'s groups 1 and 7. What it lacks is stories that cite
these scenarios: `NamedOnce` presses the name alone, `SoldOut` spies on no
callback, no story omits the callback, and no list story checks which product
a press names. The photo is a second keyboard stop today, which Q6 removes.

- [ ] 1.1 The tests this group's scenarios name, in their own commit before its code, ticked last, each citing its scenario id in its doc comment: in `product-list.stories.tsx`, a story pressing one product's name and then its photo, and `onProductClick` called twice with that product's id; in `product-card.stories.tsx`, `SoldOut` given a spied `onClick` with the name and the photo pressed and the spy never called, a story with no `onClick` and no `href` that offers no control named for the product while the cart control stays, and `SoldOutOpensWhereNothingSells` citing `shared-ui-store-product-listing-SC-94` beside `shared-ui-store-product-listing-SC-91`; `NamedOnce` tabbing through the tile and stopping on the name and the cart control only, with one control named for the product, and Enter then Space on the name each reporting once - `shared-ui-store-product-listing-SC-87`, `shared-ui-store-product-listing-SC-88`, `shared-ui-store-product-listing-SC-89`, `shared-ui-store-product-listing-SC-94`, `shared-ui-store-product-listing-SC-95`, `shared-ui-store-product-listing-SC-96`
- [ ] 1.2 Make `shared-ui-store-product-listing-SC-95` pass: the photo's activation in `product-card-image.tsx` leaves the tab order and the accessibility tree (`tabIndex={-1}`, `aria-hidden`), keeping its pointer press and, where given, its address; the stories that count the photo as a named control (`product-card-image.stories.tsx`, `product-card.stories.tsx` `SoldOutOpensWhereNothingSells` and `SoldOutOpensAsALink`, `product-browse.stories.tsx`) read it by its slot instead; any other of 1.1's stories that fails passes in `product-card.tsx` or `product-list.tsx` - `shared-ui-store-product-listing-SC-87`, `shared-ui-store-product-listing-SC-88`, `shared-ui-store-product-listing-SC-89`, `shared-ui-store-product-listing-SC-94`, `shared-ui-store-product-listing-SC-95`
- [ ] 1.3 Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories:ui`, `pnpm run tcs:validate`

## 2. The manual (grade10-spec)

- [ ] 2.1 After group 1 is verified, take the 🚧 off **Name opens the product** and **One keyboard stop** under `Product Tile` in `docs/prds/products/shared/ui/store-product-listing.md`, and off **Name opens the product** under `Product Tile` in `docs/prds/products/grade10-site/store/product-listing.md`, restating no requirement
- [ ] 2.2 Verify: `pnpm check:manual`

## 3. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review activate-listing-tile-by-name`)
as its input, and group 1 landed with `external/grade10-spec` bumped. No
listing walk presses a product's name today: `catalog.spec.ts` only sees the
fixture tiles, and `store/home.spec.ts` opens a card by its photo.

- [ ] 3.1 One test in `apps/frontend/grade10/e2e/tests/catalog.spec.ts`, end to end on the isolated stack's fixture catalogue, kept as the change's end-to-end guard: on the listing, a collector presses a fixture product's name (`listingCardTitle`) and lands on that product's page, its heading the product's title
- [ ] 3.2 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/catalog.spec.ts`
