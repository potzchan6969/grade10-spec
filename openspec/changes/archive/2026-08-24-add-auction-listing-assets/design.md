# Design: Auction listing assets

Capability deltas:
[`grade10-site/auction/listing-media`](specs/grade10-site/auction/listing-media/spec.md),
[`shared/ui/auction-listing`](specs/shared/ui/auction-listing/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

Depends on the gallery shape in
[`add-admin-auction-listing`](../add-admin-auction-listing/specs/grade10-admin/auction/listing/spec.md)
(`grade10-admin/auction/listing`): at most eight ordered media items (image or
video), first item is the catalogue card, no physical-side identity.

## Context

`add-admin-auction-listing` moves listing media to an ordered gallery keyed by
`position` (0–7), unique on `(listing_id, position)`, with image and video
types and a 100 mebibyte bound. This change sits on that gallery: optional
`alt` on image rows, named public sizes for images, preview-and-confirm in the
admin photo manager, and storefront wiring of sized paths into
`ListingGallery`.

The R2 binding is renamed to `AUCTION_LISTING_ASSETS`. Public sized GET:
`/api/public/listing-images/<size>/<objectKey>`. Original bytes remain
available for video and for `mediaPath` from admin-listing.

Screens: [ui.md](ui.md).

## Decisions

### Gallery identity is position order from admin-listing, not physical sides

Do not restore `UNIQUE(listing_id, angle)` or six side slots as the product
model. Angle may remain a compatibility label on the row for older upload
routes; product requirements speak only of gallery order and the eight-item
cap. Catalogue card = first gallery item. Details order = gallery order.

Makes pass: `Image items use the ordered gallery, not physical sides`,
`Several images appear in gallery order`, `The catalogue shows the first
gallery image when it is an image`.

### Originals stay content-addressed in R2; named sizes are produced on serve for images

Keep one object per unique byte string. Image public paths gain a size
segment:

`/api/public/listing-images/<size>/<objectKey>`

`<size>` is one of `card`, `detail`, `thumb`, `zoom`. The GET validates size
then key, reads the original from R2, and — when the named size is smaller
than the stored image — runs it through the Workers Images binding
(`env.IMAGES.input(body).transform({ width, fit: "scale-down" }).output(...)`).
Unknown size and unknown key both 404. Video items keep the original path;
named sizes apply to images only.

Pixel ceilings (CSS slot × 2, never upscale):

| Size     | Max edge | Used by                          |
| -------- | -------- | -------------------------------- |
| `thumb`  | 128      | gallery strip (`h-16 w-12`)      |
| `card`   | 800      | catalogue row                    |
| `detail` | 1280     | gallery main frame               |
| `zoom`   | 1600     | zoom dialog                      |

The public image object grows `alt` (string or null) and a `paths` map of the
four sizes. `imagePath` remains the `detail` path for stale clients. New
consumers use `paths`.

`IMAGES.info()` measures raster uploads; video skips measure. Upload size and
type bounds for media match admin-listing (100 mebibytes; JPEG/PNG/WebP/AVIF
plus video types on that capability).

Makes pass: `Each gallery image is published at named sizes`, `The catalogue
uses card size for an image card`, `The details gallery uses thumb, detail,
and zoom`, `An unknown size is not found`.

### The binding is `AUCTION_LISTING_ASSETS`; the table and public path keep listing-images

Wrangler binding and env field rename to `AUCTION_LISTING_ASSETS`. Bucket
names become `grade10-auction-listing-assets-{dev,staging,production}`. The
in-process storage area stays `listingImages`, the table stays
`auction_listing_images`, and `PUBLIC_ROUTES.listingImages` stays
`/api/public/listing-images`. Video shares this bucket via admin-listing;
renaming the HTTP path would break published `imagePath` values for no gain.

### Attach / replace / remove / alt follow admin-listing status rules

Gallery mutation windows and the last-item / eight-item rules are
admin-listing's. This change adds alt-only (`listings.updateImageAlt`) and
preview-before-upload for image bytes. Closed / settled / canceled refuse
image mutations. Measuring and named-size encoding are this capability's.

Makes pass: `Replace and remove follow the admin-listing gallery rules`,
`A gallery image may be added until the listing closes`, `Alt text is optional
and editable until close`.

### Admin photo manager is a gallery image reviewer, not six side slots

A Photos action opens a dialog over the ordered gallery (at most eight
items). Image pick shows a local preview with Confirm and Discard before
upload. Stored images render `paths.card`; magnify reveals `paths.zoom` at
least `75vh`. Grid at most three columns.

Makes pass: `An operator confirms an image before it is stored`, `The admin
photo manager reviews images at card size with hover zoom`.

### `ListingGallery` takes three sources; catalogue stays an assembly

`ListingGalleryImage` gains optional `thumbSrc` and `zoomSrc` (omit → `src`).
Labels arrive as `copy: { zoom, previous, next }`. The grade10 listing page
maps `paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title`. The
catalogue row is app-owned: an `img` at `paths.card` for the first image item.

Makes pass: `Distinct sources are used in each slot`, `A listing with a first
gallery image shows it on the catalogue`, `Several images appear in gallery
order`.

## Risks / Trade-offs

- **Cloudflare Images is a paid Workers binding.** Without it, named sizes
  cannot be produced in the worker. Fail loud (5xx + log); do not silently
  fall back to the original multi-megabyte scan for sized paths.
- **admin-listing says media is served as uploaded.** Sized paths are an
  additional public contract for images; `mediaPath` / unsized GET still serve
  the original for video and for callers that need it.
- **First request per size per object pays a transform.** Immutable cache
  absorbs repeats.

## Migration Plan

1. Create `grade10-auction-listing-assets-{staging,production}` in each
   Cloudflare account. Local uses the wrangler-dev bucket of the same name.
2. Copy keys from prior listing-images buckets when any exist.
3. Ship the worker with the renamed binding, the `IMAGES` binding, the size
   segment on the public GET, and alt on image rows.
4. Add nullable `alt` on `auction_listing_images` (expand). No backfill: null
   means "use the listing title".
5. After staging has served images from the new bucket, delete old buckets in
   a later change — not this one.

## Open Questions

None. Gallery shape is decided by admin-listing; this change only adds sized
image delivery and alt.
