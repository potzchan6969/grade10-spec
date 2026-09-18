# Technical design

## Shape

Extend the auction-order snapshot and setup command so delivery, billing and
payment method are confirmed atomically. Keep address-book records reusable,
but copy selected values into the order and invoice snapshots. A one-time
billing address remains available for the current setup session and is not
written to the address book unless the existing save action is selected.

The shared `AuctionAddressForm` remains controlled: the consuming app owns
copy, validation and phone-format policy; the component reports delivery and
billing values separately. The design-system `FileDropzone` is a separate
primitive consumed by payment proof and is not coupled to this form.

## Backend

- Add billing address, billing confirmation and payment-method fields to the
  auction-order persistence model and contracts.
- Require delivery, billing and payment method for the setup confirmation
  transition; preserve the existing address-only backfill path for old rows.
- Snapshot Bill To and Ship To on invoice creation and receipt creation.
- Refuse invoice send when billing is absent; allow an authorized operator to
  add it before send through the existing reasoned edit log. Represent an
  absent previous value as `none` in the log.
- Require reissue for post-send billing changes and never mutate paid receipt
  snapshots.

## Frontend

- Add the billing mode and second-address state to the winner setup flow.
- Reuse the shared address-book selector and five-address cap for billing.
- Render Bill To and Ship To in invoice and receipt views and the post-sale
  quote.
- Keep phone recording on the same controlled form contract, defaulting
  billing to delivery.

## Boundaries and validation

Postal-code requirements remain the consuming Winner Order application's
existing field rule; the shared component imposes no postal-code format.
Validate delivery and billing errors independently. Lock the confirmed setup
snapshot so later address-book edits cannot alter an order.

## Verification

Run focused backend lifecycle/repository tests, winner-order and admin UI
tests, shared UI typecheck/story tests, and the repository validation lane.
