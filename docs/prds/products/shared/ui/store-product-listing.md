---
title: Product Listing Blocks
spec: shared/ui/store-product-listing
order: 4
reviewed: 2026-09-25
---

This is the page a shopper browses a category on. A sidebar carries a heading, a
search box and the filter groups. A header above the grid states how many
results there are, which filters are applied, and how the list is sorted. The
grid shows product tiles that reflow their column count with the width available
and load more as the shopper scrolls.

## Product Tile

🚧 **Whole photo** — the square well shows the full picture; leftover space is
the well, not a cropped edge. Available, on sale, sold out and in cart all do
this.

🚧 **No multiply** — the photo is drawn as supplied, not blended into the well.

🚧 **Name opens the product** — when the tile can open a product, the name
does too, the same way the photo does, and shows it by an underline on hover
and on focus; a sold-out tile’s name stays inert where the tile sells, and a
name that does not open is plain text.

🚧 **One stop to open** — the name is the tile's only keyboard stop for
opening the product and the one control a screen reader announces for it, so
each product is announced once; the photo opens on a pointer press only.

🚧 **A link** - a tile that opens, given its product's page, is a link to
it: it can open in a new tab, and its address can be copied -
[You May Also Like](/p/grade10-site/store/cross-sell)'s tiles

**Opens where it does not sell** - on a surface that draws no cart control,
a sold-out tile still opens its product, sold-out treatment and all -
[You May Also Like](/p/grade10-site/store/cross-sell), and the
[Main Page](/p/grade10-site/store/home)'s row of cards

🚧 **No cart words where it does not sell** — a tile that draws no cart
control needs no cart word from the surface

**Cart on a small screen** — where the tile sells, the round cart control
stays visible without hover on a narrow viewport and on touch; on a wide
viewport with a fine pointer it still appears on hover or keyboard focus.

## Adaptive Filter

🚧 **Narrow pills** — below the wide breakpoint: result count and pills for
sort and each facet group; bottom drawers; no listing search. Facet drawers
draft until Show Results. Wide keeps the sidebar and chip header.

## Search

On a wide viewport the listing search field sits with the filters. Narrow
chrome has no search. The application decides which hits to show.

- 🚧 **Supplied groups** — while they type, the field shows the product and
  filter groups it is given; it invents none
- 🚧 **Searching and empty** — while hits resolve it shows searching and
  invents no row; when nothing matched it says so; Enter still reports a
  commit either way
- 🚧 **Commit and pick** — submitting with no row highlighted reports a
  search commit; activating a row reports that suggestion; the surface does
  not navigate or apply filters

The surface holds no state of its own. Which products match, how they are
ordered, how many there are and what a cart control does are all the
application's answers; the components render a selection and report a change.
The ceiling a cart control stops at and the count a tile says are the
application's too — the card derives neither and judges nothing about scarcity.
A sold-out tile shows no count, because nothing is left to run out of. An empty
catalogue and a search that matched nothing are told apart, because they need
different words.

:::flow{title="Browsing and filtering"}
## The page opens

On a wide viewport the sidebar shows the search box and filter groups; the
header shows the result count, sort, and chips. On a narrow viewport the
listing shows the result count and pills for sort and each facet group.

## The shopper searches

On a wide viewport they type in the listing search field. The field shows the
groups it is given, or that it is searching, or that nothing matched. Submitting
or picking a row is reported; the application decides what matches. Narrow
chrome has no search.

## They open a facet on a narrow viewport

A facet pill opens a bottom drawer for that group. They tick options in a
draft; Show Results applies and closes; Clear empties the draft for that group.

## They tick a filter on a wide viewport

A chip for it appears in the result header under the applied filters, and can be
removed from there.

## They change the sort

The header reports it and the grid re-renders with whatever the application
returns.

## They scroll

More products load in place, until the end of the catalogue is reached.

## Nothing matches

The surface shows a no-match state — distinct from the state it shows when the
catalogue itself is empty.

## They add to the cart

The tile reports the quantity change and the application updates the cart.
:::

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868" title="Product Listing — the browse page"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155" title="Product Card"}

::story{id="store-product-listing-productbrowse--default" title="The whole browse surface"}

::story{id="store-product-listing-productbrowse-states--no-match" title="A search that matched nothing"}

::story{id="store-product-listing-productbrowse-states--empty-catalog" title="An empty catalogue, which is a different state"}

::story{id="store-product-listing-productcardimage--default" title="The full photo in the well"}

::story{id="store-product-listing-productcardimage--sold-out" title="A sold-out product tile"}

::story{id="store-product-listing-productcard--sold-out-opens-where-nothing-sells" title="A sold-out tile that opens where nothing sells"}

:::detail{title="Product decisions" for="pm"}
The surface displays what a consuming application supplies and decides none of
it. The first two rows place two parts of its map; the rest decide the tile.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Responsive layout | Decided | The list answers the width it is given. It is its own part of the map, as the spec places it, because no other part means it. Not folded into the tile contract. | Product |
| Load more | Decided | Reaching the end of the catalogue and waiting for the next products are reported like every other change. It is its own part of the map, as the spec places it, because reaching the end is not a choice the shopper makes in the filters or the sort. Not folded into Filters and sort. | Product |
| Tile as a link | Decided | A tile that opens a product is a link: it opens in a new tab and its address can be copied, like any other. The surface gives the tile its product's page; the listing gives its tiles theirs in its own round. | Product |
| One stop to open | Decided | The name is the one keyboard stop that opens the product, so 24 tiles cost 24 Tab presses rather than 48 and a screen reader announces each product once. Ruled out: the photo and the name as two stops for one destination. | Product |
| Sold-out opens where nothing sells | Decided | A surface that draws no cart control carries the collector on to another product, so it has no reason to stop at a card nobody can buy. Ruled out: a sold-out tile inert everywhere, a dead end on that surface. | Product |
| The underline means it opens | Decided | A name that opens is underlined on hover and on focus, and a name that does not open stays plain, so the underline never promises a press that does nothing. Ruled out: an underline on every name. | Product |
:::
