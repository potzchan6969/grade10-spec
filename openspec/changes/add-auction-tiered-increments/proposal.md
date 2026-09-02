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
- **BREAKING for bidders: the first bid must clear the starting price by one
  increment.** Today a lot opening at 20000 accepts a first bid of 20000. It
  will require 22500. The amount stepped from is the amount a bidder must
  beat, and before anyone has bid that is the starting price. This raises the
  entry bar on every lot by one increment.
- **The bottom tier reaches zero**, so no listing can be un-biddable however
  low it opens.
- **Auto-bidding uses the table.** The `SHALL NOT use any price-banded
  increment schedule` shipped in `grade10-site/auction/auto-bidding` is removed.

## Non-Goals

- **Changing what a listing's starting price means**, the extension rule, the
  extension cap, or anything about how a listing's window works. The starting
  price is still the figure an operator sets and the figure a lot advertises;
  only the first bid that clears it changes.
- **Changing the price shown before anyone has bid.** With a single committed
  maximum the current bid remains the starting price, as
  `grade10-site/auction/auto-bidding` already specifies. Only the minimum bid
  moves.
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

- `grade10-site/auction/bid-increments`: the increment table itself — its
  shape, what makes one valid, how a tier is looked up, the house default, and
  the minimum bid it produces on an active listing.

### Modified Capabilities

- `grade10-site/auction/auto-bidding`: the two-maximum rule sizes its step
  from the table instead of a single increment, and no longer forbids a banded
  schedule.
- `grade10-admin/auction/listing`: the **Minimum increment** field becomes the
  increment table, in the draft, create, and pre-publish write requirements.

## The house default table

Grade10's default is stated once, in integer minor units, in the requirement
*A listing's table is seeded from the house default*. It is not restated here:
the spec is the source of truth for those numbers.

It is the table from the source document with two changes. The first row
extends down to zero rather than starting at $10, so a lot opened at any price
has a step. The $600,000–999,999 and $1,000,000–1,499,999 rows carry the same
increment; that is deliberate and preserved from the source.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | Stores a table per listing, seeds it from the house default at create, validates it, and looks up a tier on every bid decision and every auto-bid resolution. |
| `@grade10/auction-contracts` | **BREAKING:** the listing's single increment is replaced by the table, and listing facts gain the minimum next bid. |
| `apps/admin/grade10` | The increment field becomes a table editor, and a house-default table editor is added. |
| `apps/frontend/grade10`, `apps/frontend/zzz` | Show the minimum next bid, which now moves as the price crosses a tier. |
| `@grade10/ui` `ListingBidPanel` | May need a slot for the minimum next bid, if the existing price-hint slot is not the right home for it. That is a delivery decision at promotion. |
| `add-grade10-auction` (unarchived) | Its sentence *a valid bid SHALL meet or exceed the current bid plus the listing's configured increment* is superseded by this change's minimum-bid requirement. It must be reconciled at that change's archive. |

**Shipped scenarios whose numbers change.** `auto-bidding-SC-11`, `SC-14`, and
`SC-16` currently resolve to a current bid of 52500 minor units. Under the
default table they resolve to 55000, because the amount being stepped over is
50000, which sits in the HKD 500–999 tier with a 5000 increment. The two
worked-example tables in that requirement change with them. No other shipped
scenario changes value.

## Constraints on delivery

These bound the delivery plan an engineer writes at promotion; the mechanism is
theirs.

- **Listings that already exist must not change behaviour.** A listing holding
  a single increment must go on stepping by exactly that amount. One tier
  starting at zero reproduces a flat increment exactly, so this costs nothing.
- **The house default must not be retro-fitted onto any listing that already
  exists**, including drafts. Those lots have been priced by an operator, and
  some are live with bids against them.
- **The three scenarios named above must be updated, not worked around.** They
  are shipped results changing on purpose.

## A consequence worth reviewing

A lot advertising a starting price of 20000 will not accept a bid of 20000;
the first bidder must offer 22500. The starting price becomes the figure
bidding starts *above* rather than *at*.

That is the intended change, and it matches how a live auction room opens a
lot. It is recorded here because it is the kind of thing a collector notices,
and because it makes the advertised number and the bid-able number differ. If
operators would rather the advertised figure stay bid-able, the fix is to set
the starting price one increment lower, not to change this rule.

Note also that a listing's starting price is already required to be greater
than zero by `grade10-admin/auction/listing`, so a lot cannot open at zero and
a zero bid was never reachable under either rule.
