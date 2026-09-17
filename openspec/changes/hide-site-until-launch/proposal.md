**Author:** @seankcw - 2026-09-17

## Why

The store, the vault and booking a visit are not open, and `grade10.com`
offers all three anyway. Every build carries the store with its cart and
checkout, the vault with its cases and signing, and booking a visit — so a
collector who reaches the public site meets a price, a case and a booking
that nobody is ready to honour, and a search engine indexes them as live
products. Nothing in the site decides which lane a surface belongs on, so
there is no line to move when a product does open, and no line to hold it
shut until then. The store's own gate already runs — `hide-store-until-launch`
shipped the rule and the store set — and this change widens it from one
product to three. The auction has already opened and carries on every lane;
it is not part of this change.

**Metric:** withheld addresses a search engine holds for `grade10.com`, and
requests the public lanes answer with not-found at a withheld address. Both
are expected to fall to zero; the first delivery sets the baseline.

## What Changes

- **A build carries a surface or it does not** — the site's surface table
  says which builds carry each surface, decided when the build is made. A
  build that does not carry one holds no page, no address and no page code
  for it
- **Each waiting product waits for its own launch** — three sets, each
  carried in development and staging and on no lane the public reaches. The
  **store** is the store, the collections under it, a card's own page, the
  two addresses the shop hands out for a product and a collection, the cart,
  the checkout, and a collector's order history and order detail. The
  **vault** is the vault, a case's own page, the signing ceremony and the
  identity check. **Booking** is booking a visit, the private link from a
  booking's mail, and a collector's own visits. The auction is not one of
  them — it already carries on every lane
- **An uncarried address is not found** — a withheld address on a public lane
  answers with the not-found surface and a 404, the same as any address the
  site does not hold
- **Nothing names what is not carried** — the header's navigation items, its
  cart control and its account menu, the footer's shop column, and the front
  door's buttons and cards are absent for a product the build does not carry
- **No crawler hears of it** — robots.txt and the sitemap name only what the
  build answers, which the existing crawlable-pages requirements already
  demand of any address the site would refuse
- **The labs move under the same rule, and gain staging** — the demonstration
  surfaces and the unapproved refund and shipping drafts become the second
  reader of one rule rather than a second rule, and widen from a dev server
  alone to development and staging
- **BREAKING: the vault and booking wait too** — this reverses the recorded
  decision that only the shop's own pages wait. Neither is ready for the
  public, and a collector meets the same unhonoured promise reaching either.
  The auction is unaffected: it already answers everywhere

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/site/carried-surfaces`: the one store set becomes three
  product sets — the vault and booking wait for their own launches beside the
  store, each opened by its own line. The rule itself, and what an uncarried
  address, link and crawl entry do, already run and are not restated here
- none besides it. `grade10-site/site/navigation` already refuses an address
  under no surface, `grade10-site/site/page-shell` already refuses a link and
  a control the site has no surface for, and
  `grade10-site/site/crawlable-pages` already refuses a sitemap entry the site
  would refuse. Each of them reads the surface set this capability decides

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
- **Staging and development** — unchanged. Every surface answers as it does
  today
- **Search engines** — withheld addresses already indexed for `grade10.com`
  start answering 404 and are dropped

## Follow-on changes

- Open the store, the vault and booking, each on its own date
- Say what the front door offers while all three are shut

## References

- [Carried Surfaces · What Each Lane Carries](../../../docs/prds/products/grade10-site/site/carried-surfaces.md#what-each-lane-carries)
- [Carried Surfaces · An Address Nothing Carries](../../../docs/prds/products/grade10-site/site/carried-surfaces.md#an-address-nothing-carries)
- [Store · Where It Is Open](../../../docs/prds/products/grade10-site/store/index.md#where-it-is-open)
- [Vault · Where It Is Open](../../../docs/prds/products/grade10-site/vault/index.md#where-it-is-open)
- [Appointments · Where It Is Open](../../../docs/prds/products/grade10-site/appointment/index.md#where-it-is-open)
