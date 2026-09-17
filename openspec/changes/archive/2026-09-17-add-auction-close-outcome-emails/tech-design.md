## Context

Progress and bid-activity auction mail already run on the auction worker's
sweep: claim due rows (`SKIP LOCKED`), enqueue bulk or priority mail jobs,
render through `renderAuctionEmail` / `AuctionLetter`, write `mail_logs`, and
stamp a per-row notified-at column. Close itself (`sweeps/close.ts`) already
issues the winner's order letter on `notifications-order` and resets push
stamps via `listingStoppedTakingBids`; it does not own watcher or non-winner
close mail.

Wire letter kinds use the `listing_*` vocabulary shared with push. Preview
templates under `apps/emails` name the two close-outcome campaigns
`lot_closed_didnt_win` and `lot_ended_watched`. Campaign `lot_ended` is
retired in the capability and must not be sent or offered as a UTM campaign.

## Goals / Non-Goals

**Goals:**

- Send each enrolled non-winner and watch-only collector exactly one
  close-outcome letter when a listing stops taking bids, with mute and
  account-master gates unchanged from progress mail.
- Reuse the existing sweep → queue → render → stamp path; add the smallest
  claim and work-list surface the audiences need.
- Keep send-log rows typed without bodies, filterable by recipient email.
- Retire every surface of the public no-bids campaign (`lot_ended` /
  `listing_ended` / mail-log `ended`).

**Non-Goals:**

- Winner order mail, address reminders, hold-release copy on the non-winner
  letter, called-off notices, push or SMS.
- A second letter layout or a new Durable Object for close fanout.

## Decisions

### Spec already governs outcomes; this design picks lanes and stamps

The capability names two campaigns, enrolment, one-copy dedup, winner
exclusion, Ended-only wording on no-bids closes, and the retirement of
`lot_ended`. Implementation chooses which notify lane owns each audience and
which column stamps idempotency.

### Non-winners ride the bid-notification priority lane

When the listing is no longer biddable, `bidNotification` maps
`outbid` / `lost` / `lost_hold` to kind `listing_closed_didnt_win`. The
existing `claimBidNotifications` work lists already select those states with
`live: false` and stamp `bids.lost_at_close_notified_at`. Recipients still
require per-bid and account-level email alerts on. A listing with no
`current_top_bid_id` never produces a bidder close letter.

**Rejected — a separate close-outcome claim for bids.** The bid ladder
already encodes outbid / lost / lost_hold; a second claim would race the
existing stamps and duplicate the mute gates.

**Rejected — send did-not-win from `close.ts` under the listing lock.** Close
must stay short; watcher fanout is large; the sweep already owns at-least-once
mail.

### Watchers get a bulk `closeOutcomeReminders` fanout

Mirror `progressFanout`: `claimCloseOutcomeWatches` selects
`bidder_watches` with alerts reachable, `closed_notified_at` null, listing
`status = closed`, and **no** bid row for that `(storefront, userId,
listingId)`. Jobs list `closeOutcomeReminders`; the consumer sends and stamps
`bidder_watches.closed_notified_at`.

Dedup against the bidder letter is at claim time: any bid moves the collector
off the watcher audience. The winner holds a `won` bid, so they are excluded
from the watcher claim and never receive `listing_closed_didnt_win` (order
mail stays on `notifications-order`).

### No-bids close is watched Ended-only; `lot_ended` is gone

Product decided: enrolled watchers receive `lot_ended_watched` with no
winning amount; Sold for / Winning bid / Highest bid and non-sale wording are
omitted. Fanout kind is always `listing_ended_watched`; Sold for vs Ended-only
is derived at render from `hasWinner`. Do not send, render for production, or
advertise campaign `lot_ended`. Remove wire kind `listing_ended`, UTM
`lot_ended` / `listing_ended`, and mail-log type `ended` from the close-outcome
surface (preview `lot-ended.tsx` is already deleted in the store).

**Rejected — keep `listing_ended` renderable for a later product choice.** The
capability forbids the campaign; a dead kind invites accidental send and
UTM drift.

### Wire kinds and UTM campaigns stay `listing_*` for now

EmailKind / push kind values for the live letters stay
`listing_closed_didnt_win` and `listing_ended_watched`. `campaignForKind` maps
them to matching `utm_campaign` values `listing_closed_didnt_win` and
`listing_ended_watched` (same slug as the wire kind). Send-log types stay
`closed_didnt_win` and `ended_watched`. Preview templates in `apps/emails` may
still tag `lot_*`; aligning UTM to the capability table's `lot_*` names is a
follow-on.

**Rejected — rename EmailKind to `lot_*`.** That would fork push and mail
vocabularies.

**Deferred — map UTM to `lot_*` while keeping wire `listing_*`.** Spec and
previews name `lot_*`; this delivery keeps one slug in production mail first.

