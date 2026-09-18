## Context

The account-record read already returns separate watched and bid-backed pages,
while the site composes both into the shared `AuctionRecord` table. The
capability contract is the source for row meaning and ordering:
[account record](../redesign-my-auctions-table/specs/grade10-site/auction/account-record/spec.md)
and [auction-record blocks](../redesign-my-auctions-table/specs/shared/ui/auction-record/spec.md).
The implementation therefore needs a composition boundary, not a second
account-history model.

The shared `@grade10/ui` row already accepts application-owned standing,
alerts, image, and watch props. The site owns whether those props are present
for a row. The current account read also has the listing media needed by both
sources, so a bid-only row can use the same card identity as a watched row.

## Goals / Non-Goals

**Goals:**

- Resolve one row per listing at the site boundary, with bid-backed rows first
  and watch-only rows second.
- Carry the existing account-record standing, close, current-bid, media,
  winner-order, and alert projections into the shared row.
- Keep Unwatch an explicit watch-only capability and preserve the existing
  alert and unwatch mutations.

**Non-Goals:**

- Add a second bidding-history or watch persistence model.
- Change bid, watch, email-alert, hold, or winner-order mutation semantics.
- Add database columns or migrations for the table presentation.

## Decisions

The spec governs the visible row states, ordering, removal, and shared export
contract. The implementation choices below keep those rules in the existing
service and page seams.

- **Merge at the page adapter** — build a listing-id set from active, won, and
  losing bid items; enrich the bid row with watched alert state when the same
  listing is watched; filter that listing from the watch-only rows. This keeps
  pagination and authoritative standing in the account read and avoids a new
  repository query or duplicate row state.
- **Reuse the account-record read model** — add or carry shared listing media
  identity on the existing account-record contract and project it for watched
  and bid-backed rows. Media remains derived from listing media at read time;
  no duplicate image column is stored on a watch or bid.
- **Keep copy and writes consumer-owned** — the site maps localized copy and
  callbacks into `AuctionRecord` and `AuctionRecordRow`. The shared UI only
  renders supplied values and reports supplied callbacks.
- **Mark bid rows at the composition boundary** — every row produced from a
  bid page sets `bidPlaced: true` and never receives `watchCopy` or
  `onWatchToggle`, even if the read also contains a watch entry. The shared row
  keeps its defensive bid guard, but the adapter must not expose the action in
  its props. Passing the watch callback to a bid row was considered and
  rejected because it makes a bid row depend on an action the product forbids.
- **Keep watch-only controls local to watch-only mapping** —
  `toWatchingRow` supplies Unwatch, alert controls, close detail, and the
  no-standing placeholder. `toBiddingRow` supplies standing and alert
  controls only; winner rows keep their existing order link.

## API Contracts

- The authenticated account-record payload continues to use the existing
  `watching`, `active`, `won`, and `didntWin` pages. Shared listing identity
  carries `imageCardPath` and `imageAlt`; bid-backed items carry their existing
  alert preference so the page can render a bid-only row without a watch.
- No endpoint is added or renamed. The RPC continues to return a distinct
  successful record or read refusal, and the page preserves the existing retry
  path for a failed read.

## Risks / Trade-offs

- **A listing appears in both read pages** → merge by listing id before giving
  rows to `AuctionRecord` and test the overlap as a single row.
- **A bid row accidentally receives watch props** → set `bidPlaced: true` in
  the bid mapper and omit the watch callback and copy there; cover the overlap
  case in the page test.
- **The row count diverges from the table** → pass the deduplicated arrays to
  the shared `AuctionRecord`, which derives the badge from rendered rows.
- **Clock values look current after a failed refresh** → preserve the read
  model's `refreshStatus` and render its not-current detail instead of
  synthesizing a fresh value in the page.

## Migration Plan

No database migration is required. Deploy the contract and service projection
with the site composition, then validate the focused account-record tests and
the application's normal typecheck, lint, and test lanes. Rollback is the
application revision rollback; the read model remains backward-compatible with
the existing account-record persistence.

## Open Questions

None.
