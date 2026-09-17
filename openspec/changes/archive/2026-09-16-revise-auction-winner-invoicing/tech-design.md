# Technical design

## Context

See [proposal.md](proposal.md) for the product decision. The auction service
currently creates an invoice at lot close, derives expiry from its deadline,
and recalculates shipping when a winner changes their address. Its order,
invoice, invoice-log, notification-work, payment, and post-sale seams already
separate the persistent record from provider calls. This change reverses the
timing: the close creates an order only, a winner confirms an address, and an
operator creates the first invoice.

No auction listing has entered bidding or closed. There are no auction orders,
invoices, settlements, or close-work records to convert.

## Goals / Non-Goals

**Goals:**

- **One state source** — use the absence or status of the current invoice,
  the confirmed address, and fulfilment facts to derive every winner and
  operator state
- **Atomic money changes** — write an immutable invoice revision and invoice
  log entry in the same transaction as every send, re-quote, expiry, payment,
  manual settlement, cancellation, or refund
- **Private evidence** — retain manual-settlement proof as immutable private
  objects that only an authorised operator can retrieve

**Non-Goals:**

- **Data migration** — do not backfill, convert, dual-read, or retain a
  compatibility path for auction records; none exist in a started or closed
  auction
- **Shipping calculation** — remove the shipping-rate calculator from this
  flow rather than replacing it with another estimate
- **Provider redesign** — retain the existing card charge and notification
  ports, changing only when they are called and the data they record

## Decisions

### An unsent order has no invoice row

`auction_orders.current_invoice_id` remains nullable. A close creates the
order with a confirmed-address snapshot only when the winner supplies one;
the absence of a current invoice is the authoritative `not_issued` invoice
status. This avoids an invoice with invented amounts or a deadline before the
operator quotes it. The shared derivation receives `not_issued` when the
pointer is null, then selects Awaiting Address or Preparing Invoice from
`delivery_address_confirmed_at`.

**Alternative considered** — create a placeholder invoice at close. Rejected:
an invoice must contain a quoted amount and sent timestamp, and a placeholder
would need nullable money and deadline facts that are not an invoice.

### Operator actions create invoice revisions

Send inserts revision 1 with the confirmed address, Shipping & Handling, an
optional positive Insurance amount, final amount, UTC `sent_at`, and a deadline
seven calendar days later. An omitted Insurance amount is stored as null; an
explicit zero is rejected. A
re-quote locks the order and current invoice, supersedes that invoice, inserts
the next revision, and records whether the operator kept or reset the
deadline. Reissue remains the expired-invoice action; it does not use the
re-quote path. Each mutation appends its corresponding invoice-log record in
the same transaction and enqueues its letter only after the persistent write
succeeds.

**Alternative considered** — overwrite the current invoice. Rejected: the
receipt and operator trail need the amount, deadline, address, reason, and
actor the winner saw at each revision.

### Expiry is a written transition

The invoice-expiry sweep claims only current invoices still `pending` whose
deadline has passed, locks the invoice, sets it to `expired`, appends the
expiry log, and enqueues the expiry letter. Reads do not infer expiry from the
clock. Card payment and manual settlement accept both `pending` and `expired`;
only a paid, cancelled, or refunded invoice refuses another settlement.

**Alternative considered** — continue deriving expiry at read time. Rejected:
the queue, notifications, audit trail, and subsequent reissue need one
durable transition time and status.

### Proof files are immutable private objects

The upload entrypoint validates 1 to 5 PDF, JPEG, or PNG files of at most
10 MB before the settlement command. It writes their private object keys and
metadata on a settlement-proof relation keyed to the manual-settlement log
entry. The winner-order read model excludes that relation; the admin detail
returns short-lived authorised reads only to operators already allowed to open
the order.

**Alternative considered** — keep proof URLs in the invoice log JSON. Rejected:
URLs expire and cannot enforce the required immutable one-to-many evidence
relationship.

### No data conversion at deployment

The deployment adds the schema, checks, indexes, and private-object storage
binding required by the new paths. It neither reads nor rewrites legacy
auction state. The close worker and all order reads move together because no
listing can have used the old close model.

**Alternative considered** — dual-read or backfill the current invoice-at-close
model. Rejected: it adds states, operational risk, and test cases for records
that cannot exist.

## Database Schema

The auction database remains authoritative for order and invoice state. The
account address book remains the source for saved addresses; an order holds a
snapshot, never a mutable reference as its delivery truth.

```text
listings 1──1 auction_orders ──0..1 current auction_invoices
                         │             │
                         │             └──* auction_invoice_log ──* settlement_proof_files
                         └──1 fulfilments
```

