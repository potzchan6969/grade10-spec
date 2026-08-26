**Author:** @htonyl - 2026-08-20

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Overlaps [`add-grade10-auction`](../add-grade10-auction/proposal.md) (collector
browse and bidding; archive still pending). This change is the operator half
that change left out, plus sized gallery delivery for collectors.

This change absorbs [`add-auction-listing-assets`](../../archive/2026-08-24-add-auction-listing-assets/proposal.md)
(archived 2026-08-24, specs not folded). Grade10 PRs #85 (admin listing
workflow) and #71 (listing gallery assets, stacked on #85) ship together, so
one OpenSpec change owns both.

## Why

Collectors can only bid on listings that exist. The Grade10 admin console
lists every listing and can publish, move a draft window, or call one off —
and has no way to write one. Operators seed or call an API, so the catalogue
a collector browses is not something the house can author from the same
console it already uses to run the sale. In practice an operator saves
incomplete work, then creates the listing once the facts are in, then
publishes — often on a schedule, not by clicking at that moment.

Even when media is attached, the catalogue still reads as a text list of
lots: each row is title, close, and price, and both the catalogue and the
details gallery ask the browser for the original scan — often a
multi-megabyte JPEG — with the same address for thumbnail, main frame, and
zoom.

**Metric:** listings created and updated from the Grade10 auction admin
section that reach `published`, and the share of those whose catalogue row
shows a card-sized first image (when that item is an image) with sized
gallery sources on the details page. **Acceptance signal:** an operator can
save an empty draft, fill it over more than one session (including ordered
gallery media with optional alt and preview-before-upload), create it once
required fields are present, have it publish at a chosen time, and a
collector sees the listing by slug with sized image delivery.

## What Changes

- **Draft → create → publish.** An operator saves a draft with any subset of
  the fields, creates the listing when required fields are present and
  valid, then publishes it. Create is the validation gate; publish is what
  makes it public.
- **A draft allows required fields to be empty.** Saving a draft does not
  validate them. Create validates them on the admin form and on the API; a
  client that skips the form cannot create an incomplete listing.
- **Publish can be scheduled.** An optional **Publish at** timestamp publishes
  a created listing when that time arrives. The timestamp MUST be in the
  future; a time that has already passed is refused. An operator can still
  publish immediately. A draft is never published, on a schedule or by hand.
- **An operator updates a listing that is still editable** (`draft`,
  `created`, or `published`). Closed, settled, and canceled listings are the
  record of what was sold and are not rewritten here.
- **An operator may call a listing off** while it is `draft`, `created`, or
  `published`. Closed and settled listings cannot be called off — the
  outcome is absolute. Calling it off releases every live authorization and
  rewrites the slug so a later listing can reuse the original address.
- **A slug is the listing's public address.** Create requires a unique,
  URL-safe slug. No two live listings share a slug. A canceled listing does
  not keep its original slug: Grade10 appends `-cancelled-` and the listing
  id from the seventh character onward, which frees the original for a
  future listing. A collector reaches a published, closed, or settled
  listing at `/auction/listings/<slug>`. The slug cannot change once the
  listing is published, except by that cancel rewrite.
- **Media is an ordered gallery of one to eight images or videos.** A draft
  may have none; create requires at least one. Originals are stored
  content-addressed and served as uploaded. **BREAKING** for the public
  listing gallery: media is no longer one item per named physical side
  (`front` / `back` / `left` / `right` / `top` / `bottom`). It is an ordered
  list; the first item is the catalogue card.
- **Named sizes and optional alt for gallery images.** Each published gallery
  **image** is offered at four named sizes — `card`, `detail`, `thumb`,
  `zoom` — transformed on serve when the named size is smaller than the
  stored bytes. Image items carry optional alt (fallback: listing title).
  Video items keep the original public path. The admin media manager
  previews and confirms before image bytes upload, reviews at card size,
  and magnifies to zoom.
- **Listing object store renamed** from `AUCTION_LISTING_IMAGES` to
  `AUCTION_LISTING_ASSETS` so image and video share one bucket name.

### Fields

`Required` is the create gate: the field MUST be present and valid to create
the listing. A draft save does not enforce it.

| Field | Required | Draft | Created | Published | Closed / settled / canceled |
| --- | --- | --- | --- | --- | --- |
| Title | yes | yes | yes | yes | no |
| Slug | yes | yes | yes | no | no |
| Copy | no | yes | yes | yes | no |
| Sort index | no | yes | yes | yes | no |
| Sale | no | yes | yes | yes | no |
| Categories | no | yes | yes | yes | no |
| Currency | no | yes | yes | no | no |
| Starting price | yes | yes | yes | no | no |
| Minimum increment | yes | yes | yes | no | no |
| Starts at | yes | yes | yes | no | no |
| Scheduled close at | yes | yes | yes | no | no |
| Extension window (seconds) | no | yes | yes | no | no |
| Extension duration (seconds) | no | yes | yes | no | no |
| Extension cap (seconds) | no | yes | yes | no | no |
| Publish at | no | yes | yes | no | no |
| Sandbox | no | yes | no | no | no |
| Media (1–8 images or videos) | yes | yes | yes | yes | no |

