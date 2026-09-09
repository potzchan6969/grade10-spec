---
title: Main Page
spec: grade10-site/store/home
order: 1
---

`grade10.com/store` is the front door: a hero, a grid of collections, one
row of cards. Links people already hold still land here.

1. **Hero** — a small label, headline, copy, image, two ways on
   - In the response HTML before any script runs, whether or not the
     catalogue answers
2. **Catalogue sections** — read from the shop after the hero; each says it
   is loading, or that the read failed and can be retried without a full
   page load, or is absent when there is nothing to show, never a titled
   empty row
   1. **Collection grid** — one tile per collection, in catalogue order; a
      collection added to the shop arrives with no deploy
   2. **Merchandised row** — cards from whichever collection the shop lists
      first
      - **Card status** — sold out, and what it used to cost where the shop
        has marked it down, both said the way the browse listing says them
      - **Opens, never sells** — a card leads to the product's own page and
        offers no cart

## Designs

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051" title="Hero section"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050" title="Collection cards — the bento grid"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-11875" title="Merchandised row"}

::story{id="pages-store-home-page--default" title="The main page, whole"}

::story{id="store-home-storecollectiongrid--default" title="The collection grid"}

:::detail{title="Product decisions" for="pm"}
The front door is a shop window: it shows what the shop leads with, and a
collector who means to buy goes on to the product's own page for the cart.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector arriving cold | Reads the row | Sees what the shop leads with, what each card costs, and whether it is still there to buy. |
| Collector who means to buy | Presses a card | Lands on that product's own page, where the cart is. |

**Not in scope.** Selling from the row — the shop window shows, and the
product's own page sells.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Row-led product views | Share of front-door sessions that open a product page from the merchandised row. Unmeasured; the first delivery sets the baseline. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The row merchandises | Decided | A card opens the product's page and offers no cart. A control the surface cannot honour is worse than none: it draws, takes the press and answers with nothing, so a collector reads the shop as broken rather than the affordance as absent. | Product |
| Status is read the listing's way | Decided | Sold out and marked down come from the same rules the browse listing reads them by, so the two surfaces cannot disagree about what is unavailable or what counts as a saving. | Engineering |
:::
