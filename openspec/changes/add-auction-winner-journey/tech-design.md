# Technical design

## Context

The auction service currently models winner capture as a payment settlement tied to a listing. The winner journey needs a durable order and invoice history instead: a lot closes once, the winner receives a payable invoice, payment uses a fresh charge after the winning hold is released, and fulfilment continues through dispatch and delivery. The same record must support buyer reads, operator decisions, reminders, suspension, and audit.

The auction service owns auction orders, invoices, bids, payment holds, fulfilment, and auction-specific suspension. The platform auth service owns the account-wide shipping address book because the same verified account can use it across storefronts and products. There is no auction-to-auth database join: address reads and writes use the authenticated `AuthServiceBinding`, while the auction order stores an immutable delivery snapshot. The application repo updates its `external/grade10-spec` pin only after this change is merged to the spec store's main branch.

## Goals / Non-Goals

### Goals

- **Order identity** — Create exactly one order for the winning bid on a closed lot and keep the winner snapshot immutable
- **Invoice log** — Keep every issued invoice revision, payment attempt, failure, amendment, reissue, settlement, cancellation, and refund log entry
- **Payment safety** — Release all auction holds at close and charge the invoice independently with idempotent retries
- **Address truth** — Read the platform address book, allow multiple saved addresses and one default, require explicit confirmation, reprice shipping-sensitive amendments, and lock the dispatch snapshot
- **Derived status** — Derive buyer and operator status from invoice, fulfilment, suspension, and auction state instead of storing a second mutable order status
- **Operator control** — Separate read, payment, and shipment grants and make post-sale actions auditable and idempotent
- **Reliable side effects** — Use state rows, attempt counters, and `next_attempt_at` for reminders, suspensions, hold release, and notifications

### Non-Goals

- **Payment processing** — Stripe, wire, and payment-provider execution remain behind existing provider ports
- **Shipping fulfilment** — Carrier selection and live tracking integration are not redesigned; the change stores the provider result and exposes a stable tracker contract
- **Address-book ownership** — Auction and store do not become the source of truth for saved addresses; the platform auth service owns the account-wide address book
- **Shared UI package work** — The winner page and admin composition use existing primitives; no new brand-neutral `@grade10/ui` export is required
- **Runner-up sales** — A cancelled lot returns to available and does not create a runner-up offer

## Decisions

### One auction order, many invoice revisions

The order is the stable identity for a listing/winner pair. A current-invoice pointer makes reads cheap, while immutable invoice revisions preserve the amount and deadline the buyer saw. Reissue creates a new revision and supersedes the old one; it does not mutate historical money or address data. A saved address is reusable account data; the order's delivery address is always a snapshot.

### Platform address book and order snapshots

The auth service stores a reusable address book keyed by `userId`, with multiple named addresses and exactly one optional default. The default is the initial prefill for a new auction order; a buyer may select another saved address or create one from the order flow. Address-book management is account-wide, not storefront-specific. The auth service exposes the address book through an authenticated binding; auction and store never read its database directly.

At issue, the auction worker claims closed-winner work, resolves the account's default address through `AuthServiceBinding`, and calls an idempotent order-issue operation with the selected address snapshot. A buyer-facing request authenticates the session, reads or mutates the same account-wide address book through auth, and calls auction with the pinned `(storefront, userId)` scope. The order keeps the selected address snapshot and the source `addressBookEntryId` when one exists; later address-book edits never rewrite an invoice or dispatch record.

### Fresh charge after hold release

At close, the winning and losing holds transition to release work. The order invoice is payable only after its address and amount are confirmed. A payment attempt uses the invoice revision as its idempotency scope and records provider references and failures in the invoice log. The old one-row winner-capture path becomes a legacy adapter during migration; new orders do not capture the winning hold.

### Locks and atomic boundaries

- **Lot close** — Lock the listing row, verify the close transition, create the order and first invoice, release all holds, retract standing maxima where required, and append events in one database transaction
- **Order mutation** — Lock the order row and current invoice before address amendment, payment intent creation, reissue, manual settlement, or cancellation; append the event in the same transaction as the state change
- **Bidder suspension** — Lock the bidder suspension row and each affected open listing in a deterministic listing-id order; retract standing maxima and append bid events atomically per transaction boundary
- **External providers** — Never hold a database lock across Stripe, rate, or carrier calls. Record pending work first, call the provider with an idempotency key, then lock and record the result; retries are safe when the provider is unavailable

### Status derivation

The API derives the buyer-facing and admin-facing status from the authoritative state rows. An order cannot be both `Paid` and `Pending Payment`; a dispatched order always carries the dispatch address snapshot; a suspended bidder may still read and pay an existing order but cannot bid. Status labels are contract values, not database text copied into multiple tables.

