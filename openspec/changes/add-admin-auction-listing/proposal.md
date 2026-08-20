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
console it already uses to run the sale.

**Metric:** listings created and updated from the Grade10 auction admin
section that reach `published`. **Acceptance signal:** an operator can take a
card from nothing to a draft listing — copy, prices, window, categories, and
up to eight photos or videos — and edit that listing later without leaving
the console.

## What Changes

- **An operator creates a listing from the Grade10 auction admin section.**
  The listing opens as a draft. Publishing, calling off, and moving a live
  window stay the actions they already are.
- **An operator updates a listing that is still editable** (`draft` or
  `published`). Closed, settled, and canceled listings are the record of what
  was sold and are not rewritten here.
- **The form's fields are the listing's own facts**, listed below. A physical
  unit is minted with the listing; relisting an existing unit is out of
  scope.
- **Media is an ordered gallery of up to eight images or videos**, stored and
  served as uploaded. Image processing, renditions, and thumbnails are a
  separate change.
- **BREAKING** for the public listing gallery: media is no longer one photo
  per named physical side (`front` / `back` / `left` / `right` / `top` /
  `bottom`). It is an ordered list; the first item is the catalogue card.

### Editable fields

| Field | Create | Draft | Published | Closed / settled / canceled |
| --- | --- | --- | --- | --- |
| Title | yes, required | yes | yes | no |
| Copy | yes | yes | yes | no |
| Listing label | yes | yes | yes | no |
| Sort index | yes | yes | yes | no |
| Sale | yes, optional | yes | yes | no |
| Categories | yes | yes | yes | no |
| Currency | yes | yes | no | no |
| Starting price | yes, required | yes | no | no |
| Minimum increment | yes, required | yes | no | no |
| Starts at | yes, required | yes | no | no |
| Scheduled close | yes, required | yes | no | no |
| Snipe window (seconds) | yes | yes | no | no |
| Extension reach (seconds) | yes | yes | no | no |
| Extension cap (seconds) | yes, optional | yes | no | no |
| Sandbox | yes | no | no | no |
| Media (≤ 8 images or videos) | yes | yes | yes | no |

Not on this form: listing identity, the physical unit, status, the effective
close (extension writes it), highest bid, created/updated/closed stamps.

## Non-Goals

- Image or video processing — resize, transcode, generated thumbnails, or
  derived renditions. This change stores the uploaded bytes and serves them.
- Relisting an existing unit, picking a product, or a consignment record.
- Publishing, calling off, or moving a published listing's window — those
  actions already exist.
- Creating sales, taxonomies, or categories (pick from ones that exist).
- Reserve amounts (removed by `add-grade10-auction`).
- Buyer-fee editing (operational policy snapshot, not a listing field).
- ZZZ's admin panel (auction operations live on the Grade10 admin section).
- Storefront bid, watch, or registration flows.

## Capabilities

### New Capabilities

- `grade10-auction/admin-listing`: an authorized operator creates and updates
  an Auction listing from the Grade10 admin section — which fields they may
  write, when, and the unprocessed media gallery a listing then publishes.

### Modified Capabilities

- None. `grade10-auction/auction` is still an in-flight change and covers
  collector browse and bidding, not operator authoring.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/admin/grade10` | Create and edit surfaces on the auction listings section. |
| `apps/backend/grade10/auction` | Create already exists; update of catalogue, prices, and media must match the field matrix; media stops being keyed by physical side and accepts video. |
| `@grade10/auction-contracts` | Admin listing shape gains media; public listing gallery becomes an ordered list of images and videos. **BREAKING** for `angle`. |
| `@grade10/auction-admin-frontend` | Create/update repository and form wiring. |
| `@grade10/auction-frontend` / Grade10 listing page | Gallery must show videos as well as images, in the operator's order. |
| `@grade10/ui` `ListingGallery` | May need to accept video items; that is delivery work at promotion. |

No new design-system primitive is proposed. Money remains integer minor units
plus an ISO 4217 code.