### Runtime copy matches the preview letters

Subjects, headings, and bodies for the two kinds follow the `apps/emails`
close previews (lot wording, Ended-only bans, Manage alerts). Amounts and
times still follow `money-amounts` and `dates-and-times`.

## Database Schema

Owning service: grade10 auction (`auction` schema).

| Table | Change | Role |
| --- | --- | --- |
| `bidder_watches` | add nullable `closed_notified_at timestamptz(3)` | Idempotent stamp for watcher close-outcome mail |
| `bidder_watches` | partial index on `(listing_id, created_at)` where `closed_notified_at IS NULL AND email_alerts` | Claim due watches without a full scan |
| `bids` | reuse existing `lost_at_close_notified_at` | Idempotent stamp for did-not-win |
| `mail_logs` | type check includes `closed_didnt_win` and `ended_watched` (keep legacy `lost_at_close`); **omit** `ended` | Operator send log; no body column |

If an earlier migration already allowed `ended`, a follow-on migration drops it
from the check once no rows use it. Authoritative facts stay on listing / bid /
watch rows. Sold for vs Ended-only is derived at render from whether the
listing has a winner, not a second stamp.

```
listings 1──* bidder_watches (closed_notified_at)
listings 1──* bids (lost_at_close_notified_at, state)
listings 1──* mail_logs (type, sent_to, sent_at)
```

## Service Interfaces

### `fanoutCloseOutcomeLetters` → schedule bulk jobs

- **Input:** db, email port, clock, mail dispatcher, optional limit
  (default 500).
- **Reads:** claim due watches (alerts on, account master on, listing closed,
  no bid for that user, stamp null).
- **Writes:** claim lease fields on the watch rows; enqueue one
  `BulkMailJob` per ≤50 recipients (`list: "closeOutcomeReminders"`).
- **Success:** count of recipients scheduled.
- **Faults:** per-listing schedule failure logs and stops further chunks for
  that listing; other listings continue.

### `consumeCloseOutcomeJob` → send and stamp

- **Input:** claimed `BulkMailJob` for `closeOutcomeReminders`.
- **Reads:** reload watchers + listing + primary image; kind is always
  `listing_ended_watched` (Sold for vs Ended-only from `hasWinner`).
- **Writes:** `email.sendBatch` when listing still `closed` and addresses
  exist; `mail_logs` rows; `closed_notified_at` on success or drop; park via
  `parkNotifyFailure` after bounded attempts on send faults.
- **Idempotency:** stamp prevents re-claim; consumer may no-op when the claim
  set is empty after reload.

### Bid priority path (existing `sendDueNotifications`)

- **Input / ownership:** unchanged claim of due bid notification rows.
- **Mapping:** `live: false` + states `outbid` | `lost` | `lost_hold` →
  `listing_closed_didnt_win`; stamp `lost_at_close_notified_at`.
- **Atomicity:** send + log + stamp follow the same consumer rules as other
  bid receipts; close under the listing lock does not send these letters.

### Mutation order at close time

1. `closeOne` under listing lock: bid states, winner order enqueue, push
   reset — no close-outcome mail send.
2. Later sweep passes: bid priority claims did-not-win; watcher fanout claims
   watches. Either lane may run first; stamps keep each audience single-send.

## Risks / Trade-offs

- **[Risk] Watcher fanout on a popular lot exceeds one cron budget.** → Cap
  claims per pass (`CLOSE_OUTCOME_FANOUT_LIMIT`); remaining rows stay due for
  the next pass via null stamps.
- **[Risk] A collector both watches and bids and receives two letters.** →
  Watcher claim excludes any bid row for that listing; bidder stamp is on the
  bid path only.
- **[Risk] A leftover `listing_ended` / `ended` path ships after retirement.** →
  Delete the kind from contracts, render, campaign tags, admin labels, and the
  mail-log check; pin SC-40 with a test that no-bids fanout never selects that
  campaign.
- **[Risk] UTM / preview campaign strings drift from wire kinds.** → Keep wire
  and UTM on the same `listing_*` slug for now; pin render tests on
  `utm_campaign=listing_*`. A later change can map to `lot_*` without renaming
  EmailKind.

## Migration Plan

1. Land (or keep) the migration that adds `closed_notified_at`, its partial
   index, and mail-log types `closed_didnt_win` / `ended_watched`.
2. If `ended` was already allowed, follow with a migration that removes it from
   the type check after confirming zero rows.
3. Ship vocabulary, fanout, render copy, UTM map, and admin labels together so
   a stamped send always has a log type and a label.
4. Rollback: stop scheduling `closeOutcomeReminders` and remove the bid-list
   `live: false` did-not-win entries; stamps and columns may remain.

## Open Questions

None that change the approach. Hold-release copy on the non-winner letter and
address-reminder cadence stay with Product on the PRD / order capability and
are out of this change.
