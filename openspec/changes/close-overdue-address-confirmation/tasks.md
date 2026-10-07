## 1. Product record (owner: @htonyl)

- [x] 1.1 Update Winner Order, order-status and post-sale PRD pages with the
  persisted address deadline, derived `address_window_open`, 48-hour
  Setup Overdue status for an unconfirmed elapsed address window, and the payment Overdue timer that starts
  when the invoice is sent and visible to the winner
  (`auction-status-SC-30`, `winner-order-SC-146`).
  - Verification: `pnpm check:manual` in the registered `grade10-spec` store.

## 2. Data and contracts (owner: @htonyl)

- [x] 2.1 Add the persisted `address_deadline_at`, reopen count and reasoned
  address-reopen/address-recorded audit facts to
  `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts`.
  - Verification: schema/type checks and migration validation.
- [x] 2.2 Add deadline/refusal/reopen fields to the admin and winner contracts,
  keeping `address_window_open` derived rather than persisted.
  - Verification: contract checks cover the persisted timestamp and derived
    condition.

## 3. Backend (owner: @htonyl)

- [x] 3.1 In `services/orderStatus.ts`, `rpc/AuctionService.ts` and
  `services/auctions/auctionOrders.ts`, derive `address_window_open` from the stored
  timestamp and current facts; enforce receipt-time winner writes and account-
  book independence. Operator actions do not write status directly.
  - Covers: `auction-status-SC-30`–`SC-35`, `winner-order-SC-144`–`SC-146` and `SC-148`–`SC-151`.
  - Verification: address-boundary and derived-status checks.
- [x] 3.2 Let the persisted deadline serve the operator reopen and
  phone-recorded setup owned by `complete-auction-post-sale` (its `reopenSetup`
  and `recordSetup`): a reopen resets it. That change serializes the address
  write, reopen, record and invoice send under the order boundary (its
  `SC-90`). Map the elapsed unconfirmed 48-hour window to Setup
  Overdue through `address_deadline_passed`; reopening restores Awaiting Setup,
  while Preparing Invoice never derives Setup Overdue. Its payment Overdue timer
  starts when the invoice is sent and visible to the winner.
  - Covers: `auction-status-SC-31`–`SC-35`; the operator actions' own scenarios
    are `complete-auction-post-sale`'s.
  - Verification: permission, audit and concurrency-boundary checks.
- [ ] 3.3 Retire the address window at invoice send and keep the existing
  operator-only expired-invoice collection path, including a Partially Paid
  shortfall. Refusing a card payment received at or after the deadline, holding
  the invoice `pending` while a card session received in time is open, and
  writing `expired` when that session fails, times out or is abandoned, are new.
  - Covers: `grade10-admin-auction-post-sale-SC-85` through `SC-88`, `SC-92`
    and `SC-93`.
  - Verification: invoice-send race and settlement checks.

## 4. Frontend (owner: @htonyl)

- [ ] 4.1 Hide Confirm after the derived deadline condition, then restore it
  after an operator reopen. A confirmed address locks on confirm.
  - Verification: focused Winner Order checks for `SC-144`–`SC-146` and
    `SC-148`–`SC-151`.
- [ ] 4.2 Test first, remove any winner control for changing a confirmed
  address that 4.1 built: a failing Winner Order check that no change control
  is offered after confirm, then the removal.
  - Verification: focused Winner Order checks.

## 5. After complete-auction-post-sale archives (owner: @htonyl)

- [ ] 5.1 After `complete-auction-post-sale` archives, MODIFY Order Status's
  "An auction order carries two writable status fields" and "Permitted
  transitions" so `pending` to `expired` at the deadline carries the in-flight
  card payment exception, and the write when that session ends unpaid. Also
  drop "and has no cancellation requested" from the durable `address_window_open`
  line, since no spec defines that state and `complete-auction-post-sale`'s
  record and reopen refusals no longer name it.
  - Verification: `pnpm check:manual` shows no overlap.
- [x] 5.2 Satisfied by `complete-auction-post-sale`'s MODIFIED Winner Order "An unfinished card payment leaves the invoice payable", which already applies its timed-out and abandoned outcomes before the deadline only and points at "The payment deadline is fixed when the invoice is sent"; no follow-up after it archives.
