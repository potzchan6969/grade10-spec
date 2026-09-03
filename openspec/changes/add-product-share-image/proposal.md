**Author:** @brianchacha6969 - 2026-09-03

## Why

A card's address unfurls with its title, description and canonical address and
no picture. A preview fetcher shown no image draws a text-only card, and a
text-only card is passed over where a pictured one is opened. The catalogue
already pictures every card, so the picture is there to hand over.

**Metric:** opens per shared product link. Unmeasured today; the first delivery
sets the baseline. *(Assumption — no source PRD names a metric.)*

## What Changes

- **A product address unfurls with its first picture.** The response carries
  `og:image`, its width, its height and its alt text, readable without
  executing scripts.
- **The picture is served at the preview box.** 1200×630, the size preview
  fetchers lay out, asked of the Shopify CDN by URL rather than fetched at a
  second size from the Storefront API.
- **Filled white, never cropped.** The card is fitted inside the box and the
  rest is white: a slab's label or a card's corner cut off is the one thing a
  preview of it must not do, and product photographs sit on white, so the
  padding reads as more of the same.
- **A card the catalogue pictures no way carries no `og:image`.** A fetcher
  draws its own placeholder for a missing image; a broken one it draws as
  broken.

## Non-Goals

- No picture for the auction lot's address. A lot's images are the auction's,
  not the Shopify CDN's, and this change fixes only how a catalogue picture is
  sized.
- No composed background — no blurred or extended copy of the photograph
  behind it. That is a rendering step of our own, with its own cost and
  caching, and a solid pad is enough until a plain field is shown to look poor.
- No change to which image is first: the shop's ordering decides, as it does
  on the card's page.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/product-page`: a product address's share metadata
  gains the card's picture, at the preview box, padded white.

## Impact

- `apps/frontend/grade10/src/routes/store-product.tsx` hands the product's
  share image to `addressHead`, which gains an optional image and writes the
  four `og:image` tags from it.
- `@grade10/store-frontend/product` gains `sizedImageUrl` — one product image
  URL at a size the Shopify CDN answers — and `shareImage`, the first image at
  the preview box. The listing grid and the gallery can size their images
  through the same function later; this change does not touch them.
- The served-document reading (`documentFacts`) and the serving lab report
  `og:image`; the build check over prerendered surfaces is unchanged, because
  no prerendered surface carries a picture.
- No Storefront API query, codec, contract or backend changes.
