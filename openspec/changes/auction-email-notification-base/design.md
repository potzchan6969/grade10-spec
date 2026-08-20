## Context

The auction worker already emails eight kinds through one letter
(`AuctionEmail` over `@grade10/email` `BaseLayout`), one `EmailPort`, and a
claim–send–stamp ladder: 30s doubling to an hour, eight attempts, then park
for an operator retry. Ending-soon is a batched watcher fanout (50
recipients, one-hour lead on `scheduled_ends_at`). Bid-state mail is per
row. A bid writes a watch, so “watched or bid” is almost one predicate —
except `unwatchListing` deletes the row.

What this change adds is the listing-lifecycle family in
[`grade10-auction/notifications`](specs/grade10-auction/notifications/spec.md)
and the missing bid-activity letter (new bid). Outbid already ships.

Constraints:

- Worker subrequest budget: a popular listing cannot cost one Resend call
  per watcher. Ending-soon already batches; lifecycle fanouts must too.
- Workers must not sleep for Retry-After. The durable retry is the ladder.
- `EmailKind = AuctionPushKind`. New names join that union; device push for
  them is out of scope and must still typecheck.
- Duplicate-beats-dropped remains: send, then stamp. A crash between the two
  repeats the letter.
- Auction copy stays English, per storefront, no default catalog.

## Goals / Non-Goals

**Goals:**

- One letter for every auction kind, including the new ones.
- Resend outcomes classified so a 429 climbs the ladder and a 422 parks.
- Lifecycle work lists beside ending-soon; new-bid beside outbid.
- Audiences exactly as the spec: start = watchers; close-24h and extended =
  watchers or participants; new-bid = other bidders, not the leader, not
  the outbid overtake.

**Non-Goals:**

- In-process Resend retries / sleeps.
- Cloudflare Queues as a second durable retry.
- Push delivery of the new kinds.
- `/profile/alerts`, locale, one-click unsubscribe.
- Removing the one-hour ending-soon list or any existing receipt kind.

## Decisions

### Keep `AuctionEmail` as the only auction letter

New kinds are copy branches on the existing exhaustive `copyFor` switch and
entries in the English catalog in `messages.ts`. Markup stays heading, body,
listing button, footer, optional unsubscribe. `EmailListing` grows
`startsAt` so start letters can name it; close letters keep `endsAt` (the
effective close) except the 24-hour close letter, which names
`scheduledEndsAt` because that is the instant the spec anchors to.

*Rejected — a template per kind:* the comment on `AuctionEmail` is the
reason the eight kinds already share one file. A ninth layout would drift.

*Rejected — move `AuctionEmail` into `@grade10/email`:* presentation is
product-owned. Login mail lives in `@grade10/email` because auth is
brand-neutral; auction copy and listing links are not. Shared chrome stays
`BaseLayout` on `/render`.

*Rejected — restyle onto design-system tokens:* inboxes do not load our CSS.
Inline styles stay, matching `LoginEmail`.

### Classify Resend errors in `@grade10/email`, retry in the auction ladder

`sendEmail` / `sendEmailBatch` keep throwing on a configured failure and
returning `{ sent: false }` when unconfigured. They gain a typed error:

- **Transient** — 429, 5xx, network, missing message id, partial batch:
  throw as today so the claim backoff retries.
- **Permanent** — 4xx other than 429 (invalid recipient, invalid payload):
  throw a `PermanentSendError`. `parkExhaustedNotify` parks immediately
  when it sees that class, instead of waiting for attempt 8.

No `sleep`. No SDK retry helper. The first four backoff rungs are already
shorter than the five-minute cron, so the next pass is the retry.

Auction `createEmailPort` still throws on `{ sent: false }`, so a missing
key never stamps notified.

*Rejected — in-process retry with Retry-After:* burns Worker CPU, fights
the cron, and still needs the ladder for process death.

*Rejected — Cloudflare Queues:* a second durable retry next to columns
every money and mail list already shares. One claim shape.

*Rejected — leave 422 on the eight-attempt ladder:* a bad address occupies
the pass budget while good rows behind it wait. The parked list and
`notifications.retry` already exist for the give-up door.

Partial batches stay all-or-nothing at the stamp: if Resend confirms 48 of
50, we throw and the next pass may duplicate the 48. That is the existing
duplicate-beats-dropped trade, documented, not a new one.

Batch size stays 50 (Resend’s batch cap is 100; 50 is the subrequest
budget the ending-soon list already priced).

### Lifecycle stamps on `watches`, plus a participant fallback for 9.2

| Letter | Stamp | Claim |
| --- | --- | --- |
| Open bidding starts in 24 hours | `startSoonNotifiedAt` on `watches` | published, `startsAt` in (now, now+24h], stamp null, reachable watcher |
| Open bidding has started | `startedNotifiedAt` on `watches` | published, `startsAt ≤ now < scheduledEndsAt`, stamp null, reachable watcher |
| Open bidding closes in 24 hours | `closeSoonNotifiedAt` on `watches` **or** equivalent on a bid when no watch remains | published, `scheduledEndsAt` in (now, now+24h], still biddable |
| Extended bidding has started | `extendedStartedNotifiedAt` similarly | published, `endsAt > scheduledEndsAt`, still biddable |

