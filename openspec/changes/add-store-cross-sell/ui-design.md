## Screens

### You may also like

No frame is drawn for the rail yet — 2026-09-21, awaited from @tangconst — so
this file names none of its own. The rail sits
on the product detail frame the redesign draws —
[Product Detail `4098:2423`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423&m=dev) —
under the card's own sections and above the footer.

## Components

| Export | Package | Exists | Composes |
| --- | --- | --- | --- |
| `StoreProductRelatedRail` | `@grade10/ui`, `src/blocks/store-product/` | No — new work in this store | The rail: the heading and up to six tiles, no cart control, each tile opening its card |
| `StoreSectionHeader` | `@grade10/ui`, `src/blocks/store-home/` | Yes | The heading **You may also like**, with no browse-all link |
| `ProductCard` | `@grade10/ui`, `src/blocks/store-product-listing/` | Yes | One tile: image, name, price; `onCartQuantityChange` left unset so no cart control is drawn; `soldOut` on a chosen pick nobody can buy |
| `HStack`, `VStack` | `@grade10/design-system` | Yes | Layout |

**Copy.** One new key in the shared layer, answered in every language it
speaks (`en`, `ko`, `zh-Hans`, `zh-Hant`): `product.youMayAlsoLike` —
**You may also like**. The tile's own words (`store.soldOut`) exist.

## States

### You may also like

| State | Shows | Anchor |
| --- | --- | --- |
| Picks and similar | The heading; up to six tiles, the picks first in their order, then similar cards; each tile opens its card | `grade10-site-store-cross-sell-US-01` |
| Similar only | The heading; similar tiles alone, newest first among equals | `grade10-site-store-cross-sell-US-02` |
| One card | The heading and one tile; the row keeps its height | `grade10-site-store-cross-sell-US-01` |
| Nothing to show | No heading, no rail, no space left for it | `grade10-site-store-cross-sell-US-03` |
| A chosen pick sold out | The tile with the sold-out treatment, its price shown, nothing to press but the card itself | `grade10-site-store-cross-sell-US-01` |
| Rail loading | None: the rail is in the page's response, so no skeleton is drawn | `grade10-site-store-cross-sell-US-01` |
| Picks could not be read | The rail as if there were nothing to show; the card's page is unaffected | `grade10-site-store-cross-sell-US-03` |
| Narrow viewport | As the frame draws it; the frame is awaited | `grade10-site-store-cross-sell-US-01` |
