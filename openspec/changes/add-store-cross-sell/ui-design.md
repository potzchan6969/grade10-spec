## Screens

### You may also like

No frame is drawn for the rail yet — 2026-09-21, awaited from @tangconst — so
this file names none of its own. The host frame is the redesign's
[Product Detail `4098:2423`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423&m=dev).

## Components

| Export | Package | Exists | Composes |
| --- | --- | --- | --- |
| `StoreProductRelatedRail` | `@grade10/ui`, `src/blocks/store-product/` | No — new work in this store | The rail: the heading and the tiles it is given, in a row, no cart control, each tile opening its card; the cap is the consumer's, where the picks are assembled |
| `StoreSectionHeader` | `@grade10/ui`, `src/blocks/store-home/` | Partly — `browseAll` becomes optional, a widening in this store | The heading **You may also like**, with no browse-all link |
| `ProductCard` | `@grade10/ui`, `src/blocks/store-product-listing/` | Partly — a sold-out tile that still opens its card is new work in this store; today `soldOut` makes the tile inert | One tile: image, name, price; `onCartQuantityChange` left unset so no cart control is drawn; `soldOut` on a chosen pick nobody can buy |
| `HStack`, `VStack` | `@grade10/design-system` | Yes | Layout |

**Copy.** One new key in the shared layer, answered in every language it
speaks (`en`, `ko`, `zh-Hans`, `zh-Hant`): `product.youMayAlsoLike` —
**You may also like**. The tile's own word (`store.soldOut`) exists.

## States

### You may also like

| State | Shows | Anchor |
| --- | --- | --- |
| Picks and similar | The heading; up to 6 tiles, the picks first in their order, then similar cards; each tile opens its card | `grade10-site-store-cross-sell-US-01` |
| Similar only | The heading; similar tiles alone, newest first among equals | `grade10-site-store-cross-sell-US-02` |
| One card | The heading and one tile; as the frame draws it | `grade10-site-store-cross-sell-US-01` |
| Nothing to show | No heading, no rail, no space left for it | `grade10-site-store-cross-sell-US-01` |
| A chosen pick sold out | The tile with the sold-out treatment, its price shown; it still opens its card | `grade10-site-store-cross-sell-US-01` |
| Changed picks | The rail shows the stock keeper's changed picks when the card's page does | `grade10-site-store-cross-sell-US-03` |
| Rail loading | None: the rail is in the page's response, so no skeleton is drawn | `grade10-site-store-cross-sell-US-01` |
| Picks could not be read | The rail as if there were nothing to show; the card's page is unaffected | `grade10-site-store-cross-sell-US-01` |
| Narrow viewport | As the frame draws it; the frame is awaited | `grade10-site-store-cross-sell-US-01` |
