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

::story{id="store-home-screens-store-home--default" title="The main page, whole"}

::story{id="store-home-blocks-storecollectiongrid--default" title="The collection grid"}

:::detail{title="Product decisions" for="pm"}
The front door is a shop window: it shows what the shop leads with, and the
product's own page sells.

- **The row merchandises, never sells** — a control the surface cannot honour is worse than none: it takes the press and answers with nothing, so a collector reads the shop as broken rather than the affordance as absent
- **Status is read the listing's way** — sold out and marked down come from the browse listing's rules, so the two surfaces cannot disagree about what is unavailable or what counts as a saving
- **Measured by** — row-led product views — [Analytics](/p/grade10-site/analytics#store)
:::
