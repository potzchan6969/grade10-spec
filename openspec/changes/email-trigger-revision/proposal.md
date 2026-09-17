**Author:** @jeffffej0909 - 2026-09-17

## Why

A watcher gets two closing warnings an hour apart from the end: Bidding closes in 24 hours, and a one-hour reminder that no spec owns and no template in `apps/emails` renders. Three order letters are also listed with no content: invoice reissued, delivered and order cancelled. This change retires the one-hour reminder and settles what those three letters carry. The metric is the auction unsubscribe-by-mute rate on watched lots, which should not rise, and the share of watchers who return in the last 24 hours, which should hold.

## What Changes

- **BREAKING** **No one-hour reminder** — Grade10 stops sending the one-hour closing reminder to watchers. The last warning is Bidding closes in 24 hours, then Extended bidding has started if the lot extends. This reverses the recorded decision that the reminder stays.
- **Reissue sends the payment reminder** — a reissued invoice sends the same letter as a newly sent one, with the new total and `Pay by …`. There is no separate reissued letter.
- **Delivered letter** — names the delivery address and delivered time; View order first, Contact Us second.
- **Order cancelled letter** — names when the order was cancelled; no reason and nothing about payment; Contact Us first, View order second.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

### Modified Capabilities

- `grade10-site/auction/notifications`: the one-hour closing reminder to watchers is retired.
- `grade10-site/auction/notifications-order`: the reissued letter is the payment reminder; the delivered and cancelled letters get their content.

## Impact

- **grade10 (application):** stop the one-hour watcher reminder job; send the payment reminder on reissue; render the delivered and cancelled letters.
- **apps/emails:** `order/order-delivered.tsx` and `order/order-cancelled.tsx` added; `payment-reminder.tsx` serves reissue. No one-hour template exists to remove.
- **Overlap:** `add-winner-setup-overdue-mail` already folds invoice-sent into the first payment reminder; this change agrees and does not repeat that delta.

## Open Questions

- **Cancelling a paid order** — whether an operator can cancel a paid order, and whether the letter then names a refund. Product (@jeffffej0909) settles it; until then the letter says nothing about payment.

## References

- [Bidding · My Auctions, Watchlist and Notifications](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions-watchlist-and-notifications)
- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