## Database Schema

The auction schema remains the persistence boundary. Amounts use integer minor units and an explicit currency. Addresses and delivery proof are snapshots, not references to mutable profile data.

```text
auth_users 1──* shipping_addresses
    │
    └──(selected address snapshot)── auction_orders 1──* auction_invoices 1──* auction_invoice_log
                                      │ 1──1 fulfilments 1──* fulfilment_log
                                      └──* auction_order_notification_log
    ├──* bids ──* payment_holds
    └──* close_work / release_work state rows

(storefront, user_id) 1──1 bidder_suspensions 1──* suspension_log
```

### Core tables

| Table | Important fields and invariants |
| --- | --- |
| `shipping_addresses` in auth | Multiple named addresses per `user_id`; normalized recipient and address fields; one optional default enforced per account; create/update/archive/set-default operations are account-scoped and reusable across storefronts |
| `auction_orders` | One row per closed listing/winning bid; unique `listing_id`; immutable winner snapshot (`storefront`, `user_id`, email/name); selected `address_book_entry_id` when applicable; `current_invoice_id`; payment deadline; confirmed and dispatch address snapshots; no mutable `status` column |
| `auction_invoices` | One row per issue/reissue; `order_id`, `supersedes_invoice_id`; minor-unit components for hammer, premium, shipping, insurance, tax, and final total; currency; estimated flag; deadline; `pending`, `paid`, `cancelled`, or `refunded`; provider references; unique revision/idempotency key |
| `auction_invoice_log` | Append-only invoice, payment-attempt, failure, amendment, settlement, cancellation, refund, and address log entries; event type, actor, reason, amount/address snapshot, provider reference, and unique idempotency key |
| `fulfilments` | One current row per order/listing; `unfulfilled`, `fulfilled`, or cancelled state; tracking number; dispatch address snapshot; delivery timestamp and proof reference |
| `fulfilment_log` | Append-only dispatch, delivery, proof, and address-at-dispatch log entries; proof objects refer to private storage or provider references rather than public URLs |
| `bidder_suspensions` | Unique `(storefront, user_id)` active record with cause order, deadline, reason, lifted-by and timestamps |
| `bidder_suspension_log` | Append-only suspension log preserving expiry, retraction, and reinstatement records |
| `auction_order_notification_work` | Mutable retry state keyed by order, invoice revision, notification type, and schedule; attempt count, last error, and `next_attempt_at` |
| `auction_order_notification_log` | Append-only send log keyed by notification work and delivery attempt; provider response, timestamp, and idempotency key |

Existing `bids` and `payment_holds` remain authoritative for the auction close. Bids gain an explicit retracted-by-suspension outcome and bid log entry. Holds retain provider intent references and move through release work; they are not reused as invoice payment records. Existing settlement rows remain readable as legacy data until active legacy work is drained. Append-only persistence uses `log` in the table name; `event` remains the term for a domain trigger or provider callback.

## Service Interfaces

All operations carry `storefront` and an authenticated or worker-derived identity. Responses use stable contract objects and refusal codes; they do not expose provider or database errors directly.

