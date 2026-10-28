---
title: You May Also Like
spec: grade10-site/store/cross-sell
order: 4
---

Below a card on [Product Details](/p/grade10-site/store/product-page), the
store shows other cards the collector may also like.

| Rule | Value |
| --- | --- |
| Cards shown | up to 6 |

## Rail

- **One rail** — under the card, headed **You may also like**: the stock
  keeper's picks first, in their order, then similar cards to fill; nothing
  names a card as chosen or computed
  - **One Row** — the cards side by side; on a narrow page the row scrolls,
    part of the next card showing
- **Opens the card** — a rail card is a
  [link](/p/shared/ui/store-product-listing#product-tile) to that card's own
  page; nothing in the rail adds to the cart
- **Nothing to show, no rail** — a card with no picks and nothing similar
  shows no rail and leaves no empty space
- **Sold out** — a chosen pick nobody can buy stays in the rail, says it is
  sold out and still opens; a similar card nobody can buy is left out; a card
  nobody can buy still shows its own rail
- **Never itself** — the card the collector is reading is never in its own
  rail
- **Arrives with the card** — the rail is in the page's response; nothing
  stands in its place and the card does not move once it has
- **A rail the store cannot compose** — where the store's copy of the
  catalogue is not to hand, the card's page answers whole with no rail for that
  minute
- **Switched off** — the store can turn the rail off for a brand and
  environment; every card's page then shows no rail, as with nothing to show
- **Picks the store cannot read** — where a card's picks cannot be read,
  the similar cards fill the rail alone

## Picks

- **Chosen in Shopify** — a stock keeper picks the cards shown with a card
  in the Shopify dashboard, on the card itself; a change reaches the card's page
  within a minute, and a card the store has just taken in joins another card's
  picks once the store holds it; a pick the catalogue no longer holds is left out

## Similar Cards

- **Shared facts** — a similar card shares this card's world, its language or
  its collectible type, weighed in that order, newest first among equals; a card
  the catalogue names none of them for draws no similar cards
- **Just taken in** — a card the store has just taken in shows its picks until
  the similar cards follow

## Designs

::story{id="store-cross-sell-blocks-storeproductrelatedrail--picks-and-similar" title="The rail under a card"}

::story{id="store-cross-sell-blocks-storeproductrelatedrail--sold-out-pick-opens" title="A sold-out pick, still open"}

::story{id="store-cross-sell-blocks-storeproductrelatedrail--one-card" title="One card is enough"}

::story{id="store-cross-sell-blocks-storeproductrelatedrail--narrow" title="On a narrow screen"}

:::detail{title="Product decisions" for="pm"}
A collector who reaches a card and does not buy it leaves with nothing else to
open; the stock keeper knows which cards belong together.

- **Picks live in Shopify** — on the card, by the stock keeper; not a second store of product data in the admin panel
- **Similar order** — world, then language, then type: a Japanese card and an English one are different markets to a collector
- **One rail** — picks and similar cards alike, unlabelled, shown even with one card; not a rail per source, which labels a distinction no collector acts on, and not hiding a one-card rail, since a pick is the stock keeper's deliberate act
- **No cart in the rail** — adding is done on the card's own page, where the collector sees what they are buying; a rail tile that sells is a card the collector has not opened
- **One row on a narrow page** — not a second row, which pushes the end of the page down; not fewer cards on a small screen, since a phone should see as many picks as a desktop
- **Picks before launch, also-bought later** — picks are a stock keeper's work and can be loaded before the store opens; customers-also-bought waits for orders to count, its own change
- **Not in scope** — a rail on the listing, cart drawer or checkout; personalisation; bundles and discounts; a picks screen in the admin panel; Shopify's own recommendations; recently viewed; the ZZZ store; testing rail variants; hand-ordering the similar cards; auction lots
- ❓ **Unmeasured** — rail opens, and the add-to-cart rate of sessions that open one; nothing records them yet. Product confirms
:::
