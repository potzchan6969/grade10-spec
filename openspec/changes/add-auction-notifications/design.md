# Design: auction email notifications

Requirements are in
[`specs/grade10-auction/notifications/spec.md`](specs/grade10-auction/notifications/spec.md).
Motivation is in [`proposal.md`](proposal.md).

## Context

Auction already mails eight kinds through one letter, one `EmailPort`, and a
claim–send–stamp ladder: 30s doubling to an hour, eight attempts, then park
for an operator retry. Ending-soon is a batched watcher fanout (50
recipients, one-hour lead on `scheduled_ends_at`). Outbid already ships.
`@grade10/email` is a render-and-send library with no database.

`watches` already exists, keyed `(storefront, user_id, listing_id)`.
`add-auction-watchlist` stops `placeBid` from inserting a watch, so watcher
mail and bidder mail are different rows.

Worker subrequest budget: a popular listing cannot cost one provider call
per watcher. Workers must not sleep for Retry-After. Duplicate-beats-dropped
remains: send, then stamp.

## Decisions

Who is enrolled, which six messages fire, that the closing warning uses the
scheduled close, that outbid wins over new-bid, that a snipe war coalesces,
that a called-off listing sends nothing further, that every letter shares one
shape, that watch-driven letters can be stopped, and that a temporary failure
retries while a permanent one parks, are the spec.

### Auction emits; `@grade10/email` sends; auction owns the log

Auction names the type, the listing, and the recipient. The email library
renders and delivers. The send log is `auction.mail_sends`: the operator
reads it next to the listing, and `@grade10/email` has no store.

*Rejected — the auction worker talks to the mail provider.* Sending couples
the worker to templates and the retry ladder. *Rejected — the store service
sends.* Auction already must not grow a store binding. *Rejected — a new
email-service database for the log.* One table would mint a Neon role and an
admin path that then joins listings it does not own. *Rejected — the sender
works out recipients.* It would duplicate watches and bids.

### Keep the existing auction letter; new kinds are copy branches

Markup stays heading, body, listing button, footer, optional unsubscribe.
The listing shape the letter renders grows `startsAt` and `scheduledEndsAt`
beside the effective close, so start letters and the 24-hour close letter
can name the instants the spec anchors to. Copy stays in the auction English
catalog.

*Rejected — a template per kind.* The eight kinds already share one file; a
ninth layout would drift. *Rejected — move the letter into `@grade10/email`.*
Presentation is product-owned. Login mail lives there because auth is
brand-neutral; auction copy and listing links are not. Shared chrome stays
`BaseLayout`. *Rejected — restyle onto design-system tokens.* Inboxes do not
load that CSS.

Unsubscribe (`canUnsubscribe`) is true for start-soon and has-started; false
for outbid and new-bid; true for close-soon and extended only when the
recipient is a watcher who never bid. The control points at a signed-in
listing page, not a one-click token.

### Classify provider errors in `@grade10/email`; retry on the existing ladder

`sendEmail` / `sendEmailBatch` keep throwing on a configured failure and
returning `{ sent: false }` when unconfigured. They gain a typed error:

- **Transient** — 429, 5xx, network, missing message id, partial batch:
  throw as today so the claim backoff retries.
- **Permanent** — 4xx other than 429: throw a permanent error. The park
  path parks immediately when it sees that class, instead of waiting for
  attempt 8.

No `sleep`. No SDK retry helper. Auction still throws on `{ sent: false }`,
so a missing key never stamps notified.

*Rejected — in-process retry with Retry-After.* Burns worker CPU, fights the
cron, and still needs the ladder for process death. *Rejected — Cloudflare
Queues.* A second durable retry next to columns every money and mail list
already shares. *Rejected — leave 422 on the eight-attempt ladder.* A bad
address occupies the pass budget while good rows behind it wait.

Partial batches stay all-or-nothing at the stamp: if the provider confirms
48 of 50, throw and the next pass may duplicate the 48. That is the existing
duplicate-beats-dropped trade.

Batch size stays 50 (the provider batch cap is 100; 50 is the subrequest
budget the ending-soon list already priced). Fanout is `sendBatch` per
`(storefront, listing)` in chunks of 50, including the participant fallback
grouped with the watchers.

### New 24-hour stamps; leave the one-hour reminder in place

Do not reuse `ending_soon_notified_at`. That column holds the shipped
one-hour watcher reminder, a different message. The 24-hour close letter
gets its own stamp.

