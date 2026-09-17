---
title: My Auctions
spec: grade10-site/auction/account-record
order: 27
---

My Auctions is the account's own record of every lot the collector bookmarks,
by watching or by bidding. The record is resolved from the session and nothing
else, and it never records payment, uploads proof, changes an address or
records shipment: the order does.

## Values

| Rule | Value |
| --- | --- |
| Watch limit | ❓ A maximum number of watches per collector; Design sets the value |
| Row count | The page title carries the number of rows |

## Bookmarking

- **A watch** — made and removed wherever a lot is shown while it is open,
  private to its owner, and outliving the close while the listing stays
  published; unwatching can be undone at once —
  [Watchlist](/p/grade10-site/auction/watchlist)
- 🚧 **A bid bookmarks the lot** — with no separate Watch, and announces once
  per lot that email alerts are on
- **At the limit** — a further watch is refused, records nothing, and says
  the limit is reached
- 🚧 **Bids count** — a bid that enrolls the list counts toward the watch
  limit
- **Removed with the listing** — unpublishing or removing a listing, an
  unsold lot taken down included, takes it off My Auctions

## The Table

🚧 One table holds every bookmarked lot, each once: bid rows before
watch-only, soonest close first in each band, closed lots after open ones.

| Column | What it shows |
| --- | --- |
| Lot | The key image, the title and the close |
| Current bid | The lot's current bid |
| Your Standing | The collector's standing, or `--` for a watch-only lot |
| Email alerts | The per-lot alerts control; off or disabled when the account-wide **Auction email alerts** master is off |
| Unwatch | Only when the collector has not bid |

- 🚧 **Three tabs** — **Active** (bidding open, opened first), **Upcoming**
  (bidding not yet open) and **Ended** (closed); a tab with no lots says so,
  and the title count stays the total across all three
- 🚧 **Ended rows** — Email alerts show disabled and cannot be changed

| Standing | Meaning |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher bid stands; the row carries the next valid bid |
| Bid submitted | A bid Grade10 has not yet accepted |
| Bid not accepted | The last bid was refused, and the row says which: below the minimum, the window had closed, or the card authorization failed |
| Won | The lot closed with the collector leading; the row reads the order's status — [Auction Order Status](/p/grade10-site/auction/order-status) |
| Didn't win | The lot closed with someone else leading |

- **Won** — every Won row offers View order, Cancelled and Refunded included,
  which opens that lot's [Winner Order](/p/grade10-site/auction/winner-order);
  the row carries the status badge and nothing else, so how to reach Grade10
  about an expired invoice lives on the order
- 🚧 **Payment Verifying** — a won lot whose payment proof is waiting for an
  operator reads Payment Verifying on its row
- **Didn't win** — the row says what happened to the card authorization,
  being released or released, because a pending hold on a bank statement
  reads as a charge; a hold is never called released while its release is
  still in flight
- **Bidding History** — the one-per-listing index, its filters and the
  private chronology stay their own surface — [Bidding
  History](/p/grade10-site/auction/bidding-history)

## Honest Reads

- **Empty** — offers the catalogue rather than posing as a failure
- **Failed** — a read that failed says so and can be retried rather than
  posing as an empty record
- **Stale** — a value that follows the clock, a close or a current bid, that
  could not be refreshed is shown as not current

::cases{id="grade10-site/auction/account-record"}

:::detail{title="Product decisions" for="pm"}
Bidding is per-listing and pull-only, so without this record a collector
holds their own auction activity in browser tabs and memory: no single answer
to "am I still leading?", "what closes next?", or "which of these do I owe
money on?". Every post-sale fact the record shows already exists as an
operator-side record — outcome, payment state, shipment state — so the winner
view is a second audience for facts Grade10 already keeps, not new
bookkeeping.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Interested collector | Browsing a sale days before it opens; several listings look worth following | Mark them without commitment, and find them again when bidding opens without re-searching the catalogue. |
| Active bidder | Bidding across several listings that close the same evening | See at a glance which ones they still lead, which they have lost, and which close next — and reach the listing that needs a bid in one step. |
| Outbid collector | Returned to the site mid-window after being outbid | Learn they lost the lead, see what the next valid bid must clear, and decide whether to re-bid before the close. |
| Winner | Won a listing and wants to know what happens next | See that they won, what state their payment is in, and whether the card has shipped, without contacting Grade10. |
| Losing bidder | Bid and did not win | Confirm the outcome and that their card hold is released, so a pending authorization is not read as a charge. |

