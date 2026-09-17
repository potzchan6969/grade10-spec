---
title: Media Gallery
spec: grade10-site/auction/listing-media
order: 13
---

## Values

| Rule | Value |
| --- | --- |
| Items | **1 to 8** images and videos, in the order collectors see them |
| Image types | **JPEG, PNG, WebP, AVIF** |
| File size | At most **100 MiB** each |
| Alt text | Optional, trimmed, at most **200** characters |
| Public sizes | **card**, **thumb**, **detail**, **zoom** — images only |

## One Gallery

- **No sides** — one ordered gallery, not a front slot and a back slot; an
  unused position is not an empty slot
- **The card** — the first item is the catalogue card's media; a lot whose
  first item is not an image still appears, and no placeholder is invented
- **The lot page** — walks the gallery in order at thumb, detail and zoom
  sizes; one image shows no thumbnail strip, and a lot with no images still
  renders
- **The bound** — the cap and the accepted video types are [Listing
  Management](/p/grade10-admin/auction/listing)'s, for the whole gallery

## Attaching an Image

:::flow{title="Attaching an image"}
## *Operator* — **Picks a file**
The media manager shows a preview and stores nothing yet; discarding the
preview leaves the gallery as it was.
## *Operator* — **Confirms**
Only now do the bytes leave for the auction service, which keeps them as
uploaded.
## *Media manager* — **Shows the stored image**
At card size, with a zoom-size preview on hover or keyboard focus at least
three-quarters of the viewport high, so checking a scan needs no click.
:::

- **Until the close** — an image joins, is replaced or is removed while the
  listing is draft, created or published, and never after it closes
- **Alt text** — the listing title is the accessible name when an image
  carries none; alt text changes without touching the image bytes, while the
  listing is still writable

## Refusals

| Refused | What happens |
| --- | --- |
| A type outside JPEG, PNG, WebP and AVIF, or a file over 100 MiB | The upload is refused; the gallery is unchanged |
| A ninth item | Refused; the gallery is unchanged |
| Removing the last item once the listing is created | Refused |
| Any change after the close, alt text included | Refused |

## Sizes

Every published image answers at exactly four named sizes.

| Size | Where |
| --- | --- |
| **card** | The catalogue |
| **thumb** | The lot page's strip |
| **detail** | The lot page's main frame |
| **zoom** | The lot page's magnifier |

- **Made from the original** — an image larger than the size asked for is
  transformed to it before it is answered; one already smaller is answered as
  it is, never upscaled
- **Videos** — keep their original public path; the named sizes apply to
  images only
- **Unknown size** — a name outside the set reads as a missing image rather
  than a guess

::story{id="auction-listing-listinggallery--default" title="The lot gallery with its thumbnail strip"}

::story{id="auction-listing-listinggallery--mixed-media" title="A gallery holding both images and video"}

::cases{id="grade10-site/auction/listing-media"}
