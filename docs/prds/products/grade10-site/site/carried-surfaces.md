---
title: Carried Surfaces
spec: grade10-site/site/carried-surfaces
order: 4
---

## What Each Lane Carries

A build of the site carries a surface or it does not, and there is no third
answer. What a build carries is fixed when it is made, so a lane cannot be
told to show a surface the build it runs has no page for.

**The store waits for the shop to open** — the store surfaces are carried
in development and staging, and nowhere the public can reach.

| Lane | Store surfaces | Labs |
| --- | --- | --- |
| Development | carried | carried |
| Staging | carried | not carried |
| Preview | not carried | not carried |
| Production | not carried | not carried |

- **Store surfaces** — the store, the collections under it, a card's own
  page, the two addresses the shop hands out for a product and a collection,
  the cart, the checkout, and a collector's order history and order detail
- **Labs** — the demonstration surfaces, and the refund and shipping drafts
  nobody has approved

The auction, the vault, booking a visit, the membership pages and the
profile are carried in every lane, the auction's own order and invoice
included.

## An Address Nothing Carries

- **Not found** — an address of a surface the build does not carry is
  answered the way any address the site does not hold is, with the not-found
  surface and a 404 — [Navigation](/p/grade10-site/site/navigation)
- **Nothing names it** — no navigation item, no footer link, no control in
  the header and nothing on the front door points at a surface the build does
  not carry — [Page Shell](/p/grade10-site/site/page-shell)
- **No crawler hears of it** — robots.txt and the sitemap name only what
  the build answers —
  [Crawlable Pages](/p/grade10-site/site/crawlable-pages)

## Opening the Store

Opening the shop to the public moves one reviewed line: production and
preview start carrying the store surfaces, and every address above answers at
`grade10.com`. Nothing else about the surfaces changes, and nothing outside
this rule has to be edited to let them through.

:::detail{title="Code map" for="engineer"}
- **Surface table, and which lanes carry what** —
  `apps/frontend/grade10/src/surfaces.ts`
- **The build's own answer** — `apps/frontend/grade10/src/config.ts` for the
  application, `resolveDeployEnv()` for the build configs and the build check
- **Serving** —
  [docs/architecture/serving.md](https://github.com/9gag/grade10/blob/main/docs/architecture/serving.md)
:::

:::detail{title="Product decisions" for="pm"}
The shop is not open on `grade10.com`, and a collector who finds a store page
there would meet prices, a cart and a checkout that nobody is ready to
honour. Hiding the pages costs less than explaining them, and it keeps the
lanes the team works in complete.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector on grade10.com | Opens the front door before the shop is open | Reads a site whose store is absent, with nothing to click that leads nowhere. |
| Collector with an old store link | Opens a store address on the public site | Lands on the not-found surface, and the site does not pretend to sell. |
| Teammate on staging | Works on the store | Reads and buys exactly as before, in a lane the public does not reach. |

**Not in scope.** When the shop opens. What the front door says in place of
the store. Whether the store ever answers on the preview host separately from
production.

| Signal | Definition | Owner |
| --- | --- | --- |
| Store addresses reached on the public site | Requests the public lanes answer with not-found at a store address. Falls toward zero as search engines drop them. | Product |
| Store pages indexed | Store addresses a search engine holds for `grade10.com`. Expected zero. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The whole store set waits together | Decided | The cart, the checkout and a collector's order pages wait with the browse pages. Hiding browse alone leaves a checkout with an empty basket and a live pay button, which is the surface that does the damage. | Product |
| A lane carries the store or it does not | Decided | Hiding is decided when the build is made rather than read at each request, so a build that does not carry the store has no store page in it to reach by any route. A runtime check would leave the pages in the bundle and one mistake away from answering. | Engineering |
| An uncarried address is not found | Decided | A store address on a public lane answers with the not-found surface and a 404, the same as any address the site does not hold. A redirect to the front door would have to be undone at launch, and the site publishes a permanent redirect as permanent. | Product |
| The front door drops the store outright | Decided | The button and the card that lead to the store are absent rather than shown without a link. A teaser promises a shop with no date behind it and needs words nobody has written. | Product |
| The auction and the loyalty pages stay | Decided | Only the shop's own pages wait. The auction's post-sale order and invoice and the membership pages are not the shop, and a collector reaches them today. | Product |
| The deploy environment turns it off | Decided | Production and preview carry no store; staging and development do. Keying on the site stage was dropped: the stage reads `preview` for production today by one registry row, so a site moved to a preview stage for an unrelated reason would lose its store. | Engineering |
| Preview follows production | Decided | The preview host is the production build at another address, so it carries what production carries. A preview that sold would be a public shop under a quieter name. | Engineering |
| A store address in old mail owes nothing | Decided | A lane that carries no store takes no order, so no mail sent from it names a store address. A rule for mail would cover a case no lane can produce. | Product |
| The page code may stay in the bundle | Decided | A build without the store holds no store address and no store page; whether the code behind them still rides in the bundle is not stated. The storefront publishes the shop's features and the account's as one list, and the account's serve the profile, membership and join pages every lane carries, so telling them apart is work the shop's launch retires. | Engineering |
:::
