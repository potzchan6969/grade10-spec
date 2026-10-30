---
title: Main Page
spec: grade10-site/store/home
order: 1
---

`grade10.com/store` is the front door: a hero, a grid of collections, one
row of cards. Links people already hold still land here.

## Hero

- **Hero** — a small label, a headline, copy, an image and two ways on
  - **Before Any Script** — in the page as it arrives, whether or not the catalogue answers

::story{id="store-home-screens-store-home--default" title="The main page, whole"}

## Collection Grid

- **Tiles** — one per collection, in catalogue order
  - **New Collection** — one added in the shop arrives with no deploy

::story{id="store-home-blocks-storecollectiongrid--default" title="The collection grid"}

## Merchandised Row

- **Cards** — from whichever collection the shop lists first
  - **Card Status** — sold out, and what it used to cost where the shop has marked it down, both said the way the browse listing says them
  - **Opens, Never Sells** — a card opens the product's own page and offers no cart

## Loading and Errors

- **Catalogue Read** — the grid and the row are read from the shop after the hero
  - **Loading** — each says it is loading
  - **Failed** — each says the read failed and can be retried without a full page load
  - **Nothing to Show** — the section is absent, never a titled empty row

:::detail{title="Product decisions" for="pm"}
The front door is a shop window: it shows what the shop leads with, and the
product's own page sells.

- **The row merchandises, never sells** — a control the surface cannot honour is worse than none: it takes the press and answers with nothing, so a collector reads the shop as broken rather than the affordance as absent
- **Status is read the listing's way** — sold out and marked down come from the browse listing's rules, so the two surfaces cannot disagree about what is unavailable or what counts as a saving
- **Measured by** — row-led product views — [Analytics](/p/grade10-site/analytics#store)
:::
