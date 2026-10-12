Tasks 1.1, 2.x, 3.1, 3.2, 4.1, 4.2 and 5.1 are ticked because they were built
ahead of acceptance; they are re-verified against the accepted contract.

## 1. Product record (owner: @htonyl)

- [x] 1.1 Update post-sale and Winner Order PRD pages with categories, consequence preview, late-payment flag handling and the reason-free winner notice (`grade10-admin-auction-post-sale-SC-230`, `winner-order-SC-143`).

## 2. Contracts and data (owner: @htonyl)

- [x] 2.1 Add cancellation category/note, consequence snapshot, lot link and Paid-after-cancel facts.
- [x] 2.2 Add the terminal transition and late-payment audit events to the auction-order schema.

## 3. Backend (owner: @htonyl)

- [x] 3.1 Require category and note, show consequences, return the lot to stock and keep cancellation terminal (`grade10-admin-auction-post-sale-SC-230`, `SC-231`).
- [x] 3.2 Record late payments, expose the queue flag and allow an `auction:payment` operator to clear only the flag, with a reason and an optional return reference (`SC-232`).
- [ ] 3.3 Allow cancellation after money that counts toward nothing, and refuse it after money that counts toward the balance (`SC-233`, `SC-236`).
- [ ] 3.4 Record a required reason and optional return reference when clearing the late-payment flag (`SC-235`).

## 4. Frontend (owner: @htonyl)

- [x] 4.1 Add category filtering and consequence preview to the operator flow.
- [x] 4.2 Render the cancelled Winner Order notice with date, lot, winning bid and Contact Us only (`winner-order-SC-143`).
- [ ] 4.3 Link the cancelled order to its returned lot and show the cleared-flag state (`grade10-admin-auction-post-sale-SC-234`, `SC-235`).
- [ ] 4.4 Add the `order cancelled` reason to the Winner Order ready email: subject, `Cancelled` status label, invoice id in the body when one exists (`winner-order-SC-275`).

## 5. Verification (owner: @htonyl)

- [x] 5.1 Run terminal-transition, role, late-payment and focused admin/site E2E checks.
- [ ] 5.2 Run the cancellation-race, returned-lot link and optional-reference cases added for this refinement.
- [ ] 5.3 Run the `order cancelled` Contact Us case (`winner-order-US16-TC14-1`).

## 6. Dependencies (owner: @htonyl)

- [ ] 6.1 Publication handoff to @htonyl: published main `518318bf48cb091f067171968b81175b38fc3f88` carries the accepted late-payment and flag-cleared taxonomy, and renewed `complete-auction-post-sale` task 11.1 acceptance (fingerprint `2617613598e0d5cb306203567db6665450e377d783ca07f7634b1dcec87ce7c5`) resolves ownership and publication order without waiting for dependencies to archive. Publish the matching `Invoice log history` External reference row and complete final verification. Close when both records agree on main and verification passes. Other cancellation work can continue.
- [ ] 6.2 Decision handoff to @htonyl: @htonyl selected 1A on 2026-10-12, existing English admin copy (Q16). Publish the matching Post-sale Copy instruction in this change's UI design, following the application's `docs/conventions/code-layout.md`, "The admin panels are outside the localization scope". Close when the decision and authoritative design are published on main. Independent cancellation behavior and Winner Order localization stay unchanged.
