**Author:** @seankcw - 2026-09-17

## Why

The shop is not open, and `grade10.com` sells anyway. Every build of the site
carries the store, the cart, the checkout and a collector's order pages, so a
collector who reaches the public site meets prices, an add-to-cart control and
a checkout that nobody is ready to honour — and a search engine indexes those
pages as a live shop. Nothing in the site decides which lane a surface belongs
on, so there is no line to move when the shop does open, and no line to hold
it shut until then.

**Metric:** store addresses a search engine holds for `grade10.com`, and
requests the public lanes answer with not-found at a store address. Both are
expected to fall to zero; the first delivery sets the baseline.

## What Changes

- **A build carries a surface or it does not** — the site's surface table
  says which builds carry each surface, decided when the build is made. A
  build that does not carry one holds no page, no address and no page code
  for it
- **The store waits for the shop to open** — the store, the collections under
  it, a card's own page, the two addresses the shop hands out for a product
  and a collection, the cart, the checkout, and a collector's order history
  and order detail are carried in development and staging, and on no lane the
  public reaches
- **An uncarried address is not found** — a store address on a public lane
  answers with the not-found surface and a 404, the same as any address the
  site does not hold
- **Nothing names what is not carried** — the header's store item and cart
  control, the footer's shop column, and the front door's store button and
  store card are absent from a build that does not carry the store
- **No crawler hears of it** — robots.txt and the sitemap name only what the
  build answers, which the existing crawlable-pages requirements already
  demand of any address the site would refuse
- **The labs move under the same rule** — the demonstration surfaces and the
  unapproved refund and shipping drafts already answer only on a dev server.
  They become the second reader of one rule rather than a second rule

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/site/carried-surfaces`: which surfaces a build of the site
  carries, and what the site does about an address, a link and a crawl entry
  for one it does not

### Modified Capabilities

- none. `grade10-site/site/navigation` already refuses an address under no
  surface, `grade10-site/site/page-shell` already refuses a link and a
  control the site has no surface for, and
  `grade10-site/site/crawlable-pages` already refuses a sitemap entry the
  site would refuse. Each of them reads the surface set this capability
  decides

## Impact

- **`apps/frontend/grade10`** — `src/surfaces.ts` gains the declaration of
  which builds carry each surface; `src/config.ts` gains the flag the
  application reads; `src/routes.ts` and `react-router.config.ts` read the
  same answer from `@grade10/app-env/node`, which is what a build config can
  read; `src/serving/serveAddress.ts`, `src/routes/sitemap.ts`,
  `src/chrome/siteContent.ts`, `src/chrome/useShopColumn.ts`, `src/root.tsx`
  and the marketing page follow the surface set rather than the whole table
- **`@grade10/app-env`** — no new registry entry. The lane is the deploy
  environment the build already resolves
- **Staging and development** — unchanged. Every store surface answers as it
  does today
- **Search engines** — store addresses already indexed for `grade10.com`
  start answering 404 and are dropped

## Follow-on changes

- Open the shop: production and preview start carrying the store surfaces
- Say what the front door offers in place of the store while it is shut

## References

- [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md)
- [Store · Where It Is Open](../../../docs/prds/products/grade10-site/store/index.md#where-it-is-open)
