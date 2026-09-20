# Technical design

## Shape

Model winner bank-transfer proof as a single-use, atomic transition from a
pending invoice to Payment Verifying. Use the existing invoice revision and
notification work identity for idempotency. Store accepted proof metadata in
the invoice log; proof files remain operator-only. The winner proof contract is
separate from the broader operator settlement-proof contract.

## Design-system and frontend

- Export `FileDropzone` and its target/list primitives from the design-system
  root and retain the explicit component import path.
- Configure the winner flow for 1 required to 3 files, PDF/PNG/JPG/HEIC, 5 MiB
  per file and 15 MiB total. Convert accepted HEIC files to JPEG.
- Show the payment-method copy controls and the inline Payment Verifying alert
  at the responsive placements in `ui-design.md`.
- Refuse a second upload and all card actions while proof is being checked.

## Backend

- Add bank-transfer payment method and winner-proof persistence with content
  signature validation, atomic state transitions and idempotency keys.
- Pause the invoice deadline as a persisted integer millisecond duration while
  Payment Verifying; resume reminders from that paused clock after Return.
- Allow only Confirm or Return to win the concurrent operator race; stale
  actions are refused.
- Generate immutable invoice/receipt PDFs with configured bank details,
  identifiers and searchable references. Replaced PDFs remain available in
  invoice history.
- Keep notification scheduling idempotent; no proof-received email is sent.

## Validation

Run contract, repository, service, sweep, email, UI and design-system tests,
then the complete validation lane. Use existing payment provider seams and do
not add automatic bank-statement matching.
