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
  response before scripts run
- **Map opens Google Maps** for that address; no separate Get directions
  control
- **Chrome reaches it** — header and footer Store Locator lead to the page
  once the site answers it, and chrome marks it while the collector is there
- **Crawlable identity** — distinct title, meta description, and Open Graph
  tags under `grade10-site/site/crawlable-pages`; sitemap lists the address
- **Free pick-up on Product Details** links to Store Locator (supersedes the
  non-interactive fulfilment underline in `redesign-store-product-detail-page`)
- **A shared UI block** — `StoreLocator` in `@grade10/ui` so every consumer
  composes the same Location & Hours surface from props

## Non-Goals

- **Multi-store finder** — search, ZIP/city, distance, filters, amenities,
  stock by store, store picker / “My store”
- **In-app turn-by-turn** — Google Maps owns directions
- **Checkout store selection** — Shopify owns checkout
- **GRADE chrome destination** — separate product decision
- **A separate SEO change** — title, description, OG and sitemap inherit
  crawlable-pages; exact title/description strings stay ❓ on the PRD
- **Phone or holiday exceptions** until ops confirms them
- **Order Details pickup claim link** — follow-on once that surface’s pickup
  facts are product-owned beside this page
- **ZZZ** — no Store Locator for that brand here

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
  opens Store Locator

## Impact

- **`apps/preview`** — Store Locator page story already assembles the
  surface; chrome hrefs and workbench navigation already point at it
  (PR #412). OpenSpec makes that surface durable
- **`@grade10/ui`** — new `StoreLocator` block under `store-locator` (does
  not exist yet; Storybook currently composes in preview)
- **`@grade10/design-system`** — primitives only (`VStack`, existing layout);
  no new primitive variants
- **`@grade10/i18n`** — page copy and head title/description keys when the
  app serves the address
- **grade10 SPA** — public route, sitemap entry, `addressHead`, chrome
  destinations; path ❓ on the PRD
- **`redesign-store-product-detail-page`** — this change owns the Store
  Locator destination for the free pick-up claim; that change’s
  non-interactive underline clause is superseded when both fold
- **Crawlers** — sitemap gains the Store Locator address; no crawlable-pages
  delta (inherited)

No domain impact: Store Locator journeys stay inside one capability path;
product-page’s free pick-up link is a single-capability journey.
No platform impact: no cross-product path.

## Follow-on changes

- Pickup claim on Order Details opens Store Locator when that surface shows
  the Hong Kong shop
- GRADE as a chrome destination, if Product wants it beside Store Locator
- Public phone and holiday hours once ops names them

## Open questions

- **URL path** — Product; not required under `/store`
- **Title and description strings** — Product; must be distinct
- **Phone and holiday hours** — Ops / Product

## References

- [Store Locator · The Page](../../../docs/prds/products/grade10-site/store/store-locator.md#the-page)
- [Store Locator · From Elsewhere](../../../docs/prds/products/grade10-site/store/store-locator.md#from-elsewhere)
- [Store Locator · Shop](../../../docs/prds/products/grade10-site/store/store-locator.md#shop)
- [Store Locator Block](../../../docs/prds/products/shared/ui/store-locator.md)
- [Page Shell](../../../docs/prds/products/grade10-site/site/page-shell.md)
- [Product Details · Free Pick-up](../../../docs/prds/products/grade10-site/store/product-page.md#free-pick-up)
- [Crawlable Pages](../../../docs/prds/products/grade10-site/site/crawlable-pages.md)
