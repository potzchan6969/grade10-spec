---
title: Notifications
spec: grade10-site/auction/notifications
order: 8
reviewed: 2026-09-11
---

Auction mail exists because the close is a deadline that moves: nobody can
plan to be there at the end, so Grade10 tells enrolled collectors when a lot
needs them. Before-and-during mail stays here; post-close letters belong to
[Order Notifications](/p/grade10-site/auction/notifications-order). Every
message is transactional mail to the account's registered email address, and amounts and times in it follow
[money amounts](/platform/shared/money-amounts) and
[dates and times](/platform/shared/dates-and-times).

## Vocabulary

| Concept | Preferred | Avoid |
| --- | --- | --- |
| List membership | **Watch** / **Watching** / **Unwatch** | Using unwatch to mean mute |
| Email preference | **Email alerts** / mute / turn off email alerts | **Stop watching** for mute |
| Enrolment | Watching or bidding **and** email alerts on for that lot | Equating watch alone with mail |

## Enrolment

Two relationships can enrol a collector in a lot's mail, and each needs
**email alerts on** for that lot. **Watching** with alerts on brings the
progress messages. **Bidding** with alerts on brings bid-activity mail plus
closing and extension warnings. Unwatch ends the watch relationship and turns
alerts off with it; mute turns alerts off and leaves Watching (or the bid)
intact. A collector who both watches and bids still receives exactly one copy
of anything.

Account → Notifications also carries a global **Auction email alerts** master:
off stops all per-lot auction progress and activity mail without clearing
lists or bids; on restores per-lot preferences (default on for new watches).

## Messages

| Message | When | Who |
| --- | --- | --- |
| Bidding opens in 24 hours | 24 hours before the scheduled start | Watchers with alerts on |
| Bidding has opened | When bidding starts | Watchers with alerts on |
| Bidding closes in 24 hours | 24 hours before the *scheduled* close | Watchers and bidders with alerts on |
| Extended bidding has started | The lot enters its extension window | Watchers and bidders with alerts on |
| New bid on a lot you bid on | A bid is accepted | Every other bidder with alerts on |
| You have been outbid | The leader stops leading | The displaced leader with alerts on |

Outbid is losing the lead. A competing maximum that raises the current bid
while their own maximum still holds is not outbid — Grade10 keeps bidding
for them.

Each progress message goes once per lot per collector, and the closing
warning keys to the scheduled close on purpose — a close the extension rule
keeps moving would otherwise never warn. Nobody hears about their own bid,
an outbid collector gets the outbid message rather than that plus a new-bid
one, and a snipe war collapses into one new-bid message naming the current
leading bid rather than one per increment.

## Delivery

Every owed letter whose per-lot alerts are on carries a short footer:
**Email alerts are on for this lot.** **Manage alerts** — opens
**My Auctions**, where the collector mutes that lot's Email alerts control.
Signed out, Grade10's existing sign-in flow runs first, then My Auctions.
Never an unauthenticated one-click stop, never unwatch, and not the
account-wide Auction email alerts master as the primary destination. The
Grade10 brand mark opens the Grade10 website home. Outbound links carry
campaign tags (`utm_source=email`, `utm_medium=auction_notification`,
letter kind as `utm_campaign`, control as `utm_content`). Each
letter's lot block shows **one** primary picture of the item when the listing
has one. A temporary send failure retries with backoff under a bounded budget;
a permanent refusal stops at once, and an operator can put a given-up letter
back on the ladder. A called-off lot sends nothing further, and a letter that
would state something no longer true is not sent late.

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
| Collector watching a listing | Sale has not opened, or is about to close / extend | Hear in time to come back and bid, if alerts are on. |
| Collector who has bid | Someone else bid, or they lost the lead | Hear what changed on that lot, once, not once per snipe — or mute without ending the bid. |
| Auction operator | A collector says they were never told | See which messages went to that address, without reading bodies. |

**Not in scope.** Push, SMS, or in-app toasts. Marketing / non-auction email
prefs as the mute surface. Replacing the existing bid-state receipts or the
one-hour closing-soon reminder already sent to watchers. Auto-bidding, a
digest across listings, or a bidder's language. One-click unsubscribe — the
destination is a signed-in mute. Mail about winning, paying, invoicing, or
shipping belongs to [Order Notifications](/p/grade10-site/auction/notifications-order).

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Outbid return | Share of outbid collectors who bid again within the lot's remaining window. | Product |
| Lifecycle mail delivery | Share of owed start / close-in-24h / extended-bidding letters confirmed sent before the statement they make is false. | Engineering |
| Bid-activity noise | New-bid letters per bidder per listing per hour during an extension; near one per sweep pass, not one per bid. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Watch ≠ email alerts | Decided | Enrolment is (watching or bidding) and email alerts on for that lot. Mute ≠ unwatch. | Product |
| Per-lot mute | Decided | Primary model: one email-alerts preference per listing for progress and bid-activity mail. | Product |
| Account master | Decided | Account → Notifications: Auction email alerts on/off covers all watched and bid lots without clearing lists. | Product |
| Channel | Decided | Email first. Push kinds are named so a follow-on does not rename them, and are not delivered. | Product |
| Lot image | Decided | Every letter's lot block shows one primary listing image when available; omit when none. Not a gallery. | Design |
| Letter stack | Decided | emailcn on React Email; shared email shell components; preview with `email dev`. Map Grade10 tokens into an email theme — do not import site CSS. | Engineering |
| 24h close vs 1h reminder | Decided | Additive. "Closes in 24 hours" is a new letter; the one-hour watcher reminder stays. | Product |
| Audiences | Decided | Start letters are watchers with alerts on. Close-in-24h and extended-bidding reach a participant who unwatched, by their bid, when alerts remain on. | Product |
| New-bid volume | Decided | Coalesce: tell a previous bidder about the current leading bid they have not yet been told about, not about every increment. The previous leader gets the outbid letter, not both. | Product |
| Unsubscribe | Decided | Stop means mute for this lot. Footer: Email alerts are on for this lot. **Manage alerts** → My Auctions (sign-in first when signed out). Not unwatch; not the account master. | Product |
| Campaign tags | Decided | Every outbound link: `utm_source=email`, `utm_medium=auction_notification`, `utm_campaign` = letter kind, `utm_content` = control. No `utm_term`. | Product |
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
