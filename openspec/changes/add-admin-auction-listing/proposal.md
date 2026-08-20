**Author:** @web3-app-cursor8 - 2026-08-20

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
- **Publish can be scheduled.** An optional `publish at` timestamp publishes
  a created listing when that time arrives. An operator can still publish
  immediately. A draft is never published, on a schedule or by hand.
- **An operator updates a listing that is still editable** (`draft`,
  `created`, or `published`). Closed, settled, and canceled listings are the
  record of what was sold and are not rewritten here.
- **The form's fields are the listing's own facts**, listed below. A physical
  unit is minted with the first draft save; relisting an existing unit is
  out of scope.
- **Media is an ordered gallery of up to eight images or videos**, stored and
  served as uploaded. Image processing, renditions, and thumbnails are a
  separate change.
- **BREAKING** for the public listing gallery: media is no longer one photo
  per named physical side (`front` / `back` / `left` / `right` / `top` /
  `bottom`). It is an ordered list; the first item is the catalogue card.

### Fields

`Required` is the create gate: the field MUST be present and valid to create
the listing. A draft save does not enforce it.

| Field | Required | Draft | Created | Published | Closed / settled / canceled |
| --- | --- | --- | --- | --- | --- |
| Title | yes | yes | yes | yes | no |
| Copy | no | yes | yes | yes | no |
| Listing label | no | yes | yes | yes | no |
| Sort index | no | yes | yes | yes | no |
| Sale | no | yes | yes | yes | no |
| Categories | no | yes | yes | yes | no |
| Currency | no | yes | yes | no | no |
| Starting price | yes | yes | yes | no | no |
| Minimum increment | yes | yes | yes | no | no |
| Starts at | yes | yes | yes | no | no |
| Scheduled close | yes | yes | yes | no | no |
| Snipe window (seconds) | no | yes | yes | no | no |
| Extension reach (seconds) | no | yes | yes | no | no |
| Extension cap (seconds) | no | yes | yes | no | no |
| Publish at | no | yes | yes | no | no |
| Sandbox | no | yes | no | no | no |
| Media (≤ 8 images or videos) | no | yes | yes | yes | no |

Not on this form: listing identity, the physical unit, status, the effective
close (extension writes it), highest bid, created/updated/closed stamps.

## Non-Goals

- Image or video processing — resize, transcode, generated thumbnails, or
  derived renditions. This change stores the uploaded bytes and serves them.
- Relisting an existing unit, picking a product, or a consignment record.
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
  fields they may write, when required fields are enforced, scheduled
  publish, and the unprocessed media gallery a listing then publishes.

### Modified Capabilities

- None. `grade10-auction/auction` is still an in-flight change and covers
  collector browse and bidding, not operator authoring.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | Draft, create, and edit surfaces on the auction listings section, including client-side required-field checks at create and a publish-at control. |
| `apps/backend/grade10/auction` | Today's create is a complete draft in one step; this needs a lenient draft save, a create gate that validates required fields, and publish at `publishAt`. Media stops being keyed by physical side and accepts video. |
| `@grade10/auction-contracts` | Admin listing shape gains media and `publishAt`; public listing gallery becomes an ordered list of images and videos. **BREAKING** for `angle`. |
| `@grade10/auction-admin-frontend` | Draft/create/update repository and form wiring. |
| `@grade10/auction-frontend` / Grade10 listing page | Gallery must show videos as well as images, in the operator's order. |
| `@grade10/ui` `ListingGallery` | May need to accept video items; that is delivery work at promotion. |

No new design-system primitive is proposed. Money remains integer minor units
plus an ISO 4217 code.
