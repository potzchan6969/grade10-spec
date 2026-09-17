---
title: Order Notifications
spec: grade10-site/auction/notifications-order
order: 34
---

Order Notifications are the transactional letters that begin when a lot closes
with a winner. Each identifies the lot, goes to the winner's registered email
address, and stops or retries according to the order's current facts; a
winner of three lots is told about three orders separately.

## Values

| Rule | Value |
| --- | --- |
| Setup reminders | 🚧 **24 hours** and **72 hours** after the lot closes, while order setup is incomplete |
| Payment reminders | **Day 3** and **day 6** of the invoice's running deadline |
| Final notice | 🚧 **24 hours** before the payment deadline, while Pay is still offered |
| Attachments | Only the payment-received letter attaches a PDF, the receipt |

## Letters

| Letter | When | What it carries |
| --- | --- | --- |
| Auction won | The lot closes with a winner | Asks for a delivery address and names `Confirm by …`; no amount, because no invoice exists yet |
| 🚧 Setup reminder | 24 and 72 hours after close, while setup is incomplete | The setup steps and `Confirm by …`; Complete order setup |
| 🚧 Setup overdue | The setup deadline passes | Self-service setup is closed; Contact Us for manual review; penalties or extra charges may follow; the order may be cancelled and the lot re-listed after review, never automatically |
| Payment reminder | At send, then day 3 and day 6 while the invoice is pending | The invoice total and `Pay by …`; View invoice and pay; no PDF |
| 🚧 Final notice | 24 hours before the deadline, while the invoice is pending | The last payable reminder |
| 🚧 Payment overdue | The deadline passes and the invoice expires | What remains owed; self-service Pay is closed; Contact Us for manual review; penalties or extra charges may follow; the order may be cancelled and the lot re-listed after review |
| 🚧 Invoice reissued | An operator reissues the invoice | The payment reminder sent at invoice send, naming the new total and `Pay by …`; no letter of its own |
| 🚧 Proof not accepted | An operator returns the proof | The operator's reason for the winner, never the internal one, and `Pay by …` as a date and time; one letter per return, and none when proof is uploaded |
| Payment received | Card payment confirmed, proof confirmed, or a manual settlement | Amount paid, `Received {date}`, the method (card brand and masked number, or Bank Transfer only), a quiet Receipt ID line, and the receipt PDF; never a proof file or the internal audit number |
| Shipped | Dispatch with a tracking number | The delivery address, then the carrier and tracking number with the shipped time; primary CTA the carrier's tracking, secondary Winner Order, on one row |
| 🚧 Delivered | The carrier confirms delivery | The delivery address and the delivered time; primary CTA View order, secondary Contact Us |
| 🚧 Order cancelled | An operator cancels the order | That the order was cancelled and when; no reason and no word on payment; primary CTA Contact Us, secondary View order |

- 🚧 **Invoice sent** — the letter at send is the first payment reminder;
  there is no separate invoice-sent letter
- 🚧 **Setup steps in mail** — auction won and setup reminder list delivery
  address, payment method and billing address as bullets; setup overdue
  speaks of order setup generically
- **Reminders stop at payment** — every outstanding reminder is cancelled the
  moment payment is received; a winner who pays on day 2 gets no day 3 letter
- **A reissue restarts the series** — reminders for the replaced invoice
  stop, and the new invoice gets its own
- 🚧 **Reminders on hold** — none go out while proof is checked; if the proof
  is not accepted the sequence resumes on the moved clock, skipping nothing
  and repeating nothing
- **Final notice never late** — queued before the invoice expires, so it
  never goes to an already expired invoice
- ❓ **Reminder clock across changes** — the bank-transfer change's delta
  keeps a separate invoice-sent letter, a final notice immediately before
  expiry and an invoice-expired letter, while the setup-overdue-mail change
  folds the first into the payment reminder, moves the notice to 24 hours
  before and replaces the last with payment overdue; Product reconciles the
  two before their deltas land

## Delivery

- **CTA** — unless a letter names another primary action, every CTA opens
  that lot's [Winner Order](/p/grade10-site/auction/winner-order); signed
  out, Grade10's sign-in runs first. On every order letter, the lot image and
  the lot title also open Winner Order
- **Send log** — one record per order, message kind and event, so a repeated
  event sends nothing twice; retry state but no message body is exposed to
  operators
- **Never the record** — every fact a letter carries is visible on the order,
  the receipt PDF included, in the letter's language
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
| Payment-reminder cadence | 🚧 In flight | Schedule from invoice send: first letter at send (retires invoice-sent as its own kind), then day 3 and day 6 while pending, on the running deadline. Not “N days before due.” | Product (@tangconst) |
| Final notice timing | 🚧 In flight | 24 hours before the payment deadline, while Pay is still offered. Replaces “day 7 immediately before expiry.” Payment overdue covers the end. | Product (@tangconst) |
| Payment-reminder content | 🚧 In flight | Invoice total and `Pay by …`; CTA View invoice and pay; does not name a payment method. Copy escalates on later letters. | Product (@tangconst) |
| Payment-received content | 🚧 In flight | Amount paid, `Received {date}`, payment method (card brand + masked digits, or `Bank Transfer` only), order being processed, quiet Receipt ID line, receipt PDF attached, CTA to Winner Order. | Product (@tangconst) |
| Shipped content | Decided | Delivery address first; tracking as carrier + number with shipped time; primary CTA is track-and-trace; secondary CTA is Winner Order, on one row. | Product (@tangconst) |
| Reissue letter | 🚧 In flight | A reissue sends the payment reminder sent at invoice send, for the new invoice. It fires on the same kind of event, so a separate reissued letter is dropped. | Product (@jeffffej0909) |
| Delivered content | 🚧 In flight | Delivery address and delivered time; View order first, Contact Us second. | Product (@jeffffej0909) |
| Cancelled content | 🚧 In flight | Cancelled time only. The operator's reason stays internal. Contact Us first, View order second. | Product (@jeffffej0909) |
| Cancelling a paid order | ❓ Open | Whether an operator can cancel an order already paid, and whether the cancelled letter then names a refund. Until settled the letter says nothing about payment. | Product (@jeffffej0909) |
| Reminder clock across changes | ❓ Open | `add-winner-bank-transfer` and `add-winner-setup-overdue-mail` disagree on the invoice-sent letter, the final notice's time and the letter at expiry; one delta supersedes the other before either lands. | Product (@tangconst, @jeffffej0909) |
:::
