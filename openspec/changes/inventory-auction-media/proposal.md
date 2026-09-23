**Author:** @htonyl - 2026-09-23

## Why

Collectors need enough photographs and video to judge a lot, while the same
product is often listed more than once. Today an operator must upload those
files again for every Auction listing, which repeats work and risks an
incomplete gallery. Success is the share of listing galleries assembled from
product assets, with zero listings whose gallery changes after its source
product media is edited or removed.

## What Changes

- Inventory admins can keep an ordered gallery of reusable images and videos
  on a catalogue product, so an auction operator can start from the material
  already checked for that product.
- Auction operators can choose product assets, upload listing-only media, and
  freely order both together in one listing gallery.
- A chosen product asset becomes part of the listing at Save, so later changes
  to the product's gallery cannot rewrite what a collector sees on that lot.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/inventory/catalog`: Product records gain a reusable,
  operator-managed media gallery.
- `grade10-admin/auction/listing`: Listing media can originate from a product
  gallery or a listing upload, and is preserved with the listing.

## Impact

- The Inventory product editor and its product record expose reusable media.
- The Auction listing editor reads eligible product assets and combines them
  with its existing direct-upload flow.
- Listing-media persistence must retain an independent snapshot for every
  selected product asset; shared stored bytes may be reused without retaining
  a live dependency on the product asset.

## References

- [Inventory · Product Assets](/p/grade10-admin/inventory#product-assets)
- [Auction Management · Listings](/p/grade10-admin/auction/management#listings)
