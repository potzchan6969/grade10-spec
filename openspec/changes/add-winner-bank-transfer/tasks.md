# Tasks

## 1. Design system

- [ ] bank-design-01 Export `FileDropzone` from the design-system barrel and
  cover wrong type, size, count, removal and conversion stories.
- [ ] bank-design-02 Run design-system typecheck and Storybook tests.

## 2. Payment contract and persistence

- [ ] bank-contract-01 Add bank-transfer method, Payment Verifying status and
  winner-proof schemas without weakening operator proof limits.
- [ ] bank-persistence-02 Add migrations/repositories for proof metadata,
  invoice-log entries, paused deadline and immutable invoice history.
- [ ] bank-payment-03 Implement idempotent upload, atomic Confirm/Return and
  content-signature validation with focused red-first service tests.

## 3. Winner order

- [ ] bank-winner-01 Implement payment-method selection, proof upload limits,
  HEIC conversion, copy controls and Payment Verifying UI.
- [ ] bank-winner-02 Implement invoice/receipt identifiers, bank-detail PDF
  content, replaced-invoice history and winner visibility rules.

## 4. Operator and notifications

- [ ] bank-admin-01 Implement operator Confirm/Return, concurrency guards,
  proof viewer authorization and reissue/settlement restrictions.
- [ ] bank-mail-01 Implement reminder, final-notice and payment-received
  behavior with bank-transfer copy and no proof-received letter.

## 5. Validation

- [ ] bank-verify-01 Run focused backend, contract, frontend and email tests,
  then the complete repository validation lane.
