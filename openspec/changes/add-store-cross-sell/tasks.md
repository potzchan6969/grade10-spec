## 1. The rail block and the two widenings (grade10-spec)

The sold-out tile's hover and focus state and the row's narrow layout are the
frame's, awaited from @tangconst by 2026-09-24; 1.4's stories draw the block
as the tile exists today and the frame's follow-up rides task 5.2.

- [x] 1.1 The tests this group's scenarios name, in their own commit before its code, ticked last: stories and a public-exports test under `packages/ui/src/blocks/` for `grade10-site-store-cross-sell-SC-25`, `grade10-site-store-cross-sell-SC-26`, `shared-ui-store-home-SC-10`, `shared-ui-store-product-listing-SC-91`, `shared-ui-store-product-listing-SC-92`; the same commit flips `shared-ui-store-home-US1-TC1-1`, `shared-ui-store-product-listing-US1-TC1-1` and `shared-ui-store-product-listing-US1-TC2-1` with `pnpm run tcs:automated <case> --decided-by <the story or test path in this store>`
- [x] 1.2 Make `shared-ui-store-home-SC-10` pass: `StoreSectionHeaderCopy.browseAll` becomes optional, drawn only where a browse destination is supplied
- [x] 1.3 Make `shared-ui-store-product-listing-SC-91` and `shared-ui-store-product-listing-SC-92` pass: a `ProductCard` supplied as sold out reports its activation where an activation handler is supplied and no cart handler is — the listing supplies one and stays inert, as `activate-listing-tile-by-name` requires — keeping the sold-out treatment and no cart control; the card's cart words are optional where no cart control is drawn. That change's delta currently makes a sold-out tile's image inert as well as its name, so whichever of the two lands second in `packages/ui` breaks the other's stories: group 1 lands first, and the discriminator is written into that change's modified requirement before that change is built
- [x] 1.4 Make `grade10-site-store-cross-sell-SC-25` and `grade10-site-store-cross-sell-SC-26` pass: `StoreProductRelatedRail`, `StoreProductRelatedRailProps` and `StoreProductRelatedRailCopy` in `packages/ui/src/blocks/store-product/store-product-related-rail.tsx`, re-exported from the public entry `packages/ui/src/index.ts`, composing `StoreSectionHeader` and one `ProductCard` per card given, in a row, passing no browse-all word and no cart word; stories for the picks-and-similar, one-card, sold-out-pick and narrow states
- [x] 1.5 Answer `product.youMayAlsoLike` in the shared layer — `en`, `ko`, `zh-Hans`, `zh-Hant`
- [x] 1.6 Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories:ui`, `pnpm --dir packages/i18n test`, `pnpm run tcs:validate`, and `pnpm run design-sync:check` where a Figma token is to hand, otherwise CI's
- [ ] 1.7 After group 6 (Q42): `StoreProductRelatedRail` draws a `region` labelled by its heading, so a walk reaches the rail by role and name, with the story lane and `pnpm run design-sync:check` as 1.6 names them; the walk's slot queries retire in group 6's next round

## 2. The rail's rule (grade10)

Nothing here imports this store: the group is claimable the day the plan
lands, verified with fixtures alone in the node lane.

- [x] 2.1 The tests this group's scenarios name, in their own commit before its code, ticked last: the node lane for `relatedRail` — `grade10-site-store-cross-sell-SC-03`, `grade10-site-store-cross-sell-SC-04`, `grade10-site-store-cross-sell-SC-06`, `grade10-site-store-cross-sell-SC-11`, `grade10-site-store-cross-sell-SC-13`, `grade10-site-store-cross-sell-SC-15`, `grade10-site-store-cross-sell-SC-16`, `grade10-site-store-cross-sell-SC-17`, `grade10-site-store-cross-sell-SC-18`, `grade10-site-store-cross-sell-SC-19`, `grade10-site-store-cross-sell-SC-20`, `grade10-site-store-cross-sell-SC-21`, `grade10-site-store-cross-sell-SC-22`, `grade10-site-store-cross-sell-SC-27`, `grade10-site-store-cross-sell-SC-29`
- [x] 2.2 Make `grade10-site-store-cross-sell-SC-15`, `grade10-site-store-cross-sell-SC-16`, `grade10-site-store-cross-sell-SC-17`, `grade10-site-store-cross-sell-SC-18`, `grade10-site-store-cross-sell-SC-19`, `grade10-site-store-cross-sell-SC-20`, `grade10-site-store-cross-sell-SC-21`, `grade10-site-store-cross-sell-SC-27` and `grade10-site-store-cross-sell-SC-29` pass: the similar half of `relatedRail` in `services/catalog/related.ts` — every other entry sharing a world, a language or a type, sorted on the ordered triple (a fact shared by any handle counting once), then the entry's created date, then the product id; never the card itself, never a card among the picks, never a card with nothing for sale — sold out excludes the similar cards alone, never a pick
- [x] 2.3 Make `grade10-site-store-cross-sell-SC-03`, `grade10-site-store-cross-sell-SC-04`, `grade10-site-store-cross-sell-SC-06`, `grade10-site-store-cross-sell-SC-11`, `grade10-site-store-cross-sell-SC-13` and `grade10-site-store-cross-sell-SC-22` pass: the picks half — the ids as the metafield stores them, normalised to the entry id's form, resolved against the held entries in stored order, an id no entry answers reported as unresolved, the card itself left out of its own picks, then the picks before the similar cards and the cut to six
- [x] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` — the backend lane; `related.test.ts` runs in it

