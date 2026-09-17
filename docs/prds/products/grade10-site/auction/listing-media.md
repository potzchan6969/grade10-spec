---
title: Media Gallery
spec: grade10-site/auction/listing-media
order: 13
---

## Values

| Rule | Value |
| --- | --- |
| Items | **1 to 8** images and videos, in the order collectors see them |
| Image types | **JPEG, PNG, WebP, AVIF**, within the shared media size bound |
| Alt text | Optional, trimmed, at most **200** characters |
| Public sizes | **card**, **detail**, **thumb**, **zoom** |

## One Gallery

- **No sides** — one ordered gallery, not a front slot and a back slot; there
  is no empty placeholder for a side nobody photographed
- **The card** — the first item is the card the catalogue shows, when that
  item is an image
- **The lot page** — walks the gallery in order at thumb, detail and zoom
  sizes; one image shows no thumbnail strip, and a lot with no images still
  renders
- **The cap** — one to eight items, the bound [Listing
  Management](/p/grade10-admin/auction/listing) sets for the whole gallery

## Attaching an Image

- **Confirm before store** — the operator picks a file, sees a preview and
  confirms; only then do the bytes leave for the auction service
- **Stored as uploaded** — nothing is re-encoded behind the operator's back
- **Reviewed at card size** — the admin media manager shows stored images at
  card size, with a large zoom preview on hover or focus
- **Until the close** — an image joins, is replaced or is removed while the
  listing is draft, created or published, and never after it closes; the last
  item cannot be removed once the listing is created

## Alt Text

- **Optional** — trimmed, at most 200 characters, absent when empty
- **Title fallback** — the listing title is the accessible name when an image
  carries no alt text, so an image is never nameless
- **Editable until the close** — alt changes without touching the image bytes
  while the listing is still writable

## Sizes

Every published image answers at exactly four named sizes.

| Size | Where |
| --- | --- |
| **card** | The catalogue |
| **thumb** | The lot page's strip |
| **detail** | The lot page's main frame |
| **zoom** | The lot page's magnifier |

- **No upscaling** — an image already smaller than the size asked for is
  answered as it is
- **Unknown size** — a name outside the set reads as a missing image rather
  than a guess

::story{id="auction-listing-listinggallery--default" title="The lot gallery with its thumbnail strip"}

::story{id="auction-listing-listinggallery--mixed-media" title="A gallery holding both images and video"}

::cases{id="grade10-site/auction/listing-media"}
