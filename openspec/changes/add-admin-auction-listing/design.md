## Context

The Auction worker currently creates a complete, immediately publishable
listing around a pre-existing product, stores one image for each named physical
side, and lets the admin panel publish, reschedule, or cancel that listing.
The admin listing capability delta is the source of truth for the new
lifecycle and public address. See [proposal.md](proposal.md) for motivation.

The worker is the authority for listing state, its Postgres schema, object
store media, public routes, cache invalidation, and cron sweeps. The Grade10
admin app composes data-backed auction features from
`@grade10/auction-admin-frontend`; it does not call the transport directly.

## Goals / Non-Goals

**Goals:**

- Make draft, create, publish, scheduled publish, update, cancel, media, and
  slug lookup one consistent listing lifecycle across the schema, worker,
  contracts, and admin feature.
- Keep create as the single complete-field validation gate while preserving
  field-shape validation on each draft write.
- Make the database, rather than a read-before-write check, protect live slug
  uniqueness and the listing state transitions that race with a sweep.
- Let the admin feature run from contract-backed fixtures, independently of a
  running worker.

**Non-Goals:**

- General image/video processing, renditions, thumbnails, or content analysis.
- Changing auction bidding, close, or settlement mechanics beyond recognizing
  the new `created` lifecycle state.
- Introducing a shared form component or a design-system primitive without a
  design-system decision.

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

### Replace angle-keyed images with an ordered media gallery

Replace `auction_listing_images(angle)` with media rows that carry an integer
position, media kind/content type, object key, and optional dimensions. The
database bounds a listing to one ordered position per item and the service
accepts only one to eight items at create; drafts may contain none. Uploads
write immutable original bytes to the existing object store and insert,
replace, remove, or reorder rows through the elevated listing path. Public and
admin codecs expose an ordered media list, and public rendering chooses an
image or video element from each item's media type.

Keeping the side vocabulary was rejected because it cannot express an ordered
gallery or video. Storing media as a JSON array on the listing was rejected:
row-level writes avoid lost updates and let the orphan-object sweep continue
to discover all referenced keys. Derived uploads were rejected because this
change deliberately serves originals only.

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

Extend the existing `catalog/listings` slice with draft/create/update/media
commands and form-facing models. Its datasource decodes the admin contract,
the repository exposes the commands, and hooks invalidate listing queries.
`apps/admin/grade10` owns the listing-form page composition, dialog state, and
permission-gated actions. Fixtures implement the expanded procedure port so
the package and app tests cover form states without a running worker.

This follows the existing auction admin slice pattern and keeps the app free
of wire types. Putting the form and tRPC calls directly in the admin app was
rejected because it would duplicate the feature for future admin consumers and
bypass the decode/fixture seam. Adding a use-case layer was rejected because
the browser owns no invariant beyond presentation validation; the worker owns
the lifecycle rules.

## Risks / Trade-offs

- [Existing rows and public callers still use complete listing fields and
  angle-keyed images] → Expand the schema and contracts first, migrate existing
  rows deterministically, then update writers/readers together before removing
  legacy routes and columns.
- [A scheduled publish races with an operator action] → Lock and re-read the
  listing for every state transition; an already published or canceled row is a
  no-op for the sweep.
- [A successful object write can outlive a rejected media-row write] → Keep the
  existing write-object-first rule and let the orphan-object sweep reclaim
  unreferenced originals.
- [Browser validation drifts from the API] → Share the contract vocabulary and
  retain backend scenario tests as the authority; form tests prove only the
  early feedback.
- [The fixed-size gallery exceeds worker/object-store constraints] → Enforce
  content-type and byte limits at upload and one-to-eight media cardinality at
  create; no processing is attempted in this change.

## Migration Plan

1. Add the expanded status, authoring, slug, scheduling, and ordered-media
   schema with an expand migration; backfill existing complete listings as
   published and convert each angle image to its deterministic gallery order.
2. Generate and commit the worker migration artifacts, then ship the worker,
   contracts, and admin feature together so every deployed reader understands
   the new row shape.
3. Deploy with the public lookup route accepting slugs only after existing
   visible listings have a unique backfilled slug. Monitor the publish-due
   sweep and public lookup refusals.
4. Roll back application code only while the expanded schema remains
   compatible. Do not roll back the migration destructively; forward-fix data
   or code if a listing has already been authored under the new lifecycle.
