---
title: My Auctions
spec: grade10-site/auction/account-record
order: 10
---

My Auctions is the account's own record of every lot the collector bookmarks —
by watching or by bidding — on one table. The page title carries a count of
those rows. The record is resolved from the session and nothing else — no
input selects another collector's. An empty table offers the catalogue.

## Bookmarking

A watch is made and removed wherever a lot is shown (including the lot
details page), is private to its owner, and outlives the close while the
listing stays published. A bid bookmarks the lot with no separate Watch. A
maximum number of watches keeps the list a considered one; past it, a further
watch is refused and says so. Unpublishing or removing a listing (including
an unsold lot taken down) takes it off My Auctions.

## The table

Each row carries the lot's key image, title, close, current bid, **Your
Standing**, Email alerts, and Unwatch when the collector has not bid.
Bidding rows carry Email alerts without Unwatch. Watch-only standing is
`--`. Bid standing while open: Leading, Outbid, Bid submitted, or Bid not
accepted. After close: Won or Didn't win, with the same payment, shipment,
and hold projections as before. Bid rows sort before watch-only; soonest
close within each band. Account → Notifications holds the global **Auction
email alerts** master; when it is off, per-lot toggles on this page show
off or disabled.

Detailed [Bidding History](/p/grade10-site/auction/bidding-history) stays its
own surface for the one-per-listing index, filters, and private chronology.

A winner follows their own lot to the door through [Winner Order](/p/grade10-site/auction/winner-order): Pending Payment, Expired, Processing, Shipped, Delivered, Cancelled, or Refunded. A won lot whose invoice has expired reads Expired and says how to reach Grade10.

The record shows the derived auction status and opens the invoice for payment; address, payment, fulfilment, and delivery facts stay on the order.

A losing bidder is told what happened to their card authorization — being
released, or released — because a pending hold on a bank statement reads as a
charge for a lot they did not win. A hold is never called released while its
release is still in flight.

## Honest reads

An empty page offers the catalogue rather than posing as a failure, a read
that failed says so and can be retried rather than posing as an empty record,
and a value that follows the clock — a close, a current bid — that could not
be refreshed is shown as not current rather than presented as current.

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
| One table, not two sections | Decided | My Auctions is one bookmark table. Bid lots sort first; Your Standing separates commitment from watch-only (`--`). Replaces the earlier two-section / two-page decision. | Product and design |
| A listing that is both watched and bid on | Decided | Appears once. A bid bookmarks the lot; Unwatch is offered only when there is no bid. | Product |
| Closed standing, not Bidding groups | Decided | Won and Didn't win live in Your Standing. Won uses the auction order-status vocabulary (Pending Payment through Refunded). My Auctions does not show Active / Won / Didn't win section groups; Bidding History keeps its own index groups. | Product |

| Derived auction status | Decided | The collector sees the auction order's derived status, while the order route owns payment, address confirmation, receipt, and delivery records. The store order-status capability remains separate. | Product and engineering |
| Order owns post-sale writes | Decided | My Auctions opens the order for the winner's allowed actions; operator-only settlement, fulfilment, cancellation, and reinstatement stay in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale). | Product and operations |
| Card holds are stated plainly | Decided | The release of a losing bidder's authorization is asynchronous, so the record names the in-between state rather than implying the money is already back. Silence here is the likeliest source of "you charged me" contacts. | Product and finance |
| Ending soon threshold | Decided | 60 minutes or less to close, matching the operator queue, so the two surfaces cannot disagree about which listings are urgent. | Product |
| Bids are binding | Decided | Nothing on this page retracts a bid. A collector who believes a bid was a mistake contacts Grade10. | Product |
| Ordering | Decided | Soonest close first on both pages, with closed listings after open ones. | Product and design |
| Watch limit | ❓ Open | A limit exists, so a watch list stays a considered list and the read stays bounded. The designer sets the value and owns what the collector sees on reaching it; revisit against Watch depth after the first release. | Design |
:::
