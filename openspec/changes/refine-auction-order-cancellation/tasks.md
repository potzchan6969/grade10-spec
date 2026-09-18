## 1. Product record (owner: @htonyl)

- [ ] 1.1 Update post-sale and Winner Order PRD pages with categories, consequence preview, late-payment flag handling and the reason-free winner notice (`grade10-admin-auction-post-sale-SC-150`, `winner-order-SC-143`).

## 2. Contracts and data (owner: @htonyl)

- [ ] 2.1 Add cancellation category/note, consequence snapshot, lot link and Paid-after-cancel facts.
- [ ] 2.2 Add the terminal transition and late-payment audit events to the auction-order schema.

## 3. Backend (owner: @htonyl)

- [ ] 3.1 Require category and note, show consequences, return the lot to stock and keep cancellation terminal (`grade10-admin-auction-post-sale-SC-150`, `SC-151`).
- [ ] 3.2 Record late payments, expose the queue flag and allow only the flag to be cleared after Finance returns the money (`SC-152`).

## 4. Frontend (owner: @htonyl)

- [ ] 4.1 Add category filtering and consequence preview to the operator flow.
- [ ] 4.2 Render the cancelled Winner Order notice with date, lot, winning bid and Contact Us only (`winner-order-SC-143`).

## 5. Verification

- [ ] 5.1 Run terminal-transition, role, late-payment and focused admin/site E2E checks.
