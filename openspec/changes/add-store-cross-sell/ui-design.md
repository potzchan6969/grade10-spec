## Screens

### You may also like

No frame was drawn (Q49): the rail is designed in code, ahead of the Figma
file, and its Storybook stories show it. The tile is the existing Product
Card, not a new one. The host frame is the redesign's
[Product Detail `4098:2423`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423&m=dev).

- **Row** — one row under the card, 16px between tiles, each tile as tall as
  the tallest; the row answers the width it is given, not the screen's
- **Six fit** — from 1152px of rail width the six tiles sit side by side and
  nothing scrolls; a tile is then about 190px wide on the 1280px page
- **Narrower** — below 1152px the row scrolls sideways and each tile snaps
  to its start, with part of the next tile showing: about 4⅓ tiles from 896px,
  3⅓ from 576px, and 2⅓ on a phone (Q51); a mouse scrolls it by the
  browser's own scrollbar under the row (Q54)
- **Prices** — where a narrow tile cannot hold a price and its crossed-out
  price on one line, the crossed-out price wraps under it
- **Sold-out tile** — the photo of a sold-out pick that opens grows on hover
  the way an available tile's photo does, and stays dim; it takes the focus
  ring and the name's underline of any tile, and draws no cart (Q50). Figma's
  `Product / Product Card Image` `4274:10074` draws no hover on a sold-out
  well: the code is ahead of the set there, and the design hand owes that
  cell
- **A link** — each tile's photo and name are links to its card's own page
  (Q52)

## Components

| Export | Package | Exists | Composes |
| --- | --- | --- | --- |
| `StoreProductRelatedRail` | `@grade10/ui`, `src/blocks/store-product/` | No — new work in this store | The rail: a region named by its heading, and the tiles it is given, in a row, no cart control, each tile a link to its card; the cap is the consumer's, where the picks are assembled |
| `StoreSectionHeader` | `@grade10/ui`, `src/blocks/store-home/` | Partly — `copy.browseAll` becomes optional where the link it names is not drawn, a widening in this store | The heading **You may also like**; the link already hides itself when no target is given, and the rail passes no browse-all word |
| `ProductCard` | `@grade10/ui`, `src/blocks/store-product-listing/` | Partly — a sold-out tile that still opens, with the hover and focus above; an optional `href` that draws the photo and the name as links; and `copy` — the cart's five words — optional where the control it names is not drawn | One tile: image, name, price; `onCartQuantityChange` left unset so no cart control is drawn; the rail passes no cart word; `soldOut` on a chosen pick nobody can buy; `href` from the card's own address |
| `HStack`, `VStack` | `@grade10/design-system` | Yes | Layout |

**Copy.** One new key in the shared layer, answered in every language it
speaks (`en`, `ko`, `zh-Hans`, `zh-Hant`): `product.youMayAlsoLike` —
**You may also like**. The tile's own word (`store.soldOut`) exists.

## States

### You may also like

| State | Shows | Anchor |
| --- | --- | --- |
| Picks and similar | The heading; up to 6 tiles, the picks first in their order, then similar cards | `grade10-site-store-cross-sell-SC-03` |
| Similar only | The heading; similar tiles alone where nobody chose picks, newest first among equals | `grade10-site-store-cross-sell-SC-15` |
| One card | The heading and one tile, at the width it takes in a full row | `grade10-site-store-cross-sell-SC-05` |
| Nothing to show | No heading, no rail, no space left for it | `grade10-site-store-cross-sell-SC-09` |
| A chosen pick sold out | The sold-out tile with its price, dim, still opening its card; its photo grows on hover and the tile takes the focus ring | `grade10-site-store-cross-sell-SC-14` |
| Changed picks | The rail shows the stock keeper's changed picks when the card's page does | `grade10-site-store-cross-sell-SC-12` |
| Rail loading | The rail is there when the page is; no skeleton | `grade10-site-store-cross-sell-SC-01` |
| Picks could not be read | Similar cards alone, as if nobody had chosen; the card's page is unaffected | `grade10-site-store-cross-sell-SC-28` |
| Narrow viewport | Whole tiles with part of the next tile showing; the row scrolls sideways and snaps to each tile | **Out of suite:** the block's own layout, read in its `Narrow` and `Wide` stories |
