---
title: Carried Surfaces
spec: grade10-site/site/carried-surfaces
order: 4
---

## What Each Lane Carries

A build of the site carries a surface or it does not, and there is no third
answer. What a build carries is fixed when it is made, so a lane cannot be
told to show a surface the build it runs has no page for.

**Each waiting product waits for its own launch** — the store, the vault
and booking a visit are carried in development and staging, and nowhere the
public can reach. The auction has already opened and is carried everywhere.

| Lane | Store | Vault | Booking | Labs |
| --- | --- | --- | --- | --- |
| Development | carried | carried | carried | carried |
| Staging | carried | carried | carried | carried |
| Preview | not carried | not carried | not carried | not carried |
| Production | not carried | not carried | not carried | not carried |

- **Store** — the store, the collections under it, a card's own page, the two
  addresses the shop hands out for a product and a collection, the cart, the
  checkout, and a collector's order history and order detail
- **Vault** — the vault, a case's own page, the signing ceremony and the
  identity check
- **Booking** — booking a visit, the private link from a booking's mail, and a
  collector's own visits
- **Labs** — the demonstration surfaces, and the refund and shipping drafts
  nobody has approved

The auction, the front door, the terms, the privacy page, the membership and
join pages, the profile and sign-in are carried in every lane.

## An Address Nothing Carries

- **Not found** — an address of a surface the build does not carry is
  answered the way any address the site does not hold is, with the not-found
  surface and a 404 — [Navigation](/p/grade10-site/site/navigation)
- **Nothing names it** — no navigation item, no footer link, no control in
  the header and nothing on the front door points at a surface the build does
  not carry — [Page Shell](/p/grade10-site/site/page-shell)
- **No crawler hears of it** — robots.txt and the sitemap name only what the
  build answers —
  [Crawlable Pages](/p/grade10-site/site/crawlable-pages)

## Opening a Product

Opening a waiting product moves one reviewed line: production and preview
start carrying that product's surfaces, and every address in its row answers
at `grade10.com`. The other waiting products stay where they are, so each
launch is its own date rather than one for all of them. Nothing else about a
surface changes, and nothing outside this rule has to be edited to let it
through.

:::detail{title="Code map" for="engineer"}
- **Surface table, and which lanes carry what** —
  `apps/frontend/grade10/src/surfaces.ts`
- **The build's own answer** — `apps/frontend/grade10/src/config.ts` for the
  application, `resolveDeployEnv()` for the build configs and the build check
- **Serving** —
  [docs/architecture/serving.md](https://github.com/9gag/grade10/blob/main/docs/architecture/serving.md)
:::

:::detail{title="Product decisions" for="pm"}
The store, the vault and booking are not ready for the public; the auction
already is and carries on every lane. A collector who found the store, the
vault or booking on `grade10.com` would meet a price, a case or a booking that
nobody is ready to honour, and a search engine would index it as live. Hiding
those pages costs less than explaining them, and it keeps the lanes the team
works in complete.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector on grade10.com | Opens the front door before the store, the vault or booking has opened | Reads a site that offers what it can serve, with nothing to click that leads nowhere. |
| Collector with an old link | Opens a withheld address on the public site | Lands on the not-found surface, and the site does not pretend to sell or hold a card. |
| Teammate on staging | Works on the store, the vault or booking | Reads and buys, vaults and books exactly as before, in a lane the public does not reach. |

**Not in scope.** When each waiting product opens. What the front door says in
place of them. Whether a product answers on the preview host separately from
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
| The store, the vault and booking wait; the auction does not | Decided | The auction has already opened and answers on every lane. The store, the vault and booking each wait for their own launch, and a collector meets the same unhonoured promise whichever of the three they reach. | Product |
| Each waiting product opens on its own date | Decided | Three lines, opened one at a time by their own reviewed change, so a ready one is never held shut behind a slower one. | Product |
| The loyalty pages and the profile stay | Decided | Membership, join, the profile and sign-in are carried everywhere. A member already holds a card, and the account pages are not one of the three waiting products. | Product |
| The labs gain staging | Decided | The labs — the demonstration surfaces and the unapproved refund and shipping drafts — widen from development alone to development and staging. Preview and production still carry none of them. | Product |
| The deploy environment turns it off | Decided | Production and preview carry no store; staging and development do. Keying on the site stage was dropped: the stage reads `preview` for production today by one registry row, so a site moved to a preview stage for an unrelated reason would lose its store. | Engineering |
| Preview follows production | Decided | The preview host is the production build at another address, so it carries what production carries. A preview that sold would be a public shop under a quieter name. | Engineering |
| A store address in old mail owes nothing | Decided | A lane that carries no store takes no order, so no mail sent from it names a store address. A rule for mail would cover a case no lane can produce. | Product |
| The page code may stay in the bundle | Decided | A build without the store holds no store address and no store page; whether the code behind them still rides in the bundle is not stated. The storefront publishes the shop's features and the account's as one list, and the account's serve the profile, membership and join pages every lane carries, so telling them apart is work the shop's launch retires. | Engineering |
| The vault's link-bearing surfaces wait with it | Decided | The signing ceremony and the identity check wait behind the same gate as the rest of the vault. A shut vault mints no such link, so any link already sent was internal — nobody outside the team held it. | Product |
| Booking's private link waits whole | Decided | The private link a booking's mail hands out waits with the rest of booking's set rather than answering on its own. Nobody had taken a booking on a public lane by the time this shipped; a follow-on change covers a collector who already holds one, should one turn up before booking opens. | Product |
| The front door's card row renders empty | Decided | Where every product it would show a card for is withheld, the row stays part of the page and holds no card, rather than being removed and reshaping the front door lane to lane. | Product |
| The vault's vanity domain keeps redirecting | Decided | It still redirects to the vault's own address while the vault is withheld, and lands on the not-found surface the same way any other route into it does — the redirect is a separate rule from what answers at its target. | Engineering |
| No carried surface depends on a withheld one | Decided | Checked against each product's own PRD before this shipped: none of the store's, the vault's or booking's surfaces names a dependency on another product this change withholds. | Engineering |
:::
