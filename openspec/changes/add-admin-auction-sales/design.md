## Context

Auction **sale events** already ship: table `auctions`, admin tRPC
`auctions.{list,get,create,update,publish,cancel}`, and a thin Sales panel
that opens a draft by title and publishes from the table. Listings optionally
reference a sale via `auctionId`. Today statuses are only
`draft | published | canceled`, and
`OPEN_AUCTION_STATES = ["draft", "published"]` gates attachment. The listing
editor never exposes that field. Admin sales repository/client only wire
`list` / `create` / `publish` — not `update` / `cancel` / `get`.

This change completes the operator surface and **aligns sale status with
listing** (`draft` → `created` → `published` | `canceled`). A sale remains
one campaign/event cover that **many listings** may belong to. Store checkout
and inventory “sold” are unrelated products.

Capability specs:
[`grade10-auction/admin-sale`](specs/grade10-auction/admin-sale/spec.md),
[`grade10-auction/admin-listing`](specs/grade10-auction/admin-listing/spec.md)
(delta).

## Goals / Non-Goals

**Goals:**

- Sale editor (create / edit / publish / cancel) mirroring listing authoring.
- Listing editor sale picker limited to **`draft` | `created`**.
- Introduce `created` on sales; tighten attach eligibility accordingly.

**Non-Goals:**

- Parallel campaign table; store/inventory coupling; sale-level clocks or money.

## Decisions

### 1. Reuse the existing sale event — do not invent a parallel table

**Decision:** Product language stays **sale**; persistence and tRPC keep
`auctions` / `auctionId`. Admin domain maps to `saleId` as today. One sale
holds many listings (campaign / event cover).

**Rejected:** A new `sale_events` table. That would fork identity from live
catalogue covers and every listing FK already in production.

### 2. Sale status machine matches listing: `draft → created → published | canceled`

**Decision:** Add `created`. Open requires a title and persists `draft`.
**Create** moves `draft → created` (title still required). **Publish** moves
`created → published` only. **Cancel** moves `draft | created | published →
canceled` and fans out listing cancel. Edit title/copy while
`draft | created | published`.

**Rejected:** Keeping only `draft | published | canceled` with no `created`.
Product asked for the same stages as listing and for a picker of draft /
created only.

**Rejected:** Publish directly from `draft`. Create is the ready gate; publish
is the public-cover gate — same shape as listings.

### 3. Listing ↔ sale selection rule (final)

A listing may attach a sale **only when that sale is `draft` or `created`**.
`published` and `canceled` are refused. Clearing the sale is always allowed
while the listing is editable. Publishing a listing does **not** require a
sale.

Wire paths: pass `auctionId` on draft save and create; for post-create edits
on `created`/`published` listings, call `listings.setAuction`. Picker options
come from `auctions.list` filtered to `draft` and `created`.
`OPEN_AUCTION_STATES` becomes `["draft", "created"]`.

**Rejected:** Keeping published sales attachable (prior shipping behaviour).
Product feedback: draft or created only.

Existing listings already under a published sale keep their `auctionId`;
operators simply cannot attach **new** listings to that published sale.

### 4. Admin UI mirrors listing authoring, not listing complexity

**Decision:** Sales tab keeps a table; “new” / row open swaps to a
full-page **SaleEditorPage** beside `ListingEditorPage` patterns
(back control, `Card` form, `TextInput` for title/copy, primary actions:
create when draft, publish when created, cancel when authorized).
No media, prices, or schedule on the sale editor.

**Rejected:** Growing the inline “New sale” title field into the only edit
surface.

### 5. Packages and ownership

**Decision:** All work under `@grade10/auction-*` and
`apps/admin/grade10` auction pages. Compose existing primitives (native
`<select>` for the sale picker until a design-system Select exists).

### 6. Backend scope

**Decision:** Migration required: extend `ck_auctions_status` (and
`AUCTION_STATUSES`) with `created`; flip `OPEN_AUCTION_STATES` to
`draft` | `created`; publish path accepts only `created`; add/verify create
transition `draft → created`. Frontend and procedure-client wiring remain
bulk of the UX work.

**Rejected:** Expanding the sale row with campaign window or hero media in
this change.

## Risks / Trade-offs

| Risk | Mitigation |
| --- | --- |
| Existing flows publish draft → published | Spec + tasks: create then publish; migrate admin UI and tests |
| Published sales no longer accept new lots | Documented product rule; existing attachments unchanged |
| Parallel `add-grade10-inventory` naming | Proposal non-goals; sale = event cover only |

## Migration Plan

1. Expand status check to include `created`.
2. Deploy worker with create transition and tightened `OPEN_AUCTION_STATES`.
3. Ship admin SPA: sale editor create/publish actions + listing picker filter.
4. No row backfill required — existing `draft` / `published` / `canceled`
   rows stay valid; operators create drafts before publishing new covers.

## Open Questions

None blocking. Product confirmed: sale = multi-listing campaign/event;
picker = `draft` | `created` only; statuses align with listing.