| Table | Change | Authority and invariants |
| --- | --- | --- |
| `auction_orders` | Keep nullable `current_invoice_id`, address snapshot, confirmation time, and lock time | No pointer means `not_issued`; `delivery_address_confirmed_at` decides the pre-invoice state; one row per listing remains unique |
| `auction_invoices` | Add `expired` status; require quoted Shipping & Handling on a sent revision and allow optional positive Insurance; retain `sent_at`, UTC deadline, revision, supersession, and provider fields | The current revision is the payable invoice; its amount and address are immutable after insert; absent Insurance is null |
| `auction_invoice_log` | Add `sent`, `expired`, and `re_quoted` log types; record deadline choice, settlement method details, and the payment-card brand/last four where applicable | Append-only, one idempotency key per order action; it is the audit trail, not a read-model cache |
| `auction_manual_settlement_proofs` | Add `id text` primary key, `invoice_log_sequence bigint not null` foreign key, `object_key text not null`, `content_type text not null`, `byte_size integer not null`, and `created_at timestamptz not null default now()` | One to five immutable private objects for one manual-settlement log; no update or delete route |
| `auction_order_notification_work` | Add the `invoice_sent` notification type and allow `invoice_id` only after send | Work is deduplicated by order, invoice revision, and letter type |

The schema migration adds checks for the expanded invoice and log enums,
non-negative quote components, a sent invoice's required quote fields, and
the proof-file content and size bounds. Index the current-invoice expiry sweep
on `(status, payment_deadline)` and proof reads on `invoice_log_sequence`.

## Service Interfaces

Each service locks the order and current invoice inside its transaction. The
entrypoint authenticates the winner or checks `auction:payment`; services own
the state transition; repositories own SQL and object metadata. The private
object upload completes before the settlement transaction, and rejected or
uncommitted objects enter the existing orphan-object sweep.

| Processor | Input | Success | Refusal |
| --- | --- | --- | --- |
| `closeWinnerOrder` | `{ listingId, winningBidId, at }` | `{ orderId, invoiceStatus: "not_issued" }` | `ALREADY_ISSUED`, `LISTING_NOT_CLOSED` |
| `confirmWinnerAddress` | `{ orderId, userId, address, addressBookEntryId?, at }` | `{ orderId, addressConfirmedAt }` | `NOT_FOUND`, `FORBIDDEN`, `ADDRESS_LOCKED` |
| `sendInvoice` | `{ orderId, shippingAmount, insuranceAmount?, actor, idempotencyKey, at }` | `{ invoiceId, finalAmount, deadline }` | `ADDRESS_UNCONFIRMED`, `QUOTE_INCOMPLETE`, `FORBIDDEN`, `ALREADY_SENT` |
| `requoteInvoice` | `{ orderId, address, shippingAmount, insuranceAmount?, deadlineChoice, reason, actor, idempotencyKey, at }` | `{ invoiceId, previousFinalAmount, finalAmount, deadline }` | `NOT_PAYABLE`, `REASON_REQUIRED`, `FORBIDDEN` |
| `recordManualSettlement` | `{ orderId, method, description?, externalReference?, proofIds, reason, actor, idempotencyKey, at }` | `{ invoiceId, status: "paid" }` | `NOT_PAYABLE`, `PROOF_INVALID`, `REFERENCE_REQUIRED`, `DESCRIPTION_REQUIRED`, `FORBIDDEN` |

For a send, the transaction locks the order, verifies the confirmed unlocked
address, inserts the invoice and `sent` log, links it as current, locks the
address, and inserts notification work for the invoice-sent letter and day 3,
day 6, and day 7 reminders. Re-quote and reissue park reminder work for the
superseded invoice before scheduling the same sequence for the new current
invoice. The day 7 work is scheduled immediately before the expiry deadline;
the expiry transition then writes `expired` and enqueues the expiry letter.
For a manual settlement, it locks the
order and invoice, verifies each uploaded proof belongs to the command and is
valid, writes `paid`, inserts the settlement log and proof rows, then inserts
payment-received notification work. Provider card calls remain outside the
database lock: reserve the idempotency key, charge, then lock and record the
provider result.

## Risks / Trade-offs

- **Concurrent operator actions** → Lock the order and current invoice,
  condition updates by status, and key every mutation by an idempotency key
- **Private upload left unused** → Associate proof objects only in the
  settlement transaction and let the existing orphan-object sweep remove
  abandoned uploads
- **Expiry races with payment** → The sweep and payment completion both lock
  the current invoice and condition their update on its prior status
- **Quote data changes after send** → Store immutable invoice revisions and
  prohibit winner-side address changes after the order lock is written
- **Provider card data missing** → Require card brand and last four from the
  successful provider response before recording a card-paid receipt

## Migration Plan

1. **Deploy schema** — Apply the additive auction schema migration, generated
   snapshot, private-storage binding, and constraints.
2. **Deploy application** — Release the contract, service, worker, admin, and
   winner flows together so lot close creates an order without an invoice.
3. **Verify** — Exercise a fresh closed-listing fixture through address
   confirmation, quote, send, card payment, manual settlement, expiry, and
   reissue.
4. **Rollback** — Roll back the worker and application release before any
   auction starts. The additive schema remains harmless; no data rollback,
   backfill, compatibility adapter, or legacy conversion is required.
