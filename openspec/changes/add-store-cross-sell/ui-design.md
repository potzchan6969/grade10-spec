## Screens

### You may also like

Frame awaited from @tangconst by 2026-09-24: the rail's tile width, the gap,
the row's behaviour at narrow, and the sold-out tile's hover and focus state on
the set `Product / Product Card` `4200:155`. The tile is the existing Product
Card, not a new one — that much is decided today. The host frame is the
redesign's
[Product Detail `4098:2423`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423&m=dev).

## Components

| Export | Package | Exists | Composes |
| --- | --- | --- | --- |
| `StoreProductRelatedRail` | `@grade10/ui`, `src/blocks/store-product/` | No — new work in this store | The rail: the heading and the tiles it is given, in a row, no cart control, each tile opening its card; the cap is the consumer's, where the picks are assembled |
| `StoreSectionHeader` | `@grade10/ui`, `src/blocks/store-home/` | Partly — `copy.browseAll` becomes optional where the link it names is not drawn, a widening in this store | The heading **You may also like**; the link already hides itself when no target is given, and the rail passes no browse-all word |
| `ProductCard` | `@grade10/ui`, `src/blocks/store-product-listing/` | Partly — a sold-out tile that still opens its card is design work in Figma (a hover and focus state on `Product / Product Card` `4200:155`, which draws the sold-out tile inert today) and component work in this store; and `copy` — the cart's five words — becomes optional where the control it names is not drawn | One tile: image, name, price; `onCartQuantityChange` left unset so no cart control is drawn; the rail passes no cart word; `soldOut` on a chosen pick nobody can buy |
| `HStack`, `VStack` | `@grade10/design-system` | Yes | Layout |

**Copy.** One new key in the shared layer, answered in every language it
speaks (`en`, `ko`, `zh-Hans`, `zh-Hant`): `product.youMayAlsoLike` —
**You may also like**. The tile's own word (`store.soldOut`) exists.

## States

### You may also like

| State | Shows | Anchor |
| --- | --- | --- |
| Picks and similar | The heading; up to 6 tiles, the picks first in their order, then similar cards; each tile opens its card | `grade10-site-store-cross-sell-US-01` |
| Similar only | The heading; similar tiles alone where nobody chose picks, newest first among equals | `grade10-site-store-cross-sell-US-02` |
| One card | The heading and one tile; as the frame draws it | `grade10-site-store-cross-sell-US-01` |
| Nothing to show | No heading, no rail, no space left for it | `grade10-site-store-cross-sell-US-02` |
| A chosen pick sold out | The sold-out tile with its price, still opening its card, still taking hover and focus | `grade10-site-store-cross-sell-US-01` |
| Changed picks | The rail shows the stock keeper's changed picks when the card's page does | `grade10-site-store-cross-sell-US-03` |
| Rail loading | The rail is there when the page is; no skeleton | `grade10-site-store-cross-sell-US-01` |
| Picks could not be read | The rail as if there were nothing to show; the card's page is unaffected | `grade10-site-store-cross-sell-US-01` |
| Narrow viewport | Awaited — the tile width, the gap, and whether the row wraps or scrolls | `grade10-site-store-cross-sell-US-01` |
