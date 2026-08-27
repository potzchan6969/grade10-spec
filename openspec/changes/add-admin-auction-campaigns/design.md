## Context

Auction **campaign** covers already ship under the existing `auctions`
persistence and admin tRPC `auctions.{list,get,create,update,publish,cancel}`,
with a thin admin panel that opens a draft by title and publishes from the
table. Listings optionally reference a campaign via `auctionId`. Today
statuses are only `draft | published | canceled`, and
`OPEN_AUCTION_STATES = ["draft", "published"]` gates attachment. The listing
editor never exposes that field. The admin repository/client only wire
`list` / `create` / `publish` — not `update` / `cancel` / `get`. Operator
chrome still says **Sales**, which collides with store checkout and with
inventory “sold” in [`add-grade10-inventory`](../add-grade10-inventory/proposal.md).

This change completes the operator surface, **renames operator language to
Campaign / Campaigns**, and **aligns campaign status with listing**
(`draft` → `created` → `published` | `canceled`). A campaign remains one
catalogue cover that **many listings** may belong to. Store checkout and
inventory “sold” stay unrelated.

Capability specs:
[`grade10-auction/admin-campaign`](specs/grade10-auction/admin-campaign/spec.md),
[`grade10-auction/admin-listing`](specs/grade10-auction/admin-listing/spec.md)
(delta).

## Goals / Non-Goals

**Goals:**

- Operator chrome and copy use **Campaign** / **Campaigns**, not Sale / Sales.
- Campaign editor (create / edit / publish / cancel) mirroring listing
  authoring.
- Listing editor campaign picker limited to **`draft` | `created`**.
- Introduce `created` on campaigns; tighten attach eligibility accordingly.

**Non-Goals:**

- Parallel campaign table; renaming `auctions` / `auctionId` / tRPC paths;
  store/inventory coupling; campaign-level clocks or money.

## Decisions

### 1. Product rename only — reuse the existing cover row

**Decision:** Operator language is **Campaign**; persistence and tRPC keep
`auctions` / `auctionId`. Admin domain may keep `saleId` as a wire alias of
that id until a later cleanup. One campaign holds many listings. No new
table.

**Rejected:** A new `campaigns` / `sale_events` table. That would fork
identity from live catalogue covers and every listing FK already in
production.

**Rejected:** Keeping the **Sales** admin label. It overlaps inventory sold
and store checkout; product name is Campaigns.

### 2. Campaign status machine matches listing: `draft → created → published | canceled`

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

### 3. Listing ↔ campaign selection rule (final)

A listing may attach a campaign **only when that campaign is `draft` or
`created`**. `published` and `canceled` are refused. Clearing the campaign is
always allowed while the listing is editable. Publishing a listing does
**not** require a campaign.

Wire paths: pass `auctionId` on draft save and create; for post-create edits
on `created`/`published` listings, call `listings.setAuction`. Picker options
come from `auctions.list` filtered to `draft` and `created`.
`OPEN_AUCTION_STATES` becomes `["draft", "created"]`.

**Rejected:** Keeping published campaigns attachable (prior shipping
behaviour). Product feedback: draft or created only.

Existing listings already under a published campaign keep their `auctionId`;
operators simply cannot attach **new** listings to that published campaign.

### 4. Admin UI mirrors listing authoring, not listing complexity

**Decision:** Campaigns tab keeps a table; “new” / row open swaps to a
full-page **CampaignEditorPage** beside `ListingEditorPage` patterns
(back control, `Card` form, `TextInput` for title/copy, primary actions:
create when draft, publish when created, cancel when authorized).
No media, prices, or schedule on the campaign editor. Rename the existing
Sales panel / routes / feature folder labels to Campaigns for operator-facing
surfaces; package path cleanup may trail the label change in the same PR.

**Rejected:** Growing the inline “New sale” title field into the only edit
surface.

### 5. Packages and ownership

**Decision:** All work under `@grade10/auction-*` and
`apps/admin/grade10` auction pages. Compose existing primitives (native
`<select>` for the campaign picker until a design-system Select exists).

### 6. Backend scope

**Decision:** Migration required: extend `ck_auctions_status` (and
`AUCTION_STATUSES`) with `created`; flip `OPEN_AUCTION_STATES` to
`draft` | `created`; publish path accepts only `created`; add/verify create
transition `draft → created`. Frontend and procedure-client wiring remain
bulk of the UX work. Wire identifiers stay `auctions` / `auctionId`.

**Rejected:** Expanding the campaign row with window or hero media in this
change.

## Risks / Trade-offs

| Risk | Mitigation |
| --- | --- |
| Existing flows publish draft → published | Spec + tasks: create then publish; migrate admin UI and tests |
| Published campaigns no longer accept new lots | Documented product rule; existing attachments unchanged |
| Parallel `add-grade10-inventory` naming | Campaigns chrome requirement; proposal non-goals; inventory sale = sold stock only |
| Code paths still say `sale` / `SalesPanel` | Tasks require operator-visible Campaigns labels; internal path rename optional in same change |

## Migration Plan

1. Rename the live admin Sales tab/page and operator copy to Campaigns
   (including listing Campaign field label) — no schema change.
2. Expand status check to include `created`.
3. Deploy worker with create transition and tightened `OPEN_AUCTION_STATES`.
4. Ship admin SPA: campaign editor create/publish actions and listing picker
   filter.
5. No row backfill required — existing `draft` / `published` / `canceled`
   rows stay valid; operators create drafts before publishing new covers.

## Open Questions

None blocking. Product confirmed: campaign = multi-listing catalogue cover;
operator language Campaigns; picker = `draft` | `created` only; statuses
align with listing; wire table stays `auctions`.
