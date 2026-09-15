---
title: Product Listing Blocks
spec: shared/ui/store-product-listing
order: 4
reviewed: 2026-09-11
---

This is the page a shopper browses a category on. A sidebar carries a heading, a
search box, the filter groups and utility links. A header above the grid states
how many results there are, which filters are applied, and how the list is
sorted. The grid shows product tiles that reflow their column count with the
width available and load more as the shopper scrolls.

## Product Tile

🚧 **Name opens the product** — when the tile can open a product, the name
does too, the same way the photo does; a sold-out tile’s name stays inert.

🚧 **Cart on a small screen** — where the tile sells, the round cart control
stays visible without hover on a narrow viewport and on touch; on a wide
viewport with a fine pointer it still appears on hover or keyboard focus.

## Adaptive Filter

🚧 **Narrow pills** — below the wide breakpoint: result count and pills for
sort and each facet group; bottom drawers; no listing search. Facet drawers
draft until Show Results. Wide keeps the sidebar and chip header.

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

On a wide viewport they type in the listing search field. The surface reports
the change; the application decides what matches. Narrow chrome has no search.

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

::story{id="store-product-listing-productcardimage--sold-out" title="A sold-out product tile"}

::::detail{title="Product decisions" for="pm"}
The surface displays what a consuming application supplies and decides none of
it. Two things it has always done were missing from the map above it, and are
recorded here rather than quietly folded into a group that does not mean them.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Responsive layout | Open | The list answers the width it is given, and has since it was written, but no part of the feature set said so. Named as its own part of the map. Confirm that is where it belongs, or fold it somewhere that already means it. | Product |
| Load more | Open | Reaching the end of the catalogue and waiting for the next products are reported like every other change, and were likewise unmapped. Named as its own part. Same question. | Product |
:::

