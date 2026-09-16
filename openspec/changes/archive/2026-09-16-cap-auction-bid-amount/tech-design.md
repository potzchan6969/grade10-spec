# Tech design

## Context

Auction amounts are represented as integer minor units. The auction contract already owns supported currencies, increments, and next-bid calculations. The backend derives the minimum next amount from the listing's current top amount and any live pending maximum. There is no shared ceiling, so a submitted maximum can currently grow without an upper bound.

## Goals / Non-Goals

Goals:

- Define one fixed ceiling lookup for USD, HKD, and JPY in the auction contract.
- Enforce the ceiling for manual bids and automatic maximums inside the locked bid transaction.
- Refuse a bid when the derived next minimum is already above the ceiling.
- Return the ceiling in the refusal outcome so clients can name the limit in the active currency.
- Keep storefront quick-bid amounts at or below the ceiling.
- Add localized refusal copy without changing design tokens or shared visual components.

Non-goals:

- Per-lot or operator-configurable ceilings.
- Currency conversion, starting-price changes, or payment-hold changes.
- A new persisted ceiling column.
- Changes to the design-system exports or visual tokens.

## Decisions

### Shared currency policy

The bid-increment contract will export a `bidCeiling(currency)` lookup beside `bidIncrement` and `nextBidAmount`. Ceilings remain integer minor-unit constants and are selected from the listing currency after normalisation. No conversion is performed.

The contract is the only source of truth used by the backend and storefront. This avoids duplicating currency policy across the bid service and quick-bid presentation logic.

### Bid-service enforcement

`placeBid` will compare the requested maximum with the listing currency's ceiling after currency matching and before previous-maximum, payment, or bid writes. An amount above the ceiling returns `AMOUNT_TOO_HIGH`, includes `ceilingMinor`, and records an automatic-max refusal with failure code `ceiling`.

The same transaction will reject every new bid when the derived minimum next amount is above the ceiling. The refusal does not change the listing, leader, or any stored maximum. An amount equal to the ceiling continues through normal bid and automatic-resolution handling.

The existing bid-action failure-code check constraint will be updated by one additive migration so refusal events can use `ceiling`. No persisted ceiling column is added. The ceiling is still a fixed cross-lot policy, and the service remains the atomic write boundary for all supported bid entry points.

### Resolver and public state

The automatic resolver will not clamp amounts. Valid submitted maxima are bounded before resolution, and the existing increment rules can only resolve to a value at or below the accepted maximum. Public state will continue to expose the derived minimum; the storefront will suppress actions when that minimum is above the ceiling.

### Storefront behavior

The storefront will use the shared ceiling lookup to filter quick-bid suggestions. A listing whose next minimum is above the ceiling has no valid quick-bid amount. A server refusal with `AMOUNT_TOO_HIGH` will format `ceilingMinor` using the listing currency and render dedicated localized copy.

### Rejected alternatives

- Persisting a ceiling on each listing would duplicate a fixed policy and imply an operator override that the specification forbids.
- Clamping a computed minimum to the ceiling would turn an exhausted auction into an apparently valid bid opportunity. Exhausted minimums remain refusals.
- Formatting the ceiling only in a server error would leave clients without a stable typed value and would make localization depend on backend prose.

## Service Interfaces

`placeBid` keeps its existing input and success shape. Its refusal shape gains:

- `errorCode: "AMOUNT_TOO_HIGH"`
- `ceilingMinor: number`

The service obtains the ceiling from the listing currency while holding the listing transaction lock. The refusal action is idempotent with the existing action-group flow and performs no bid, maximum, or payment-hold write.

## API Contracts

The shared `placeBidErrorCode` schema gains `AMOUNT_TOO_HIGH`. The optional `ceilingMinor` field is added to failed `placeBid` outcomes. The internal bidding-history failure-code schema gains `ceiling` so refusal events remain renderable in every supported locale. No route or procedure name changes.

## Risks / Trade-offs

- [Risk] A pre-existing invalid pending maximum could remain above the new policy after deployment. → Mitigation: all new `placeBid` calls validate before accepting or confirming a bid; deployment verification checks the existing pending-maximum projection.
- [Risk] Public snapshots can briefly show an exhausted minimum before the next refusal is observed. → Mitigation: the backend remains authoritative, and the storefront derives action availability from the same ceiling lookup.
- [Risk] A missing catalog key would make a refusal fall back to raw service text. → Mitigation: update all supported auction-listing and bidding-history locales and run catalog/manual validation.

## Migration Plan

Ship the contract, migration, backend, frontend, and catalog changes together. Apply the migration before exercising ceiling refusals, then run the targeted auction tests and type checks. Rollback is a code revert plus the normal migration rollback procedure; no persisted ceiling data needs cleanup.

## Open Questions

None.