| Letter | Stamp | Claim |
| --- | --- | --- |
| Opens in 24 hours | `opens_in_24h_notified_at` on `watches` | published, `starts_at` in (now, now+24h], stamp null, reachable watcher |
| Bidding has opened | `opened_notified_at` on `watches` | published, `starts_at ≤ now < scheduled_ends_at`, stamp null, reachable watcher |
| Closes in 24 hours | `closes_in_24h_notified_at` on `watches`, or on a bid when no watch remains | published, `scheduled_ends_at` in (now, now+24h], still biddable |
| Extended bidding has started | `extended_notified_at` similarly | published, `ends_at > scheduled_ends_at`, still biddable |

Close-24h and extended are owed to watchers **or** participants. Unwatch
deletes the watch row, so those claims take (1) remaining `watches` rows and
(2) distinct bidders with a bid and no watch. Stamps for (2) live on the
bidder's latest bid row. Watchers who also bid stamp the watch row only.

Start letters stay watch-row only. Unwatch before start = no letter.

*Rejected — a mute flag on watches and never deleting a participant's row.*
That changes unwatch semantics the watched list does not exist to explain.
*Rejected — convert the one-hour stamp into the 24-hour letter.* Two
messages, one column.

Drop at send time if the statement is false (`stillBiddable` for
close/extended; start-soon if `starts_at` has passed; has-started if
`now < starts_at` or `now ≥ scheduled_ends_at`). The one-hour
`ending_soon_notified_at` list is untouched and stays last among mail lists.

### Once is a unique row on `mail_sends`, plus sweep stamps

Progress uniqueness is `(listing_id, storefront, user_id, type)`. Activity
uniqueness includes `cause_id` (the leading bid the collector was told
about). Sweep stamps keep a pass from claiming the same row twice before the
log write lands. The log stores no body. `sent_to` is the registered address
at send time.

*Rejected — derive once from enrolment at send time.* A collector who
unwatches and re-watches would receive the opening message twice.
*Rejected — store the rendered body.* Templates go stale; the operator's
question is which message went out.

Outbid-over-new-bid is chosen before emit, so the log never sees both for
one bid.

### New-bid coalesces against `current_top_bid_id`

Column `new_bid_told_bid_id` on `watches`, and on the bid row for the
participant fallback. Recipients are collectors with a bid who are not the
current leader. Skip when the outbid list still owns them: live `outbid` /
`lost` with `outbid_notified_at` null.

Claim when `listing.current_top_bid_id` is set, is not theirs, and differs
from `new_bid_told_bid_id` (null counts as differs). Send, then set
`new_bid_told_bid_id = current_top_bid_id`. `cause_id` on the log row is
that leading bid. Several bids in one cron interval collapse to one letter
about the latest top.

Sweep order: existing settlement lists, existing bid lists (outbid /
now-top first), **then** new-bid, **then** the four progress fanouts,
**then** ending-soon. Receipts before reminders; outbid before new-bid so
the previous leader is already stamped when new-bid claims.

`placeBid` does not walk every other bid to reset a stamp. The comparison
to `current_top_bid_id` is the reset.

*Rejected — one email per accepted bid.* A 30-minute snipe war would mail
every previous bidder on every increment and blow the provider rate limit
inside one pass. *Rejected — time-window debounce as the only rule.*
Comparing the leading bid they were told about is deterministic across
overlapping passes.

### Push kinds exist; push delivery does not

Add the four progress kinds plus `listing_new_bid` to `AuctionPushKind`
(and therefore `EmailKind`). `outbid` already exists. Push claiming stays
on the current eight kinds. New names join the union so a follow-on does
not rename them; they are unused on the push path in this change.

Copy keys (not spec text): `opensIn24h`, `opened`, `closesIn24h`,
`extended`, `newBid`. Outbid copy is unchanged.

## Data model

Schema `auction`. Timestamps are `timestamptz(3)`. `mail_sends.type` slugs:

`opens_in_24h` · `opened` · `closes_in_24h` · `extended` · `new_bid` ·
`outbid`

### `watches` — additive stamp columns

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `opens_in_24h_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `opened_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `closes_in_24h_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `extended_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `new_bid_told_bid_id` | `text` | NULL | `NULL` |

Indexes, partial so stamped rows leave them:

| Index | On | Where |
| --- | --- | --- |
| `idx_watches_opens_in_24h_due` | `(listing_id, created_at)` | `opens_in_24h_notified_at IS NULL` |
| `idx_watches_opened_due` | `(listing_id, created_at)` | `opened_notified_at IS NULL` |
| `idx_watches_closes_in_24h_due` | `(listing_id, created_at)` | `closes_in_24h_notified_at IS NULL` |
| `idx_watches_extended_due` | `(listing_id, created_at)` | `extended_notified_at IS NULL` |
| `idx_watches_new_bid_due` | `(listing_id, created_at)` | `new_bid_told_bid_id IS NULL` |

