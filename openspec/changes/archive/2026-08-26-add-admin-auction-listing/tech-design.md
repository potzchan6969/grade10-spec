## Context

The Auction worker currently creates a complete, immediately publishable
listing around a pre-existing product, stores one image for each named physical
side, and lets the admin panel publish, reschedule, or cancel that listing.
See [proposal.md](proposal.md) for motivation. This design covers both the
operator listing lifecycle and sized gallery delivery (formerly split across
`add-admin-auction-listing` and `add-auction-listing-assets`).

Capability deltas:
[`grade10-admin/auction/listing`](specs/grade10-admin/auction/listing/spec.md),
[`grade10-site/auction/listing-media`](specs/grade10-site/auction/listing-media/spec.md),
[`shared/ui/auction-listing`](specs/shared/ui/auction-listing/spec.md).

The worker is the authority for listing state, its Postgres schema, object
store media, public routes, cache invalidation, and cron sweeps. The Grade10
admin app composes data-backed auction features from
`@grade10/auction-admin-frontend`; it does not call the transport directly.
Screens: [ui-design.md](ui-design.md).

## Goals / Non-Goals

**Goals:**

- Make draft, create, publish, scheduled publish, update, cancel, ordered
  media, slug lookup, optional image alt, and named image sizes one consistent
  listing lifecycle across the schema, worker, contracts, admin feature, and
  storefront.
- Keep create as the single complete-field validation gate while preserving
  field-shape validation on each draft write.
- Make the database, rather than a read-before-write check, protect live slug
  uniqueness and the listing state transitions that race with a sweep.
- Serve originals from R2; produce named sizes for images on the public GET
  through the Workers Images binding.
- Let the admin feature run from contract-backed fixtures, independently of a
  running worker.

**Non-Goals:**

- Video transcoding or generated video thumbnails.
- Changing auction bidding, close, or settlement mechanics beyond recognizing
  the new `created` lifecycle state.
- Introducing a shared form component or a design-system primitive without a
  design-system decision.
- Cloudflare Images as the object store, or precomputed derivatives in R2.

## Decisions

### Persist the lifecycle and authoring fields on the listing row

Add `created` to the listing status vocabulary and make authorable fields
nullable only while a row is a `draft`. Store `slug`, `publishAt`, and the
optional catalogue/window fields on the listing itself; preserve the existing
listing id as the internal identity. A partial unique index holds a non-null
slug for every status except `canceled`, while application validation protects
the operator-facing shape and state-specific invariants. The cancel transaction
rewrites the slug before it transitions the row to `canceled`, freeing the
original in the same transaction.

This keeps an incomplete draft representable without inventing a second draft
table or a JSON staging record, and it leaves row locks as the serialization
point for create, publish, cancel, and sweeps. A separate draft table was
rejected because it duplicates every field and creates a risky move into the
money-bearing listing table. Storing a full placeholder product was rejected:
the operator is authoring the listing, not a product catalogue record.

### Separate draft save, create, and publish commands

Expose typed admin procedures for saving a draft, creating a draft, updating
an editable listing, publishing immediately, and canceling. The service owns
all state and cross-field checks; the router only decodes input, enforces the
existing graded permissions, audits, and purges affected public cache tags.
The admin form performs the same required-field check before it sends create,
but its result is advisory: the API is authoritative.

Catalogue-only updates remain available to `auction:catalog`; draft save,
create, publish, and timing/pricing writes use `auction:operate`; cancel stays
at `auction:settle` because it releases live authorizations. A single generic
PATCH route was rejected because it would make each transition's permission,
validation point, audit record, and cache effect implicit.

### Publish due created listings in the existing ordered sweep pass

An optional future `publishAt` is stored on a created listing. A dedicated
`publishDueListings` work list selects due created rows, locks each listing,
rechecks the clock, transitions it to `published`, and clears the schedule in
the same transaction. It runs before close processing; a listing that becomes
public with a window already open can therefore take bids in that same pass.
The public cache is purged after each successful transition.

This reuses the worker's bounded, idempotent, observable sweep framework and
its retry-on-next-pass behaviour. A timer per listing was rejected because
Workers do not provide durable per-row timers and it would create a second
scheduler beside the existing cron pass. Having the admin client publish it
was rejected because publication must happen when no client is open.

### Replace angle-keyed rows with an ordered media gallery

Formerly `auction_listing_images` keyed by physical side (`angle`). Replace
that with `auction_listing_media` rows that carry an integer
position, media kind/content type, object key, optional dimensions, and
optional alt (images only). The database bounds a listing to one ordered
position per item and the service accepts only one to eight items at create;
drafts may contain none. Uploads write immutable original bytes to the object
store and insert, replace, remove, or reorder rows through the elevated
listing path. Public and admin codecs expose an ordered media list, and public
rendering chooses an image or video element from each item's media type.

Keeping the side vocabulary was rejected because it cannot express an ordered
gallery or video. Storing media as a JSON array on the listing was rejected:
row-level writes avoid lost updates and let the orphan-object sweep continue
to discover all referenced keys.

### Originals stay in R2; named sizes for images are produced on serve

Keep one object per unique byte string under binding `AUCTION_LISTING_ASSETS`
(buckets `grade10-auction-listing-assets-{dev,staging,production}`). Image
public paths gain a size segment:

