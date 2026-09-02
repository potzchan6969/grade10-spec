**Author:** @htonyl - 2026-08-20

## Why

A collector opening the auction catalogue never sees the card. Each listing
row is title, close, and price; the payload already carries gallery media and
the details page already mounts a gallery, but both ask the browser for the
original scan — often a multi-megabyte JPEG — and the gallery uses that same
address for the thumbnail, the main frame, and zoom. Operators need sized
delivery and optional alt on top of the ordered one-to-eight media gallery
from `add-admin-auction-listing`.

Until a collector sees a card-sized first image on the catalogue and sized
gallery images on the details page, the auction reads as a text list of lots
even when media is attached.

**Metric:** share of published listings whose catalogue row shows a card-sized
first image (when the first gallery item is an image) and whose details
gallery shows every gallery image at the size named for that slot.

## What Changes

- Gallery identity follows `grade10-admin/auction/listing`: at most eight
  ordered media items (image or video), no physical-side keys. This change
  adds optional alt on image items, preview-and-confirm before image bytes
  upload from the admin photo manager, and named public sizes for images.
- Each published gallery **image** is offered at four named sizes — `card`,
  `detail`, `thumb`, `zoom`. The original is transformed on the way out when
  the named size is smaller than the stored bytes. Video items keep the
  original public path from admin-listing.
- The public catalogue shows the first gallery item at card size when that
  item is an image; an empty gallery still lists. The details gallery shows
  gallery images in operator order, using distinct sources for the thumbnail
  strip, the main frame, and zoom.
- The listing object store is renamed from `AUCTION_LISTING_IMAGES` to
  `AUCTION_LISTING_ASSETS` so media (including video from admin-listing) shares
  one bucket name.

## Non-Goals

- **Defining the eight-item gallery, reorder, or video playback.** Those
  requirements live in `grade10-admin/auction/listing` (`add-admin-auction-listing`).
- **Physical sides.** There is no `front`/`back`/… identity for uploads.
- **Creating listings in admin.** Owned by admin-listing.
- **Required alt text or a publish gate on images.** Alt falls back to the
  listing title. Create's "at least one media" rule is admin-listing's.
- **Cloudflare Images as the object store, or precomputed derivatives in
  R2.** Originals stay content-addressed in R2; named sizes are produced on
  serve for images.
- **ZZZ auction UI.** ZZZ has no auction catalogue. The public image paths
  are brand-neutral.

## Capabilities

### New Capabilities

- `grade10-site/auction/listing-media`: how gallery images get optional alt text
  and named public sizes, how the admin photo manager previews before upload,
  and how the catalogue and details page consume sized paths — on top of the
  ordered gallery from admin-listing.
- `shared/ui/auction-listing`: the listing product-page blocks `@grade10/ui`
  already exports (`ListingGallery`, `ListingBidPanel`, `ListingDetails`) and
  the gallery's distinct sources for thumbnail, main frame, and zoom. The
  blocks ship today with no spec; this change alters the gallery contract, so
  the surface is written down here.

### Modified Capabilities

None. Photo/image delivery is a separate capability from bidding.
`grade10-admin/auction/listing` owns the gallery shape this change sits on.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | Photo manager: preview/confirm, card/zoom review, alt on gallery images. |
| `apps/frontend/grade10` | Catalogue row shows first image at card size; details gallery passes sized sources and alt into `ListingGallery`. |
| `apps/backend/grade10/auction` | Binding renamed to `AUCTION_LISTING_ASSETS`; Images binding for on-serve transform; public path gains a size segment for images. |
| `@grade10/auction-contracts` | Public image shape gains alt and named-size paths. |
| `@grade10/auction-backend` | Alt edit, sized public GET, dimension measurement for images. |
| `@grade10/auction-frontend` | Catalogue and details consume sized paths and alt. |
| `@grade10/auction-admin-frontend` | Photo/alt repository methods for the listings photo manager. |
| `@grade10/ui` | `ListingGallery` / `ListingGalleryImage` accept distinct thumbnail, main, and zoom sources. |

Cloudflare Images (Workers binding) is a new account-level dependency on the
auction worker. The public listing-image path stays under
`/api/public/listing-images`; only the object-store binding is renamed.
