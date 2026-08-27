# Grade10 Auction notifications

## Summary

A collector who watched or bid on a listing needs to hear the moments that
change what they should do next — bidding is about to open, it has opened, it
is a day from closing, it has gone into extended bidding, someone else bid,
they were overtaken — without a different letter for every event.

## Context

- Problem: the auction MVP deferred notifications. Bid-state receipts (you
  were outbid, you lead, you won, the card failed) already go out. The
  listing-lifecycle and “someone else bid” mails in the product event table
  do not, so a watcher learns nothing until an hour before close, and a
  bidder who is not the previous leader never hears that the lot moved.
- Evidence: product event table §§9.1–9.3 (watch- and bid-triggered mails);
  `add-grade10-auction` listed listing notifications, outbid notifications,
  and extended-bidding emails as follow-on; the original auction PRD named
  notifications a non-goal of that MVP.
- Related: [Grade10 Auction](./auction.md), OpenSpec change
  `auction-email-notification-base`.

## Goals

- Tell a watcher the listing is 24 hours from opening, and that open bidding
  has started.
- Tell a watcher or participant that open bidding closes in 24 hours, and
  that extended bidding has started.
- Tell a bidder when the lot received a new bid, and when they were outbid.
- One letter shape for every auction email, so a new event is copy and an
  audience, not a new layout.
- Delivery that retries a temporary provider failure and stops on a permanent
  one, without sending a statement that has become false.

## Non-goals

- Push, SMS, in-app toasts, or a notification-preferences centre.
- `/profile/alerts` itself — watch-driven mail already links there; the page
  is a separate SPA gap.
- Replacing the existing bid-state receipts (you lead, hold failed, lost at
  close, listing cancelled, winner, capture failed) or the one-hour
  closing-soon reminder already sent to watchers.
- Auto-bidding, digest/rollup across listings, or a bidder’s language.
- One-click unsubscribe (the destination is a signed-in page).

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector watching a listing | Sale has not opened, or is about to close / extend | Hear in time to come back and bid. |
| Collector who has bid | Someone else bid, or they lost the lead | Hear what changed on that lot, once, not once per snipe. |

## Experience

### Primary flow

1. A collector watches a listing, or places a bid (which also watches it).
2. When a listed event becomes true for that person, Grade10 emails them one
   letter about that listing: heading, body, a button to the listing, a
   footer.
3. Watch-driven letters offer a way to stop further letters about that
   listing. Bid-activity letters do not: they answer the collector’s own bid.

## Requirements

Checkable requirements: `openspec/specs/grade10-auction/notifications/spec.md`
(in flight as the `auction-email-notification-base` delta until archived).

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| Grade10 auction service | Owns who is owed mail, renders through the shared auction letter, and retries via the existing mail ladder. | A send that did not happen must not be remembered as sent. |
| Shared email package | Provider send, shared letter chrome, error class (temporary vs permanent). | Unconfigured local/dev still refuses to pretend a send happened. |
| Grade10 storefront | Listing links and the alerts URL watch-driven mail already names. | No new page in this change. |
| ZZZ | None. ZZZ runs no auction storefront. | Copy and links stay per storefront with no default catalog. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Lifecycle mail delivery | Share of owed start / close-in-24h / extended-bidding letters that are confirmed sent before the statement they make is false. | Engineering |
| Parked mail | Count of permanently failed sends, by kind — a bad address parks once, a provider outage does not. | Engineering |
| Bid-activity noise | New-bid letters per bidder per listing per hour during an extension; should stay near one per cron pass, not one per bid. | Product |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Channel | Decided | Email first. Push stays the existing eight kinds until a follow-on. | Product |
| 24h close vs 1h reminder | Decided | Additive. The product’s “closes in 24 hours” is a new letter; the shipped one-hour watcher reminder stays. | Product |
| “Watched or participated” | Decided | A bid writes a watch, but unwatching can remove it. Close-in-24h and extended-bidding still reach a participant who unwatched, by their bid. Start letters stay watchers only. | Product |
| New-bid volume | Decided | Coalesce: tell a previous bidder about the current leading bid they have not yet been told about, not about every increment. The previous leader gets the outbid letter, not both. | Product |
| Unsubscribe | Decided | Watch-driven lifecycle letters can be stopped. Outbid and new-bid cannot — they answer the bid. | Product |
| Language | Decided | English, matching every auction email today. Locale waits on recording one. | Engineering |

## Rollout and risks

- A popular listing’s watcher fanout must stay batched. Per-recipient sends
  exhaust a worker before the last watcher.
- A snipe war must not mail every previous bidder on every increment.
- A provider outage must retry; a refused address must not occupy the ladder
  for eight attempts while other rows wait.
- Duplicate mail on a crash between send and stamp remains the accepted
  trade: a second letter beats a silently dropped one.