The existing `idx_watches_listing_id_notified` stays the one-hour
ending-soon claim. `ending_soon_notified_at` is unchanged.

### `bids` — additive stamp columns for the participant fallback

`outbid_notified_at` already exists.

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `closes_in_24h_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `extended_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `new_bid_told_bid_id` | `text` | NULL | `NULL` |

| Index | On | Where |
| --- | --- | --- |
| `idx_bids_closes_in_24h_due` | `(listing_id, created_at)` | `closes_in_24h_notified_at IS NULL` |
| `idx_bids_extended_due` | `(listing_id, created_at)` | `extended_notified_at IS NULL` |

### `mail_sends` — new table

`sent_to` is the registered address at send time, so a later email change
does not rewrite history. `cause_id` is the leading bid the collector was
told about for `new_bid` and `outbid`; NULL for the four progress messages.

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `id` | `text` | NOT NULL | — (PK) |
| `listing_id` | `text` | NOT NULL | — (FK `auction_listings.id`) |
| `storefront` | `text` | NOT NULL | — |
| `user_id` | `text` | NOT NULL | — |
| `sent_to` | `text` | NOT NULL | — |
| `type` | `text` | NOT NULL | — |
| `cause_id` | `text` | NULL | `NULL` |
| `state` | `text` | NOT NULL | `'attempted'` |
| `attempted_at` | `timestamptz(3)` | NOT NULL | `now()` |
| `sent_at` | `timestamptz(3)` | NULL | `NULL` |

Checks:

- `ck_mail_sends_type`: `type` in the six slugs above
- `ck_mail_sends_state`: `state IN ('attempted', 'sent')`
- `ck_mail_sends_sent_at`: `state = 'sent' AND sent_at IS NOT NULL` or
  `state = 'attempted' AND sent_at IS NULL`
- `ck_mail_sends_cause`: progress types have `cause_id IS NULL`;
  `new_bid` and `outbid` have `cause_id IS NOT NULL`

| Index | On | Where |
| --- | --- | --- |
| `uq_mail_sends_progress` | `(listing_id, storefront, user_id, type)` | `cause_id IS NULL` |
| `uq_mail_sends_activity` | `(listing_id, storefront, user_id, type, cause_id)` | `cause_id IS NOT NULL` |
| `idx_mail_sends_sent_to_attempted_at` | `(sent_to, attempted_at DESC)` | no |

The spec's email filter is `sent_to = :email`. Sweeps skip
`auction_listings.status = 'canceled'`; they do not delete log rows.

### Contracts

Extend `AuctionPushKind` / `EmailKind` with `listing_opens_in_24h`,
`listing_opened`, `listing_closes_in_24h`, `listing_extended`, and
`listing_new_bid`. `outbid` already exists. Existing `listing_ending_soon`
stays the one-hour push slug; new `mail_sends` rows use `closes_in_24h`.

Admin gains a send-log read: filter by `sent_to`, page by `attempted_at`.
There is no body column. No public storefront contract beyond the kinds.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| A send failure silently loses a message | `state` distinguishes `attempted` from `sent`. A missing provider key throws and never stamps. |
| A popular listing exhausts the worker | Batch 50 per `(storefront, listing)`, same as ending-soon. |
| A snipe war mails every increment | `new_bid_told_bid_id` compared to `current_top_bid_id`; outbid claims first. |
| A refused address blocks the pass | Permanent provider error parks immediately. |
| Duplicate on partial batch or crash between send and stamp | Existing duplicate-beats-dropped trade; the unique `mail_sends` row still records one logical send. |
| 24h close plus 1h reminder both fire | Separate stamps and separate copy: the 24h letter names the scheduled close. |

## Migration plan

1. Additive auction migration: the five watch stamps, the three bid
   fallback columns, `mail_sends` and its indexes and checks. No backfill.
   Existing `ending_soon_notified_at` values stand. Listings already in
   their window become due on the next pass.
2. Deploy after `add-auction-watchlist`.
3. Collectors who already bid on an open listing begin receiving
   bid-activity mail at release; that is the intent, not a data backfill.
4. Rollback keeps the columns and `mail_sends`. Do not delete log rows.

`WORK_LISTS` gains the new lists before `endingSoonReminders`, after
`sentNotifications`. The order test pins it.

## Open questions

Answerable later without changing the specs, the approach, or the tasks.

- How long the send log is retained.