**Not in scope.** Retracting or editing a bid — a placed bid is binding.
Paying, requesting a wire, or arranging delivery from this page; detailed
invoice, receipt, address, refund, and dispute flows belong to [Winner Order](/p/grade10-site/auction/winner-order). A public watch list or collector profile — the record is
owner-only, and no listing shows a watch count. Search, saved searches, and
recommendations. Seller-side records; Grade10 is the seller. ZZZ gains no
account auction surface. History export, and any record beyond the
collector's own account.

**Measurement.** Every signal starts from no baseline; the first release
establishes it.

| Signal | Definition | Owner |
| --- | --- | --- |
| Watch-to-bid conversion | Watched listings on which the watching collector later placed at least one bid, divided by watched listings whose bidding window opened. | Product |
| Outbid recovery rate | Listings where a collector was outbid while the window was open and placed a further bid within it, divided by such outbid events. Segmented by whether the record page was opened in between. | Product |
| Record-page reach | Signed-in collectors with any auction activity who opened the record at least once in a 30-day window, divided by all such collectors. | Product |
| Winner self-service | Won listings that reached paid with no inbound contact from the winner, divided by won listings. | Product and operations |
| Hold-related contacts | Inbound contacts about a pending or unreleased card authorization, per 100 losing bids. | Operations |
| Watch depth | Distribution of watches per collector, and the share hitting the watch limit. Sets the limit's value after the first release. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The term "favourites" is retired | Decided | The feature is **watching**, the action is **watch** and **unwatch**, and the list is the Watching page. "Favourites", "saved", and "starred" are not used in product copy, specs, message catalogs, or analytics event names. | Product |
| One table, not two sections | 🚧 In flight | My Auctions is one bookmark table. Bid lots sort first; Your Standing separates commitment from watch-only (`--`). Replaces the earlier two-section / two-page decision. | Product and design |
| A listing that is both watched and bid on | 🚧 In flight | Appears once. A bid bookmarks the lot; Unwatch is offered only when there is no bid. | Product |
| Closed standing, not Bidding groups | Decided | Won and Didn't win live in Your Standing. Won uses the auction order-status vocabulary (Pending Payment through Refunded). My Auctions does not show Active / Won / Didn't win section groups; Bidding History keeps its own index groups. | Product |
| Derived auction status | Decided | The collector sees the auction order's derived status, while the order route owns payment, address confirmation, receipt, and delivery records. The store order-status capability remains separate. | Product and engineering |
| Order owns post-sale writes | Decided | My Auctions opens the order for the winner's allowed actions; operator-only settlement, fulfilment, cancellation, and reinstatement stay in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale). | Product and operations |
| View order on Won | Decided | Every Won row offers View order / open order into Winner Order; non-won rows do not. | Product (@tangconst) |
| Calm Won detail | Decided | No secondary helper lines under Won standing; contact for expired payment is on Winner Order only. | Product (@tangconst) |
| Card holds are stated plainly | Decided | The release of a losing bidder's authorization is asynchronous, so the record names the in-between state rather than implying the money is already back. Silence here is the likeliest source of "you charged me" contacts. Hold being-released / released copy stays for Didn’t win. | Product and finance |
| Ending soon threshold | Decided | 60 minutes or less to close, matching the operator queue, so the two surfaces cannot disagree about which listings are urgent; the redesigned table shows close urgency with the lot, not as a standing. | Product |
| Bids are binding | Decided | Nothing on this page retracts a bid. A collector who believes a bid was a mistake contacts Grade10. | Product |
| Ordering | Decided | Soonest close first, with closed listings after open ones. | Product and design |
| Tabs by bidding window | 🚧 In flight | Active, Upcoming and Ended tabs group the one table by bidding window, not by outcome. Replaces "one table, no groups" for presentation; the row rules stay. | Product |
| Won hands off to orders | Decided | A won lot reads Won and links to its order, with the order status read on [My Auction Orders](/p/grade10-site/auction/auction-orders). | Product |
| Watch limit | ❓ Open | A limit exists, so a watch list stays a considered list and the read stays bounded. The designer sets the value and owns what the collector sees on reaching it; revisit against Watch depth after the first release. | Design |
:::
