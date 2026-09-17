# Auction Email Kinds Timeline

When each auction mail kind fires, who gets it, whether it sends today, and
which `pnpm email:dev` template under `apps/emails/emails/` it maps to.

**Status**

| Value | Meaning |
| --- | --- |
| Sends | Kill switch on — provider send runs |
| Gated off | Enqueued or claimable, kill switch off |
| Retired | No longer scheduled or enqueued |

Cron is every five minutes; a scheduled letter goes out on the next pass after
`scheduledAt`.

## Listing Life

| Kind | When it fires | Audience | Status | email:dev template | Notes |
| --- | --- | --- | --- | --- | --- |
| `listing_opens_in_24h` | T−24h before `opens_at` | Watchers | Sends | `auction/progress/bidding-opens-in-24h` | |
| `listing_opened` | At `opens_at` | Watchers | Sends | `auction/progress/bidding-has-opened` | |
| `listing_new_bid` | Each accepted bid (coalesced fanout) | Watchers (not the bidder) | Sends | `auction/activity/new-bid` | |
| `listing_outbid` | When your bid is displaced | Outbid bidder | Sends | `auction/activity/outbid` | |
| `listing_closes_in_24h` | T−24h before `scheduled_ends_at` | Watchers + bidders | Sends | `auction/progress/bidding-closes-in-24h` | Anchored to `scheduled_ends_at`; extensions do not re-arm |
| `listing_extended` | When extended bidding starts / restarts | Watchers + bidders | Sends | `auction/progress/extended-bidding` | |
| `listing_ending_soon` | Was T−1h before `ends_at` | Watchers | Retired | — | Work list removed; kill switch false |
| `listing_closed_didnt_win` | At close | Losing bidders | Sends | `auction/close/lot-closed-didnt-win` | |
| `listing_ended_watched` | At close | Watchers who did not win | Sends | `auction/close/lot-watched-ended` | |
| `listing_winner` | When capture succeeds | Winner | Gated off | — | Settlement receipt; winner hears via `auction_won` / order mail |

## Winner Order

| Kind | When it fires | Audience | Status | email:dev template | Notes |
| --- | --- | --- | --- | --- | --- |
| `auction_won` | At close (order issued) | Winner | Sends | `auction/order/auction-won` | |
| `address_reminder` | Close + 24h | Winner (no address) | Sends | `auction/order/setup-reminder` | |
| `address_reminder_second` | Close + 72h | Winner (no address) | Sends | `auction/order/setup-reminder-second` | |
| `invoice_sent` | Invoice send or reissue | Winner | Sends | `auction/order/payment-reminder` | urgency `first`; reissue uses the new invoice id |
| `payment_reminder_day_3` | Invoice sent + 3 days | Winner (unpaid) | Sends | `auction/order/payment-reminder-day-three` | |
| `payment_reminder_day_6` | Invoice sent + 6 days | Winner (unpaid) | Sends | `auction/order/payment-reminder-day-six` | |
| `payment_reminder_final` | Invoice deadline − 24h | Winner (unpaid) | Sends | `auction/order/payment-reminder-final` | Replaces former day-7-at-deadline schedule |
| `payment_reminder_day_7` | — | — | Retired | — | No longer scheduled; kept in enum for old rows |
| `invoice_expired` | When invoice expires | Winner | Sends | `auction/order/payment-overdue` | |
| `invoice_reissued` | — | — | Retired | — | Reissue enqueues `invoice_sent` instead |
| `payment_received` | When payment clears | Winner | Sends | `auction/order/payment-received` | |
| `shipped` | When fulfillment dispatches | Winner | Sends | `auction/order/order-shipped` | |
| `delivered` | When delivery is recorded | Winner | Sends | `auction/order/order-delivered` | Address + delivered time; View order → Contact Us |
| `order_cancelled` | When order is cancelled | Winner | Sends | `auction/order/order-cancelled` | Cancelled-at only; Contact Us → View order |

## Payment Window

From `invoice_sent`, the unpaid path is:

1. **`invoice_sent`** → `auction/order/payment-reminder` (first)
2. **`payment_reminder_day_3`** → `auction/order/payment-reminder-day-three`
3. **`payment_reminder_day_6`** → `auction/order/payment-reminder-day-six`
4. **`payment_reminder_final`** → `auction/order/payment-reminder-final` (deadline − 24h)
5. **`invoice_expired`** → `auction/order/payment-overdue` — or **`payment_received`** if they pay

`payment_reminder_day_7` is retired. `shipped`, `delivered`, and `order_cancelled`
fire on those fulfilment / cancel events after payment.
