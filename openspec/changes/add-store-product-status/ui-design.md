## Screens

### Store listing

Use the existing listing composition in the PRD's
`pages-product-list-page--default` Storybook story and the registered
[Product List page frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868).
Keep the established page layout; the product-status requirement controls what
availability information the listing shows.

### Product details

Use the existing product-detail composition in the PRD's
`pages-product-detail-page--docs` Storybook story and the registered
[Product Detail page frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423).
Keep the established one-item page: show the price and availability of its
sellable item, without a shopper-facing variant chooser or variant title.
**This reference is out of sync:** its accepted “Low inventory indicator”
annotation asks for an `Only X left` cue, while the product-status requirement
forbids stock counts and scarcity cues on browse surfaces. This change follows
the requirement and removes that cue from the Storybook reference. The frame
owner must supersede the annotation through the design annotation workflow
before this frame is treated as current.

### Cart drawer

Use the existing Cart Drawer composition in the PRD's
`store-cart-cartdrawer--default` and
`store-cart-cartdrawer--unavailable-items-removed` Storybook stories. Cart
layout remains owned by the existing cart capability.

### Checkout review

The Grade10 pre-checkout route is assembled by `CheckoutPage`; the Checkout
PRD has no registered page Storybook story or Figma frame. Keep its existing
line-summary layout and make the review, refusal and retry states below
visible before the collector can leave for Shopify.

## Components

- **Store listing:** `ProductBrowse`, `ProductCard` from `@grade10/ui`.
- **Product details:** `StoreProductGallery`, `StoreProductHeader`,
  `StoreProductDescription`, `StoreProductMetadata`,
  `StoreProductPurchasePanel` from `@grade10/ui`.
- **Cart drawer:** `CartDrawer` from `@grade10/ui`.
- **Checkout review:** the existing Grade10 `CheckoutPage` line summary and
  review notice.
- **Copy:** reuse the existing availability and sold-out messages. No new
  variant-choice label, component or token is needed.

## States

### Store listing

| State | Shows | Anchor |
| --- | --- | --- |
| A tile with an available variant | The existing usable add control communicates availability; no separate status label, count or scarcity cue | `grade10-site-commerce-product-status-SC-10` |
| Every variant on a tile is unavailable | Sold-out status and no usable add control | `grade10-site-commerce-product-status-SC-13` |
| Available variants have different counts | The same available treatment and controls; no remaining count | `grade10-site-commerce-product-status-SC-10` |
| A requested add quantity exceeds the browse count | The requested quantity without a stock-derived maximum or remaining-count message | `grade10-site-commerce-product-status-SC-07`, `grade10-site-commerce-product-status-SC-11` |

### Product details

| State | Shows | Anchor |
| --- | --- | --- |
| The product's internal sale item is available | Its price and available purchase control; no variant name or chooser | `grade10-site-store-product-page-SC-08`, `grade10-site-commerce-product-status-SC-12` |
| The internal sale item is unavailable | Its price remains visible, the product reads sold out, and no add is offered | `grade10-site-store-product-page-SC-11`, `grade10-site-commerce-product-status-SC-15` |
| No product item can be bought | The listed price remains visible and no product can be added | `grade10-site-store-product-page-SC-11`, `grade10-site-commerce-product-status-SC-13` |
| A requested quantity exceeds the browse count | The requested quantity without a stock-derived maximum or remaining-count message | `grade10-site-commerce-product-status-SC-07`, `grade10-site-commerce-product-status-SC-11` |

### Cart drawer

| State | Shows | Anchor |
| --- | --- | --- |
| Cart review is pending | Lines are unconfirmed and checkout is unavailable | `grade10-site-store-cart-validation-SC-03` |
| Only part of a requested quantity can be filled | The corrected quantity and an explanation of the short fill | `grade10-site-store-cart-validation-SC-05` |
| A line is out of stock | The line remains visible, marked out of stock and removable | `grade10-site-store-cart-validation-SC-06` |
| A product is withdrawn from the store | The unavailable line is removed after review; a distinct toast names each removed product | `grade10-site-store-cart-validation-SC-09`, `grade10-site-store-cart-validation-SC-10` |
| A line's price changes | The current price and a clear price-change message | `grade10-site-store-cart-validation-SC-11`, `grade10-site-store-cart-validation-SC-12` |
| Cart-open review cannot finish | A persistent error toast names each unchecked line and offers retry; the affected lines' availability, prices and cart total are replaced with unchecked copy; checkout remains unavailable | `grade10-site-store-cart-validation-SC-22` |

### Checkout review

| State | Shows | Anchor |
| --- | --- | --- |
| The checkout-time review is pending | The affected lines are not presented as confirmed; Pay is unavailable | `grade10-site-store-cart-validation-SC-03` |
| The checkout-time review confirms every line | The current price is used for the handoff and Pay becomes available | `grade10-site-store-cart-validation-SC-17` |
| A cart line changes before checkout | Every changed line is named with its out-of-stock, unavailable, adjusted or repriced result; Pay is unavailable until the cart is resolved | `grade10-site-store-cart-validation-SC-15`, `grade10-site-store-cart-validation-SC-16` |
| The checkout-time review cannot finish | Each held line is named as unchecked, its last availability, price and total are replaced by unchecked copy, and Retry is available | `grade10-site-store-cart-validation-SC-21` |
| The shop refuses after its review passed | The refused line and any short-fill answer are named from the checkout result; the cart remains available to resolve | `grade10-site-store-cart-validation-SC-19`, `grade10-site-store-cart-validation-SC-20` |
