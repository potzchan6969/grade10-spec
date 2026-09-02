---
title: Main Page
spec: grade10-site/store/home
order: 1
---

`grade10.com/store` is the front door: a hero, a grid of collections, one
row of cards. Links people already hold still land here.

1. **Hero** — a small label, headline, copy, image, two ways on
   - In the response HTML before any script runs, whether or not the
     catalogue answers ([[home-SC-15]])
2. **Catalogue sections** — read from the shop after the hero; each says it
   is loading, or that the read failed and can be retried without a full
   page load, or is absent when there is nothing to show, never a titled
   empty row ([[home-SC-17]])
   1. **Collection grid** — one tile per collection, in catalogue order; a
      collection added to the shop arrives with no deploy ([[home-SC-06]])
   2. **Merchandised row** — cards from whichever collection the shop lists
      first ([[home-SC-11]])

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051" title="Hero section"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050" title="Collection cards — the bento grid"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-11875" title="Merchandised row"}

::story{id="pages-store-home-page--default" title="The main page, whole"}

::story{id="store-home-storecollectiongrid--default" title="The collection grid"}

## Journeys

::journeys{id="grade10-site/store/home"}
