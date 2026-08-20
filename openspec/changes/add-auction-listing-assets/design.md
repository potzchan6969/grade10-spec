# Design: Auction listing assets

Capability deltas:
[`grade10-auction/listing-images`](specs/grade10-auction/listing-images/spec.md),
[`shared-ui/auction-listing`](specs/shared-ui/auction-listing/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The auction worker already stores listing photos: table
`auction.auction_listing_images` (one row per listing per side), R2 bucket
bound as `AUCTION_LISTING_IMAGES`, content-addressed keys
`listings/<sha256>.<ext>`, admin `PUT`/`DELETE`
`/api/admin/listings/:listingId/images/:angle`, and public
`GET /api/public/listing-images/*` serving the original bytes `immutable`.
`putListingImage` upserts on `(listing_id, angle)` and currently allows any
editable listing (draft or published) to overwrite a side.

The public summary already carries the front photo; the details payload
already carries every side. `ListingView` maps each to `ListingGallery` with a
single `src`. `AuctionsPage`'s listing row never renders the photo. The admin
listings table has no photo controls, and `@grade10/auction-admin-frontend`
has no upload method.

`ListingGallery` already exists in `@grade10/ui` (`shared-ui/auction-listing`
in the package entry) with no capability spec. Width and height on the row are
untrusted browser hints; the worker comment that nothing can measure an image
predates the Images binding.

Screens: [ui.md](ui.md).

## Decisions

### Originals stay content-addressed in R2; named sizes are produced on serve

Keep one object per unique byte string. The public path gains a size segment:

`/api/public/listing-images/<size>/<objectKey>`

`<size>` is one of `card`, `detail`, `thumb`, `zoom`. `<objectKey>` stays
`listings/<64-hex>.<ext>`, minted by the existing `contentKey` helper. The GET
validates size then key, reads the original from R2, and — when the named size
is smaller than the stored image — runs it through the Workers Images binding
(`env.IMAGES.input(body).transform({ width, fit: "scale-down" }).output(...)`).
The response is `immutable` for a year, same as today. The cache key includes
the size, so a `card` entry can never be served as `zoom`.

Pixel ceilings (CSS slot × 2, never upscale):

| Size     | Max edge | Used by                          |
| -------- | -------- | -------------------------------- |
| `thumb`  | 128      | gallery strip (`h-16 w-12`)      |
| `card`   | 800      | catalogue row                    |
| `detail` | 1280     | gallery main frame               |
| `zoom`   | 1600     | zoom dialog                      |

Output format follows `Accept` (`image/avif`, `image/webp`, else `image/jpeg`)
and sends `Vary: Accept`. Unknown size and unknown key both 404.

The public photo object grows `alt` (string or null) and a `paths` map of the
four sizes. `imagePath` remains the `detail` path so a stale client that
concatenates `imageBaseUrl + imagePath` still gets a usable frame rather than
the original scan. New consumers use `paths`.

A transform port sits next to `ObjectStorePort`. Tests bind a fake that
returns the input bytes tagged with the requested size; the worker binds
`IMAGES`. `IMAGES.info()` runs at upload so `width`/`height` on the row are
measured, not taken from the query string. A body `info()` rejects is
`INVALID_CONTENT_TYPE`, the same as a bad header.

*Alternatives considered*

- **Precompute four derivatives at upload and store them in R2.** Rejected:
  adding a size later requires rewriting every object; the orphan sweep would
  have to know the derivative keys; re-uploading the same original would mint
  four new keys instead of one. The content-addressed original is the whole
  point of the current store.
- **Cloudflare Images as the object store (`imagedelivery.net`).** Rejected
  under Q7: a second product, a second id space, and the proof-document bucket
  would still be R2. Named variants on Images duplicate the size table this
  path already has.
- **Query string `?width=` on the existing path.** Rejected: open numeric
  parameters are not a contract, and the immutable cache would need to vary on
  an unbounded key. Four names are the spec.

Makes pass: `Each photo is published at named sizes`, `The catalogue uses card
size`, `The details gallery uses thumb, detail, and zoom`, `An unknown size is
not found`.

### The binding is `AUCTION_LISTING_ASSETS`; the table and public path keep saying photos

Wrangler binding and env field rename to `AUCTION_LISTING_ASSETS`. Bucket
names become `grade10-auction-listing-assets-{dev,staging,production}`. The
in-process storage area stays `listingImages`, the table stays
`auction_listing_images`, and `PUBLIC_ROUTES.listingImages` stays
`/api/public/listing-images`. Videos are a follow-up that will add a content
kind and likely a second public prefix; renaming the HTTP path now would
break every already-published `imagePath` for no collector-facing gain.

Migration: create the new buckets, copy existing keys (content-addressed, so
the key does not change), switch the binding, keep the old buckets until
staging has served a week of photos from the new name. Local dev has no
precious objects — `pnpm dev:clean` already drops R2 state.

*Alternatives considered*

- **Rename the table and the public path too.** Rejected: this change does
  not store videos, and the public path is already in payloads and caches.
- **Keep the old binding and add a second assets bucket.** Rejected: two
  public photo buckets is the typo hazard `docs/architecture/auction.md`
  already refused when it split photos from proofs.

### Add, replace, remove, and alt-only are four operations, not one upsert

`putListingImage` today is `ON CONFLICT DO UPDATE` on `(listing_id, angle)`.
Split it:

| Op        | Draft | Published | Closed / settled / canceled |
| --------- | ----- | --------- | --------------------------- |
| Add       | yes   | yes       | no                          |
| Replace   | yes   | no        | no                          |
| Remove    | yes   | no        | no                          |
| Alt-only  | yes   | yes       | no                          |

Add is a PUT to a side that has no row. Replace is a PUT to a side that has
one. The byte route stays `PUT /api/admin/listings/:listingId/images/:angle`
with `alt`, `width`, and `height` as query params (`width`/`height` ignored
once `info()` lands; kept for one release so old clients do not 400). Alt-only
is `listings.updateImageAlt` on tRPC, no bytes. Delete stays `DELETE` on the
same path.

Refusal codes: `NOT_EDITABLE` stays for closed listings; `NOT_REPLACABLE` for
a replace on a published side; `NOT_REMOVABLE` for a delete on a published
side. The admin UI disables those actions rather than surprising the operator
with the code, but the codes are what a test asserts.

`isEditableListing` (draft + published) is **not** reused for replace/remove.
It still governs copy, sale, and schedule. Photo rules are their own
predicates so a published listing can gain a missing back without opening the
front to a swap.

Objects still write before the row. Delete still drops the row and leaves the
object; the orphan sweep reclaims it.

Makes pass: `A published listing can gain a missing side`, `Replacing a live
photo is refused`, `Removing a live photo is refused`, `A draft photo can be
replaced and removed`, `Alt can be edited on a published listing`, `Adding
after close is refused`.

### Admin photos hang off the existing listings table

No listing-editor page. `listings.get` grows `images` (every side that has a
row, with alt and the four paths). `listings.list` grows a nullable
`frontImage` so the table can show a card-sized thumb without N+1 gets. A
"Photos" action on each row opens a dialog with six side slots.

The admin panel already talks tRPC for listing mutations and a Hono byte route
for uploads. Keep that split: the photo manager's upload calls `PUT` with
`credentials: "include"`; alt, delete, and the listing read stay on the
procedure client. A new `uploadListingImage` method lives next to the
procedure client, not on it — the procedure client is JSON-unknown on
purpose, and a `Blob` does not belong there.

Makes pass: `An accepted upload becomes that side's photo`, `Operators attach
photos from the admin listings table`.

### `ListingGallery` takes three sources; the catalogue stays an assembly

`ListingGalleryImage` gains optional `thumbSrc` and `zoomSrc` (omit → `src`).
`alt` is already required. The grade10 listing page maps `paths.thumb` /
`paths.detail` / `paths.zoom` and `alt ?? title`. The catalogue row is
app-owned (`AuctionsPage` `ListingRow`): an `img` at `paths.card`, no new
`@grade10/ui` card. ZZZ has no auction UI.

*Alternatives considered*

- **A shared listing card in `@grade10/ui`.** Rejected: the catalogue is one
  brand's assembly today, and this change is the photo, not a redesign of the
  sale list.
- **Keep a single `src` and let the browser download detail bytes for
  thumbs.** Rejected under Q4: that is the status quo.

Makes pass: `Distinct sources are used in each slot`, `A listing with a front
photo shows it on the catalogue`, `Several sides appear in side order`.

## Risks / Trade-offs

- **Cloudflare Images is a paid Workers binding.** Without it, named sizes
  cannot be produced in the worker. Delivery creates the binding on each
  account before the worker that reads it deploys; local wrangler provides
  the binding in `wrangler dev`. If a given environment's Images is not
  enabled, the public GET fails loud (5xx + log), it does not silently fall
  back to the original 20 MB scan.
- **First request per size per object pays a transform.** The immutable cache
  and the short browse cache in front of listing JSON (which only carries
  paths) absorb repeats. A purge still never prefixes listing-image paths.
- **Copying staging/production objects into the renamed bucket** is a one-time
  ops step. Keys are hashes, so a copy is idempotent; dual-running two
  bindings is not attempted.

## Migration Plan

1. Create `grade10-auction-listing-assets-{staging,production}` in each
   Cloudflare account. Local uses the wrangler-dev bucket of the same name.
2. Copy keys from `grade10-auction-listing-images-*` into the new buckets
   (no-op when empty).
3. Ship the worker with the renamed binding, the `IMAGES` binding, the size
   segment on the public GET, and the add/replace split.
4. Add nullable `alt` on `auction_listing_images` (expand). No backfill: null
   means "use the listing title".
5. Stop writing `width`/`height` from the query string once `info()` is in;
   leave the columns.
6. After staging has served photos from the new bucket, delete the old
   buckets in a later change — not this one.

No contract break for JSON clients that only read `imagePath`: it now points
at `detail` instead of the original, which is smaller and correct. Clients
that fetched the original path without a size segment receive 404 (the old
path no longer exists). That path was never on the grade10 SPA except through
`imagePath`, which this change rewrites.

## Open Questions

None. Q1–Q9 are closed; remaining unknowns (Images entitlement on an account,
whether staging has objects to copy) are delivery checks, not spec or task
changes.
