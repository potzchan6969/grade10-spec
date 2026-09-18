# Tasks

## 1. Notification contract (owner: @htonyl)

- [ ] overdue-contract-01 Add payment-overdue kind and payload fields while
  preserving legacy invoice-expired compatibility.
- [ ] overdue-contract-02 Expand auction-won/setup-reminder payload contracts
  for delivery, payment method, billing and setup deadline.

## 2. Scheduling

- [ ] overdue-sweep-01 Make setup completeness include the companion billing and
  payment confirmation fields and park setup letters after confirmation.
- [ ] overdue-sweep-02 Schedule one setup reminder at 24h and setup overdue at
  48h; remove the 72h second reminder and test idempotency.
- [ ] overdue-sweep-03 Replace invoice-expired activation with payment-overdue
  and safely process already queued legacy work.

## 3. Email

- [ ] overdue-email-01 Update auction-won and setup-reminder copy with complete
  setup bullets and deadline.
- [ ] overdue-email-02 Implement setup-overdue and payment-overdue copy,
  Contact Us/View order actions, manual-review language and no auto-cancel.
- [ ] overdue-email-03 Add email port/template/campaign tests for all four
  letter variants.

## 4. Validation

- [ ] overdue-verify-01 Run focused sweeps, notification, email and contract
  tests, then the complete repository validation lane.
