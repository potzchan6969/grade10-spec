# Grade10 Auction notifications

## Summary

A collector who watched or bid on a listing needs to hear the moments that
change what they should do next — bidding is about to open, it has opened, it
is a day from closing, it has gone into extended bidding, someone else bid,
they were overtaken — without a different letter for every event, and without
a snipe war filling their inbox.

## Context

- Problem: the auction MVP deferred notifications. Bid-state receipts already
  go out. The listing-lifecycle and "someone else bid" mails in the product
  event table do not, so a watcher learns nothing until an hour before close,
  and a bidder who is not the previous leader never hears that the lot moved.
- Evidence: product event table §§9.1–9.3 (watch- and bid-triggered mails);
  `add-grade10-auction` listed listing notifications, outbid notifications,
  and extended-bidding emails as follow-on; the original auction PRD named
  notifications a non-goal of that MVP.
- Related: [Grade10 Auction](./auction.md), [Watching a lot](./watchlist.md),
  OpenSpec change `add-auction-notifications`.

## Goals

- Tell a watcher in time to come back when a lot is about to open, has
  opened, is a day from closing, or has gone into extended bidding.
- Tell a bidder when they lost the lead, and when the lot they bid on moved,
  without mailing every increment of a snipe war.
- One letter shape for every auction email, so a new event is copy and an
  audience, not a new layout.
- Give operators a way to answer a collector who says they were never told.

## Non-goals

- Push, SMS, in-app toasts, or a notification-preferences centre.
- Replacing the existing bid-state receipts or the one-hour closing-soon
  reminder already sent to watchers.
- Auto-bidding, digest/rollup across listings, or a bidder's language.
- One-click unsubscribe (the destination is a signed-in page).
- Mail about winning, paying, invoicing, or shipping.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector watching a listing | Sale has not opened, or is about to close / extend | Hear in time to come back and bid. |
| Collector who has bid | Someone else bid, or they lost the lead | Hear what changed on that lot, once, not once per snipe. |
| Auction operator | A collector says they were never told | See which messages went to that address, without reading bodies. |

## Experience

### Primary flow

1. A collector watches a listing, or places a bid.
2. When a listed event becomes true for that person, Grade10 emails them one
   letter about that listing.
3. Watch-driven letters offer a signed-in way to stop further letters about
   that listing. Bid-activity letters do not: they answer the collector's own
   bid.

## Requirements

Checkable requirements: `openspec/specs/grade10-auction/notifications/spec.md`
(in flight as the `add-auction-notifications` delta until archived).

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| Grade10 auction service | Owns who is owed mail and the send log. | A send that did not happen must not be remembered as sent. |
| Shared email package | Provider send, shared letter chrome, temporary vs permanent failure. | Unconfigured local/dev still refuses to pretend a send happened. |
| Grade10 storefront | Listing links watch-driven mail already names. | No new page in this change. |
| Grade10 admin | Send log filtered by collector email. | No message bodies. |
| ZZZ | Same six messages, ZZZ identity. | Copy and links stay per storefront. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Outbid return | Share of outbid collectors who bid again within the lot's remaining window. | Product |
| Lifecycle mail delivery | Share of owed start / close-in-24h / extended-bidding letters confirmed sent before the statement they make is false. | Engineering |
| Bid-activity noise | New-bid letters per bidder per listing per hour during an extension; should stay near one per sweep pass, not one per bid. | Product |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Channel | Decided | Email first. Push kinds are named so a follow-on does not rename them, and are not delivered here. | Product |
| 24h close vs 1h reminder | Decided | Additive. The product's "closes in 24 hours" is a new letter; the shipped one-hour watcher reminder stays. | Product |
| Audiences | Decided | Start letters are watchers only. Close-in-24h and extended-bidding reach a participant who unwatched, by their bid. | Product |
| New-bid volume | Decided | Coalesce: tell a previous bidder about the current leading bid they have not yet been told about, not about every increment. The previous leader gets the outbid letter, not both. | Product |
| Unsubscribe | Decided | Watch-driven lifecycle letters can be stopped from a signed-in page. Outbid and new-bid cannot — they answer the bid. | Product |
| Send log | Decided | Operators see type, address, listing, and Sent At. No bodies. Filter by the address sent to. | Product |
| Language | Decided | English, matching every auction email today. Locale waits on recording one. | Engineering |
| Send-log retention | Open | How long rows are kept. | Engineering |

## Rollout and risks

- A popular listing's watcher fanout must stay batched. Per-recipient sends
  exhaust a worker before the last watcher.
- A snipe war must not mail every previous bidder on every increment.
- A provider outage must retry; a refused address must not occupy the ladder
  while other rows wait.
- Duplicate mail on a crash between send and stamp remains the accepted
  trade: a second letter beats a silently dropped one.
- `add-auction-watchlist` must land first.
