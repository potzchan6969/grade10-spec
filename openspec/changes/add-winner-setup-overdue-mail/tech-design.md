# Technical design

## Shape

Use one notification kind per durable letter. Keep `auction_won` and
`setup_reminder` as the existing event identities with updated payloads; add
the `payment_overdue` identity while accepting legacy `invoice_expired` rows
as a compatibility alias during migration. Remove scheduling of the second
setup reminder. Setup completion includes the companion billing/payment setup
fields and parks all setup letters.

## Backend

- Update setup-incomplete evaluation and close scheduling to use the complete
  setup snapshot, schedule one reminder at 24 hours and setup overdue at 48
  hours, and never enqueue a second reminder.
- Rename expiry activation to payment-overdue while mapping existing queued
  `invoice_expired` work safely and preserving idempotency.
- Include delivery, payment method and billing fields in auction-won and
  setup-reminder payloads. Keep setup-overdue generic and route its primary
  action to Contact Us.
- Add focused sweep, notification-work and email-mapping tests for park,
  duplicate delivery, deadline and legacy compatibility behavior.

## Email surface

Update templates and campaign tags for auction-won, setup-reminder,
setup-overdue and payment-overdue. Payment-overdue and setup-overdue name
manual review and applicable penalties/extra charges, use Contact Us first and
View order second, and promise no automatic cancellation.

## Dependencies

Consume the billing fields delivered by `add-winner-billing-address`; do not
duplicate its address validation or snapshots. Coordinate status labels with
the overdue-order-status change, but keep letter delivery owned here.

## Validation

Run focused sweep/email/service tests, contract checks and the full validation
lane. Verify old notification rows are neither duplicated nor silently lost.
