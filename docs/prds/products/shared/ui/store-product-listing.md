---
title: Product Listing Blocks
spec: shared/ui/store-product-listing
order: 4
---

This is the page a shopper browses a category on. A sidebar carries a heading, a
search box, the filter groups and utility links. A header above the grid states
how many results there are, which filters are applied, and how the list is
sorted. The grid shows product tiles that reflow their column count with the
width available and load more as the shopper scrolls.

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

The sidebar shows the search box and filter groups; the header shows the result
count and the sort control.

## The shopper searches

They type in the sidebar. The surface reports the change; the application
decides what matches.

## They tick a filter

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
