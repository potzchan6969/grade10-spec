# Design: watching a lot

Requirements are in
[`specs/grade10-auction/watchlist/spec.md`](specs/grade10-auction/watchlist/spec.md).
Motivation is in [`proposal.md`](proposal.md).

## Context

Auction listings are shared between the Grade10 and ZZZ brands. Identity is
not: bidder identity in auction is already `(storefront, user_id)`.

`watches` already exists in schema `auction`. `ListingBidPanel` already ships
`watchAction` and `watching`. `watchListing` / `unwatchListing` /
`listMyWatches` already hang off those rows. `placeBid` currently inserts a
watch in the same transaction as the bid, so "watched it or bid on it" is one
predicate for ending-soon mail.

This change fills the collector surface and stops that auto-insert, which
couples watching to bidding.

## Decisions

What a watch is, that it is private, that it confers no standing, that it
survives close, and what the list shows are the spec.

### Reuse `watches`, keyed like `bidders`

The key stays `(storefront, user_id, listing_id)`. Watched At is
`created_at`. Same user id on two brands is two collectors.

*Alternative rejected — key only by `(user_id, listing_id)`.* User ids are
per-brand; colliding strings would merge two people. *Alternative rejected —
store watches per brand, beside the collector.* Listings are shared and
collectors are not, so an operator count would have to be assembled across
two systems.

### Repeat watch is `ON CONFLICT DO NOTHING`; unwatch is a delete

A second insert does not change `created_at`. There is no `source` column.

*Alternative rejected — refresh `created_at` on a repeat watch.* It would
reorder the list for an action the collector did not perceive as an action.

### `placeBid` stops writing `watches`

Bid-activity mail stays on `bids`. Watcher mail stays on `watches`. That is
what makes unwatch end watcher enrolment without ending bidder enrolment.

*Alternative rejected — keep auto-watch on bid and add a `source` column.* A
second kind of watch is a second product. Existing rows written by a bid
remain; new bids do not create one.

### The catalogue control stays application-owned

The lot page fills `ListingBidPanel`'s existing slot. The catalogue tile's
control is built in each application.

*Alternative rejected — add a watch control to the shared auction tile now.*
A second consumer is what justifies promoting it.

## Data model

Schema `auction`. Table `watches` already exists. No new columns. No new
table.

Existing key and Watched At:

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `storefront` | `text` | NOT NULL | — |
| `user_id` | `text` | NOT NULL | — |
| `listing_id` | `text` | NOT NULL | — (FK `auction_listings.id`) |
| `created_at` | `timestamptz(3)` | NOT NULL | `now()` |

Primary key `(storefront, user_id, listing_id)`. FK to `bidders
(storefront, user_id)`. Notify-ladder columns on this row stay; they belong
to `add-auction-notifications`.

### Additive index

`listMyWatches` is newest-first by `created_at` with a listing-id tiebreak.
The primary key leads `(storefront, user_id)` but cannot start that ordered
scan.

| Index | On | Partial |
| --- | --- | --- |
| `idx_watches_storefront_user_id_created_at_listing_id` | `(storefront, user_id, created_at DESC, listing_id DESC)` | no |

Current bid, close, and sale state are read from `auction_listings` at list
time (`top_amount`, `ends_at`, `status`). They are not copied onto the watch.

### Contracts

Watch write/read already exist (`watchListing`, `unwatchListing`,
`readWatch`, `listMyWatches`). Public listing facts stay watch-free.

`MyWatch` is missing the current bid the spec requires on each entry.
Additive:

| Field | Type | Null |
| --- | --- | --- |
| `topAmountMinor` | `int` | no |

Same integer minor units as `publicListingSummary.topAmount`. Operator watch
count is `count(*)` grouped by `listing_id` across both storefronts; it is
an admin read, not a public field.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| The control repeats the removed wishlist's mistake — a heart that saves nothing | Persistence, the list, and the control land in this one change. |
| Stopping auto-watch on bid drops bidders from ending-soon mail | Watcher mail is `watches`; bidder mail is `bids` (`add-auction-notifications`). |
| An unbounded watched list grows slow to read | The new index; the list is already keyset-paged. |

## Migration plan

1. Additive migration: create
   `idx_watches_storefront_user_id_created_at_listing_id`. No backfill.
2. Deploy the worker that stops `placeBid` from inserting a watch, together
   with the `MyWatch.topAmountMinor` contract.
3. Existing watches, including those written by an earlier bid, stay.
4. Rollback keeps the index. Restoring auto-watch on bid would re-couple
   enrolment; do not do that from a rollback.

## Open questions

Answerable later without changing the specs, the approach, or the tasks.

- Whether the watched list is reachable from the header or only from the
  account area. Placement, not behaviour.
- How many entries a page of the watched list holds. Bounds already live on
  `AUCTION_PAGE_LIMIT_*`.
- Whether an operator's watch count appears on the listings table or only on a
  listing's own admin page.
