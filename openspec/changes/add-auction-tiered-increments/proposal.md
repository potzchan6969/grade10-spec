# Tiered bid increments

**Author:** @jeffffej0909 - 2026-09-02

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Reverses a prohibition shipped by
[`add-auction-auto-bidding`](../archive/2026-09-01-add-auction-auto-bidding/proposal.md).

## Why

A Grade10 listing steps by one flat number the operator types once, and that
number has to be right for every price the lot will ever reach. It cannot be.
A card opened at HKD 200 with a 25-dollar step is sensible at 200 and absurd
at 20,000 — it takes eight hundred bids to cross that range, and a bidding war
on a valuable card becomes a war of attrition in 25-dollar clicks. The
operator's only defence is to guess the closing price at creation and set a
large step, which then prices out the early bidding the lot needs to get
going.

Both failures are silent. Nobody files a complaint about an increment; they
stop bidding.

Grade10 rejected a banded schedule when auto-bidding was specified, on the
grounds that an operator can set the right increment per lot. That reasoning
holds only while a lot has one price. It does not survive a lot that opens at
200 and closes at 20,000, which is the lot the auction exists to sell.

**Metric:** bids per lot on lots that close at more than ten times their
starting price, and the share of those lots whose bidding stalls for more than
an hour below the eventual close. **Acceptance signal:** a lot opened at HKD
200 and closed at HKD 20,000 gets there in tens of bids, not hundreds.

## What Changes

- **A listing carries an increment table, not a single increment.** Each row
  is a price range and the increment that applies inside it.
- **BREAKING:** the listing field **Minimum increment** is replaced by that
  table. Every consumer reading a single increment must read the table.
- **The table is fully configurable per lot** — the ranges and the increment
  in each. An operator is not choosing from fixed bands.
- **A house default table is applied at creation**, so an operator configures
  nothing on an ordinary lot. It is itself operator-configurable, and a change
  to it applies only to listings created afterwards.
- **The minimum bid on an active listing** is the current bid plus the
  increment for the tier the **current bid** falls in.
- **The first bid is the starting price, unchanged.** With no bid there is
  nothing to step from, and the starting price is the number the lot
  advertises.
- **The bottom tier reaches zero**, so no listing can be un-biddable however
  low it opens.
- **Auto-bidding uses the table.** The `SHALL NOT use any price-banded
  increment schedule` shipped in `grade10-auction/auto-bidding` is removed.

## Non-Goals

- **Changing the starting price rule**, the extension rule, the extension cap,
  or anything about how a listing's window works.
- **Reserve prices.** Still removed.
- **A different table per currency on one listing.** A listing has one
  currency and one table.
- **Editing the table after publish.** It is a price rule and follows the
  existing rule that prices are writable only while `draft` or `created`.
- **Retro-fitting the new house default onto listings that already exist.**
- **Showing a collector the whole table.** What a bidder needs is the minimum
  next bid, which is one number.

## Capabilities

### New Capabilities

- `grade10-auction/bid-increments`: the increment table itself — its shape,
  what makes one valid, how a tier is looked up, the house default, and the
  minimum bid it produces on an active listing.

### Modified Capabilities

- `grade10-auction/auto-bidding`: the two-maximum rule sizes its step from the
  table instead of a single increment, and no longer forbids a banded
  schedule.
- `grade10-auction/admin-listing`: the **Minimum increment** field becomes the
  increment table, in the draft, create, and pre-publish write requirements.

## The house default table

Grade10's default, in HKD. Ranges are stated here in major units for reading;
the spec states them in integer minor units.

| Range | Increment |
| --- | --- |
| $0 – $49 | $2 |
| $50 – $99 | $5 |
| $100 – $199 | $10 |
| $200 – $499 | $25 |
| $500 – $999 | $50 |
| $1,000 – $2,499 | $100 |
| $2,500 – $4,999 | $250 |
| $5,000 – $9,999 | $500 |
| $10,000 – $19,999 | $1,000 |
| $20,000 – $29,999 | $2,000 |
| $30,000 – $49,999 | $3,000 |
| $50,000 – $99,999 | $5,000 |
| $100,000 – $199,999 | $10,000 |
| $200,000 – $299,999 | $20,000 |
| $300,000 – $599,999 | $25,000 |
| $600,000 – $999,999 | $50,000 |
| $1,000,000 – $1,499,999 | $50,000 |
| $1,500,000 and up | $100,000 |

The first row extends down to zero rather than starting at $10. The
$600,000–999,999 and $1,000,000–1,499,999 rows carry the same increment; that
is deliberate and preserved from the source table.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | Stores a table per listing, seeds it from the house default at create, validates it, and looks up a tier on every bid decision and every auto-bid resolution. |
| `@grade10/auction-contracts` | **BREAKING:** the listing's single increment is replaced by the table, and listing facts gain the minimum next bid. |
| `apps/admin/grade10` | The increment field becomes a table editor, and a house-default table editor is added. |
| `apps/frontend/grade10`, `apps/frontend/zzz` | Show the minimum next bid, which now moves as the price crosses a tier. |
| `@grade10/ui` `ListingBidPanel` | May need a slot for the minimum next bid; see `ui.md`. |
| `add-grade10-auction` (unarchived) | Its sentence *a valid bid SHALL meet or exceed the current bid plus the listing's configured increment* is superseded by this change's minimum-bid requirement. It must be reconciled at that change's archive; recorded in `design.md`. |

**Shipped scenarios whose numbers change.** `auto-bidding-SC-11`, `SC-14`, and
`SC-16` currently resolve to a current bid of 52500 minor units. Under the
default table they resolve to 55000, because the amount being stepped over is
50000, which sits in the HKD 500–999 tier with a 5000 increment. The two
worked-example tables in that requirement change with them. No other shipped
scenario changes value.
