# Tasks: Add inventory card price reference

`add-grade10-inventory` must land before any Grade10 group begins. Once group
2 lands, groups 3–6 are independently claimable; the frontend uses contracts
and fixtures, never a running worker.

## 1. Publish the product story (grade10-spec)

- [ ] 1.1 Update the Inventory catalogue manual for the shipped card
  classification, required controlled tag roles, confirmed PriceCharting reference, and
  cache-only current PSA-oriented prices and CSV import that make
  card-price-SC-01 through card-price-SC-13 pass.
- [ ] 1.2 At archive, carry this delta's Feature set and User journeys into the
  durable `grade10-admin/inventory/card-price-reference` capability before the
  archive preflight.
- [ ] 1.3 Verify with `pnpm check:manual`, `openspec validate
  add-inventory-card-price-reference --strict`, and `pnpm run archive:preflight`.

## 2. Share card-reference contracts (grade10) (owner: @htonyl)

- [ ] 2.1 Make card-price-SC-01, card-price-SC-02, and card-price-SC-09 pass
  with collectible-type, kind-less reusable-tag, three controlled-role, and complete product
  classification contracts shared by the inventory service and admin frontend.
- [ ] 2.2 Make card-price-SC-03 through card-price-SC-08 pass with PriceCharting
  candidate, confirmed-reference, normalized PSA-oriented current-price,
  freshness, stale, and Auction refresh-request contracts; include fixtures
  for missing grades and provider failures.
- [ ] 2.3 Make card-price-SC-10 through card-price-SC-13 pass with fixed CSV
  row, preview, candidate-confirmation, and atomic-import contracts.
- [ ] 2.4 Verify with `pnpm run typecheck`, `pnpm run lint`, and focused
  inventory contract tests.

## 3. Migrate inventory card identity (grade10)

- [ ] 3.1 Make card-price-SC-01, card-price-SC-02, and card-price-SC-09 pass
  by folding the clean product classification, globally normalized reusable
  tags, and its three non-null role foreign keys into the unpublished inventory
  schema/migration; no backfill or compatibility path is needed.
- [ ] 3.2 Make card-price-SC-03 through card-price-SC-08 pass with confirmed
  provider identity, one replaceable price-cache row, and the global request
  gate; generate and commit the inventory migration.
- [ ] 3.3 Make card-price-SC-10 through card-price-SC-13 pass with expiring
  import previews and rows, including the row limit, candidate confirmation,
  expiry index, and cleanup sweep state.
- [ ] 3.4 Verify with `pnpm run db:drizzle:generate`, `pnpm run
  check:migrations`, `pnpm run test:backend`, and `pnpm run typecheck`.

## 4. Serve and refresh the reference (grade10)

- [ ] 4.1 Make card-price-SC-01, card-price-SC-02, and card-price-SC-09 pass
  by atomically validating required tag coverage and replacing the product
  classification while reusing case-insensitive inline tags.
- [ ] 4.2 Make card-price-SC-03 and card-price-SC-04 pass with a server-only
  PriceCharting search/confirmation flow that persists the canonical link and
  unique numeric id without page scraping.
- [ ] 4.3 Make card-price-SC-05 through card-price-SC-07 pass with the
  secret-backed, rate-limited provider client, 24-hour cache, normalized USD
  values, and stale/unavailable behavior that never creates price history.
- [ ] 4.4 Make card-price-SC-08 pass by accepting only the Grade10 Auction
  lifecycle's idempotent four-hour refresh-eligibility request through a
  narrow inventory entrypoint.
- [ ] 4.5 Declare the PriceCharting token, add the admin procedures and
  gateway wiring, and update generated Worker types as required.
- [ ] 4.6 Make card-price-SC-10 through card-price-SC-13 pass with bounded CSV
  parsing, persisted preview/candidate confirmation, and one-transaction
  product creation that rolls back every row on a concurrent duplicate or
  write refusal.
- [ ] 4.7 Verify with `pnpm run test:backend`, `pnpm run cf-typegen`, `pnpm
  run typecheck`, and `pnpm run lint`.

## 5. Present card identity and prices (grade10)

- [ ] 5.1 Make card-price-SC-01, card-price-SC-02, and card-price-SC-09 pass
  in the inventory product create/edit form with the required type and
  reusable inline controlled-role controls.
- [ ] 5.2 Make card-price-SC-03 and card-price-SC-04 pass with pasted-link
  search, explicit candidate confirmation, and card-type-only reference
  controls.
- [ ] 5.3 Make card-price-SC-05 through card-price-SC-07 pass with a
  PSA-focused current-price panel that renders USD minor units, source,
  update time, unavailable grades, fresh, stale, and no-result states.
- [ ] 5.4 Make card-price-SC-10 through card-price-SC-13 pass with CSV upload,
  row validation, all-candidate confirmation, and a single atomic import
  action that does not offer product updates.
- [ ] 5.5 Verify with `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`,
  and `pnpm run build`.

## 6. Trigger Auction-aware freshness (grade10)

- [ ] 6.1 Make card-price-SC-08 pass by emitting the inventory refresh request
  when a Grade10 Auction listing for the linked product becomes active, without
  exposing PriceCharting credentials or adding external-marketplace events.
- [ ] 6.2 Verify with `pnpm run test:backend`, `pnpm run typecheck`, and
  `pnpm run lint`.
