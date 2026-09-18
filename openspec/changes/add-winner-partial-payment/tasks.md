## 1. Product record (owner: @htonyl)

- [ ] 1.1 Update the auction payment, post-sale, order-status, account-record and Winner Order PRD pages with partial collection and the tolerance boundary (`grade10-admin-auction-post-sale-SC-140`, `auction-status-SC-49`, `winner-order-SC-156`).

## 2. Contracts and data (owner: @htonyl)

- [ ] 2.1 Add the payment-history, balance, receipt and tolerance types to the auction contracts.
- [ ] 2.2 Add the append-only payment table, indexes and receipt-number migration without changing the invoice quote.

## 3. Backend

- [ ] 3.1 Implement idempotent operator payment recording, balance validation and the close-or-keep decision (`grade10-admin-auction-post-sale-SC-140`–`SC-142`).
- [ ] 3.2 Derive Partially Paid and remove Pay, reissue, cancellation and the payment deadline after the first payment (`auction-status-SC-49`, `SC-50`).

## 4. Frontend

- [ ] 4.1 Render the operator payment history, remaining balance and tolerance prompt.
- [ ] 4.2 Render the locked Partially Paid Winner Order and My Auctions row with every receipt (`winner-order-SC-156`, `grade10-site-auction-account-record-SC-62`).

## 5. Verification

- [ ] 5.1 Run the domain cases, contract tests, migration checks and the focused admin/site E2E journeys.
