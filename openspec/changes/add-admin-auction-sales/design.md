## Context

Auction **sale events** already ship end-to-end: table `auctions`, statuses
`draft | published | canceled`, admin tRPC `auctions.{list,get,create,update,publish,cancel}`,
and a thin Sales panel that only opens a draft by title and publishes from
the table. Listings optionally reference a sale via `auctionId`;
`OPEN_AUCTION_STATES = ["draft", "published"]` gates attachment. The listing
editor never exposes that field. Admin sales repository/client only wire
`list` / `create` / `publish` — not `update` / `cancel` / `get`.

This change completes the operator surface on that model. It does **not**
add a second “campaign” entity or a `created` sale status. Store checkout
and inventory “sold” are unrelated products.

Capability specs:
[`grade10-auction/admin-sale`](specs/grade10-auction/admin-sale/spec.md),
[`grade10-auction/admin-listing`](specs/grade10-auction/admin-listing/spec.md)
(delta). Attach eligibility is already required under admin-listing catalogue
fields; this plan adds editor scenarios and the sale CRUD capability.

## Decisions

### 1. Reuse the existing sale event — do not invent a parallel table

**Decision:** Product language stays **sale**; persistence and tRPC keep
`auctions` / `auctionId`. Admin domain maps to `saleId` as today.

**Rejected:** A new `sale_events` (or similar) table and API. That would
fork identity from live catalogue covers, fan-out cancel, and every listing
FK already in production.

### 2. Sale status machine stays `draft → published | canceled`

**Decision:** No `created` on sales. Open requires a title; that is the only
authoring gate. Publish moves `draft → published`. Cancel moves
`draft|published → canceled` and fans out listing cancel.

**Rejected:** Mirroring listing’s `draft → created → published`. Listings need
a create gate for money/window/media; sales carry identity/copy only. Adding
`created` would force a migration and break `OPEN_AUCTION_STATES` and public
cover rules for no operator gain.

**Rejected:** Making only `draft` sales attachable (the ambiguous reading of
“not published/draft/canceled”). Code and durable admin-listing already
allow **`draft` or `published`**. Tightening would strand live covers that
still receive lots.

### 3. Listing ↔ sale selection rule (final)

A listing may attach a sale **only when that sale is `draft` or
`published`**. `canceled` is refused. Clearing the sale is always allowed
while the listing is editable. Publishing a listing does **not** require a
sale.

Wire paths: pass `auctionId` on draft save and create (already on payloads);
for post-create edits on `created`/`published` listings, call
`listings.setAuction` (extend the admin procedure client — it is missing
today). Picker options come from `auctions.list` filtered client-side to
open statuses (or keep canceled out of the control).

### 4. Admin UI mirrors listing authoring, not listing complexity

**Decision:** Sales tab keeps a table; “new” / row open swaps to a
full-page **SaleEditorPage** beside `ListingEditorPage` patterns
(back control, `Card` form, `TextInput` for title/copy, primary actions).
No media, prices, or schedule on the sale editor.

**Rejected:** Growing the inline “New sale” title field into the only edit
surface. Operators need cancel and copy edit without leaving a one-line form.

### 5. Packages and ownership

**Decision:** All work under `@grade10/auction-*` and
`apps/admin/grade10` auction pages. No store/finance coupling. No
grade10-spec design-system or `@grade10/ui` package change unless a Select
primitive is later requested — compose existing primitives (native
`<select>` labeled with design-system `Text` / field patterns is enough).

### 6. Backend scope

**Decision:** Prefer **no migration**. Tables and status check already match
the specs. Backend tasks are verification and any thin gap (none expected
beyond ensuring admin cancel/update remain the authority). Frontend and
procedure-client wiring are the bulk.

**Rejected:** Expanding the sale row with campaign window or hero media in
this change.

## Risks / Trade-offs

| Risk | Mitigation |
| --- | --- |
| Operators expect listing-like `created` on sales | Spec and UI copy state open → publish; no create gate |
| Cancel of a large sale is batched | Existing cancel + sweep; UI reports remaining if the client surfaces it |
| Parallel `add-grade10-inventory` naming collision | Proposal non-goals; sale = event cover only |
| Submodule pin lags store | Implementers bump `external/grade10-spec` only if this change ships UI contracts there (none planned) |

## Migration Plan

None for schema. Rollout is admin SPA + package deploys with the grade10
product. Existing sales and listing `auctionId` values keep working.

## Open Questions

None that block the task breakdown. Eligibility (`draft` \| `published`) and
no-`created` are settled against shipping code and durable admin-listing.
