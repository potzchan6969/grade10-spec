# Auction Email Kinds Timeline

When each auction mail kind fires, who gets it, whether it sends today,
which `pnpm email:dev` template under `apps/emails/emails/` it maps to, and
the staging preview at `https://email.grade10-stg.com/preview/…` (same path
as the template).

**Status**

| Value | Meaning |
| --- | --- |
| Sends | Kill switch on — provider send runs |
| Gated off | Enqueued or claimable, kill switch off |
| Retired | No longer scheduled or enqueued |
| Draft | Preview only — not a send kind yet |

Cron is every five minutes; a scheduled letter goes out on the next pass after
`scheduledAt`.

## Listing Life

| Kind | When it fires | Audience | Status | email:dev template | Preview | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `listing_opens_in_24h` | T−24h before `opens_at` | Watchers | Sends | `auction/progress/bidding-opens-in-24h` | [preview](https://email.grade10-stg.com/preview/auction/progress/bidding-opens-in-24h) | |
| `listing_opened` | At `opens_at` | Watchers | Sends | `auction/progress/bidding-has-opened` | [preview](https://email.grade10-stg.com/preview/auction/progress/bidding-has-opened) | |
| `listing_new_bid` | Each accepted bid (coalesced fanout) | Enrolled bidders (not the bidder) | Sends | `auction/activity/new-bid` | [preview](https://email.grade10-stg.com/preview/auction/activity/new-bid) | |
| `listing_outbid` | When your bid is displaced | Outbid bidder | Sends | `auction/activity/outbid` | [preview](https://email.grade10-stg.com/preview/auction/activity/outbid) | `outbid-without-image` is a preview variant of the same letter |
| `listing_closes_in_24h` | T−24h before `scheduled_ends_at` | Watchers + bidders | Sends | `auction/progress/bidding-closes-in-24h` | [preview](https://email.grade10-stg.com/preview/auction/progress/bidding-closes-in-24h) | Anchored to `scheduled_ends_at`; extensions do not re-arm |
| `listing_extended` | When extended bidding starts / restarts | Watchers + bidders | Sends | `auction/progress/extended-bidding` | [preview](https://email.grade10-stg.com/preview/auction/progress/extended-bidding) | |
| `listing_ending_soon` | Was T−1h before `ends_at` | Watchers | Retired | — | — | Work list removed; kill switch false |
| `listing_closed_didnt_win` | At close with a winner who is not this collector | Losing bidders | Sends | `auction/close/lot-closed-didnt-win` | [preview](https://email.grade10-stg.com/preview/auction/close/lot-closed-didnt-win) | Campaign `lot_closed_didnt_win` |
| `listing_watched_sold` | At close with a winner | Watch-only (did not bid; not the winner) | Sends | `auction/close/lot-watched-sold` | [preview](https://email.grade10-stg.com/preview/auction/close/lot-watched-sold) | Campaign `lot_watched_sold`; **Sold for**. A watcher who also bid gets `listing_closed_didnt_win` only |
| `listing_watched_ended` | At close with no bids | Watch-only | Sends | `auction/close/lot-watched-ended` | [preview](https://email.grade10-stg.com/preview/auction/close/lot-watched-ended) | Campaign `lot_watched_ended`; Ended-only — never unsold / no sale / Highest bid. Replaces former single `lot_ended_watched` campaign for this path |

## Winner Order

| Kind | When it fires | Audience | Status | email:dev template | Preview | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `auction_won` | At close (order issued) | Winner | Sends | `auction/order/auction-won` | [preview](https://email.grade10-stg.com/preview/auction/order/auction-won) | Asks for order setup; formerly also known as `listing_winner` |
| `setup_reminder` | Close + 24h | Winner (setup incomplete) | Sends | `auction/order/setup-reminder` | [preview](https://email.grade10-stg.com/preview/auction/order/setup-reminder) | Formerly address reminder; parks once setup is confirmed. No second (72h) reminder |
| `setup_overdue` | Close + 48h (setup deadline) | Winner (setup incomplete) | Sends | `auction/order/setup-overdue` | [preview](https://email.grade10-stg.com/preview/auction/order/setup-overdue) | Self-service setup closed; Contact Us primary |
| `invoice_sent` | Invoice send or reissue | Winner | Sends | `auction/order/payment-reminder` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-reminder) | Letter is `payment-reminder` (urgency `first`); reissue uses the new invoice id |
| `payment_reminder_day_3` | Invoice sent + 3 days | Winner (unpaid) | Sends | `auction/order/payment-reminder-day-three` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-reminder-day-three) | |
| `payment_reminder_day_6` | Invoice sent + 6 days | Winner (unpaid) | Sends | `auction/order/payment-reminder-day-six` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-reminder-day-six) | |
| `payment_reminder_final` | Payment deadline − 24h | Winner (unpaid) | Sends | `auction/order/payment-reminder-final` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-reminder-final) | Replaces former day-7-at-deadline schedule |
| `payment_reminder_day_7` | — | — | Retired | — | — | No longer scheduled; kept in enum for old rows |
| `invoice_expired` | When invoice expires | Winner | Sends | `auction/order/payment-overdue` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-overdue) | Letter is `payment-overdue` |
| `invoice_reissued` | — | — | Retired | — | — | Reissue sends `payment-reminder` (same letter as invoice send) |
| `payment_received` | When payment clears | Winner | Sends | `auction/order/payment-received` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-received) | |
| `payment_received_partial` | — | — | Draft | `auction/order/payment-received-partial` | [preview](https://email.grade10-stg.com/preview/auction/order/payment-received-partial) | Preview only; not a send kind yet (`add-winner-partial-payment` non-goals a new letter) |
| `order_shipped` | When fulfilment dispatches | Winner | Sends | `auction/order/order-shipped` | [preview](https://email.grade10-stg.com/preview/auction/order/order-shipped) | Mail kind / campaign `shipped`; carrier track primary |
| `order_delivered` | When delivery is recorded | Winner | Sends | `auction/order/order-delivered` | [preview](https://email.grade10-stg.com/preview/auction/order/order-delivered) | Mail kind / campaign `delivered`; address + delivered time; View order → Contact Us |
| `order_cancelled` | When order is cancelled | Winner | Sends | `auction/order/order-cancelled` | [preview](https://email.grade10-stg.com/preview/auction/order/order-cancelled) | Cancelled-at only; Contact Us → View order |

## Setup Window

From lot close / order issued, while setup is incomplete:

1. **`auction_won`** → `auction/order/auction-won`
2. **`setup_reminder`** → `auction/order/setup-reminder` (+24h)
3. **`setup_overdue`** → `auction/order/setup-overdue` (+48h deadline)

Setup mail parks once setup is confirmed. There is no second setup reminder.

## Payment Window

From invoice send (`invoice_sent` → `payment-reminder`), the unpaid path is:

1. **`invoice_sent`** → `auction/order/payment-reminder` (first)
2. **`payment_reminder_day_3`** → `auction/order/payment-reminder-day-three`
3. **`payment_reminder_day_6`** → `auction/order/payment-reminder-day-six`
4. **`payment_reminder_final`** → `auction/order/payment-reminder-final` (payment deadline − 24h)
5. **`invoice_expired`** → `auction/order/payment-overdue` — or **`payment_received`** if they pay

`payment_reminder_day_7` and `invoice_reissued` are retired. Reissue sends
`payment-reminder` again for the new invoice.

## Fulfilment and cancel

After payment (or when an operator cancels):

1. **`order_shipped`** → `auction/order/order-shipped`
2. **`order_delivered`** → `auction/order/order-delivered`
3. **`order_cancelled`** → `auction/order/order-cancelled` (cancel may fire without the shipped path)
