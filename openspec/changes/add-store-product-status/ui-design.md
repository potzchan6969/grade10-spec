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
layout remains owned by the existing cart capability. Add reference states for
an unchecked cart, checkout-time changes and shop refusal. The drawer remains
open unless the store creates an order with a Shopify hosted checkout URL.

## Components

- **Store listing:** `ProductBrowse`, `ProductCard` from `@grade10/ui`.
- **Product details:** `StoreProductGallery`, `StoreProductHeader`,
  `StoreProductDescription`, `StoreProductMetadata`,
  `StoreProductPurchasePanel` from `@grade10/ui`.
- **Cart drawer:** `CartDrawer` from `@grade10/ui`.
- **Checkout feedback:** the Grade10 cart host supplies line states, persistent
  retry notices and checkout results to the drawer.
- **Copy:** reuse the existing availability, sold-out, tender and checkout
  outcome messages. Localize unchecked and retry notices. No new variant-choice
  label, component or token is needed.

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
| The initial cart read fails before lines are known | A drawer-level unchecked notice and Retry; no line name or total is invented and checkout remains unavailable | `grade10-site-store-cart-validation-SC-23` |
| Checkout is in progress | The drawer remains open; the action cannot be sent twice and its lines are not presented as confirmed by the earlier read | `grade10-site-store-cart-validation-SC-02`, `grade10-site-store-cart-validation-SC-18` |
| Checkout confirms every line | The accepted quote is sent with the lines; the collector leaves for Shopify | `grade10-site-store-cart-validation-SC-17` |
| A line changes at checkout | The drawer stays open and names every changed line with its out-of-stock, unavailable, adjusted or repriced result | `grade10-site-store-cart-validation-SC-15`, `grade10-site-store-cart-validation-SC-16` |
| The checkout-time read fails | The drawer stays open; each known line and the total are unchecked, and Retry offers the cart again | `grade10-site-store-cart-validation-SC-21` |
| The shop refuses after a passing read | The drawer names each refused line and any short-fill amount; the cart remains available to resolve | `grade10-site-store-cart-validation-SC-19`, `grade10-site-store-cart-validation-SC-20` |
| Checkout requires identity verification | The drawer explains the threshold and offers the existing account verification action; the cart remains available | **Out of suite:** existing `CheckoutResolution.verify` treatment and Checkout PRD buyer-verification rule |
| Checkout creates an order without a hosted URL | The drawer shows the existing settling outcome and the order remains trackable | **Out of suite:** existing `CheckoutResolution.settling` treatment and Checkout PRD order flow |
| Checkout cannot proceed for another reason | The drawer preserves the existing retry or support treatment and any coupon or points refusal; an unchanged request is not silently retried when its choice must change | **Out of suite:** existing `CheckoutResolution.retry` and `CheckoutResolution.support` treatments |
