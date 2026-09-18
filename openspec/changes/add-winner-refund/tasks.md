## 1. Product record (owner: @htonyl)

- [ ] 1.1 Update the refund, post-sale, Winner Order and roles PRD pages with one bounded external refund and the `auction:refund` grant (`grade10-admin-auction-post-sale-SC-145`, `winner-order-SC-157`, `shared-auth-roles-SC-14`).

## 2. Contracts and data (owner: @htonyl)

- [ ] 2.1 Add refund method, amount, reason, note, reference, proof, audit and stock-choice contracts.
- [ ] 2.2 Add the append-only refund table, one-refund constraint and invoice-log migration.

## 3. Backend

- [ ] 3.1 Implement the permissioned, idempotent refund mutation and cumulative-paid bound (`grade10-admin-auction-post-sale-SC-145`, `SC-146`).
- [ ] 3.2 Derive Refunded as terminal and expose the queue filter and reconciliation record (`SC-147`, `auction-status-SC-51`).

## 4. Frontend

- [ ] 4.1 Add the operator refund form, stock choice, queue filter and detail record.
- [ ] 4.2 Render Refunded Winner Order with retained invoice and receipts and no self-service actions (`winner-order-SC-157`).

## 5. Verification

- [ ] 5.1 Run role-matrix, domain, migration and focused admin/site E2E checks.
