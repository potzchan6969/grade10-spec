## 1. Product record

- [ ] 1.1 Update Winner Order, order-status and post-sale PRD pages with the closed address window, operator reopen/record paths and expired-invoice settlement boundary (`auction-status-SC-30`, `grade10-admin-auction-post-sale-SC-85`, `winner-order-SC-146`).

## 2. Data and contracts

- [ ] 2.1 Add the persisted address deadline, reopen count and reasoned audit event to the auction order schema.
- [ ] 2.2 Add deadline/refusal/reopen fields to the admin and winner contracts.

## 3. Backend

- [ ] 3.1 Enforce receipt-time address writes, account-book independence and operator-only reopen (`winner-order-SC-144`–`SC-151`).
- [ ] 3.2 Retire the deadline at invoice send and settle expired invoices only through the operator path (`grade10-admin-auction-post-sale-SC-85`–`SC-89`).

## 4. Frontend

- [ ] 4.1 Hide Confirm and address change after the deadline, then restore them after an operator reopen.
- [ ] 4.2 Add the operator reopen and record-address controls with reasoned audit display.

## 5. Verification

- [ ] 5.1 Run the address-window, concurrency-boundary, invoice-settlement and focused admin/site E2E checks.
