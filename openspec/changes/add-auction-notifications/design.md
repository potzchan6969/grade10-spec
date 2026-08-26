# Design: auction email notifications

Requirements are in
[`specs/grade10-auction/notifications/spec.md`](specs/grade10-auction/notifications/spec.md).
Motivation is in [`proposal.md`](proposal.md).

## Context

Who is enrolled, which six messages fire, that the closing warning uses the
scheduled close, that outbid wins over new-bid, and that a called-off listing
sends nothing further are the spec. Money and times in a sent message already
follow `money-amounts` and `dates-and-times`.

Auction already mails from bid and watch notify columns (`outbid`,
`now_top`, `listing_ending_soon` at one hour before `scheduled_ends_at`, and
others). `@grade10/email` is a render-and-send library with no database.

## Decisions

### Auction emits; `@grade10/email` sends; auction owns the log

Auction names the type, the listing, and the recipient. The email library
renders and delivers. The send log is an auction table: the operator reads it
next to the listing, and `@grade10/email` has no store.

*Alternative rejected — the auction worker talks to the mail provider.*
Sending couples the worker to templates and the retry ladder. *Alternative
rejected — the store service sends.* Auction already must not grow a store
binding. *Alternative rejected — a new email-service database for the log.*
One table would mint a Neon role and an admin path that then joins listings
it does not own. *Alternative rejected — the sender works out recipients.*
It would duplicate watches and bids.

### Closing warning reuses `ending_soon_notified_at`

The existing watch stamp becomes the spec's 24-hour closing warning (lead
changes from one hour to 24). Bidders without a watch still receive it, so
`bids` gains the same stamp. Do not add a second closing column.

*Alternative rejected — a new `closes_in_24h_notified_at` beside the existing
stamp.* Two stamps for one message. Already-stamped watches stay stamped;
they are not mailed again.

### Once is a unique row on `mail_sends`, plus sweep stamps

Progress uniqueness is `(listing_id, storefront, user_id, type)`. Activity
uniqueness includes `cause_id` (the triggering bid). Sweep stamps on
`watches` and `bids` keep a pass from claiming the same row twice before the
log write lands. The log stores no body.

*Alternative rejected — derive once from enrolment at send time.* A
collector who unwatches and re-watches would receive the opening message
twice. *Alternative rejected — store the rendered body.* Templates go stale;
the operator's question is which message went out.

Outbid-over-new-bid is chosen before emit, so the log never sees both for
one bid.

## Data model

Schema `auction`. Timestamps are `timestamptz(3)`. `mail_sends.type` slugs:

`opens_in_24h` · `opened` · `closes_in_24h` · `extended` · `new_bid` ·
`outbid`

### `watches` — additive stamp columns

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `opens_in_24h_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `opened_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `extended_notified_at` | `timestamptz(3)` | NULL | `NULL` |

Indexes, partial so stamped rows leave them:

| Index | On | Where |
| --- | --- | --- |
| `idx_watches_opens_in_24h_due` | `(listing_id, created_at)` | `opens_in_24h_notified_at IS NULL` |
| `idx_watches_opened_due` | `(listing_id, created_at)` | `opened_notified_at IS NULL` |
| `idx_watches_extended_due` | `(listing_id, created_at)` | `extended_notified_at IS NULL` |

The existing `idx_watches_listing_id_notified` stays the `closes_in_24h`
claim.

### `bids` — additive stamp columns

`outbid_notified_at` already exists. `new_bid` is per triggering bid, so it
is not a stamp on the recipient row; the activity unique key is the once.

| Column | Type | Null | Default |
| --- | --- | --- | --- |
| `ending_soon_notified_at` | `timestamptz(3)` | NULL | `NULL` |
| `extended_notified_at` | `timestamptz(3)` | NULL | `NULL` |

| Index | On | Where |
| --- | --- | --- |
| `idx_bids_ending_soon_due` | `(listing_id, created_at)` | `ending_soon_notified_at IS NULL` |
| `idx_bids_extended_due` | `(listing_id, created_at)` | `extended_notified_at IS NULL` |

### `mail_sends` — new table

`sent_to` is the registered address at send time, so a later email change
does not rewrite history. `cause_id` is the triggering bid id for `new_bid`
and `outbid`; NULL for the four progress messages.

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

Extend `AuctionPushKind` / `EmailKind` with the four new progress kinds and
`new_bid`. `outbid` already exists. Existing `listing_ending_soon` stays the
push slug; new `mail_sends` rows use `closes_in_24h`.

Admin gains a send-log read: filter by `sent_to`, page by `attempted_at`.
There is no body column. No public storefront contract beyond the kinds.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| A send failure silently loses a message | `state` distinguishes `attempted` from `sent`. |
| Changing ending-soon from 1h to 24h re-mails people already stamped | Existing stamps stand; those watches are not claimed again. Unstamped listings still inside 24h get the warning once. |

## Migration plan

1. Additive auction migration: the three watch stamps, the two bid stamps,
   `mail_sends` and its indexes and checks. No backfill. Existing
   `ending_soon_notified_at` values stand.
2. Deploy after `add-auction-watchlist`, with the closing-soon lead set to 24
   hours.
3. Collectors who already bid on an open listing begin receiving bid-activity
   mail at release; that is the intent, not a data backfill.
4. Rollback keeps the columns and `mail_sends`. Do not delete log rows.

## Open questions

Answerable later without changing the specs, the approach, or the tasks.

- How long the send log is retained.
- Whether the new-bid message states the new current bid or only that a bid
  arrived. The outbid message's contents are specified; this one's are not
  constrained by any scenario.