## 3. The rail's read (grade10)

Needs group 2's `relatedRail`; nothing here imports this store. 3.2 is written
against the complementary list's metafield namespace and key as @htonyl
confirms them on the dev shop's private token before the group is claimed
(`tech-design.md` § Risks); where the standard field does not read, the
fallback comes back through the change's own round, not a checkbox here.

- [x] 3.1 The tests this group's scenarios name, in their own commit before its code, ticked last: the worker lane for `catalog.product` — `grade10-site-store-cross-sell-SC-12`, `grade10-site-store-cross-sell-SC-23`, `grade10-site-store-cross-sell-SC-24`, `grade10-site-store-cross-sell-SC-28`, `grade10-site-store-cross-sell-SC-30`, and the read's `empty`, `no_mirror` and `card_unresolved` outcomes
- [x] 3.2 Make `grade10-site-store-cross-sell-SC-12`, `grade10-site-store-cross-sell-SC-23`, `grade10-site-store-cross-sell-SC-24`, `grade10-site-store-cross-sell-SC-28` and `grade10-site-store-cross-sell-SC-30` pass: the complementary list read as one field (`value`) on the product's Storefront query; `catalog.product` gains `related` from the held copy through `storeKeeper(env)` — no `sync` in the request, nothing thrown, the fill scheduled when nothing is held, the card's own facets from its held entry — with `store.catalog.related` by `outcome` and `store.catalog.related_ms`, the projection version logged with the compose, and the alert on `picks_absent` rising on a shop that has the app
- [x] 3.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` — the backend lane, the worker spec for `catalog.product` in it

## 4. The rail on the card's page (grade10)

Needs group 1 landed and `external/grade10-spec` bumped, for
`StoreProductRelatedRail`; group 3's `related` is met by the fixture 4.2
writes. The rail composes onto the page `redesign-store-product-detail-page`
is rebuilding, so this group follows that change's page work.

- [x] 4.1 Bump `external/grade10-spec` to the commit carrying group 1
- [x] 4.2 The tests this group's scenarios name, in their own commit before its code, ticked last: page serving and hydration tests over a fixture of `related` (full, one card, empty, and the read answering nothing) for `grade10-site-store-cross-sell-SC-01`, `grade10-site-store-cross-sell-SC-02`, `grade10-site-store-cross-sell-SC-05`, `grade10-site-store-cross-sell-SC-07`, `grade10-site-store-cross-sell-SC-08`, `grade10-site-store-cross-sell-SC-09`, `grade10-site-store-cross-sell-SC-10`, `grade10-site-store-cross-sell-SC-14`
- [x] 4.3 Make `grade10-site-store-cross-sell-SC-01`, `grade10-site-store-cross-sell-SC-02`, `grade10-site-store-cross-sell-SC-05`, `grade10-site-store-cross-sell-SC-07`, `grade10-site-store-cross-sell-SC-08`, `grade10-site-store-cross-sell-SC-09`, `grade10-site-store-cross-sell-SC-10` and `grade10-site-store-cross-sell-SC-14` pass: compose `StoreProductRelatedRail` under the card in the page's response, mapping each `related` entry to `ProductSummary` with the listing's formatter and each tile's activation to its card's address, headed with `product.youMayAlsoLike`, drawn with no heading and no space where `related` holds no card; the page's read decodes a body carrying no `related` as none until 3.2 is deployed, and the default goes with that deploy
- [x] 4.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, the product serving and hydration tests

## 5. The manual (grade10-spec)

- [ ] 5.1 Update `docs/prds/products/grade10-site/store/cross-sell.md`, the `You May Also Like` section of `docs/prds/products/grade10-site/store/product-page.md` and the `Product Tile` section of `docs/prds/products/shared/ui/store-product-listing.md` — whose "a sold-out tile's name stays inert" gains "where the tile sells" — to the shipped rail, with a `::story` card for the block, restating no requirement; `docs/prds/products/shared/ui/store-home.md` already reads that a header with no browse address renders a title alone and needs no line
- [ ] 5.2 After the walk (group 6) has run, correct the suite's `### Manual` table in `openspec/changes/add-store-cross-sell/specs/grade10-site/store/cross-sell/feature-tcs.md` to what the walk reached — the rows the walk did not reach say so, and are named in the walk's `rounds.md` row
- [ ] 5.3 Verify: `pnpm run tcs:validate`, `pnpm check:manual`

