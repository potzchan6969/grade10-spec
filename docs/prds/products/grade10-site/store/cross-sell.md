---
title: You May Also Like
spec: grade10-site/store/cross-sell
order: 4
---

Below a card on [Product Details](/p/grade10-site/store/product-page), the
store shows other cards the collector may also like.

| Rule | Value |
| --- | --- |
| Cards shown | 🚧 up to 6 |

## Rail

- 🚧 **One rail** — under the card, headed **You may also like**: the stock
  keeper's picks first, in their order, then similar cards to fill; nothing
  names a card as chosen or computed
- 🚧 **Opens the card** — a rail card is a link to that card's own page, so it
  opens in a new tab and before the page's scripts run; nothing in the rail
  adds to the cart
- 🚧 **Nothing to show, no rail** — a card with no picks and nothing similar
  shows no rail and leaves no empty space
- 🚧 **Sold out** — a chosen pick nobody can buy stays in the rail, says it is
  sold out and still opens; a similar card nobody can buy is left out; a card
  nobody can buy still shows its own rail
- 🚧 **Never itself** — the card the collector is reading is never in its own
  rail
- 🚧 **Arrives with the card** — the rail is in the page's response; nothing
  stands in its place and the card does not move once it has
- 🚧 **A rail the store cannot compose** — where the store's copy of the
  catalogue is not to hand, the card's page answers whole with no rail for that
  minute
- 🚧 **Picks the store cannot read** — where a card's picks cannot be read,
  the similar cards fill the rail alone

## Picks

🚧 **Chosen in Shopify** — a stock keeper picks the cards shown with a card
in the Shopify dashboard, on the card itself; a pick the catalogue no longer
holds is left out

## Similar Cards

🚧 **Shared facts** — a similar card shares this card's world, its language or
its collectible type, weighed in that order, newest first among equals; a card
sharing none of them draws no similar cards

🚧 **Just taken in** — a card the store has just taken in shows its picks until
the similar cards follow, within minutes

## Designs

::story{id="store-product-related-rail--picks-and-similar" title="The rail under a card"}

::story{id="store-product-related-rail--sold-out-pick-opens" title="A sold-out pick, still open"}

::story{id="store-product-related-rail--one-card" title="One card is enough"}

::story{id="store-product-related-rail--narrow" title="On a narrow screen"}

:::detail{title="Product decisions" for="pm"}
A collector who reaches a card and does not buy it leaves with nothing else to
open. The catalogue already holds the cards beside it, and the stock keeper
knows which ones belong together.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Reads a card they will not buy | Finds another card worth opening without going back to the listing. |
| Collector | Reads a card they will buy | Sees the cards that go with it. |
| Stock keeper | Knows which cards sell together | Chooses them once, in Shopify, and sees them on the page. |

**Not in scope.** Customers-also-bought from orders, its own change once the
store has orders to count. A rail on the listing, in the cart drawer or at
checkout. Personalisation per collector. Bundles and discounts. A picks
screen in the admin panel. Ranking by Shopify's own recommendations. Recently
viewed. The ZZZ store. Testing rail variants against each other. Ordering or
curating the similar cards by hand. Auction lots.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Rail opens | ❓ Unmeasured. Share of product-page sessions that open a second card from the rail, and the add-to-cart rate of those sessions; the first delivery sets the baseline. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where picks live | Decided | In Shopify, on the card, by the stock keeper. Not a second store of product data in the admin panel. | Product |
| Similar order | Decided | World, then language, then type. A Japanese card and an English one are different markets to a collector. | Product |
| Also bought | Decided | Phase two, its own change, once the store has orders to count. | Product |
| One rail | Decided | One rail for picks and similar cards alike, unlabelled and shown even with one card. Not a rail per source, which labels a distinction no collector acts on; not hiding a one-card rail, since a pick is the stock keeper's deliberate act. | Product |
| No cart in the rail | Decided | Adding is done on the card's own page, where the collector sees what they are buying. Not adding from the rail — a rail tile that sells is a card the collector has not opened. | Product |
| Narrow layout | Decided | One row that answers its own width: six tiles side by side on a wide page; on a narrower one the row scrolls sideways and snaps to each tile, part of the next showing. Not a second row, which pushes the page's end down; not fewer tiles on a small screen, which makes the cap depend on the screen. | Design |
| Now, before launch | Decided | Picks are a stock keeper's work and can be loaded before the store opens. | Product |
:::
