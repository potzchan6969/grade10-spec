---
title: Main Page
spec: grade10-site/store/home
order: 1
---

The store's own address serves a marketing hero, a grid of collections into the
catalogue, and one row of cards from whichever collection the shop lists first.
Links people already hold still land here.

The hero is in the response HTML before any script runs, and renders whether or
not the catalogue answers. Which collections appear, in what order, and which
one leads is the shop's to decide, not the application's — a collection added
there arrives with no deploy. Each section under the hero says it is loading,
or that the read failed and can be retried without a full page load, or is
absent when there is nothing to show; a titled empty row is never the answer.

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051" title="Hero section"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050" title="Collection cards — the bento grid"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-11875" title="Merchandised row"}

::story{id="pages-store-home-page--default" title="The main page, whole"}

::story{id="store-home-storecollectiongrid--default" title="The collection grid"}

## Journeys

::journeys{id="grade10-site/store/home"}
