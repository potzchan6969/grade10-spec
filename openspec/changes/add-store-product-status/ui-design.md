## Screens

### Store listing

Use the existing listing composition in the PRD's
`pages-store-product-list-page--default` Storybook story and the registered
[Product List page frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868).
Keep the established page layout; the product-status requirement controls what
availability information the listing shows.

### Product details

Use the existing product-detail composition in the PRD's
`pages-store-product-detail-page--docs` Storybook story and the registered
[Product Detail page frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423).
Keep the established one-item page: show the price and availability of its
sellable item, without a shopper-facing variant chooser or variant title.
**This reference is out of sync:** its accepted “Low inventory indicator”
annotation asks for an `Only X left` cue, while the product-status requirement
forbids stock counts and scarcity cues on browse surfaces. This change follows
the requirement and removes that cue from the Storybook reference; it does not
edit the Figma frame. The annotation is superseded through the design
annotation workflow, handed to redraw-store-product-card-frames for the
designer (decisions Q7); until then the requirement governs and the frame is
not treated as current.

### Cart drawer

Use the existing Cart Drawer composition in the PRD's
`store-cart-cartdrawer--default` and
`store-cart-cartdrawer--unavailable-items-removed` Storybook stories. Cart
layout remains owned by the existing cart capability. Checkout starts from the
drawer, with no separate checkout page, so the checkout-time review, refusal
and retry states below show in the drawer before the collector leaves for
Shopify.

## Components

- **Store listing:** `ProductBrowse`, `ProductCard` from `@grade10/ui`.
- **Product details:** `ListingLotGallery`, `StoreProductHeader`,
  `StoreProductDescription`, `StoreProductMetadata`,
  `StoreProductPurchasePanel` from `@grade10/ui`.
- **Cart drawer:** `CartDrawer` from `@grade10/ui`, with its checkout action
  and refusal notice.
- **Copy:** reuse the existing availability and sold-out messages and
  `checkout.review.blocked`; add `checkout.review.soldOut`,
  `checkout.review.unavailable`, `checkout.review.reduced` (`{count}`) and
  `checkout.review.repriced` (`{price}`), each with `{title}`, for the
  outcome the checkout answer gives each moved line, and
  `checkout.review.filledShort` (`{title}`, `{count}`) for a line the shop
  would fill short. No new variant-choice
  label, component or token is needed.

## States

### Store listing

| State | Shows | Anchor |
| --- | --- | --- |
| A tile with an available variant | The one item's price, and the existing usable add control communicates availability; no separate status label, count or scarcity cue | `grade10-site-commerce-product-status-SC-10`, `grade10-site-commerce-product-status-SC-12` |
| Every variant on a tile is out of stock | Sold-out status and its price; nothing that adds it can be pressed | `grade10-site-commerce-product-status-SC-13` |
| Available variants have different counts | The same available treatment and controls; no remaining count | `grade10-site-commerce-product-status-SC-10` |
| A requested add quantity exceeds the browse count | The requested quantity without a stock-derived maximum or remaining-count message | `grade10-site-commerce-product-status-SC-17` |

### Product details

| State | Shows | Anchor |
| --- | --- | --- |
| The product's internal sale item is available | Its price and available purchase control; no variant name or chooser | `grade10-site-store-product-page-SC-33`, `grade10-site-store-product-page-SC-34`, `grade10-site-commerce-product-status-SC-12` |
| A listed variant is sold out and a later one is for sale | The item for sale, its price and its purchase control; the sold-out variant is not shown | `grade10-site-store-product-page-SC-12` |
| The internal sale item is out of stock | Its price remains visible, the product reads sold out, and nothing that adds it can be pressed | `grade10-site-store-product-page-SC-11`, `grade10-site-commerce-product-status-SC-15` |
| A requested quantity exceeds the browse count | The requested quantity without a stock-derived maximum or remaining-count message | `grade10-site-commerce-product-status-SC-17` |

### Cart drawer

| State | Shows | Anchor |
| --- | --- | --- |
| Cart review is pending | Lines are unconfirmed and checkout is unavailable | `grade10-site-store-cart-validation-SC-03` |
| Only part of a requested quantity can be filled | The corrected quantity and an explanation of the short fill | `grade10-site-store-cart-validation-SC-05` |
| A line is out of stock | The line remains visible, marked out of stock and removable; checkout is unavailable until it is removed | `grade10-site-store-cart-validation-SC-06`, `grade10-site-store-cart-validation-SC-26` |
| A product is withdrawn from the store | The line leaves the cart when it opens; one toast names every removed product | `grade10-site-store-cart-validation-SC-09`, `grade10-site-store-cart-validation-SC-10` |
| A line's price changes | The current price and a clear price-change message | `grade10-site-store-cart-validation-SC-11`, `grade10-site-store-cart-validation-SC-12` |
| Cart-open review cannot finish | A persistent error toast names each unchecked line and offers retry; the affected lines' availability, prices and cart total are replaced with unchecked copy; checkout remains unavailable | `grade10-site-store-cart-validation-SC-22` |
| Initial cart read fails before any lines are known | The drawer body keeps its loading treatment, never its empty state, as `shared/ui/store-cart` shows a cart not yet read; a persistent notice offers Retry without line names or a current total; checkout remains unavailable | `grade10-site-store-cart-validation-SC-23` |
| The checkout-time review confirms every line | The checkout action proceeds with the current prices | `grade10-site-store-cart-validation-SC-17` |
| A cart line changes at checkout | The drawer stays open and names every changed line with its out-of-stock, unavailable, adjusted or repriced result; an unavailable line leaves the cart under the removal toast; checkout is unavailable until the cart is resolved | `grade10-site-store-cart-validation-SC-15`, `grade10-site-store-cart-validation-SC-16`, `grade10-site-store-cart-validation-SC-27`, `grade10-site-store-cart-validation-SC-29` |
| The checkout-time review cannot finish | Each held line is named as unchecked, its last availability, price and total are replaced by unchecked copy, and Retry is available; checkout stays unavailable | `grade10-site-store-cart-validation-SC-21` |
| The shop refuses after its review passed | The drawer names the refused line and any short-fill answer from the checkout result; the cart is read again as on opening, so a line filled short then reads adjusted at the shop's count; the cart remains available to resolve | `grade10-site-store-cart-validation-SC-19`, `grade10-site-store-cart-validation-SC-20`, `grade10-site-store-cart-validation-SC-28` |
