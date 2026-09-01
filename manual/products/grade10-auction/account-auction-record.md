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
