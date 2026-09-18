## 1. Product record (owner: @htonyl)

- [ ] 1.1 Update post-sale, order-status, Winner Order, account-record and shared auction-record PRD pages with Setup Overdue, Payment Overdue and Status-column ownership (`auction-status-SC-52`, `winner-order-SC-158`, `shared-ui-auction-record-SC-16`).

## 2. Contracts (owner: @htonyl)

- [ ] 2.1 Add the two overdue outcomes to the closed auction order-status contract and preserve the existing action-context fields.

## 3. Backend (owner: @htonyl)

- [ ] 3.1 Derive Setup Overdue and Payment Overdue from the address deadline and expired invoice (`auction-status-SC-52`, `SC-53`).
- [ ] 3.2 Add queue filters and preserve winner, lot, amount and contact/resolution context (`grade10-admin-auction-post-sale-SC-148`, `SC-149`).

## 4. Frontend (owner: @htonyl)

- [ ] 4.1 Render overdue alerts with Contact Us and no Confirm or Pay (`winner-order-SC-158`, `SC-159`).
- [ ] 4.2 Rename the My Auctions mixed column to Status and render both overdue rows (`grade10-site-auction-account-record-SC-63`, `shared-ui-auction-record-SC-16`).

## 5. Verification (owner: @htonyl)

- [ ] 5.1 Run status projection, queue-filter, shared-component and focused site/admin E2E checks.
