---
title: Notifications
spec: grade10-auction/notifications
order: 8
---

Auction mail exists because the close is a deadline that moves: nobody can
plan to be there at the end, so Grade10 tells enrolled collectors when a lot
needs them. Every message is transactional mail to the account's registered
email address, and amounts and times in it follow
[money amounts](/platform/money-amounts) and
[dates and times](/platform/dates-and-times).

## Enrolment

Two things enrol a collector in a lot's mail, and they are different
subscriptions. **Watching** brings the progress messages and ends on unwatch.
**Bidding** brings the bid-activity mail plus the closing and extension
warnings, and does not end on unwatch — a participant is owed those whatever
they do with the watch. A collector who both watches and bids still receives
exactly one copy of anything.

## The six messages

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