## 6. The walk (grade10)

Needs groups 1 to 4 landed. The walks live in
`apps/frontend/grade10/e2e/tests/store/cross-sell.spec.ts` and run on the
isolated stack, whose fixture catalogue seeds the stock keeper's picks as the
app stores them (`packages/shopify/backend/src/testing/fixture.ts`); the lane
refuses any other shop. A Decided-by path cannot leave this store, so
cross-sell's cases stay `manual` on the run sheet and the suite's `### Manual`
table names the walk that proves each and what it walks beyond it. The stock
keeper's steps in the Shopify dashboard are out of the lane: one occupancy
skip per case, walked by hand on the dev shop with the page read after them
within its minute. The walk waits on the card's own read, past the card's
minute, never on a sleep.

- [ ] 6.1 One test per case the fixture reaches, under a describe per journey, end to end through the collector's browser on the isolated stack's fixture catalogue, which seeds the picks, warmed by one listing read so the isolate holds a copy, kept as the change's end-to-end suite: `grade10-site-store-cross-sell-US-01`, `grade10-site-store-cross-sell-US-02`, `grade10-site-store-cross-sell-US-03`
- [ ] 6.2 Verify: `pnpm --dir apps/frontend/grade10 run e2e -- e2e/tests/store/cross-sell.spec.ts`

## 7. The frame's follow-up (grade10-spec)

Gated on @tangconst's frame, awaited by 2026-09-24; claimed only once it
lands, so no other group waits on it.

- [ ] 7.1 The sold-out tile's hover and focus state as the frame draws it on `Product / Product Card` `4200:155`, in `ProductCard`'s stories and the block
- [ ] 7.2 The frame's `::figma` card on `docs/prds/products/grade10-site/store/cross-sell.md`, and the rail's narrow layout as the frame draws it
- [ ] 7.3 Verify: `pnpm run test:stories:ui`, `pnpm run design-sync:check`, `pnpm check:manual`
