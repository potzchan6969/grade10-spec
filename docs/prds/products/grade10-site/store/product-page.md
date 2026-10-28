---
title: Product Details
spec: grade10-site/store/product-page
order: 3
---

The product details page shows one product, its price, and the one sellable
item a collector can add.

- **Card** — name, description, images and the one sellable item's price;
  badges where the catalogue provides them, and the site discounts named
  among them; the sale strikes as on the listing —
  [Discounts](/p/grade10-site/store/discounts#where-each-shows)
- **One item to buy** — the page offers no size, option or variant choice.
  Shopify's sale identifier stays internal to availability and cart handling
- **Buy** — choose a quantity, add the product, and stay on the page; while
  the add is pending the controls show Adding…; after it settles the cart
  drawer opens, the quantity resets, and the cart total updates; adding it
  again stays on one line
- **Description** — a long description shows collapsed to three lines with a
  button to read it in full, without leaving the page
- ❓ **A short description** — one that fits in three lines shows whole, with
  no button. Design confirms
- 🚧 **Availability without stock pressure** — the page says whether its one
  sellable item can be bought, with no remaining count or scarcity cue. A
  requested quantity is not capped by the browse read; Cart explains a short
  fill
- **Sold out** — a sold-out product says so and cannot be added; its price
  remains visible
- **Shipping and pickup** — the same copy on every card: shipping calculated
  at checkout, free pick-up at Hong Kong Grade10 Store
- **Shared link** — unfurls with the card's first picture, fitted whole into
  the wide box a preview fetcher lays out and padded white, and says it is the
  wide card; a card the catalogue pictures no way unfurls without a picture,
  and asks for the small one

## Unknown product address

- 🚧 **Unknown product address** — `grade10.com/store/products/<handle>` still
  answers 404 when the catalogue has no card for the handle, but the Store
  product route shows its own localized not-found state inside the Store shell.
  Its one action returns the collector to the product listing in the same
  tab; an address outside an owned surface keeps the generic site not-found
  page and its Home action.

## Buy

- **Signed-out Add to cart** — adds the line to the cart this browser holds,
  with no sign-in; signing in later moves those lines into the member's cart -
  [Cart Drawer](/p/grade10-site/store/cart#reviewing-the-cart)

## Free Pick-up

- **Opens Store Locator** — the store name in the free pick-up claim opens
  Store Locator in the same tab, in the page's language
- **No dead label** — Shipping fee has no page behind it, so it is plain
  text, not a link

## You May Also Like

- **You may also like** — related cards under the card —
  [You May Also Like](/p/grade10-site/store/cross-sell)

## Designs

::story{id="store-product-page-screens-product-detail--docs" title="Product details"}

::story{id="store-product-page-screens-product-detail--unknown-product-address" title="Unknown product address"}

:::detail{title="Implementation map" for="engineer"}
- [Product listing page](https://github.com/9gag/grade10/blob/main/apps/frontend/grade10/src/pages/store/ProductListingPage.tsx)
- [Product page route](https://github.com/9gag/grade10/blob/main/apps/frontend/grade10/src/pages/store/ProductPage.tsx)
- [Product view](https://github.com/9gag/grade10/blob/main/packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductView.tsx)
- [Purchase view and internal sale identity](https://github.com/9gag/grade10/blob/main/packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductBuyBox.tsx)
- [Product variant model and priced item selection](https://github.com/9gag/grade10/blob/main/packages/grade10-store/frontend/src/features/products/product/domain/models/Product.ts)
- [Standalone product detail preview](https://github.com/9gag/grade10-spec/blob/main/apps/preview/src/pages/store/product-page/store-product-detail.tsx)
- [Frontend feature layout](https://github.com/9gag/grade10/blob/main/docs/conventions/code-layout.md)
:::

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