| Operation | Fixed input/output and refusal codes |
| --- | --- |
| `listShippingAddresses` | Auth input `{ userId }`; output `{ addresses: [{ id, label, recipient, address, isDefault }] }`; refuses `FORBIDDEN` or `ACCOUNT_NOT_FOUND` |
| `saveShippingAddress` / `updateShippingAddress` / `archiveShippingAddress` / `setDefaultShippingAddress` | Auth input carries `{ userId, addressId?, label, recipient, address, makeDefault, at }`; output the account address book with exactly one optional default; refuses `FORBIDDEN`, `ADDRESS_NOT_FOUND`, `DUPLICATE_ADDRESS`, or `LAST_DEFAULT_REQUIRED` |
| `claimClosedWinnerOrders` | Input `{ storefront, limit, at }`; output `{ items: [{ listingId, winningBidId, userId, email, closedAt }], cursor }`; claim state prevents duplicate enrichment; refuses `UNAVAILABLE` with retryable worker state |
| `issueWinnerOrder` | Input `{ storefront, listingId, winningBidId, userId, email, name, addressBookEntryId?, shippingAddress?, at }`; output `{ orderId, invoiceId, paymentDeadline, finalAmount, currency, estimated, selectedAddress }`; refuses `ALREADY_ISSUED`, `WINNER_MISMATCH`, or `LISTING_NOT_CLOSED` |
| `readWinnerOrder` | Input `{ storefront, userId, orderId }`; output order, current invoice, invoice log, fulfilment log, and suspension-safe actions; refuses `NOT_FOUND` or `FORBIDDEN` |
| `amendAddress` | Input `{ storefront, userId, orderId, addressBookEntryId?, address?, saveToAddressBook?, at }`; output `{ orderId, invoiceId, previousTotal, newTotal, delta, deadline, selectedAddress }`; refuses `PAYMENT_LOCKED`, `DEADLINE_ELAPSED`, or `RATE_UNAVAILABLE` |
| `payInvoice` | Input `{ storefront, userId, orderId, invoiceId, paymentMethodRef, idempotencyKey, at }`; output `{ paymentId, invoiceId, status: "paid" }`; refuses `ADDRESS_UNCONFIRMED`, `INVOICE_EXPIRED`, `PAYMENT_DECLINED`, `ALREADY_PAID`, or `PAYMENT_PENDING` |
| `reissueInvoice` | Admin input `{ orderId, reason, at, actor }`; output new invoice revision and deadline; refuses `ORDER_NOT_PAYABLE`, `ADDRESS_UNCONFIRMED`, or `ALREADY_PROCESSING` |
| `manuallySettleOrder` | Admin input `{ orderId, address, paymentReference, reason, at, actor }`; output paid invoice and fulfilment-ready order; refuses `ADDRESS_UNCONFIRMED`, `ORDER_EXPIRED`, or `ALREADY_PAID` |
| `cancelUnpaidOrder` | Admin input `{ orderId, reason, at, actor }`; output cancelled order and returned listing; refuses `ORDER_PAID`, `ORDER_DISPATCHED`, or `ALREADY_CANCELLED` |
| `recordDispatch` / `recordDelivery` | Shipment-admin input with tracking, dispatch address, carrier result, proof reference, actor, and idempotency key; output fulfilment log entry and derived order status; refuses `NOT_PAID`, `ALREADY_DISPATCHED`, `PROOF_INVALID`, or `ALREADY_DELIVERED` |
| `reinstateBidder` | Admin input `{ storefront, userId, reason, at, actor }`; output active bidder standing and audit event; refuses `NOT_SUSPENDED` or `FORBIDDEN` |

The scheduled service interfaces claim due release, suspension, reminder, and notification work using the same state-row pattern. Each claim has a lease or attempt timestamp, and each completion records the provider result before the row can be claimed again.

## Contracts

The application repo adds codecs for the platform address book, order, invoice, fulfilment, invoice-log, suspension, notification-log, and refusal unions. Address-book procedures use the authenticated user identity from `AuthServiceBinding`; storefront-to-auction procedures use the same pinned identity. Admin procedures expose separate payment and shipment grants. Contract tests cover one representative successful response and every refusal code used by the user-facing flows.

## Risks / Trade-offs

- **Provider outage** — Stripe, shipping-rate, or carrier calls can leave work pending; explicit pending states and retry metadata keep the invoice payable or safely retryable
- **Address-book race** — A saved address can change between issue and payment; the selected address id and issue snapshot are retained, amendment reads the latest saved value only when explicitly selected, and dispatch stores a final immutable snapshot
- **Close/suspension race** — A deadline sweep can overlap a bid; listing locks and deterministic lock order make the close or retraction win atomically
- **Legacy capture rows** — Existing captured settlements cannot be silently interpreted as new invoices; a legacy read adapter and guarded cutover preserve history until migration is complete
- **Sensitive evidence** — Addresses and proof documents are private account data; API scope checks and private object references prevent cross-buyer access
- **Derived labels** — Multiple clients can drift if they invent status rules; the auction contract owns derivation and clients render the returned label and permitted actions

## Migration Plan

1. **Expand** — Add the auth address-book tables and service procedures, then add order, invoice, log, suspension, notification-log, and fulfilment-log tables plus indexes and constraints. Keep existing settlement and hold tables readable.
2. **Backfill safely** — Convert only legacy records whose captured or fulfilled outcome can be mapped with complete evidence; mark the source settlement id and leave ambiguous records on the legacy adapter for operator review.
3. **Dual-read** — Serve new order records first and fall back to legacy settlement records only for pre-cutover listings. Compare derived status and totals in backend tests and operational logs.
4. **Cut over** — Gate new lot-close work on invoice creation, release the winning hold instead of capturing it, and enable the store enrichment worker and post-sale actions after contract validation.
5. **Drain and contract** — Drain or manually resolve legacy active settlement work, then remove the legacy write path in a later migration. Do not drop legacy history in this change.

The migration is additive and reversible at each application step. Destructive cleanup of legacy tables is explicitly out of scope.
