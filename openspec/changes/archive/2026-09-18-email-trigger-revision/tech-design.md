## Context

Progress mail already fans out opens / opened / closes-in-24h / extended from
`sweeps/progressFanout.ts`. The one-hour closing reminder is a separate list:
`endingSoonReminders` in `sweeps/pass.ts` → `remindEndingSoon` →
`claimEndingSoonWatches` with `ENDING_SOON_LEAD_MS` (one hour). The kill switch
`ACTIVE_MAIL_KINDS.listing.listing_ending_soon` is already `false`, so the
sweep still claims and stamps but does not send — the application must stop
the job, not only the render
([`docs/architecture/auction.md`](../../../../../docs/architecture/auction.md)
Sweeps).

Winner order mail already enqueues on send, reissue, cancel, and delivery
(`winnerInvoice.ts`, `admin/postSale.ts`, `admin/fulfillment.ts`) through
`enqueueOrderNotification` and the priority consumer. First send uses
`invoice_sent`; both reissue paths still enqueue `invoice_reissued`. Delivered
and cancelled kinds exist and enqueue, but
`ACTIVE_MAIL_KINDS.order.delivered` / `order_cancelled` are `false`, and
`orderEmailCopy` / React Email wiring do not yet carry the settled facts and
CTA order. Templates
`apps/emails/emails/auction/order/order-delivered.tsx` and
`order-cancelled.tsx` (and `payment-reminder.tsx` with `urgency: "first"`)
already match the product copy in grade10-spec.

Behaviour:
[`notifications`](specs/grade10-site/auction/notifications/spec.md),
[`notifications-order`](specs/grade10-site/auction/notifications-order/spec.md).

## Goals / Non-Goals

**Goals:**

- Stop the one-hour ending-soon fanout so no collector gets a T−1h closing
  reminder (scheduled or moved close); leave 24h and extended progress mail
  unchanged.
- On invoice reissue, enqueue the same first payment letter as invoice send
  (`invoice_sent` → payment-reminder `first`), never `invoice_reissued`.
- Turn on delivered and cancelled order mail with address / time / CTA order
  from the settled templates.

**Non-Goals:**

- Folding invoice-sent into the first payment reminder for the initial send —
  `add-winner-setup-overdue-mail`.
- Rewriting the durable Post-close letters table while
  `add-winner-bank-transfer` still MODIFIES it — this change's ADDED rules sit
  beside that fold.
- Paid-order cancel / refund wording (proposal open question).
- Dropping the `invoice_reissued` / `listing_ending_soon` enum values from the
  schema in this change — stop enqueue and sweep use; retire the vocabulary
  later if nothing else reads them.

## Decisions

### Remove `endingSoonReminders` from `WORK_LISTS`

Delete the work-list entry (and stop calling `remindEndingSoon`) so a pass
neither claims watches nor schedules bulk jobs. Keep
`listing_ending_soon: false` as belt-and-braces if any stray path remains.
Update the pass-order comment and the architecture Sweeps rows that still
describe ending-soon as live mail.

**Rejected — leave the sweep and rely on the kill switch.** Decision Q2: the
application is sending (or claiming) today; retirement means stop the job.
Claiming without send still burns budget and parks watches.

**Rejected — narrow the claim to zero recipients / empty lead.** A dead list
that still runs is a footgun; removal matches “retired”.

### Reissue enqueues `invoice_sent` for the new invoice id

Both reissue call sites (`winnerInvoice` re-quote and expired reissue, and the
admin `postSale.reissueInvoice` wrapper) enqueue
`type: "invoice_sent"` with the **new** `invoiceId`, the same shape as first
send. Idempotency key
`order-mail:<orderId>:<invoiceId>:invoice_sent` already makes a repeated
confirmation of the same reissue a no-op (`SC-40`, `SC-43`). Day-3 / day-6
scheduling stays on `schedulePaymentReminders` after park of the superseded
invoice (durable Reminder cadence; Q14).

Wire `invoice_sent` (and any shared payment-reminder render path) through
`payment-reminder.tsx` with `urgency: "first"` so reissue and first send share
one letter. Do not enqueue `invoice_reissued`; leave the kind inactive.

**Rejected — keep enqueueing `invoice_reissued` and only change the React
template.** The outbox type would still be a separate “reissued” letter in the
send log and kill switch; the requirement is no separate letter.

**Rejected — invent a new `payment_reminder_first` enum value.** First send
already uses `invoice_sent`; reusing it is the same letter at send.

### Delivered and cancelled: activate kinds and pass template props

Flip `delivered` and `order_cancelled` to active. Extend the order email port
/ render path so delivered carries delivery address + delivered time (View
order primary, Contact Us secondary) and cancelled carries cancelled-at (Contact
Us primary, View order secondary), matching the existing React Email props.
Contact Us uses the storefront Contact Us URL already on the letter shell
(Q16). Missing facts are not a second letter shape (Q12).

**Rejected — invent new outbox kinds.** The rows already enqueue; content and
activation were missing.

## Risks / Trade-offs

- **Admin `postSale.reissueInvoice` today enqueues without `invoiceId`.** Both
  paths must pass the new invoice id or reissue mail shares the
  `…:none:invoice_sent` key with a prior send and silently drops.
- **`invoice_reissued` remains in the DB enum.** Inactive and unused after this
  change; a later cleanup can drop it once no work rows reference it.
- **Archive order.** Fold after `add-winner-bank-transfer` so Post-close table
  edits do not silently revert (named on the proposal Archive section).
