---
title: Order Notifications
spec: grade10-site/auction/notifications-order
order: 14
---

Order Notifications are the transactional letters that begin when an auction lot closes with a winner. They identify the lot, use the winner's registered email address, and stop or retry according to the order's current facts.

- **Winning** — the auction-won letter identifies the lot and asks the winner to confirm a delivery address; it names no amount because no invoice exists yet
- ❓ **Address reminder** — whether Grade10 re-asks for a delivery address while the order stays Awaiting Address, and at which hours after close
- **Invoice sent** — the operator's quote, final amount, and payment deadline
- **Payment reminders** — day 3, day 6, and a final notice on day 7, measured from the current invoice
- **Invoice expired** — says what remains owed and how to resolve it
- **Invoice reissued** — confirms the new invoice and deadline
- **Payment** — the address, payment, decline, receipt, and deadline events that change what the winner should do
- **Payment received** — confirms a card payment or manual settlement
- **Delivery** — dispatch, tracking, and delivery confirmation messages that identify the lot
- **Cancellation** — explains that an operator cancelled the order
- **Send log** — one idempotent record per order, message kind, and event key, with retry state but no message body exposed to operators

Before-and-during auction mail, and close-outcome letters for watchers and
non-winners, remain on [Notifications](/p/grade10-site/auction/notifications).
A winner follows the order and its letters from
[Winner Order](/p/grade10-site/auction/winner-order).

:::detail{title="Product decisions" for="pm"}
Post-close mail has a different job from bidding mail: it tells one winner what to pay, what changed on their order, and what happened to delivery. It stays a separate capability so a reminder cannot be mistaken for a bidding alert and so each order can own its own idempotency key.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Address reminder cadence | ❓ Open | Draft: 24h and 72h after close while Awaiting Address; product confirms count and copy. | Product |
:::
