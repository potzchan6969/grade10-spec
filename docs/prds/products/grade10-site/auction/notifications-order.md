---
title: Order Notifications
spec: grade10-site/auction/notifications-order
order: 34
---

Order Notifications are the transactional letters that begin when a lot closes
with a winner. Each identifies the lot, goes to the winner's registered email
address, and stops or retries according to the order's current facts; a
winner of three lots is told about three orders separately.

## Winning and Order Setup

- 🚧 **Winning** — the auction-won letter identifies the lot, asks the winner
  to complete order setup as bullets (delivery address, payment method,
  billing address), and names the setup deadline (`Confirm by …`); it names
  no amount because no invoice exists yet
- 🚧 **Setup reminder** — at **24 hours** and **72 hours** after lot close
  while order setup is incomplete; same setup bullets and `Confirm by …`; CTA
  Complete order setup
- 🚧 **Setup overdue** — when the setup deadline passes: self-service setup is
  closed; Contact Us for manual review; may face penalties or extra charges
  (what those are is ❓); order may be cancelled and the lot re-listed after
  review — no automatic cancel. Copy speaks of order setup generically, not
  the three fields

## Paying

- 🚧 **Payment reminder** — one letter kind for the unpaid invoice: first when
  an operator sends the invoice (invoice total, `Pay by …`, payment window
  starts; no PDF), then on **day 3** and **day 6** after that send while the
  invoice stays `pending`, measured from invoice send (the same clock as the
  7-day payment window). CTA to Winner Order to pay. There is no separate
  invoice-sent letter
- 🚧 **Final notice** — last payable reminder **24 hours before** the payment
  deadline, while the invoice is still `pending` and self-service Pay is still
  offered — not at the expiry instant
- 🚧 **Reminders on hold** — no payment reminder or final notice goes out
  while payment proof is being checked; the sequence resumes if the proof is
  not accepted
- 🚧 **Payment overdue** — when the payment deadline passes and the invoice is
  `expired`: replaces the invoice-expired letter; names what remains owed;
  self-service Pay is closed; Contact Us for manual review; may face penalties
  or extra charges; order may be cancelled and the lot re-listed after review
- 🚧 **Proof not accepted** — the reason the operator gave, and the new
  payment deadline (`Pay by …`); no letter goes out when proof is uploaded
- **Invoice reissued** — confirms the new invoice and deadline
- **Payment** — the address, payment, decline, receipt, and deadline events
  that change what the winner should do
- 🚧 **Payment received** — confirms payment with amount paid, `Received
  {date}`, and payment method (card: brand and masked number; bank transfer:
  `Bank Transfer` only — no bank, account number, or account name); says the
  order is being processed; quiet `Receipt ID: …` line; attaches the receipt
  PDF (same ID in the file name); CTA to Winner Order for the receipt. Proof
  files and the internal audit number never appear

## After Payment

- **Shipped** — carrier, tracking number, shipped time, and delivery address;
  primary CTA is the carrier track-and-trace link; secondary CTA opens Winner
  Order (CTAs sit on one row)
- **Delivered** — delivery confirmation that identifies the lot
- **Cancellation** — explains that an operator cancelled the order

## Delivery

- **CTA** — unless a letter names another primary action, every CTA opens
  that lot's [Winner Order](/p/grade10-site/auction/winner-order); signed
  out, Grade10's sign-in runs first. On every order letter, the lot image and
  the lot title also open Winner Order
- **PDF** — only the payment-received letter attaches a PDF, the receipt; the
  invoice PDF lives on Winner Order
- **Send log** — one idempotent record per order, message kind, and event key,
  with retry state but no message body exposed to operators
- **Never the record** — every fact a letter carries is visible on the order
- **Before the close** — mail before and during bidding, and the
  close-outcome letters for watchers and non-winners, are [Bidding
  Notifications](/p/grade10-site/auction/notifications)'s

:::detail{title="Product decisions" for="pm"}
Post-close mail has a different job from bidding mail: it tells one winner what to pay, what changed on their order, and what happened to delivery. It stays a separate capability so a reminder cannot be mistaken for a bidding alert and so each order can own its own idempotency key.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Setup reminder cadence | 🚧 In flight | **24h** and **72h** after lot close while order setup is incomplete. Renames address reminder. | Product (@tangconst) |
| Setup in mail | 🚧 In flight | Auction-won and setup-reminder name delivery address, payment method, and billing address as bullets. Setup-overdue stays generic (“order setup”). | Product (@tangconst) |
| Setup overdue | 🚧 In flight | Self-service setup closed; Contact Us; manual review; may cancel and re-list after review; no automatic cancel. Penalties or extra charges named in copy while durable rules for a setup miss stay ❓. | Product (@tangconst) |
| Payment overdue | 🚧 In flight | Replaces invoice-expired as the post-deadline letter: amount owed, Contact Us, manual review, penalties or extra charges, may cancel and re-list after review. | Product (@tangconst) |
| Overdue penalties | ❓ Open | What “penalties or extra charges” means after setup miss vs payment miss (suspension already covers payment expiry). | Product (@tangconst) |
| Letter CTA | Decided | Default CTA opens that lot's Winner Order; sign-in first when signed out. Lot image and lot title always open Winner Order. Overdue letters: primary = Contact Us; secondary = View order. Shipped letter: primary = carrier track-and-trace; secondary = Winner Order. | Product (@tangconst) |
| PDF attachments | 🚧 In flight | Only payment-received attaches a PDF — the receipt, named by its receipt ID. Payment-reminder, final-notice, and overdue letters attach no PDF; the invoice opens from Winner Order. | Product (@jeffffej0909, @tangconst) |
| Formal tax receipt | ❓ Open | Whether a receipt must carry Grade10's company details and tax ID. | Finance |
| Address deadline in mail | Decided | Auction-won and setup-reminder letters name `Confirm by …` (absolute datetime, winner's zone). | Product (@tangconst) |
| Payment-reminder cadence | 🚧 In flight | Schedule from invoice send: first letter at send (retires invoice-sent as its own kind), then day 3 and day 6 while `pending`. Not “N days before due.” | Product (@tangconst) |
| Final notice timing | 🚧 In flight | 24 hours before the payment deadline, while Pay is still offered. Replaces “day 7 immediately before expiry.” Payment overdue covers the end. | Product (@tangconst) |
| Payment-reminder content | 🚧 In flight | Invoice total and `Pay by …`; CTA View invoice and pay; does not name a payment method. Copy escalates on later letters. | Product (@tangconst) |
| Payment-received content | 🚧 In flight | Amount paid, `Received {date}`, payment method (card brand + masked digits, or `Bank Transfer` only), order being processed, quiet Receipt ID line, receipt PDF attached, CTA to Winner Order. | Product (@tangconst) |
| Shipped content | Decided | Delivery address first; tracking as carrier + number with shipped time; primary CTA is track-and-trace; secondary CTA is Winner Order, on one row. | Product (@tangconst) |
:::
