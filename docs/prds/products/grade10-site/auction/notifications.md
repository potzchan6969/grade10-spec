---
title: Notifications
spec: grade10-site/auction/notifications
order: 8
---

Auction mail exists because the close is a deadline that moves: nobody can
plan to be there at the end, so Grade10 tells enrolled collectors when a lot
needs them. Every message is transactional mail to the account's registered
email address, and amounts and times in it follow
[money amounts](/platform/shared/money-amounts) and
[dates and times](/platform/shared/dates-and-times).

## Enrolment

Two things enrol a collector in a lot's mail, and they are different
subscriptions. **Watching** brings the progress messages and ends on unwatch.
**Bidding** brings the bid-activity mail plus the closing and extension
warnings, and does not end on unwatch — a participant is owed those whatever
they do with the watch. A collector who both watches and bids still receives
exactly one copy of anything.

## Messages

| Message | When | Who |
| --- | --- | --- |
| Bidding opens in 24 hours | 24 hours before the scheduled start | Watchers |
| Bidding has opened | When bidding starts | Watchers |
| Bidding closes in 24 hours | 24 hours before the *scheduled* close | Watchers and bidders |
| Extended bidding has started | The lot enters its extension window | Watchers and bidders |
| New bid on a lot you bid on | A bid is accepted | Every other bidder |
| You have been outbid | The leader stops leading | The displaced leader |

Each progress message goes once per lot per collector, and the closing
warning keys to the scheduled close on purpose — a close the extension rule
keeps moving would otherwise never warn. Nobody hears about their own bid,
an outbid collector gets the outbid message rather than that plus a new-bid
one, and a snipe war collapses into one new-bid message naming the current
leading bid rather than one per increment.

## Delivery

A watch-driven letter carries a way to stop further mail about that lot — a
signed-in page where the collector unwatches, never an unauthenticated
one-click stop. A letter owed for the collector's own bid carries none,
because stopping a watch could not honour it. A temporary send failure
retries with backoff under a bounded budget; a permanent refusal stops at
once, and an operator can put a given-up letter back on the ladder. A
called-off lot sends nothing further, and a letter that would state
something no longer true is not sent late.

Operators answer "I was never told" from a send log: message type, recipient
address, lot, and when it was sent — never the body.

:::detail{title="Product decisions" for="pm"}
Bid-state receipts go out on their own. The letters here are the moments that
change what a collector should do next — bidding about to open, opened, a day
from closing, gone into extended bidding, someone else bid, overtaken — as one
letter shape, so a new event is copy and an audience rather than a new layout,
and never a snipe war filling an inbox.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector watching a listing | Sale has not opened, or is about to close / extend | Hear in time to come back and bid. |
| Collector who has bid | Someone else bid, or they lost the lead | Hear what changed on that lot, once, not once per snipe. |
| Auction operator | A collector says they were never told | See which messages went to that address, without reading bodies. |

**Not in scope.** Push, SMS, in-app toasts, or a notification-preferences
centre. Replacing the existing bid-state receipts or the one-hour
closing-soon reminder already sent to watchers. Auto-bidding, a digest across
listings, or a bidder's language. One-click unsubscribe — the destination is a
signed-in page. Mail about winning, paying, invoicing, or shipping.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Outbid return | Share of outbid collectors who bid again within the lot's remaining window. | Product |
| Lifecycle mail delivery | Share of owed start / close-in-24h / extended-bidding letters confirmed sent before the statement they make is false. | Engineering |
| Bid-activity noise | New-bid letters per bidder per listing per hour during an extension; near one per sweep pass, not one per bid. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Channel | Decided | Email first. Push kinds are named so a follow-on does not rename them, and are not delivered. | Product |
| 24h close vs 1h reminder | Decided | Additive. "Closes in 24 hours" is a new letter; the one-hour watcher reminder stays. | Product |
| Audiences | Decided | Start letters are watchers only. Close-in-24h and extended-bidding reach a participant who unwatched, by their bid. | Product |
| New-bid volume | Decided | Coalesce: tell a previous bidder about the current leading bid they have not yet been told about, not about every increment. The previous leader gets the outbid letter, not both. | Product |
| Unsubscribe | Decided | Watch-driven lifecycle letters can be stopped from a signed-in page. Outbid and new-bid cannot — they answer the bid. | Product |
| Send log | Decided | Operators see type, address, listing, and Sent At. No bodies. Filter by the address sent to. | Product |
| Language | Decided | English, matching every auction email. Locale waits on recording one. | Engineering |
| Send-log retention | ❓ Open | How long rows are kept. | Engineering |

**Risks.** A popular listing's watcher fanout stays batched; per-recipient
sends exhaust a worker before the last watcher. A snipe war never mails every
previous bidder on every increment. A provider outage retries; a refused
address never occupies the ladder while other rows wait. Duplicate mail on a
crash between send and stamp is the accepted trade: a second letter beats a
silently dropped one.
:::
