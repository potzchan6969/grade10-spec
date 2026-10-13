**Author:** @tangconst - 2026-09-14

## Why

Chrome already names Store Locator, and Product Details already promises free
pick-up at Hong Kong Grade10 Store, but neither has a public page behind it —
the home-page change left that destination out until a surface answered. A
collector looking for the one Hong Kong shop meets a dead hash or underlined
copy that does nothing.

**Metric:** opens of the Store Locator address from chrome and from free
pick-up, plus map activations that leave for Google Maps. Unmeasured; first
delivery sets the baseline.

## What Changes

- **A public Store Locator surface** for the one Hong Kong shop: Location &
  Hours with map, store name, street address, and week hours, in the first
  response and visible before scripts run
- **Map opens Google Maps** for that address, in a new tab; no separate Get
  directions control
- **Chrome reaches it** — header and footer Store Locator lead to the page
  wherever the build carries the store, directly before Help, which ends the
  primary nav, and first in the footer's Help column, and the header marks it while the
  collector is there
- **Waits with the store** — Store Locator joins the store's set in
  `grade10-site/site/carried-surfaces`, so the route, the chrome items and the
  sitemap entry share one gate and auction-first builds carry none of them
- **Crawlable identity** — distinct title, meta description, and Open Graph
  tags under `grade10-site/site/crawlable-pages`; the sitemap lists the
  address wherever the build carries it
- **Free pick-up on Product Details** — the store name in the claim links to
  Store Locator; a fulfilment label the site has no page for is not a link
- **A shared UI block** — `StoreLocator` in `@grade10/ui` so every consumer
  composes the same Location & Hours surface from props

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/store-locator`: the public Location & Hours page for
  the one Hong Kong shop — content, map-to-Maps, chrome reachability, and
  crawlable identity (inherits crawlable-pages)
- `shared/ui/store-locator`: the shared `StoreLocator` compound the page
  composes — name, address, hours, map embed, Maps destination, all through
  props

### Modified Capabilities

- `grade10-site/store/product-page`: free pick-up at Hong Kong Grade10 Store
  opens Store Locator, and a fulfilment label with no page is not a link
- `grade10-site/site/carried-surfaces`: Store Locator joins the store's set,
  and the requirement that lists each set states the site's lanes as built -
  staging-2 and uat, and the front door and grading gates (grade10
  `apps/frontend/grade10/src/surfaces.ts:343-399`). The front door scenarios
  that read a production build move to a build that carries the front door

## Impact

- **`apps/preview`** — the Store Locator page story already assembles the
  surface; chrome hrefs and workbench navigation already point at it
  (PR #412). Its reveal hides the content until a script runs
- **`@grade10/ui`** — new `StoreLocator` block under `store-locator`; it does
  not exist yet, and Storybook composes the page in `apps/preview`
- **`@grade10/ui` `StoreProductMetadata`** — `pickupHref` and `shippingFeeHref`
  stop defaulting to `#`: each fulfilment label is a link only when its href is
  supplied. Consumer: grade10
  `packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductView.tsx:132`,
  which passes neither today, so both labels are `#` links; it passes the
  Store Locator address as `pickupHref`. Consumer: `apps/preview/src/store-product`,
  whose product detail passes the workbench's Store Locator story as
  `pickupHref`
- **`@grade10/ui` first-paint reveal** — `blocks/shared/use-first-paint-reveal.ts`
  hides content in the server markup until an effect runs; Store Locator needs
  it visible without scripts, and the fix in the shared module reaches every
  user: the order details, order history, auction record and winner order
  blocks, the preview's Store Locator page story, which imports it by relative
  path, the preview page stories that wait on the blocks' `data-revealed`, and
  five grade10 end-to-end specs that wait on the auction record's
  `data-revealed` (`apps/frontend/grade10/e2e/tests/auction/lot-status.spec.ts:100`,
  `my-auctions-evidence.spec.ts:167`, `account-record.spec.ts:204`,
  `winner-order-partial-payment.spec.ts:167`, `listing-page.spec.ts:144`).
  grade10's `AllAuctionsGrid` sets `data-revealed` from a prop of its own, not
  from this module, and does not move
- **`@grade10/design-system`** — primitives only (`VStack`, existing layout);
  no new primitive variants
- **`@grade10/i18n`** — page copy and head title and description in the
  grade10 brand layer; the store name moves from `shared/` to the grade10
  layer, so the claim and Store Locator read one key and ZZZ answers no
  Grade10 fact
- **grade10 SPA** — the public route, the Store set entry in
  `apps/frontend/grade10/src/surfaces.ts`, the sitemap entry, `addressHead`
  and the chrome destinations, at `/<lang>/store-locator` (Q9)
- **grade10 chrome fix, before this change** — the footer's Store Locator
  link and the listing's utility row point at `#` on staging store builds
  (grade10 `apps/frontend/grade10/src/chrome/siteContent.ts:100-104`,
  `:183-186`); a `fix` commit in grade10, run through the bug rounds
  (`docs/governance/bug-fixes.md`) with a regression test that a carried-store
  build draws no `#` chrome link, omits them until their pages answer
- **`redesign-store-product-detail-page`** — its delta's Item facts and
  `grade10-site-store-product-page-SC-15` defer to this change's Free pick-up
  requirement: the store name opens Store Locator and Shipping fee is text.
  The redesign cites that requirement, so it is accepted after this change, as
  its `depends_on` records
- **Crawlers** — the sitemap gains the Store Locator address wherever the
  store is carried; no crawlable-pages delta

**Domain impact** — Store Locator is new to `grade10-site/store`, which has a
domain suite, and free pick-up crosses from Product Details to Store Locator;
the domain pass adds that path to the change's `domain-tcs.md`.
No platform impact: no cross-product path.

## Follow-on changes

- Pickup claim on Order Details opens Store Locator when that surface shows
  the Hong Kong shop
- GRADE as a chrome destination, if Product wants it beside Store Locator
- Public phone and holiday hours once Operations names them (Q13)
- The page's look drawn in Figma, in draw-store-locator-page: the designer
  confirms or redraws this change's interim answers to Q14 to Q16, Q19 and
  Q22
- The store-product blocks' export contract under `shared/ui`, so a later
  prop change to `StoreProductMetadata` and its siblings has a delta to land
  in; today only the site-level product page carries its behaviour

## References

- [Store Locator · The Page](../../../docs/prds/products/grade10-site/store/store-locator.md#the-page)
- [Store Locator · From Elsewhere](../../../docs/prds/products/grade10-site/store/store-locator.md#from-elsewhere)
- [Store Locator · Shop](../../../docs/prds/products/grade10-site/store/store-locator.md#shop)
- [Store Locator Block](../../../docs/prds/products/shared/ui/store-locator.md)
- [Store Locator Block · Designs](../../../docs/prds/products/shared/ui/store-locator.md#designs)
- [Page Shell](../../../docs/prds/products/grade10-site/site/page-shell.md)
- [Product Details · Free Pick-up](../../../docs/prds/products/grade10-site/store/product-page.md#free-pick-up)
- [Crawlable Pages](../../../docs/prds/products/grade10-site/site/crawlable-pages.md)
- [Carried Surfaces · What Each Lane Carries](../../../docs/prds/products/grade10-site/site/carried-surfaces.md#what-each-lane-carries)
