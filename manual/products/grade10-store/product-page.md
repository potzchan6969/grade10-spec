---
title: Card page
summary: One card at its own address — its grades, its prices, and the add that keeps the collector where they are.
spec: grade10-store/product-page
order: 3
---

Every card has an address of its own, keyed by the handle the catalogue already
addresses a product by. The response carries the card's name, its description and
a price for every grade it lists before any script runs, so what a collector
reads is the card the address names rather than a shell the catalogue fills in
later.

Whether a handle is a card is asked of the catalogue at the moment the address is
requested. One that names nothing answers 404 with the site's own not-found
surface — never an empty product page, which reads as a page that broke.

Buying happens in place. The page opens on the grade it priced, so a card with
one thing to buy needs no choice made; choosing another grade is what gets added,
never whichever the catalogue listed first. The collector stays on the card while
the cart total catches up, and adding the same grade again carries the quantity on
one line rather than opening a second.

A card nobody can buy still costs what it costs. It keeps its prices and offers
nothing to press, and a card with one grade sold and another still for sale says
so per grade.

::spec{id="grade10-store/product-page" scenario="product-page-SC-11"}

:::callout{kind="note"}
No Figma frame exists for this page's buy box, and no `@grade10/ui` block covers
it — the card page is composed in the app. The grid's product card, which is
where a collector reaches this page from, is a shared block and does have frames.
:::

::story{id="store-product-listing-productcard--sold-out" title="The grid card a sold-out page is reached from"}

## Journeys

::journeys{id="grade10-store/product-page"}

## The contract

::spec{id="grade10-store/product-page"}
