## Context

The authenticated admin `listings.list` read already supplies the Listings
table. It reads a page of listings, while `readAdminListingStats` counts one
listing's watchers and bidders on demand. The shared watch record already
defines an explicit watch in `bidder_watches`; it is the authority for this
count.

See [proposal.md](./proposal.md) for why the table needs the column.

## Goals / Non-Goals

**Goals:**

- Add one page-load watcher-count snapshot to every admin list item
- Read explicit watches across both brands in one bounded query per page
- Keep the count typed from the contract through the admin table

**Non-Goals:**

- Store or cache another watcher count
- Add a watcher sort, filter, live refresh, identity, or bidder meaning
- Change the existing listing detail or on-demand statistics reads

## Decisions

The listing spec governs who sees the count, which states show it, its
cross-brand meaning, and its unsortable table position. Implementation choices:

| Topic | Choice | Rejected |
| --- | --- | --- |
| List contract | Add `watcherCount` as a non-negative integer to the additive `listings.list` item contract only | Adding it to detail or mutation shapes; a new endpoint or grant |
| Count read | After loading the current page, group explicit `bidder_watches` by its listing ids and merge missing groups as `0` | Calling the one-listing stats read for every row; correlated count queries; a stored counter |
| Watch definition | Count only rows whose explicit-watch timestamp is set, across storefronts | Counting implicit bid rows as watches |
| Admin table | Carry the list projection through the feature and fixture, then render a plain `Watchers` cell with no sort key | Treating the count as a detail default; a sortable heading |

The existing `auction:read` authorization on `listings.list` remains the
boundary. Its response is a snapshot when the list query and grouped count
complete; no transaction or refresh protocol is added.

## Service Interfaces

`listAdminListings` owns the enrichment after its existing listing-page read.
It passes the returned listing ids to a repository read with this shape:

| Input | Success output | Refusal / fault |
| --- | --- | --- |
| `{ listingIds: ListingId[] }` | `Map<ListingId, number>` of explicit cross-brand watch counts | Empty ids returns an empty map; database fault propagates through the list read |

The repository runs one `IN` / `GROUP BY listing_id` query against
`bidder_watches` and filters on the explicit-watch timestamp. The service
merges its rows into the page projection, defaulting an absent map entry to
`0`. It does not write or lock data.

Example: listing ids `[a, b]` with three qualifying rows for `a` and none for
`b` returns `{ a: 3 }`; the list response carries `a.watcherCount = 3` and
`b.watcherCount = 0`.

## API Contracts

`listings.list` gains `items[*].watcherCount: integer >= 0` for an operator
already authorized to read listings. Inputs and every other endpoint remain
unchanged.

## Risks / Trade-offs

- **[Risk]** A page read can fan out by row → **Mitigation:** one grouped
  aggregate limited to that page's ids
- **[Risk]** Implicit bid rows can overstate interest → **Mitigation:** filter
  on the explicit-watch stamp
- **[Risk]** Contract, fixture, and table drift → **Mitigation:** decode at
  the shared contract boundary and cover both the list mapping and table cell

## Migration Plan

Deploy the additive list contract, enrichment, and table together. No data or
schema migration is needed. Rollback removes the response field and column;
the existing watch rows remain unchanged.
