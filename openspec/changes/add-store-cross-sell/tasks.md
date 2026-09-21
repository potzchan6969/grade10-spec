## 1. The rail block and the two widenings (grade10-spec)

- [ ] 1.1 The tests this group's scenarios name, in their own commit before its code, ticked last: stories and unit tests under `packages/ui/src/blocks/` for `grade10-site-store-cross-sell-SC-25`, `grade10-site-store-cross-sell-SC-26`, `shared-ui-store-home-SC-10`, `shared-ui-store-product-listing-SC-91`, `shared-ui-store-product-listing-SC-92`
- [ ] 1.2 Make `shared-ui-store-home-SC-10` pass: `StoreSectionHeaderCopy.browseAll` becomes optional, drawn only where a browse destination is supplied
- [ ] 1.3 Make `shared-ui-store-product-listing-SC-91` and `shared-ui-store-product-listing-SC-92` pass: a `ProductCard` supplied as sold out reports its activation where a handler is supplied, keeping the sold-out treatment and no cart control; the card's cart words become optional where no cart control is drawn
- [ ] 1.4 Make `grade10-site-store-cross-sell-SC-25` and `grade10-site-store-cross-sell-SC-26` pass: export `StoreProductRelatedRail`, `StoreProductRelatedRailProps` and `StoreProductRelatedRailCopy` from `packages/ui/src/blocks/store-product/`, composing `StoreSectionHeader` and one `ProductCard` per card given, in a row, passing no browse-all word and no cart word; stories for the picks-and-similar, one-card, sold-out-pick and narrow states
- [ ] 1.5 Answer `product.youMayAlsoLike` in the shared layer — `en`, `ko`, `zh-Hans`, `zh-Hant`
- [ ] 1.6 Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm --dir packages/ui test`, `pnpm --dir packages/i18n test`, `pnpm run storybook:ui` builds

## 2. The rail's read (grade10)

Needs group 1 landed and the submodule bumped, for the shape the page maps to.

- [ ] 2.1 The tests this group's scenarios name, in their own commit before its code, ticked last: the node lane for the rule (`grade10-site-store-cross-sell-SC-03`, `grade10-site-store-cross-sell-SC-04`, `grade10-site-store-cross-sell-SC-06`, `grade10-site-store-cross-sell-SC-11`, `grade10-site-store-cross-sell-SC-13`, `grade10-site-store-cross-sell-SC-16`, `grade10-site-store-cross-sell-SC-17`, `grade10-site-store-cross-sell-SC-18`, `grade10-site-store-cross-sell-SC-19`, `grade10-site-store-cross-sell-SC-20`, `grade10-site-store-cross-sell-SC-21`, `grade10-site-store-cross-sell-SC-22`, `grade10-site-store-cross-sell-SC-27`, `grade10-site-store-cross-sell-SC-29`) and the worker lane for the read (`grade10-site-store-cross-sell-SC-09`, `grade10-site-store-cross-sell-SC-10`, `grade10-site-store-cross-sell-SC-12`, `grade10-site-store-cross-sell-SC-15`, `grade10-site-store-cross-sell-SC-23`, `grade10-site-store-cross-sell-SC-24`, `grade10-site-store-cross-sell-SC-28`, `grade10-site-store-cross-sell-SC-30`)
- [ ] 2.2 Make `grade10-site-store-cross-sell-SC-16`, `grade10-site-store-cross-sell-SC-17`, `grade10-site-store-cross-sell-SC-18`, `grade10-site-store-cross-sell-SC-19`, `grade10-site-store-cross-sell-SC-20`, `grade10-site-store-cross-sell-SC-21`, `grade10-site-store-cross-sell-SC-27` and `grade10-site-store-cross-sell-SC-29` pass: `relatedRail` in `services/catalog/related.ts` — the similar cards sorted on the ordered triple (world, language, type; a fact shared by any handle counting once), then the entry's created date, then the product id; never the card, never sold out
- [ ] 2.3 Make `grade10-site-store-cross-sell-SC-03`, `grade10-site-store-cross-sell-SC-04`, `grade10-site-store-cross-sell-SC-06`, `grade10-site-store-cross-sell-SC-11`, `grade10-site-store-cross-sell-SC-13` and `grade10-site-store-cross-sell-SC-22` pass: the complementary list read as one field (`value`) on the product's Storefront query, its ids resolved against the held copy in stored order, composed before the similar cards and cut to six
- [ ] 2.4 Make `grade10-site-store-cross-sell-SC-09`, `grade10-site-store-cross-sell-SC-10`, `grade10-site-store-cross-sell-SC-12`, `grade10-site-store-cross-sell-SC-15`, `grade10-site-store-cross-sell-SC-23`, `grade10-site-store-cross-sell-SC-24`, `grade10-site-store-cross-sell-SC-28` and `grade10-site-store-cross-sell-SC-30` pass: `catalog.product` gains `related` from the held copy through `storeKeeper(env)` — no `sync` in the request, nothing thrown, the fill scheduled when nothing is held — cached with the card under the 60 s tier, and one counter `store.catalog.related` by `outcome` with `store.catalog.related_ms`
- [ ] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, the store backend package's node and worker lanes

## 3. The rail on the card's page (grade10)

Needs group 2's `related` field, or its fixture, for the page to map.

- [ ] 3.1 The tests this group's scenarios name, in their own commit before its code, ticked last: page serving and hydration tests for `grade10-site-store-cross-sell-SC-01`, `grade10-site-store-cross-sell-SC-02`, `grade10-site-store-cross-sell-SC-05`, `grade10-site-store-cross-sell-SC-07`, `grade10-site-store-cross-sell-SC-08` and `grade10-site-store-cross-sell-SC-14`
- [ ] 3.2 Make `grade10-site-store-cross-sell-SC-01` and `grade10-site-store-cross-sell-SC-02` pass: compose `StoreProductRelatedRail` under the card in the page's response, mapping each `related` entry to `ProductSummary` with the listing's formatter, headed with `product.youMayAlsoLike`, drawn only where `related` holds a card
- [ ] 3.3 Make `grade10-site-store-cross-sell-SC-05`, `grade10-site-store-cross-sell-SC-07`, `grade10-site-store-cross-sell-SC-08` and `grade10-site-store-cross-sell-SC-14` pass: each tile opens its card's address, no tile sells, and a sold-out pick still opens
- [ ] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, the product serving and hydration tests

## 4. The manual (grade10-spec)

- [ ] 4.1 Update `docs/prds/products/grade10-site/store/cross-sell.md` and the `You May Also Like` section of `docs/prds/products/grade10-site/store/product-page.md` to the shipped rail — a `::story` card for the block, and the frame's `::figma` card once it lands — without restating a requirement; verify with `pnpm check:manual`

## 5. The walk (grade10)

- [ ] 5.1 One walk per journey, end to end through the collector's browser and the stock keeper's Shopify dashboard on the dev shop, kept as the change's end-to-end suite: `grade10-site-store-cross-sell-US-01`, `grade10-site-store-cross-sell-US-02`, `grade10-site-store-cross-sell-US-03`
- [ ] 5.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walks' own commit; the ones that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 5.3 Verify: the end-to-end suite passes on every push to `main`
