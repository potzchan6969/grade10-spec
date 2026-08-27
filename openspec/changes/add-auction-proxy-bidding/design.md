# Design: automatic bidding

Requirements are in
[`specs/grade10-auction/proxy-bidding/spec.md`](specs/grade10-auction/proxy-bidding/spec.md).
Motivation is in [`proposal.md`](proposal.md).

## Context

`add-grade10-auction` delivered a serialized bid decision per listing: bids are
evaluated in one order, the current bid is `auction_listings.top_amount`, and
a card authorization is obtained per bidder per listing before a bid is
accepted. `bids.amount` is that accepted amount. There is no committed
maximum, and `placeBid` takes `amountMinor`.

Everything below fits inside the existing listing-row lock. Automatic bidding
does not add a second place where a bid is accepted.

## Decisions

The two-maximum price, that the hold covers the maximum, once-per-commitment
resolution, and raise-only are the spec. This file records how those land on
the existing rows.

### Persist the derived price on the listing

After each resolution, write the spec's current bid and leader onto
`top_amount` and `current_top_bid_id`. Reads do not re-derive.

*Rejected — leave `top_amount` as a cache anyone may recompute.* Two writers
can then disagree about which number is true. The listing row is already the
serializer.

### The hold amount is `bids.maximum`

Stripe's create-hold path passes `maximum` as `amountMinor`. `payment_holds`
gains no column; it already keys one intent per bid and seq.

*Rejected — authorize `amount` and re-authorize on each proxy row.* A proxy
row is written without the bidder present, so an issuer decline there would
drop them mid-auction. *Rejected — top up in bands.* Same failure mode at
every band boundary.

### A commitment is a new bid row

A collector commitment and a platform-placed bid are both inserts, not
updates of `maximum` in place. `source` distinguishes them (`manual` |
`proxy`). Accepted At is `created_at`. That keeps the operator history
append-only and matches how `bids` already works.

*Rejected — one row per bidder per listing, updated in place.* It loses prior
maxima and forces Accepted At to move. *Rejected — step intermediate
increments on a timer.* A schedule would fill the ledger and extend the close
on every step, even though the spec already forbids a ladder.

## Data model

Schema `auction`. Types follow the existing listing and bid columns: money is
`bigint` (integer minor units), timestamps are `timestamptz(3)`, identity is
`(storefront, user_id)`.

### `bids` — additive columns

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `maximum` | `bigint` | NOT NULL | none; backfill `amount` |
| `source` | `text` | NOT NULL | `'manual'` |

`amount` stays the standing amount of this row — what `top_amount` becomes
when this bid is the leader. After backfill, `maximum = amount`. They
diverge once a proxy resolution lands below the cap.

Checks:

- `ck_bids_source`: `source IN ('manual', 'proxy')`
- `ck_bids_maximum_covers_amount`: `maximum >= amount AND maximum > 0`

Index: `idx_bids_listing_id_maximum` on `(listing_id, maximum)` so the
two-maximum derivation does not sort the listing's whole ledger. Live
derivation still runs under the listing row lock.

### Contracts

**BREAKING.** `placeBid` input `amountMinor` becomes `maximumMinor`. Same
integer minor units, same currency check. `AMOUNT_TOO_LOW` still returns
`minimumNextAmount`.

Authenticated listing facts (not the public listing) gain:

| Field | Type | Null | Notes |
| --- | --- | --- | --- |
| `ownMaximumMinor` | `int` | yes | The viewer's latest accepted maximum; absent when they have none |
| `leading` | `boolean` | no | Whether that viewer currently leads |

`MyBidStanding` gains `maximumMinor: int` (required when the standing
exists). Public `bids[]` and `topAmount` do not gain a maximum.
`publicBidSchema` gains `source: 'manual' \| 'proxy'` so history can mark a
platform-placed bid without implying identity.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| Holding the maximum discourages high maximums | The bid surface states that the hold is the maximum. Named in `ui.md`. |
| A card issuer declines a large authorization | The raise is refused; the previous row stands. |
| Deriving the leader concurrently could produce two leaders | Derivation stays inside the existing listing-row lock. |

## Migration plan

1. Additive migration: add `maximum bigint`, backfill `maximum = amount`,
   then `SET NOT NULL`; add `source text NOT NULL DEFAULT 'manual'` and the
   two checks; add `idx_bids_listing_id_maximum`.
2. Existing open listings keep their leader and `top_amount`: a bidder who
   bid 30000 behaves as one who committed a maximum of 30000 and is at their
   limit. Existing holds already cover those amounts; do not re-authorize.
3. Deploy contracts, then the auction worker. The first raise after deploy
   follows the new rule.
4. Rollback keeps the columns. Do not drop `maximum`. Old code that writes
   `amount` without `maximum` cannot be redeployed after `maximum` is
   `NOT NULL`.

## Open questions

These can be answered after implementation begins without changing the specs,
the approach, or the task breakdown.

- Whether the admin bid history filters to show only bids a bidder placed
  themselves. An operator can already see both.
- Whether the bid surface offers preset maximum amounts alongside free entry.
  Presentation only; the committed value is unaffected.
