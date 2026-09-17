---
title: Order Notifications
spec: grade10-site/auction/notifications-order
order: 14
---

Order Notifications are the transactional letters that begin when an auction lot closes with a winner. They identify the lot, use the winner's registered email address, and stop or retry according to the order's current facts. Unless a letter names another primary action (for example track-and-trace), every CTA opens that lot's [Winner Order](/p/grade10-site/auction/winner-order); signed out, Grade10's sign-in runs first. On every order letter, the lot image and lot title also open Winner Order. Only the payment-received letter attaches a PDF, the receipt; the invoice PDF lives on Winner Order.

- **Winning** — the auction-won letter identifies the lot, asks the winner to confirm a delivery address, and names the address deadline (`Confirm by …`); it names no amount because no invoice exists yet
- ❓ **Address reminder** — whether Grade10 re-asks for a delivery address while the order stays Awaiting Address, and at which hours after close; draft letters also name the address deadline
- 🚧 **Payment reminder** — one letter kind for the unpaid invoice: first when an operator sends the invoice (invoice total, `Pay by …`, payment window starts; no PDF), then on **day 3** and **day 6** after that send while the invoice stays `pending`, measured from invoice send (the same clock as the 7-day payment window). CTA to Winner Order to pay. There is no separate invoice-sent letter
- 🚧 **Final notice** — last payable reminder **24 hours before** the payment deadline, while the invoice is still `pending` and self-service Pay is still offered — not at the expiry instant. The invoice-expired letter covers what happens after the deadline
- 🚧 **Reminders on hold** — no payment reminder or final notice goes out while payment proof is being checked; the sequence resumes if the proof is not accepted
- **Invoice expired** — says what remains owed and how to resolve it
- 🚧 **Proof not accepted** — the reason the operator gave, and the new payment deadline (`Pay by …`); no letter goes out when proof is uploaded
- **Invoice reissued** — confirms the new invoice and deadline
- **Payment** — the address, payment, decline, receipt, and deadline events that change what the winner should do
- 🚧 **Payment received** — confirms payment with amount paid, `Received {date}`, and payment method (card: brand and masked number; bank transfer: `Bank Transfer` only — no bank, account number, or account name); says the order is being processed; quiet `Receipt ID: …` line; attaches the receipt PDF (same ID in the file name); CTA to Winner Order for the receipt. Proof files and the internal audit number never appear
- **Shipped** — carrier, tracking number, shipped time, and delivery address; primary CTA is the carrier track-and-trace link; secondary CTA opens Winner Order (CTAs sit on one row)
- **Delivered** — delivery confirmation that identifies the lot
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
| Letter CTA | Decided | Default CTA opens that lot's Winner Order; sign-in first when signed out. Lot image and lot title always open Winner Order. Shipped letter: primary = carrier track-and-trace; secondary = Winner Order. | Product (@tangconst) |
| PDF attachments | 🚧 In flight | Only payment-received attaches a PDF — the receipt, named by its receipt ID. Payment-reminder and final-notice letters attach no PDF; the invoice opens from Winner Order. | Product (@jeffffej0909, @tangconst) |
| Formal tax receipt | ❓ Open | Whether a receipt must carry Grade10's company details and tax ID. | Finance |
| Address deadline in mail | Decided | Auction-won and address-reminder letters name `Confirm by …` (absolute datetime, winner's zone). | Product (@tangconst) |
| Payment-reminder cadence | 🚧 In flight | Schedule from invoice send: first letter at send (retires invoice-sent as its own kind), then day 3 and day 6 while `pending`. Not “N days before due.” | Product (@tangconst) |
| Final notice timing | 🚧 In flight | 24 hours before the payment deadline, while Pay is still offered. Replaces “day 7 immediately before expiry,” which can arrive after self-service Pay has ended. Invoice-expired covers the end. | Product (@tangconst) |
| Payment-reminder content | 🚧 In flight | Invoice total and `Pay by …`; CTA View invoice and pay; does not name a payment method. Copy escalates on later letters. | Product (@tangconst) |
| Payment-received content | 🚧 In flight | Amount paid, `Received {date}`, payment method (card brand + masked digits, or `Bank Transfer` only), order being processed, quiet Receipt ID line, receipt PDF attached, CTA to Winner Order. | Product (@tangconst) |
| Shipped content | Decided | Delivery address first; tracking as carrier + number with shipped time; primary CTA is track-and-trace; secondary CTA is Winner Order, on one row. | Product (@tangconst) |
:::
