## Context

The product route's `meta` already builds the head from what its loader read,
through `addressHead`, and the Shopify catalogue read returns each image as a
`cdn.shopify.com` URL with its intrinsic width and height. That CDN resizes
off the URL's query — `width`, `height`, `pad_color`, `format`, `crop`. Asked
for a box without `pad_color` it fits the picture inside and never enlarges,
so a small original comes back untouched; asked with one it answers the exact
box, enlarging the picture to fill it.

## Goals / Non-Goals

**Goals:**

- The four `og:image` tags on a product address, from the loader's read, and
  the card shape a fetcher draws them in.
- One function that sizes any product image URL, so the grid and the gallery
  can use it next.

**Non-Goals:**

- A second image size from the Storefront API.
- A composed background behind the picture.

## Decisions

- **Size by URL, not by query.** The Storefront API can return transformed
  URLs through `url(transform:)` aliases, but each size would mean a query,
  codec, mapper and contract change, and the catalogue answer would carry
  every size every consumer might want. The CDN answers any size off one URL,
  so the contract keeps one URL per image and each surface asks for its own.
- **Pad, do not crop.** `pad_color` fills to the exact box; `crop` cuts. A
  slab's label is what a preview of it is for.
- **White, fixed.** Product photographs sit on white. A token-driven pad
  would put the design system's colour in a query string that a fetcher
  caches, for a background nobody sees as the site's.
- **Absent, not broken.** `shareImage` is null for a card with no image, and
  `addressHead` writes no image tags for null.
- **The size lives in the product domain.** `SHARE_IMAGE` sits beside
  `shareImage` in `@grade10/store-frontend/product`, which is what the route
  reads the product through; the head builder only writes what it is handed.
- **The shape is named, not inferred.** X reads Open Graph for the picture and
  takes the card shape from `twitter:card` alone, defaulting to the small
  square. A picture padded to the wide box and not declared as one is drawn as
  a thumbnail, so `addressHead` writes the shape beside the picture — for every
  surface, because a surface with no picture must ask for the small card rather
  than a wide one with a hole in it.

## Risks / Trade-offs

- A small original is enlarged to fill the box, so it reads soft rather than
  small. Acceptable — the shop's photographs are large. What this buys is that
  the dimensions the head declares are the dimensions delivered, whatever the
  original measures.
- `pad_color` and `format` are CDN parameters, not Storefront API contracts.
  Their behaviour is checked by the CDN answering, not by a type; the tests pin
  what is asked for. `format` is answered for the photographs a shop uploads
  and not for a master the CDN will not re-encode, which fetchers decode
  alike.
