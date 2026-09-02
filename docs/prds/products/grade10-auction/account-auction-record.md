---
title: My Auctions
spec: grade10-auction/account-auction-record
order: 10
---

My Auctions is the account's own record of every lot the collector watches or
has bid on, split into two pages: **Watching** for interest, **Bidding** for
money. The record is resolved from the session and nothing else — no input
selects another collector's — and it opens on Bidding once the collector has
ever bid, on Watching before that.

## Watching

A watch is made and removed wherever a lot is shown, is private to its owner,
and outlives the lot — an ended listing stays on the page as Ended rather
than vanishing. A maximum number of watches keeps the list a considered one;
past it, a further watch is refused and says so. Each row carries exactly one
state — Scheduled with when it opens, Live, Ending soon inside the last hour,
or Ended however it ended — ordered soonest close first, finished lots after.
A watched lot the collector also bid on is marked, and opens its row on
Bidding in one step; the page never reports bidder standing itself.

## Bidding

While a lot is open, the row answers where the collector stands: Leading,
Outbid with the minimum next valid bid, Bid submitted, or Bid not accepted —
naming whether the bid was below the minimum, the window had closed, or the
card authorization failed. Closed lots split into Won and Didn't win.

A winner follows their own lot to the door without contacting Grade10:
Awaiting payment, Payment problem with how to reach Grade10, one single Paid
whether the money came by card capture or an operator's manual record, then
Shipped and Delivered. The surface is read-only — recording payment and
shipment belongs to the operator's [post-sale queue](/p/grade10-auction/post-sale).

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
Paying, requesting a wire, or arranging delivery from this page; recording
payment and shipment stays the operator's. Invoices, receipts, refunds, or
dispute flows. A public watch list or collector profile — the record is
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
| Two pages, not one | Decided | Watching and Bidding are different jobs — interest versus commitment — with different states, different urgency, and different empty states. One merged list would bury a won listing among idle watches, or force a filter to be usable. | Product and design |
| A listing that is both watched and bid on | Decided | Appears on both pages, marked on Watching as one they bid on. Removing it from Watching does not touch their bids. | Product |
| Bidding groups | Decided | Active, Won, Didn't win. Won is separated from all other closed listings because it is the only group that carries an obligation. | Product |
| One "Paid" for the collector | Decided | The collector sees **Paid**, whether collection was card capture or manual. The operator queue's Paid via Stripe / Paid via Manual split is a finance-reconciliation need, and noise to the person who paid. | Product and finance |
| Post-sale is read-only here | Decided | The winner reads payment and shipment state; every write stays the operator's. A winner-initiated action — paying again, requesting a wire — is follow-on and is never smuggled in as a button. | Product and operations |
| Card holds are stated plainly | Decided | The release of a losing bidder's authorization is asynchronous, so the record names the in-between state rather than implying the money is already back. Silence here is the likeliest source of "you charged me" contacts. | Product and finance |
| Ending soon threshold | Decided | 60 minutes or less to close, matching the operator queue, so the two surfaces cannot disagree about which listings are urgent. | Product |
| Bids are binding | Decided | Nothing on this page retracts a bid. A collector who believes a bid was a mistake contacts Grade10. | Product |
| Ordering | Decided | Soonest close first on both pages, with closed listings after open ones. | Product and design |
| Watch limit | ❓ Open | A limit exists, so a watch list stays a considered list and the read stays bounded. The designer sets the value and owns what the collector sees on reaching it; revisit against Watch depth after the first release. | Design |
:::
