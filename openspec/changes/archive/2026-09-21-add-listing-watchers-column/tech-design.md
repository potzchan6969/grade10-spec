## Context

The authenticated admin `listings.stats` read already returns one listing's
watcher and bidder counts on demand. The Listings Stats dialog opens from the
table and renders both. A later list-row enrichment added `watcherCount` to
`listings.list` and a Watchers column, duplicating the same figure.

The shared watch record already defines an explicit watch in `bidder_watches`;
it is the authority for this count.

See [proposal.md](./proposal.md) for why Stats owns the count.

## Goals / Non-Goals

**Goals:**

- Keep the watch count on the existing on-demand Stats read and dialog
- Remove the list-row watcher count and the Listings-table Watchers column
- Keep the count typed from the Stats contract through the dialog

**Non-Goals:**

- Store or cache another watcher count
- Add a watcher sort, filter, live refresh, identity, or bidder meaning
- Change when a row offers Stats, or the bidder-count / bidder-summary reads
- Add watcher count to listing detail or mutation shapes

## Decisions

The listing spec governs who sees the count, which listings offer Stats, its
cross-brand meaning, and that the table does not show it. Implementation
choices:

| Topic | Choice | Rejected |
| --- | --- | --- |
| Surface | Stats dialog via existing `listings.stats` | A Watchers column fed by `listings.list` |
| List contract | Drop `watcherCount` from the list-item shape; stop the batched list enrichment | Keeping both surfaces in sync |
| Watch definition | Count only rows whose explicit-watch timestamp is set, across storefronts (unchanged in `readAdminListingStats`) | Counting implicit bid rows as watches |
| Admin table | No Watchers heading or cell | An unsortable column beside Stats |

The existing `auction:read` authorization on `listings.stats` remains the
boundary. The response is a snapshot when that read completes; no transaction
or refresh protocol is added for the watcher line.

## Service Interfaces

`readAdminListingStats` remains the sole admin watch-count read for this
surface. It already:

| Input | Success output | Refusal / fault |
| --- | --- | --- |
| `{ listingId }` for an existing listing | `{ listingId, watcherCount, bidderCount }` with explicit cross-brand watches | Missing listing refuses; database fault propagates |

`listAdminListings` no longer calls a page-scoped watch aggregate or merges
`watcherCount` into each row.

## API Contracts

`listings.stats` keeps `watcherCount: integer >= 0` for an operator already
authorized to read listings. `listings.list` items lose `watcherCount`. Inputs
and every other endpoint remain unchanged.

## Risks / Trade-offs

- **[Risk]** Operators lose at-a-glance comparison across the whole page →
  **Mitigation:** accepted; Stats is opened per listing when interest is judged,
  beside the bidder count
- **[Risk]** Implicit bid rows can overstate interest → **Mitigation:** filter
  on the explicit-watch stamp (unchanged)
- **[Risk]** Contract, fixture, and dialog drift → **Mitigation:** decode at
  the shared Stats contract boundary; cover the dialog watcher line, not a
  table cell

## Migration Plan

Deploy the list-contract removal, drop the list enrichment, and remove the
Watchers column together. No data or schema migration is needed. Rollback
restores the list field and column; watch rows and `listings.stats` remain
unchanged.
