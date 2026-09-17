---
title: Carried Surfaces
spec: grade10-site/site/carried-surfaces
order: 4
---

## What Each Lane Carries

A build of the site carries a surface or it does not, and there is no third
answer. What a build carries is fixed when it is made, so a lane cannot be
told to show a surface the build it runs has no page for.

🚧 **Each product waits for its own launch** — the store, the auction, the
vault and booking a visit are carried in development and staging, and nowhere
the public can reach.

| Lane | Store | Auction | Vault | Booking | Labs |
| --- | --- | --- | --- | --- | --- |
| Development | carried | carried | carried | carried | carried |
| Staging | carried | carried | carried | carried | not carried |
| Preview | not carried | not carried | not carried | not carried | not carried |
| Production | not carried | not carried | not carried | not carried | not carried |

- **Store** — the store, the collections under it, a card's own page, the two
  addresses the shop hands out for a product and a collection, the cart, the
  checkout, and a collector's order history and order detail
- **Auction** — the auction, a lot's own page, the watchlist, the collector's
  bids, and the winner's order and invoice
- **Vault** — the vault, a case's own page, the signing ceremony and the
  identity check
- **Booking** — booking a visit, the private link from a booking's mail, and a
  collector's own visits
- **Labs** — the demonstration surfaces, and the refund and shipping drafts
  nobody has approved

The front door, the terms, the privacy page, the membership and join pages,
the profile and sign-in are carried in every lane.

## An Address Nothing Carries

- **Not found** — an address of a surface the build does not carry is
  answered the way any address the site does not hold is, with the not-found
  surface and a 404 — [Navigation](/p/grade10-site/site/navigation)
- **Nothing names it** — no navigation item, no footer link, no control in
  the header and nothing on the front door points at a surface the build does
  not carry — [Page Shell](/p/grade10-site/site/page-shell)
- 🚧 **No crawler hears of it** — robots.txt and the sitemap name only what the
  build answers —
  [Crawlable Pages](/p/grade10-site/site/crawlable-pages)

## Opening a Product

Opening one product moves one reviewed line: production and preview start
carrying that product's surfaces, and every address in its row answers at
`grade10.com`. The other products stay where they are, so the four launches
are four dates rather than one. Nothing else about a surface changes, and
nothing outside this rule has to be edited to let it through.

:::detail{title="Code map" for="engineer"}
- **Surface table, and which lanes carry what** —
  `apps/frontend/grade10/src/surfaces.ts`
- **The build's own answer** — `apps/frontend/grade10/src/config.ts` for the
  application, `resolveDeployEnv()` for the build configs and the build check
- **Serving** —
  [docs/architecture/serving.md](https://github.com/9gag/grade10/blob/main/docs/architecture/serving.md)
:::

:::detail{title="Product decisions" for="pm"}
None of the four products is ready for the public. A collector who found one
on `grade10.com` would meet a price, a bid, a case or a booking that nobody is
ready to honour, and a search engine would index it as a live product. Hiding
the pages costs less than explaining them, and it keeps the lanes the team
works in complete.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector on grade10.com | Opens the front door before any product is open | Reads a site that offers what it can serve, with nothing to click that leads nowhere. |
| Collector with an old link | Opens a withheld address on the public site | Lands on the not-found surface, and the site does not pretend to sell, take a bid or hold a card. |
| Teammate on staging | Works on any of the four | Reads and buys, bids, vaults and books exactly as before, in a lane the public does not reach. |

**Not in scope.** When each product opens. What the front door says in place
of the four. Whether a product answers on the preview host separately from
production.

| Signal | Definition | Owner |
| --- | --- | --- |
| Withheld addresses reached on the public site | Requests the public lanes answer with not-found at a withheld address. Falls toward zero as search engines drop them. | Product |
| Withheld pages indexed | Withheld addresses a search engine holds for `grade10.com`. Expected zero. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The whole store set waits together | Decided | The cart, the checkout and a collector's order pages wait with the browse pages. Hiding browse alone leaves a checkout with an empty basket and a live pay button, which is the surface that does the damage. | Product |
| A lane carries a product or it does not | Decided | Hiding is decided when the build is made rather than read at each request, so a build that does not carry a product has no page of it to reach by any route. A runtime check would leave the pages in the bundle and one mistake away from answering. | Engineering |
| An uncarried address is not found | Decided | A withheld address on a public lane answers with the not-found surface and a 404, the same as any address the site does not hold. A redirect to the front door would have to be undone at launch, and the site publishes a permanent redirect as permanent. | Product |
| The front door drops what is shut | Decided | The button and the card that lead to a withheld product are absent rather than shown without a link. A teaser promises a product with no date behind it and needs words nobody has written. | Product |
| Every product waits, not only the shop | Decided | The store, the auction, the vault and booking each wait for their own launch. None of the four is ready, and a collector meets the same unhonoured promise whichever one they reach. | Product |
| Each product opens on its own date | Decided | Four lines, opened one at a time by their own reviewed change. The auction opens first. One line for the whole site would hold a ready product shut behind the slowest one. | Product |
| The loyalty pages and the profile stay | Decided | Membership, join, the profile and sign-in are carried everywhere. A member already holds a card, and the account pages are not one of the four products. | Product |
| The deploy environment turns it off | Decided | Production and preview carry no store; staging and development do. Keying on the site stage was dropped: the stage reads `preview` for production today by one registry row, so a site moved to a preview stage for an unrelated reason would lose its store. | Engineering |
| Preview follows production | Decided | The preview host is the production build at another address, so it carries what production carries. A preview that sold would be a public shop under a quieter name. | Engineering |
| A store address in old mail owes nothing | Decided | A lane that carries no store takes no order, so no mail sent from it names a store address. A rule for mail would cover a case no lane can produce. | Product |
| The page code may stay in the bundle | Decided | A build without the store holds no store address and no store page; whether the code behind them still rides in the bundle is not stated. The storefront publishes the shop's features and the account's as one list, and the account's serve the profile, membership and join pages every lane carries, so telling them apart is work the shop's launch retires. | Engineering |
:::
