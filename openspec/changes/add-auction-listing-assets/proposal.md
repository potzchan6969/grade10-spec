**Author:** @htonyl - 2026-08-20

## Why

A collector opening the auction catalogue never sees the card. Each listing
row is title, close, and price; the payload already carries a front photo and
the details page already mounts a gallery, but both ask the browser for the
original scan — often a multi-megabyte JPEG — and the gallery uses that same
address for the thumbnail, the main frame, and zoom. Operators cannot fix
this from the admin panel: the listings table has publish, window, and call
off, and no way to attach a photo, even though the service already accepts a
byte upload per side.

Until an operator can hang photos on a listing and a collector sees a
card-sized front on the catalogue and sized sides on the details page, the
auction reads as a text list of lots.

**Metric:** share of published listings whose catalogue row shows a card-sized
front photo and whose details gallery shows every attached side at the size
named for that slot.

## What Changes

- Operators attach, replace, and remove listing photos from the existing
  listings table in the grade10 admin panel, one photo per physical side
  (`front`, `back`, `left`, `right`, `top`, `bottom`). A listing does not
  need every side. Each photo may carry optional alt text. Choosing a file
  shows a local preview first; bytes reach the auction service only after the
  operator confirms, and discarding the preview uploads nothing. The photo
  manager lays sides out in a grid (at most three per row), shows each stored
  photo at card size, and reveals zoom size on hover of a magnify control —
  the zoom preview is at least three-quarters of the viewport height.
- Replace and remove are allowed only while the listing is a draft. Adding a
  missing side is allowed until the listing closes. Alt text may be edited
  until the listing closes.
- The public catalogue shows the front photo at card size when one exists;
  missing front is still a valid listing. The details gallery shows every
  attached side, using distinct sources for the thumbnail strip, the main
  frame, and zoom.
- Each published photo is offered at four named sizes — `card`, `detail`,
  `thumb`, `zoom`. The original is transformed on the way out when the named
  size is smaller than the stored bytes.
- The listing-photo object store is renamed from `AUCTION_LISTING_IMAGES` to
  `AUCTION_LISTING_ASSETS` so a later video change does not rename the
  bucket. This change still stores and serves photos only.

## Non-Goals

- **Video.** The store is named for assets; upload, playback, and posters are
  a follow-up.
- **A free-form album.** Photos stay keyed by physical side, at most one per
  side. Lifestyle shots beyond those six sides are out of scope.
- **Creating listings in admin.** Listing create already exists on the
  elevated API and in local setup. This change is the photos, not a catalogue
  CMS.
- **Replacing or removing a photo on a live or closed listing.** A standing
  bidder keeps the sides they have been looking at. Adding a missing side
  while the listing is published is the only live visual addition.
- **Required alt text, required front photo, or a publish gate on photos.**
  Alt falls back to the listing title. A listing with no photos still
  publishes.
- **Cloudflare Images as the object store, or precomputed derivatives in
  R2.** Originals stay content-addressed in R2; named sizes are produced on
  serve.
- **ZZZ auction UI.** ZZZ has no auction catalogue. The public photo paths
  are brand-neutral; a ZZZ surface that later browses listings consumes them
  without a second upload path.

## Capabilities

### New Capabilities

- `grade10-auction/listing-images`: how a listing's photos are attached by an
  operator, identified by side, described with optional alt text, published
  at named sizes, and shown on the catalogue and the listing details page.
- `shared-ui/auction-listing`: the listing product-page blocks `@grade10/ui`
  already exports (`ListingGallery`, `ListingBidPanel`, `ListingDetails`) and
  the gallery's distinct sources for thumbnail, main frame, and zoom. The
  blocks ship today with no spec; this change alters the gallery contract, so
  the surface is written down here.

### Modified Capabilities

None. `grade10-auction/auction` is still an in-flight delta on
`add-grade10-auction` and does not yet live under `openspec/specs/`. Photo
behavior is a separate capability, not a patch on bidding.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | Photo manager on the listings table: per-side preview and confirm, replace, remove, and alt. |
| `apps/frontend/grade10` | Catalogue row shows the front photo at card size; details gallery passes sized sources and alt into `ListingGallery`. |
| `apps/backend/grade10/auction` | Binding renamed to `AUCTION_LISTING_ASSETS`; Images binding for on-serve transform; public path gains a size segment; add vs replace vs remove vs alt-only follow the listing's status. |
| `@grade10/auction-contracts` | Public photo shape gains alt and named-size paths; admin listing reads gain the photo list. |
| `@grade10/auction-backend` | Upload, alt edit, status rules, sized public GET, dimension measurement. |
| `@grade10/auction-frontend` | Catalogue and details consume sized paths and alt. |
| `@grade10/auction-admin-frontend` | Photo repository methods and the listings-table manager. |
| `@grade10/ui` | `ListingGallery` / `ListingGalleryImage` accept distinct thumbnail, main, and zoom sources. |

Cloudflare Images (Workers binding) is a new account-level dependency on the
auction worker. The public listing-image path stays under
`/api/public/listing-images`; only the object-store binding is renamed.