Close-24h and extended are owed to watchers **or** participants. A bid
already inserts a watch, but unwatch deletes it. The close/extended claims
therefore take:

1. unmute path: existing `watches` rows (reachable), and
2. participants with no watch: distinct bidders who have a bid on the
   listing.

Stamps for (2) live on the bidder’s latest bid row as
`closeSoonNotifiedAt` / `extendedStartedNotifiedAt` so unwatching cannot
erase the memory. Watchers who also bid stamp the watch row only — one
letter, not two.

Start letters stay watch-row only. Unwatch before start = no letter, which
is the spec.

Lead windows mirror ending-soon: the copy names the real instant, so a
watch created 6 hours before start still gets start-soon. Drop at send time
if the statement is false (`stillBiddable` for close/extended; start-soon
if `startsAt` has passed; has-started if `now < startsAt` or
`now ≥ scheduledEndsAt`).

Fanout is `sendBatch` per `(storefront, listing)` in chunks of 50, same as
ending-soon, including the participant fallback grouped with the watchers.

The one-hour `endingSoonNotifiedAt` list is untouched.

Unsubscribe: start letters are watch-driven → `canUnsubscribe` true.
Close-24h and extended: true only for recipients who have a watch and no
bid (the spec’s “solely as a watcher”). Participants get no unsubscribe
control on those two, because unwatch cannot stop them.

### New-bid is coalesced against `currentTopBidId`, after outbid

Column on `watches`: `newBidToldBidId`. Recipients are collectors with a
bid on the listing who are not the current leader.

Skip when the outbid list still owns them: live `outbid` / `lost` with
`outbidNotifiedAt` null. Those rows get the existing outbid letter.

Claim when `listing.currentTopBidId` is set, is not theirs, and differs
from `newBidToldBidId` (null counts as differs). Send, then set
`newBidToldBidId = currentTopBidId`. Several bids in one cron interval
collapse to one letter about the latest top.

Bidders who unwatched: same participant fallback as 9.2, stamp
`newBidToldBidId` on their bid row.

Sweep order: existing settlement lists, existing bid lists (outbid /
now-top first), **then** new-bid, **then** lifecycle fanouts, **then**
ending-soon. Receipts before reminders; outbid before new-bid so the
previous leader is already stamped when new-bid claims.

`placeBid` does not walk every other bid to reset a stamp. The comparison
to `currentTopBidId` is the reset.

*Rejected — one email per accepted bid:* a 30-minute snipe war would
mail every previous bidder on every increment and blow the Resend rate
limit inside one pass.

*Rejected — time-window debounce as the only rule:* comparing the leading
bid they were told about is deterministic across overlapping passes.

### Push kinds exist; push delivery does not

Add the four lifecycle kinds plus `listing_new_bid` to `AuctionPushKind`
(and therefore `EmailKind`). `claimDuePushNotifications` stays on the
current eight: watch pulls remain ending-soon only; bid pulls remain
vocabulary-driven for states that already owe push. New kinds are unused
on that path until a follow-on. Exhaustiveness is preserved by not
introducing a switch that must name them on the push side — they are
email-list kinds, and push continues to derive from bid/settlement state
plus the one ending-soon watch pull.

### Copy stays in the auction catalog, English

Same interim home as today (`messages.ts` / Grade10 English). Moving to
`@grade10/i18n` is the localization change, not this one.

Suggested keys (not spec text): `startSoon`, `started`, `closeSoon`,
`extendedStarted`, `newBid`. Outbid copy is unchanged.

## Risks / Trade-offs

- **Duplicate on partial batch** remains. Classifying permanent errors
  reduces the worse case (one bad address blocking fifty) but not the
  crash-between-send-and-stamp case.
- **Participant stamps on bids** add two columns to a table that already
  carries six mail stamps. Alternative was a mute flag on watches and
  never deleting a participant’s row; that changes unwatch semantics the
  alerts page does not exist to explain. Fallback query is the smaller
  behaviour change.
- **24h + 1h close** can mean two “closing” letters. Product asked for
  24h without withdrawing the shipped 1h reminder; copy must make the
  24h letter say the scheduled close, not “soon” in the same voice as
  the hour reminder.
- **Has-started for a late watcher** during a multi-day open window is
  true but stale-feeling. The spec allows it; a tighter “first 24 hours
  after start” window can wait for product if it is noisy.

## Migration Plan

Additive nullable stamp columns on `watches` and the participant fallback
columns on `bids`. Generate and commit the Drizzle migration. No backfill:
listings already in their window become due on the next pass, which is
correct for “at most once from now on”, not “retroactive for sales that
started last week”.

`WORK_LISTS` in `sweeps/pass.ts` gains the new lists before
`endingSoonReminders`, after `sentNotifications`. The order test pins it.

## Open Questions

None that change the specs, the approach, or the task breakdown. Push
timing for the new kinds is a follow-on change, not an unknown here.
