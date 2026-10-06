## 1. Product record (owner: @htonyl)

- [x] 1.1 Update post-sale and Winner Order PRD pages with categories, consequence preview, late-payment flag handling and the reason-free winner notice (`grade10-admin-auction-post-sale-SC-150`, `winner-order-SC-143`).

## 2. Contracts and data (owner: @htonyl)

- [x] 2.1 Add cancellation category/note, consequence snapshot, lot link and Paid-after-cancel facts.
- [x] 2.2 Add the terminal transition and late-payment audit events to the auction-order schema.

## 3. Backend (owner: @htonyl)

- [x] 3.1 Require category and note, show consequences, return the lot to stock and keep cancellation terminal (`grade10-admin-auction-post-sale-SC-150`, `SC-151`).
- [x] 3.2 Record late payments, expose the queue flag and allow an `auction:payment` operator to clear only the flag, with a reason and an optional return reference (`SC-152`).
- [ ] 3.3 Allow cancellation after money that counts toward nothing, and refuse it after money that counts toward the balance (`SC-153`, `SC-156`).
- [ ] 3.4 Record a required reason and optional return reference when clearing the late-payment flag (`SC-155`).

## 4. Frontend (owner: @htonyl)

- [x] 4.1 Add category filtering and consequence preview to the operator flow.
- [x] 4.2 Render the cancelled Winner Order notice with date, lot, winning bid and Contact Us only (`winner-order-SC-143`).
- [ ] 4.3 Link the cancelled order to its returned lot and show the cleared-flag state (`grade10-admin-auction-post-sale-SC-154`, `SC-155`).

## 5. Verification (owner: @htonyl)

- [x] 5.1 Run terminal-transition, role, late-payment and focused admin/site E2E checks.
- [ ] 5.2 Run the cancellation-race, returned-lot link and optional-reference cases added for this refinement.
