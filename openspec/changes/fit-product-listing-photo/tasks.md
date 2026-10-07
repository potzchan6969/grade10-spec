## 1. The tile's photo (grade10-spec)

The fit is already on `main` (b632582fe). This group writes the test that
holds it; the `<img>` does not change
(`tech-design.md` § Hover, position and corners stay as shipped).

- [ ] 1.1 The tests this group's scenarios name, in their own commit before any code, ticked last: `ProductCardImage` → Non Square Photo in `packages/ui/src/blocks/store-product-listing/product-card-image.stories.tsx`, a portrait photo shot on white (`product-card.portrait.fixture.png`) in available, on-sale, sold-out and in-cart wells, one available landscape photo (`product-card.landscape.fixture.png`) and one available portrait photo smaller than the well (`product-card.small.fixture.png`), each beside `product-card.fixture.png`, whose play test decodes each photo and reads its painted box against the well's inner box inside its 1px border: the well square, the photo inside it, centred and meeting its two edges along its longer side, with the space it leaves on each side at least the well's corner radius, and the sold-out photo's opacity below 1 - `shared-ui-store-product-listing-SC-63`; and the same play test on `Default`, whose square photo (`product-card.fixture.png`) meets all four edges of a square well that clips to its rounded corners - `shared-ui-store-product-listing-SC-63a`; the same commit flips `shared-ui-store-product-listing-US1-TC18-1` and `shared-ui-store-product-listing-US1-TC19-1`, which the two play tests decide whole, with `pnpm run tcs:automated <case> --decided-by packages/ui/src/blocks/store-product-listing/product-card-image.stories.tsx`
- [ ] 1.2 Make `shared-ui-store-product-listing-SC-63` and `shared-ui-store-product-listing-SC-63a` pass: confirm 1.1 fails with `object-cover` or `object-scale-down` put on the `<img>` and passes on `main`
- [ ] 1.3 Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories:ui`, `pnpm run tcs:validate`

## 2. The manual (grade10-spec)

- [ ] 2.1 Point the `::story` "The whole photo in the well" on `docs/prds/products/shared/ui/store-product-listing.md` at `store-product-listing-productcardimage--non-square-photo`, and the Non Square Photo row of `ui-design.md` at the built story
- [ ] 2.2 After group 1 is verified, take the 🚧 off **Whole photo** under `Product Tile`, restating no requirement
- [ ] 2.3 Verify: `pnpm check:manual`

## 3. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review fit-product-listing-photo`) as
its input, and group 1 landed. The application's pin already carries the code,
so the walk needs no bump and no application change. The isolated stack's
fixture catalogue names its photos on `cdn.shop.test`, which resolves nowhere;
the walk answers every request to it with one portrait or one landscape image
of its own.

- [ ] 3.1 One test per surface that composes the tile (the store listing, the store home row, and You May Also Like under Charizard), in `apps/frontend/grade10/e2e/tests/store/listing-photo.spec.ts`, end to end through the collector's browser on the isolated stack, reading each tile's painted photo inside its well, with a screenshot of each surface attached, each test's title citing `shared-ui-store-product-listing-US1-TC20-1`, which stays manual as the suite's `### Manual` table says, kept as the change's end-to-end suite: `shared-ui-store-product-listing-SC-63`
- [ ] 3.2 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/store/listing-photo.spec.ts`
