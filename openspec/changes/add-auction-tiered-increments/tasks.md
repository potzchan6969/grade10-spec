## 1. Publish the shared auction policy (grade10-spec)

- [ ] 1.1 Make `bid-increments-SC-01` through `bid-increments-SC-06`, `auto-bidding-SC-09`, `auto-bidding-SC-11`, `auto-bidding-SC-15`, `auto-bidding-SC-16`, and the modified admin-listing scenarios unambiguous in the durable specifications; update the auction bidding and auto-bidding manual pages with the three schedules and the removal of the operator override.
- [ ] 1.2 Derive and commit the draft test-case suites for every changed delta with user journeys.
- [ ] 1.3 Verify with `openspec validate add-auction-tiered-increments --strict`, `pnpm check:manual`, and `pnpm run tcs:validate`.

## 2. Replace the persisted increment (grade10)

- [ ] 2.1 Make the migration path in `bid-increments-SC-01` through `bid-increments-SC-06` possible by removing `auction_listings.min_increment` and updating repository types, factories, and fixtures without changing recorded bids or holds.
- [ ] 2.2 Verify with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run test:backend`, and `pnpm run build`.

## 3. Apply the schedule at the service boundary (grade10)

- [ ] 3.1 Make `bid-increments-SC-01` through `bid-increments-SC-05` and `auto-bidding-SC-09`, `auto-bidding-SC-11`, `auto-bidding-SC-15`, and `auto-bidding-SC-16` pass with one shared USD/HKD/JPY schedule lookup for manual floors and proxy resolution.
- [ ] 3.2 Make `bid-increments-SC-06`, `admin-listing-SC-03`, and `admin-listing-SC-09` pass by enforcing the currency allowlist in listing draft, create, update, and schedule services and their contracts.
- [ ] 3.3 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build`.

## 4. Align the operator and collector surfaces (grade10)

- [ ] 4.1 Make `admin-listing-SC-06` and `admin-listing-SC-09` pass by removing Minimum increment and rendering USD, HKD, and JPY as the only listing-editor currency choices.
- [ ] 4.2 Make `bid-increments-SC-02` through `bid-increments-SC-05` pass by deriving the displayed minimum and each quick-bid suggestion from the shared schedule contract and fixtures.
- [ ] 4.3 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.
