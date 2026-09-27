---
title: Product Details
spec: grade10-site/store/product-page
order: 3
reviewed: 2026-09-23
---

The product details page shows one product, its price, and the one sellable
item a collector can add.

- **Card** — name, description, images and the one sellable item's price;
  badges and compare-at price where the catalogue provides them
- 🚧 **One item to buy** — the page offers no size, option or variant choice.
  Shopify's sale identifier stays internal to availability and cart handling
- **Buy** — choose a quantity, add the product, and stay on the page while the
  cart total updates; adding it again stays on one line
- **Description** — a long description shows collapsed to three lines with a
  button to read it in full, without leaving the page
- 🚧 **Availability without stock pressure** — the page says whether its one
  sellable item can be bought, with no remaining count or scarcity cue. A
  requested quantity is not capped by the browse read; Cart explains a short
  fill
- **Sold out** — a sold-out product says so and cannot be added; its price
  remains visible
- **Shipping and pickup** — static copy on every card: shipping calculated at
  checkout, free pick-up at Hong Kong Grade10 Store
- **Shared link** — unfurls with the card's first picture, fitted whole into
  the wide box a preview fetcher lays out and padded white, and says it is the
  wide card; a card the catalogue pictures no way unfurls without a picture,
  and asks for the small one
- **URL** — `grade10.com/store/products/<handle>`; a handle that is not a
  card answers 404 with the site's not-found page

## Buy

**Signed-out Add to cart** — opens the sign-in dialog titled
**Sign In to Add to Cart**; no guest cart; after a successful sign-in the
add completes when practical.

## Free Pick-up

🚧 **Opens Store Locator** — the free pick-up claim names Hong Kong Grade10
Store and opens Store Locator

## You May Also Like

🚧 **You may also like** — related cards under the card —
[You May Also Like](/p/grade10-site/store/cross-sell)

## Designs

::story{id="pages-product-detail-page--docs" title="Product details"}

:::detail{title="Implementation map" for="engineer"}
- [Product listing page](https://github.com/9gag/grade10/blob/main/apps/frontend/grade10/src/pages/store/ProductListingPage.tsx)
- [Product page route](https://github.com/9gag/grade10/blob/main/apps/frontend/grade10/src/pages/store/ProductPage.tsx)
- [Product view](https://github.com/9gag/grade10/blob/main/packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductView.tsx)
- [Purchase view and internal sale identity](https://github.com/9gag/grade10/blob/main/packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductBuyBox.tsx)
- [Product variant model and priced item selection](https://github.com/9gag/grade10/blob/main/packages/grade10-store/frontend/src/features/products/product/domain/models/Product.ts)
- [Standalone product detail preview](https://github.com/9gag/grade10-spec/blob/main/apps/preview/src/store-product/store-product-detail.tsx)
- [Frontend feature layout](https://github.com/9gag/grade10/blob/main/docs/conventions/code-layout.md)
:::

:::detail{title="Product decisions" for="pm"}
A card travels as a pasted address — a group chat, a Discord, a reply — more
often than it is found by search, and the preview is the whole of what the
receiver sees before deciding to open it. The catalogue already pictures every
card, so the picture is there to hand over.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector sharing a card | Pastes the address into a chat | The preview shows the card, whole. |
| Collector receiving one | Reads the preview before the page | Recognises the card and opens it. |
| Preview fetcher | Reads the response, runs nothing | Finds the picture and its size in the first bytes. |

**Not in scope.** A composed background — a blurred or extended copy of the
photograph behind it; a solid pad holds until a plain field is shown to read
poorly. A second image size from the catalogue read. Changing which image is
first; the shop's order decides, here as on the page. A picture for the
auction lot's address.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Link opens | Opens per shared product link. Unmeasured; the first delivery sets the baseline. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Which picture | Decided | The card's first catalogue image, in the shop's own order. | Product |
| Sign-in to add | Decided | A signed-out Add to cart opens the sign-in dialog. There is no guest cart and no guest checkout. After sign-in the add completes when practical. Same rule as the listing. | Product |
| Sign-in title from add | Decided | The dialog title is **Sign In to Add to Cart** (Title Case, as Modal titles are) — why, not the bare **Sign In to Grade10**. Same string as the listing. Header Sign In keeps **Sign In to Grade10**. | Product |
| Fitted, not cropped | Decided | The card sits whole inside the box. A slab's label or a card's corner cut off is the one thing a preview of it must not do. | Product |
| Pad colour | Decided | White, fixed. Product photographs sit on white, so the pad reads as more of the same rather than as a colour of ours. | Design |
| No picture, no tag | Decided | A card the catalogue pictures no way unfurls without a picture. A fetcher's own placeholder beats a broken image. | Product |
| One sizing rail | Decided | The size is asked of the shop's CDN by address, so one catalogue image serves the preview, the grid and the gallery. | Engineering |
| Large card on X | Decided | The response names the card shape, because X sizes the card from that name alone and defaults to the small square. Wide with a picture, small without. | Product |
| Originals under the box | Decided | A picture narrower than the box is enlarged to fill it, so it reads soft rather than small, and the declared size is always the delivered one. | Product |
| Lot previews | ❓ Open | An auction lot's address unfurls with no picture; its images are the auction's, not the shop's. | Product |
| A catalogue image that fails to transform | ❓ Open | Whether a card whose image exists but fails to load or resize from the CDN falls back to no `og:image`, the same as a card with no image, or something else. | Engineering |
:::