Not on this form: listing identity besides the slug, the physical unit,
status, the effective close (extension writes it), highest bid,
created/updated/closed stamps.

**Slug** is the lookup key in the listing's public URL
(`/auction/listings/<slug>`). Lower-case words joined by hyphens. Unique
among listings that currently hold that slug. Empty on draft; required and
unique at create; locked once published. A closed or settled listing keeps
its slug. Canceling a listing that has a slug rewrites it to
`<slug>-cancelled-<id from character 7 onward>`, which may be longer than
64 characters, and frees the original.

**Starts at** is when bidding opens. **Scheduled close at** is the published
close. **Publish at** is when a created listing becomes public.

**Extension window** is how close to the close a bid must land to extend.
**Extension duration** is how far that bid moves the close (to now plus this
many seconds). **Extension cap** is the farthest the close may go past
scheduled close at; omit it for no cap.

**Publish at** MUST be after now when the operator sets it.

**Sandbox** runs the listing on test-mode payment credentials instead of
live money, so the house can rehearse a sale.

## Non-Goals

- Video transcoding or generated video thumbnails. Video is stored and served
  as uploaded; named sizes apply to images only.
- Cloudflare Images as the object store, or precomputed derivatives in R2.
  Originals stay content-addressed in R2; named sizes for images are produced
  on serve.
- Required alt text or a publish gate on images. Alt falls back to the
  listing title. Create's "at least one media" rule stands.
- Relisting an existing unit, picking a product, or a consignment record.
- A sale-scoped lot number (listing label / `12A`). An online listing is
  identified by its title and address.
- Moving a published listing's window — that action already exists.
- Creating sales, taxonomies, or categories (pick from ones that exist).
- Reserve amounts (removed by `add-grade10-auction`).
- Buyer-fee editing (operational policy snapshot, not a listing field).
- ZZZ's admin panel (auction operations live on the Grade10 admin section).
- Storefront bid, watch, or registration flows.

## Capabilities

### New Capabilities

- `grade10-auction/admin-listing`: an authorized operator drafts, creates,
  and publishes an Auction listing from the Grade10 admin section — which
  fields they may write, when required fields are enforced, when a listing
  may be called off, slug lookup at `/auction/listings/<slug>`, the cancel
  rewrite that frees a slug, scheduled publish, and the ordered one-to-eight
  image-or-video gallery (originals stored and served as uploaded).
- `grade10-auction/listing-media`: optional alt on gallery images, named
  public sizes (`card`, `detail`, `thumb`, `zoom`), admin media-manager
  preview-before-upload and card/zoom review, and catalogue/details
  consumption of sized paths — on the gallery from admin-listing.
- `shared-ui/auction-listing`: the listing product-page blocks `@grade10/ui`
  already exports (`ListingGallery`, `ListingBidPanel`, `ListingDetails`) and
  the gallery's distinct sources for thumbnail, main frame, and zoom. The
  blocks ship today with no durable spec; this change alters the gallery
  contract, so the surface is written down here.

### Modified Capabilities

- None. `grade10-auction/auction` is still an in-flight change and covers
  collector browse and bidding, not operator authoring.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | Draft, create, and edit surfaces; gallery media manager with preview/confirm, card/zoom review, and alt; client-side required-field checks at create and a publish at control. |
| `apps/frontend/grade10` | Catalogue row shows first image at card size; details gallery passes sized sources and alt into `ListingGallery`; public lookup by slug. |
| `apps/backend/grade10/auction` | Lenient draft save, create gate, scheduled publish, ordered media (image and video), binding renamed to `AUCTION_LISTING_ASSETS`, Images binding for on-serve transform, public path gains a size segment for images. Cancel of a `created` listing is allowed; cancel rewrites the slug. |
| `@grade10/auction-contracts` | Admin listing shape gains slug, media, publish at, alt, and named-size paths; public gallery becomes an ordered list. Public listing lookup is by slug. **BREAKING** for `angle` and for listing addresses that named an internal id. |
| `@grade10/auction-admin-frontend` | Draft/create/update/media/alt repository and form wiring. |
| `@grade10/auction-frontend` / Grade10 listing page | Lookup by slug; sized paths and alt; gallery shows videos as well as images. |
| `@grade10/ui` | `ListingGallery` / `ListingGalleryImage` accept distinct thumbnail, main, and zoom sources; may render video items. |

Cloudflare Images (Workers binding) is a new account-level dependency on the
auction worker. The public gallery path is `/api/public/listing-media` (sized
segment for images; originals for video). The object-store binding is
`AUCTION_LISTING_ASSETS`. Money remains integer minor units plus an ISO 4217
code. No new design-system primitive is proposed.
