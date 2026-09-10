---
title: Order Notifications
spec: grade10-site/auction/notifications-order
order: 14
---

Order Notifications are the transactional letters that begin when an auction lot closes with a winner. They identify the lot, use the winner's registered email address, and stop or retry according to the order's current facts.

- **Winning** — the lot became a winner order and an invoice is ready
- 🚧 **Winning** — the auction-won letter asks for a delivery address and names no amount
- 🚧 **Invoice sent** — names the amount and the payment deadline, which starts at send
- **Payment** — the address, payment, decline, receipt, and deadline events that change what the winner should do
- **Reminder** — the day-3 and day-6 prompts, followed by the deadline notice on day 7; reminders stop when the invoice is paid, cancelled, or otherwise no longer payable
- **Settlement** — manual settlement and cancellation messages that explain the operator's recorded outcome
- **Delivery** — dispatch, tracking, and delivery confirmation messages that identify the lot
- **Send log** — one idempotent record per order, message kind, and event key, with retry state but no message body exposed to operators

Before-and-during auction mail remains on [Notifications](/p/grade10-site/auction/notifications). A winner follows the order and its letters from [Winner Order](/p/grade10-site/auction/winner-order).

:::detail{title="Product decisions" for="pm"}
Post-close mail has a different job from bidding mail: it tells one winner what to pay, what changed on their order, and what happened to delivery. It stays a separate capability so a reminder cannot be mistaken for a bidding alert and so each order can own its own idempotency key.
:::
