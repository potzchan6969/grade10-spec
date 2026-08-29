---
title: Front door
summary: What the store's own address serves — a hero that needs no script, collections to enter through, and one merchandised row.
spec: grade10-store/home
order: 1
---

The store's own address used to open the catalogue. It now opens a front door: a
marketing hero, a grid of collections as ways into the catalogue, and one row of
cards from whichever collection the shop lists first. Links people already hold
still land here.

Two things make this page unusual. The hero arrives in the response HTML with no
script executing, so the page is readable and shareable the instant it lands —
and it renders whether or not the catalogue ever answers. Below it, nothing about
which collections appear, in what order, or which one leads is decided by the
application: a collection is on the front door by being in the shop, so one added
there arrives with no deploy.

::spec{id="grade10-store/home" scenario="home-SC-15"}

Each section under the hero speaks for itself — it says it is loading, or that
the read failed and can be tried again without a full page load, or it is absent
entirely when there is nothing to show. A titled empty row is never the answer.

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051" title="Hero section"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050" title="Collection cards — the bento grid"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-11875" title="Merchandised row"}

::story{id="pages-store-home-page--default" title="The front door, whole"}

::story{id="store-home-storecollectiongrid--default" title="The collection grid"}

## Journeys

::journeys{id="grade10-store/home"}

## The contract

::spec{id="grade10-store/home"}
