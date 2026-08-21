**Author:** @htonyl - 2026-08-20

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Overlaps [`add-grade10-auction`](../add-grade10-auction/proposal.md) (collector
browse and bidding; archive still pending). This change is the operator half
that change left out.

## Why

Collectors can only bid on listings that exist. The Grade10 admin console
lists every listing and can publish, move a draft window, or call one off —
and has no way to write one. Operators seed or call an API, so the catalogue
a collector browses is not something the house can author from the same
console it already uses to run the sale. In practice an operator saves
incomplete work, then creates the listing once the facts are in, then
publishes — often on a schedule, not by clicking at that moment.

**Metric:** listings created and updated from the Grade10 auction admin
section that reach `published`. **Acceptance signal:** an operator can save
an empty draft, fill it over more than one session, create it once required
fields are present, and have it publish at a chosen time.

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
- **A slug is the listing's public address.** Create requires a unique,
  URL-safe slug. No two listings share a slug, in any status. A collector
  reaches the listing at `/auction/listings/<slug>`. The slug cannot change
  once the listing is published, so a shared link stays valid.
- **Media is an ordered gallery of one to eight images or videos**, stored
  and served as uploaded. A draft may have none; create requires at least
  one. Image processing, renditions, and thumbnails are a separate change.
- **BREAKING** for the public listing gallery: media is no longer one photo
  per named physical side (`front` / `back` / `left` / `right` / `top` /
  `bottom`). It is an ordered list; the first item is the catalogue card.

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
across every listing in any status — a canceled or closed listing still
occupies its slug. Empty on draft; required and unique at create; locked
once published.

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

- Image or video processing — resize, transcode, generated thumbnails, or
  derived renditions. This change stores the uploaded bytes and serves them.
- Relisting an existing unit, picking a product, or a consignment record.
- A sale-scoped lot number (listing label / `12A`). An online listing is
  identified by its title and address.
- Calling off a listing, or moving a published listing's window — those
  actions already exist.
- Creating sales, taxonomies, or categories (pick from ones that exist).
- Reserve amounts (removed by `add-grade10-auction`).
- Buyer-fee editing (operational policy snapshot, not a listing field).
- ZZZ's admin panel (auction operations live on the Grade10 admin section).
- Storefront bid, watch, or registration flows.

## Capabilities

### New Capabilities

- `grade10-auction/admin-listing`: an authorized operator drafts, creates,
  and publishes an Auction listing from the Grade10 admin section — which
  fields they may write, when required fields are enforced, slug lookup at
  `/auction/listings/<slug>`, scheduled publish, and the unprocessed media
  gallery a listing then publishes.

### Modified Capabilities

- None. `grade10-auction/auction` is still an in-flight change and covers
  collector browse and bidding, not operator authoring.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | Draft, create, and edit surfaces on the auction listings section, including client-side required-field checks at create and a publish at control. |
| `apps/backend/grade10/auction` | Today's create is a complete draft in one step; this needs a lenient draft save, a create gate that validates required fields, and publish at a scheduled time. Media stops being keyed by physical side and accepts video. |
| `@grade10/auction-contracts` | Admin listing shape gains slug, media, and publish at; public listing gallery becomes an ordered list of images and videos. Public listing lookup is by slug. **BREAKING** for `angle` and for listing addresses that named an internal id. |
| `@grade10/auction-admin-frontend` | Draft/create/update repository and form wiring. |
| `@grade10/auction-frontend` / Grade10 listing page | Lookup by slug; gallery must show videos as well as images, in the operator's order. |
| `@grade10/ui` `ListingGallery` | May need to accept video items; that is delivery work at promotion. |

No new design-system primitive is proposed. Money remains integer minor units
plus an ISO 4217 code.
