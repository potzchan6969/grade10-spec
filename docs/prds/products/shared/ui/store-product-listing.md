---
title: Product Listing Blocks
spec: shared/ui/store-product-listing
order: 4
---

The blocks a store's catalogue is browsed with: a filter sidebar, a results header and a grid of product tiles.

## What the App Supplies

- **Everything Shown** — the products, their order, the counts, the filters and the suggestions; the blocks show what they are given and report each change
- **Cart Limits** — a cart control's maximum and a tile's remaining count; the card works out neither
- **Empty and No Match** — told apart, each with its own words

::story{id="store-product-listing-blocks-productbrowse--default" title="The whole browse surface"}

## Product Tile

- **Photo** — the whole photo, centred and as large as it fits in the square well, rounding with the well's corners
  - **As Supplied** — not blended into the well
  - **On Hover** — may grow and lose its edges until the pointer leaves
- **Name** — opens the product, as the photo does, underlined on hover and keyboard focus; a name that doesn't open is plain text
  - **One Stop to Open** — the name is the tile's only keyboard stop and the one control a screen reader announces; the photo opens on a pointer press
- **Link** — a tile given its product's page is a link, so it opens in a new tab and its address can be copied — [You May Also Like](/p/grade10-site/store/cross-sell)
- **Cart Control** — always visible on small screens and touch; on a wide screen with a mouse, on hover or keyboard focus
- **Sold Out** — the sold-out treatment over the photo; doesn't open where the tile sells
  - **Where Nothing Sells** — opens its product, as on [You May Also Like](/p/grade10-site/store/cross-sell) and the [Main Page](/p/grade10-site/store/home)'s row of cards
- **Photo on Its Own** — used without its tile, opens where the tile would, as its own keyboard stop named for the product

::story{id="store-product-listing-blocks-productcardimage--non-square-photo" title="The whole photo in the well"}

## Small Screens

- **Pills** — the result count, sort and one per facet group, each opening a drawer from the bottom
  - **Facet Drawers** — a draft until the shopper confirms

::story{id="store-product-listing-blocks-productbrowse--narrow" title="Small screen"}

## Search

- **Search Box** — wide screens only, with the filters
  - **Suggestions** — the product and filter groups the app gives
  - **Searching and No Match** — shown while hits resolve, and when nothing matched
  - **Enter and Picking** — reported to the app; the box doesn't navigate or apply a filter itself

::story{id="store-product-listing-blocks-productbrowse-search--suggestions-and-commit" title="Search"}

:::detail{title="Product decisions" for="pm"}
The surface displays what a consuming application supplies and decides none of
it. The first two rows place two parts of its map; the rest decide the tile.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Responsive layout | Decided | The list answers the width it is given. It is its own part of the map, as the spec places it, because no other part means it. Not folded into the tile contract. | Product |
| Load more | Decided | Reaching the end of the catalogue and waiting for the next products are reported like every other change. It is its own part of the map, as the spec places it, because reaching the end is not a choice the shopper makes in the filters or the sort. Not folded into Filters and sort. | Product |
| Tile as a link | Decided | A tile that opens a product is a link: it opens in a new tab and its address can be copied, like any other. The surface gives the tile its product's page; the listing gives its tiles theirs in its own round, and until then its cards open in place. | Product |
| Look | Decided | The blocks' stories are the agreed look: the photo unblended and a sold-out tile's dimmed photo growing on hover. The earlier frames are historical. | Design |
| One stop to open | Decided | The name is the one keyboard stop that opens the product, so a Tab user passes one stop fewer on every tile and a screen reader announces each product once. Ruled out: the photo and the name as two stops for one destination. | Product |
| Sold-out opens where nothing sells | Decided | A surface that draws no cart control carries the collector on to another product, so it has no reason to stop at a card nobody can buy. Ruled out: a sold-out tile inert everywhere, a dead end on that surface. | Product |
| The underline means it opens | Decided | A name that opens is underlined on hover and on keyboard focus, and a name that does not open stays plain, so the underline never promises a press that does nothing. Ruled out: an underline on every name. | Product |
| Whole photo | Decided | The tile shows the whole photo, centred and as large as it fits, so a slab or a box shows whole before its product opens. Where the photo reaches into the well's rounded corners it rounds with them, which is not a crop. Ruled out: cropping the photo to fill the square; growing the photo on hover only inside the well, which shrinks every photo at rest; a small upload at its own size, which draws it small; insetting the photo to clear the rounded corners, which shrinks every square photo. | Product |
| Photo as supplied | Decided | The photo is not blended into the well. Multiply made a white studio fill read as transparent, and muddied a real catalogue photo once it letterboxes. A white fill shows white inside the grey well. | Product |
| Measure for the whole photo | Decided | Not measured: the tile now draws the photo it is given. Ruled out: comparing how often slab and box tiles open their product before and after, which can move either way, and a new tile event that records each photo's shape, which adds tracking for a rendering fix. | Product |
:::
