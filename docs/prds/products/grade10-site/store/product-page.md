---
title: Product Details
spec: grade10-site/store/product-page
order: 3
---

The product details page shows one product, its price, and the one item for
sale a collector can add.

## Product Card

- **Card** — name, pictures, description and price of the one item for sale
  - **One Item to Buy** — no size, option or variant to choose
  - **Sale Price** — struck through as on the listing — [Discounts](/p/grade10-site/store/discounts#where-each-shows)
  - **Badges** — where the catalogue gives them, with the site's discounts named among them — [Discounts](/p/grade10-site/store/discounts#where-each-shows)
  - **Description** — a long one shows three lines, with a button to read it in full without leaving the page

:::callout{kind="note"}
- ❓ **Short description** — one that fits in three lines shows whole, with no button. Design confirms
:::

::story{id="store-product-page-screens-product-detail--docs" title="Product details"}

## Buy

- **Quantity** — how many to add
- **Cart Button** — adds the product and stays on the page
  - **Pending** — the controls show Adding… until the add settles
  - **Added** — the cart drawer opens, the quantity resets and the cart total updates
  - **Adding Again** — the same product stays one line in the cart
  - **Signed Out** — adds to the cart this browser holds, with no sign-in; signing in later moves those lines into the member's cart — [Cart Drawer](/p/grade10-site/store/cart#reviewing-the-cart)
- 🚧 **Stock** — whether the item can be bought, with no count left or scarcity cue; the quantity isn't capped by it, and the cart explains a short fill
- **Sold Out** — says so and can't be added; its price stays

:::detail{title="One item to buy" for="engineer"}
- **Sale Identifier** — Shopify's identifier for the one item for sale never shows; only availability and the cart use it
:::

## Free Pick-up

- **Shipping and Pick-up Lines** — the same on every card: shipping calculated at checkout, free pick-up at Hong Kong Grade10 Store
  - **Store Name** — opens Store Locator in the same tab, in the page's language
  - **Shipping Fee** — plain text, not a link: no page stands behind it

## Shared Link

- **Link Preview** — the card's first picture, fitted whole into the wide box a preview fetcher lays out and padded white; it asks for the wide card
  - **No Picture** — a card the catalogue has no picture for unfurls without one, and asks for the small card

## You May Also Like

- **Related Cards** — under the card — [You May Also Like](/p/grade10-site/store/cross-sell)

## Unknown Product Address

- 🚧 **Not-Found State** — `grade10.com/store/products/<handle>` with no card for the handle shows the Store's own not-found state, in the page's language, still answering 404; its one action returns to the product listing in the same tab
  - **Other Addresses** — one outside an owned surface keeps the site's generic not-found page and its Home action

::story{id="store-product-page-screens-product-detail--unknown-product-address" title="Unknown product address"}

:::detail{title="Product decisions" for="pm"}
A card travels as a pasted address more often than it is found by search, and
the preview is all the receiver sees before deciding to open it.

- **Fitted, not cropped** — a slab's label or a card's corner cut off is the one thing a preview of it must not do
- **White pad** — product photographs sit on white, so the pad reads as more of the same rather than as a colour of ours
- **No picture, no tag** — a fetcher's own placeholder beats a broken image
- **One sizing rail** — the size is asked of the shop's CDN by address, so one catalogue image serves the preview, the grid and the gallery
- **Large card on X** — X sizes the card from the named shape alone and defaults to the small square
- **Originals under the box are enlarged** — a small picture reads soft rather than small, and the declared size is always the delivered one
- **No `Only X left`** — the Product Detail frame's Low inventory indicator is superseded by the no-scarcity rule; the stories are the agreed look
- **Remaining count stays in the shared blocks** — Grade10 supplies none of the header's or listing card's remaining count, nor a stepper ceiling from stock, but the blocks keep all three as optional props
- ❓ **A catalogue image that fails to transform** — whether a card whose image exists but fails to load or resize from the CDN falls back to no `og:image`, as with no image, or something else. Engineering confirms
- **Not in scope** — a composed background, until a plain pad is shown to read poorly; a second image size from the catalogue read; changing which image is first; a picture for the auction lot's address
- ❓ **Unmeasured** — opens per shared product link; nothing records them yet. Product confirms
:::
