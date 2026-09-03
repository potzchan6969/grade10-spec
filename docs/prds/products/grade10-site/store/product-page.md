---
title: Product Details Page
spec: grade10-site/store/product-page
order: 3
---

The product details page is one card: what it is, what each grade costs, and
the button to buy it.

- **Card** — name, description, images, a price per grade; badges, compare-at
  price and low-stock notes where the catalogue provides them
- **Buy** — pick a grade and quantity, add to cart, stay on the page while
  the cart total updates; the same grade added again stays on one line
- **Sold out** — a grade sold out says so and cannot be added; a card with
  nothing to buy keeps its prices
- **Shipping and pickup** — shown on the card where the catalogue provides
  them
- **Shared link** — unfurls with the card's first picture, fitted whole into
  the box a preview fetcher lays out and padded white; a card the catalogue
  pictures no way unfurls without a picture
- **URL** — `grade10.com/store/products/<handle>`; a handle that is not a
  card answers 404 with the site's not-found page

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423" title="Product detail"}

## Journeys

::journeys{id="grade10-site/store/product-page"}

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
| Fitted, not cropped | Decided | The card sits whole inside the box. A slab's label or a card's corner cut off is the one thing a preview of it must not do. | Product |
| Pad colour | Decided | White, fixed. Product photographs sit on white, so the pad reads as more of the same rather than as a colour of ours. | Design |
| No picture, no tag | Decided | A card the catalogue pictures no way unfurls without a picture. A fetcher's own placeholder beats a broken image. | Product |
| One sizing rail | Decided | The size is asked of the shop's CDN by address, so one catalogue image serves the preview, the grid and the gallery. | Engineering |
| Large card on X | ❓ Open | The response names no Twitter card, so X draws the small square rather than the wide one the picture is sized for. | Product |
| Originals under the box | ❓ Open | The CDN never enlarges, so a picture narrower than the box is served smaller than the response declares. | Product |
| Lot previews | ❓ Open | An auction lot's address unfurls with no picture; its images are the auction's, not the shop's. | Product |
:::
