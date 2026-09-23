## 1. Product record (owner: @htonyl)

- [x] 1.1 Update Winner Order, order-status and post-sale PRD pages with the
  persisted address deadline, derived `address_window_open`, 48-hour
  Awaiting Setup-only Overdue mark, and the payment Overdue timer that starts
  when the invoice is sent and visible to the winner
  (`auction-status-SC-30`, `grade10-admin-auction-post-sale-SC-90`–`SC-91`,
  `winner-order-SC-146`).
  - Verification: `pnpm check:manual` in the registered `grade10-spec` store.

## 2. Data and contracts (owner: @htonyl)

- [ ] 2.1 Add the persisted `address_deadline_at`, reopen count and reasoned
  address-reopen/address-recorded audit facts to
  `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts`.
  - Verification: schema/type checks and migration validation.
- [ ] 2.2 Add deadline/refusal/reopen fields to the admin and winner contracts,
  keeping `address_window_open` derived rather than persisted.
  - Verification: contract checks cover the persisted timestamp and derived
    condition.

## 3. Backend (owner: @htonyl)

- [ ] 3.1 In `services/orderStatus.ts`, `rpc/AuctionService.ts` and
  `services/auctionOrders.ts`, derive `address_window_open` from the stored
  timestamp and current facts; enforce receipt-time winner writes and account-
  book independence. Operator actions do not write status directly.
  - Covers: `auction-status-SC-30`–`SC-35` and `winner-order-SC-144`–`SC-151`.
  - Verification: address-boundary and derived-status checks.
- [ ] 3.2 In `services/admin/postSale.ts` plus its repository/router, implement
  operator-only reopen and phone-address recording with named actor, timestamp
  and reason; serialize both against address writes and invoice send. Map the
  48-hour queue mark to Awaiting Setup only; Preparing Invoice has no queue mark,
  and its payment Overdue timer starts when the invoice is sent and visible to
  the winner.
  - Covers: `grade10-admin-auction-post-sale-SC-75`–`SC-84`, `SC-90` and
    `SC-91`.
  - Verification: permission, audit and concurrency-boundary checks.
- [ ] 3.3 Retire the address window at invoice send and preserve the existing
  operator-only expired-invoice settlement path.
  - Covers: `grade10-admin-auction-post-sale-SC-85`–`SC-89`.
  - Verification: invoice-send race and settlement checks.

## 4. Frontend

- [ ] 4.1 Hide Confirm and address change after the derived deadline condition,
  then restore them after an operator reopen.
  - Verification: focused Winner Order checks for `SC-144`–`SC-151`.
- [ ] 4.2 Add the operator reopen and record-address controls with reasoned
  audit display and aligned visible-disabled controls for operators without the
  grant.
  - Verification: focused admin checks for `SC-75`–`SC-84` and `SC-89`.
