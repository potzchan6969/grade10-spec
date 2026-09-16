---
title: Order Notifications
spec: grade10-site/auction/notifications-order
order: 14
---

Order Notifications are the transactional letters that begin when an auction lot closes with a winner. They identify the lot, use the winner's registered email address, and stop or retry according to the order's current facts. Unless a letter names another primary action (for example track-and-trace), every CTA opens that lot's [Winner Order](/p/grade10-site/auction/winner-order); signed out, Grade10's sign-in runs first. On every order letter, the lot image and lot title also open Winner Order. Letters never attach an invoice or receipt PDF — those live on Winner Order.

- 🚧 **Winning** — the auction-won letter identifies the lot, asks the winner to confirm a delivery address, and names the address deadline (`Confirm by …`); it names no amount because no invoice exists yet
- ❓ **Address reminder** — whether Grade10 re-asks for a delivery address while the order stays Awaiting Address, and at which hours after close; draft letters also name the address deadline
- 🚧 **Invoice sent** — after the address is confirmed and an operator sends the invoice: invoice total, payment deadline (`Pay by …`), CTA to Winner Order to check the invoice and pay; no PDF attachment
- **Payment reminders** — day 3, day 6, and a final notice on day 7, measured from the current invoice
- 🚧 **Reminders on hold** — no payment reminder or final notice goes out while payment proof is being checked; the sequence resumes if the proof is not accepted
- **Invoice expired** — says what remains owed and how to resolve it
- 🚧 **Proof not accepted** — the reason the operator gave, and the time left to pay; no letter goes out when proof is uploaded
- **Invoice reissued** — confirms the new invoice and deadline
- **Payment** — the address, payment, decline, receipt, and deadline events that change what the winner should do
- 🚧 **Payment received** — confirms payment with amount, payment date, and method (card brand and masked number, or bank transfer with bank and masked account); CTA to Winner Order for the receipt; no PDF attachment
- 🚧 **Shipped** — carrier, tracking number, shipped time, and delivery address; primary CTA is the carrier track-and-trace link; secondary CTA opens Winner Order (CTAs sit on one row)
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
| No PDF attachments | Decided | Invoice-sent and payment-received never attach a PDF; invoice and receipt PDFs open from Winner Order. | Product (@tangconst) |
| Address deadline in mail | Decided | Auction-won and address-reminder letters name `Confirm by …` (absolute datetime, winner's zone). | Product (@tangconst) |
| Invoice-sent content | Decided | Names invoice total and `Pay by …`; asks the winner to pay on Winner Order; does not name a payment method. | Product (@tangconst) |
| Payment-received content | Decided | Confirms payment with amount, payment date, and method (card brand + masked number, or bank + masked account); CTA to Winner Order for the receipt. | Product (@tangconst) |
| Shipped content | Decided | Delivery address first; tracking as carrier + number with shipped time; primary CTA is track-and-trace; secondary CTA is Winner Order, on one row. | Product (@tangconst) |
:::
