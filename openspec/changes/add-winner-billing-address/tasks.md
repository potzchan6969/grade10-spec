# Tasks

## 1. Shared contract

- [ ] billing-shared-01 Extend `AuctionAddressForm` props, values and stories for
  same-as-delivery, separate billing and independent errors.
- [ ] billing-shared-02 Export the completed contract from the shared auction
  order surface and update component tests.

## 2. Winner order

- [ ] billing-winner-01 Add billing snapshot and payment-method fields to the
  order model, contracts, fixtures and persistence migrations.
- [ ] billing-winner-02 Make setup confirmation validate and lock delivery,
  billing and payment method atomically, with the existing address-book and
  one-time-address behavior.
- [ ] billing-winner-03 Render billing setup, Bill To/Ship To invoice and
  receipt snapshots, and immutability behavior.
- [ ] billing-winner-04 Add focused red-first tests for same-address default,
  separate saved/one-time billing, missing-field refusal and immutable receipt.

## 3. Post-sale

- [ ] billing-post-sale-01 Add Bill To/Ship To quote rendering and refuse send
  when billing is missing.
- [ ] billing-post-sale-02 Add reasoned pre-send billing edits, phone-record
  parity and post-send reissue behavior.
- [ ] billing-post-sale-03 Add focused tests for send guards, operator edits,
  audit logging and reissue snapshots.

## 4. Validation

- [ ] billing-verify-01 Run design-system typecheck/story tests, focused auction
  backend/frontend tests and the required repository validation commands.
