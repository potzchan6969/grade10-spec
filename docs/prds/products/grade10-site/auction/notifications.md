---
title: Bidding Notifications
spec: grade10-site/auction/notifications
order: 29
---

Grade10 tells enrolled collectors when a lot needs them, because the close is
a deadline that moves. Every letter is transactional mail to the account's
registered address, and its amounts and times follow [money
amounts](/platform/shared/money-amounts) and [dates and
times](/platform/shared/dates-and-times); the letters a winner gets about an
order belong to [Order Notifications](/p/grade10-site/auction/notifications-order).

## Enrolment

Enrolment is watching or bidding **and** email alerts on for that lot; the
words are [Watchlist](/p/grade10-site/auction/watchlist)'s.

- **Watching** with alerts on brings the progress messages
- **Bidding** with alerts on brings bid-activity mail plus the closing and
  extension warnings
- **Unwatch** ends the watch and turns alerts off; **mute** turns alerts off
  and leaves the watch or the bid intact
- **One copy** — a collector who both watches and bids receives exactly one
  copy of anything
- **Account master** — Account → Notifications carries a global **Auction
  email alerts** switch: off stops all per-lot auction mail without clearing
  lists or bids; on restores per-lot preferences, default on for new watches

## Messages

| Message | When | Who |
| --- | --- | --- |
| Bidding opens in 24 hours | 24 hours before the scheduled start | Watchers with alerts on |
| Bidding has opened | When bidding starts | Watchers with alerts on |
| Bidding closes in 24 hours | 24 hours before the *scheduled* close | Watchers and bidders with alerts on |
| Extended bidding has started | The lot enters its extension window | Watchers and bidders with alerts on |
| New bid on a lot you bid on | A bid is accepted | Every other bidder with alerts on |
| You have been outbid | The leader stops leading | The displaced leader with alerts on |

- **Outbid is losing the lead** — a competing maximum that raises the current
  bid while their own maximum still holds is not outbid; Grade10 keeps
  bidding for them
- **Once per lot** — each progress message goes once per lot per collector
- **Keyed to the scheduled close** — the closing warning keys to the
  scheduled close on purpose; a close the extension keeps moving would
  otherwise never warn
- **No noise** — nobody hears about their own bid, an outbid collector gets
  the outbid message rather than that plus a new-bid one, and a snipe war
  collapses into one new-bid message naming the current leading bid

## Close Outcome

When a lot stops taking bids, enrolled collectors who did not win hear once
that it closed — same alerts-on enrolment as progress mail.

- 🚧 **Non-winner** — a bidder who lost to someone else gets a letter that the
  lot closed and they did not win, with Winning bid and Their bid when those
  amounts are supplied
- 🚧 **Watcher, sold** — a watch-only collector with alerts on gets a letter
  that the lot has ended, with Sold for when a winning bid is supplied
  (`lot_ended_watched`)
- 🚧 **No bids at close** — watchers with alerts on get **Ended** only
  (`lot_ended_watched` without a winning amount). Subject, preheader and body
  never say unsold, did not sell, no sale, or no bids, and never show Highest
  bid. At close this means nobody bid — not a later winner default. There is
  no bidder close letter when nobody bid; campaign `lot_ended` is retired
- 🚧 **One letter** — a watcher who also bid gets the non-winner letter, not
  also the watcher letter. The winner gets only the auction-won order letter
- ❓ **Hold line on the non-winner letter** — whether the body also says the
  card hold is being released; My Auctions already carries hold state

## Delivery

- **Footer** — every owed letter whose per-lot alerts are on says **Email
  alerts are on for this lot**, and **Manage alerts** opens **My Auctions**,
  where the collector mutes that lot; signed out, sign-in runs first. Never an
  unauthenticated one-click stop, never unwatch, and not the account-wide
  master as the primary destination
- **Brand mark** — opens the Grade10 website home
- **Campaign tags** — every outbound link carries `utm_source=email`,
  `utm_medium=auction_notification`, the letter kind as `utm_campaign` and
  the control as `utm_content`
- **Lot picture** — each letter's lot block shows one primary picture of the
  item when the listing has one
- **Failed send** — a temporary failure retries with backoff under a bounded
  budget; a permanent refusal stops at once, and an operator can put a
  given-up letter back on the ladder
- **Never a false statement** — a called-off lot sends nothing further, and a
  letter that would state something no longer true is not sent late
- **Send log** — operators answer "I was never told" from message type,
  recipient address, lot and when it was sent — never the body

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
| Collector watching or who bid | Lot stops taking bids and they did not win | Hear that it ended or closed, once; on a no-bids close, Ended only with no non-sale disclosure. |
| Auction operator | A collector says they were never told | See which messages went to that address, without reading bodies. |

**Not in scope.** Push, SMS, or in-app toasts. Marketing / non-auction email
prefs as the mute surface. Replacing the existing bid-state receipts or the
one-hour closing-soon reminder already sent to watchers. Auto-bidding, a
digest across listings, or a bidder's language. One-click unsubscribe — the
destination is a signed-in mute. Mail about winning, paying, invoicing,
setup reminders, or shipping belongs to
[Order Notifications](/p/grade10-site/auction/notifications-order). Called-off
lots still send nothing further. Winner default after a win is order mail, not
a close-outcome letter.

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
| Close-outcome audiences | Decided | Watchers and non-winners with alerts on; winner gets only Order Notifications. Dedup: bid beats watch; win beats both. | Product |
| No-bids close copy | Decided | Ended only — never unsold, did not sell, no sale, no bids, or Highest bid. No bidder letter when nobody bid. No-bids ≠ winner default. | Product |
| No-bids campaign | Decided | Watchers only, campaign `lot_ended_watched` without a winning amount. `lot_ended` retired. | Product |
| Hold line on non-winner letter | ❓ Open | Draft omits it; My Auctions keeps hold state. | Product |
| Send-log retention | ❓ Open | How long rows are kept. | Engineering |

**Risks.** A popular listing's watcher fanout stays batched; per-recipient
sends exhaust a worker before the last watcher. A snipe war never mails every
previous bidder on every increment. A provider outage retries; a refused
address never occupies the ladder while other rows wait. Duplicate mail on a
crash between send and stamp is the accepted trade: a second letter beats a
silently dropped one.
:::