`/api/public/listing-media/<size>/<objectKey>`

`<size>` is one of `card`, `detail`, `thumb`, `zoom`. The GET validates size
then key, reads the original from R2, and — when the named size is smaller
than the stored image — runs it through the Workers Images binding. Unknown
size and unknown key both 404. Video items keep the original path (no size
segment); named sizes apply to images only. The in-process storage area is
`listingMedia`, the table is `auction_listing_media` (renamed from
`auction_listing_images` when angle gives way to position), and
`PUBLIC_ROUTES.listingMedia` is `/api/public/listing-media`.

Pixel ceilings (CSS slot × 2, never upscale):

| Size     | Max edge | Used by                          |
| -------- | -------- | -------------------------------- |
| `thumb`  | 128      | gallery strip (`h-16 w-12`)      |
| `card`   | 800      | catalogue row                    |
| `detail` | 1280     | gallery main frame               |
| `zoom`   | 1600     | zoom dialog                      |

The public image object grows `alt` (string or null) and a `paths` map of the
four sizes. `imagePath` remains the `detail` path for stale clients.
`IMAGES.info()` measures raster uploads; video skips measure. Upload size and
type bounds: 100 mebibytes; JPEG/PNG/WebP/AVIF plus video types from
admin-listing.

Precomputing derivatives in R2 was rejected: content-addressed originals stay
simple and cache absorbs repeat transforms. Serving only originals for every
slot was rejected: catalogue and zoom would pull multi-megabyte scans.

### Use slug at the public boundary while retaining internal ids behind it

Public list and detail codecs use a listing's slug for its address; routes
look up only `published`, `closed`, and `settled` rows. Admin procedures and
internal relations continue using `listingId`, avoiding a cascade through bid,
hold, settlement, and audit identities. Every slug-affecting or
visibility-affecting write purges the old and new public address tags.

Keeping ids in public URLs was rejected because it preserves an implementation
detail and cannot meet the stable catalogue address requirement. Reusing a
canceled slug without rewriting the canceled row was rejected because a
unique constraint would either block reuse or allow two historical rows to
claim the same address.

### Keep the admin feature shallow and DI-backed

Extend the existing `catalog/listings` slice with draft/create/update/media/alt
commands and form-facing models. Its datasource decodes the admin contract,
the repository exposes the commands, and hooks invalidate listing queries.
`apps/admin/grade10` owns the listing-form page composition, dialog state,
permission-gated actions, and the media manager (local preview with Confirm /
Discard before upload; stored images at card size; magnify reveals zoom).
Fixtures implement the expanded procedure port so the package and app tests
cover form states without a running worker.

Putting the form and tRPC calls directly in the admin app was rejected because
it would duplicate the feature for future admin consumers and bypass the
decode/fixture seam. Adding a use-case layer was rejected because the browser
owns no invariant beyond presentation validation; the worker owns the
lifecycle rules.

### `ListingGallery` takes three sources; catalogue stays an assembly

`ListingGalleryImage` gains optional `thumbSrc` and `zoomSrc` (omit → `src`).
Labels arrive as `copy: { zoom, previous, next }`. The grade10 listing page
maps `paths.thumb` / `paths.detail` / `paths.zoom` and `alt ?? title`. The
catalogue row is app-owned: an `img` at `paths.card` for the first image item.

## Risks / Trade-offs

- [Existing rows and public callers still use complete listing fields and
  angle-keyed images] → Expand the schema and contracts first, migrate existing
  rows deterministically, then update writers/readers together before removing
  legacy routes and columns.
- [A scheduled publish races with an operator action] → Lock and re-read the
  listing for every state transition; an already published or canceled row is a
  no-op for the sweep.
- [A successful object write can outlive a rejected media-row write] → Keep the
  write-object-first rule and let the orphan-object sweep reclaim unreferenced
  originals.
- [Browser validation drifts from the API] → Share the contract vocabulary and
  retain backend scenario tests as the authority; form tests prove only the
  early feedback.
- [Cloudflare Images is a paid Workers binding] → Without it, named sizes
  cannot be produced. Fail loud (5xx + log); do not silently fall back to the
  original multi-megabyte scan for sized paths.
- [First request per size per object pays a transform] → Immutable cache
  absorbs repeats.

## Migration Plan

1. Add the expanded status, authoring, slug, scheduling, ordered-media, and
   nullable `alt` schema with expand migrations; backfill existing complete
   listings as published and convert each angle image to its deterministic
   gallery order. No alt backfill: null means "use the listing title".
2. Create `grade10-auction-listing-assets-{staging,production}` in each
   Cloudflare account; copy keys from prior listing-asset buckets when any
   exist; bind `IMAGES`. Local uses the wrangler-dev bucket of the same name.
3. Generate and commit the worker migration artifacts, then ship the worker,
   contracts, admin feature, and storefront together so every deployed reader
   understands the new row shape and sized public GET.
4. Deploy with the public lookup route accepting slugs only after existing
   visible listings have a unique backfilled slug. Monitor the publish-due
   sweep, sized GET failures, and public lookup refusals.
5. Roll back application code only while the expanded schema remains
   compatible. Do not roll back the migration destructively; forward-fix data
   or code if a listing has already been authored under the new lifecycle.
   Delete old pre-rename object-store buckets in a later change — not this one.
