---
title: Product Details
spec: grade10-site/store/product-page
order: 3
reviewed: 2026-09-11
---

The product details page is one product: what it is, what it costs, and the
button to buy it.

- **Card** — name, description, images, a price; badges, compare-at
  price and low-stock notes where the catalogue provides them
- 🚧 **One product item** — each product has one sellable item; the page offers
  no size, option or variant choice
- **Buy** — choose a quantity, add the product, and stay on the page while the
  cart total updates; adding it again stays on one line
- **Stock is a ceiling** — the quantity stops where the shop's count stops, and
  the page says how many are left when the shop is nearly out or the collector
  has asked for the last one
- **Sold out** — a sold-out product says so and cannot be added; its price
  remains visible
- **Shipping and pickup** — shown on the card where the catalogue provides
  them
- **Shared link** — unfurls with the card's first picture, fitted whole into
  the wide box a preview fetcher lays out and padded white, and says it is the
  wide card; a card the catalogue pictures no way unfurls without a picture,
  and asks for the small one
- **URL** — `grade10.com/store/products/<handle>`; a handle that is not a
  card answers 404 with the site's not-found page

## Buy

🚧 **Signed-out Add to cart** — opens the sign-in dialog; no guest cart;
after a successful sign-in the add completes when practical.

## Free Pick-up

🚧 **Opens Store Locator** — the free pick-up claim names Hong Kong Grade10
Store and opens Store Locator

## Designs

::story{id="pages-product-detail-page--docs" title="Product details"}

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
| Fitted, not cropped | Decided | The card sits whole inside the box. A slab's label or a card's corner cut off is the one thing a preview of it must not do. | Product |
| Pad colour | Decided | White, fixed. Product photographs sit on white, so the pad reads as more of the same rather than as a colour of ours. | Design |
| No picture, no tag | Decided | A card the catalogue pictures no way unfurls without a picture. A fetcher's own placeholder beats a broken image. | Product |
| One sizing rail | Decided | The size is asked of the shop's CDN by address, so one catalogue image serves the preview, the grid and the gallery. | Engineering |
| Large card on X | Decided | The response names the card shape, because X sizes the card from that name alone and defaults to the small square. Wide with a picture, small without. | Product |
| Originals under the box | Decided | A picture narrower than the box is enlarged to fill it, so it reads soft rather than small, and the declared size is always the delivered one. | Product |
| Lot previews | ❓ Open | An auction lot's address unfurls with no picture; its images are the auction's, not the shop's. | Product |
:::
