## Context

The rule is in [bid-increments](specs/grade10-site/auction/bid-increments/spec.md). The code that applies it is one module in the grade10 repository: `packages/grade10-auction/contracts/src/bidIncrements.ts`. It holds the tier list as a private constant and exports `bidIncrement`, `nextBidAmount`, `openingPrice`, `bidCeiling` and the currency guards. Every reader imports it from `@grade10/auction-contracts`:

| Reader | Where | What it does with the schedule |
| --- | --- | --- |
| Backend | `packages/grade10-auction/backend/src/listingPolicy.ts` (`bidFloor`) | Computes the minimum next amount from the listing row on every read and every bid. Used by `placeBid`, `resolveStandingMaxima`, `internalBids/commit`, `testBids`, `repositories/listings` (public summary), `services/accountRecord` |
| Backend | `resolveStandingMaxima.ts`, `internalBids/commit.ts`, `history.ts` | Price after a proxy resolution, a re-stand and a lowered house maximum; the opening price on history rows |
| Collector site | `packages/grade10-auction/frontend/.../quickBidAmounts.ts`, `listingUi.ts` | Quick-bid chips after the first, and a view field `incrementMinor` |
| Demo | `packages/grade10-auction/demo/src/fake/FakeAuctionService.ts` | The fake backend's floor |
| Admin site | `packages/grade10-auction/admin-frontend/.../ListingEditor.tsx` (`NextBids`) | The "Next bids" preview under a starting price |
| E2E | `apps/frontend/grade10/e2e/helpers/auction.ts` (`plusIncrement`) and `tests/auction/bid-increments.spec.ts` | Helper reads the module; the spec holds literal tier amounts |

The collector site's minimum shown on the bid form is the backend's `minimumNextAmount`, not a client computation. The client computes only the chips after the first and the admin preview.

**Nothing persists an increment or a minimum.** Checked against the code:
- The listings table holds `top_amount` and `starting_price`; no column or migration under `apps/backend/grade10/auction/src/db/migrations` holds an increment or a floor. Bid rows hold `amount` and `maximum`.
- `minimumNextAmount` is derived per read by `bidFloor` (`repositories/listings.ts`, `services/accountRecord.ts`, `services/bidding/testBids.ts`). The AuctionRoom durable object does not compute or hold it.
- No payment-hold amount derives from an increment: nothing is held or charged on the card at bid time, per [bid-payment-method](../../specs/grade10-site/auction/bid-payment-method/spec.md). The verified-bidder bar compares an amount, not an increment.

The working tree of branch `claude/bid-increments-alignment-99505e` already holds an inline version of the new values in `bidIncrements.ts` and its tests. It omits the $1,000,000 row, which repeats the $600,000 increment. Under this design the row stays, so the table and the configuration match row for row.

## Goals / Non-Goals

**Goals:**
- One configuration file holds the values; backend, collector site, admin preview, demo and e2e read it.
- A retune is one pull request that edits the configuration and the manual table, with a test that fails when they differ.
- A bad file fails at start, not on the first bid.

**Non-Goals:**
- A runtime store, screen or API for the values, per [decisions Q1](decisions.md#decisions).
- A per-listing schedule or a stored minimum.
- A currency other than USD.

## Decisions

**Where the values live.** The spec governs the lookup rule; the implementation choice is a typed module `packages/grade10-auction/contracts/src/bidIncrementSchedule.ts` that exports one constant: the currency, and an ordered list of `{ fromMinor, incrementMinor }` rows in integer USD minor units. `bidIncrements.ts` imports it and keeps its exported functions and signatures.
- Alternative - a JSON file: rejected because the e2e helper and the demo import contract sources as `.ts` directly, and a typed module gives the type check and the validator one place without import attributes in each loader.
- Alternative - the file in the spec store, read as the i18n catalogs are: rejected because a retune would then need a store change, a submodule bump and a deploy, and the manual could not tell the deploy which values are in force. Decision Q1 names pull request and deploy.
- Alternative - a database row or an environment variable: rejected by Q1.

**One source for every reader.** `@grade10/auction-contracts` stays the only import path. The backend, the collector site, the admin preview and the demo already import it, so none of them changes its import. The e2e helper keeps its relative import of `bidIncrements.ts`. No file outside the contracts package may hold a tier amount; the verification task greps for this.

**Fail fast.** The module validates the constant when it loads and throws on: a first row not from 0, or not 100; rows not strictly ascending by `fromMinor`; a non-integer or non-positive increment; an empty list. Equal increments on adjacent rows are allowed, so the table can keep every published Goldin row. A contracts test feeds each broken shape to the validator.

**Pure lookups take the schedule.** `bidIncrement(currency, amount)` and `nextBidAmount` bind the configured schedule. Beside them the module exports `incrementIn(schedule, amount)` and `nextAmountIn(schedule, amount)` as pure functions, and `bidFloor` takes an optional schedule argument that defaults to the configured one. The contracts vitest project runs with `isolate: false` and no module mocks, so the change tests cannot mock the file. They pass a second schedule instead.

**The manual cannot be generated from the file; it is checked against it.** The manual's block grammar (`tools/manual/src/content/grammar.ts`) has `spec`, `cases`, `figma`, `story`, `image`, `callout`, `detail`, `flow` and `example` blocks and no block that reads data. The store cannot import the grade10 package, and grade10 may not commit into `external/grade10-spec` (the design-override hooks stop it). So the table stays hand-written markdown on the Bidding page, under `### Bid Increments`. A contracts test, `test/bidIncrementsManual.test.ts`, reads `external/grade10-spec/docs/prds/products/grade10-site/auction/bidding.md`, takes the first table under that heading (columns From, Increment), converts `$1,000` and `+$100` to minor units, and asserts equality with the configuration row for row. The order of a retune follows the existing boundary: the store page lands first, then the grade10 pull request bumps the submodule and edits the configuration, and the test fails until both agree.
- The test reads the submodule at the pinned SHA, so it stays red on a retune pull request that forgets the bump. That is the intended gate.
- Rejected: a generator in grade10 that rewrites the page. It writes into the store from the app repository.
- Rejected: a store-side check against the app. `pnpm check:manual` runs from the store alone and cannot see grade10.

**How a change reaches the next bid.** The deploy replaces the module in every bundle; nothing else moves.
- Open lot at deploy: the backend recomputes `bidFloor` from `top_amount` on the next read or bid, so the new minimum shows and applies at once. No backfill, no migration, no listing touched.
- Standing bids: `top_amount`, bid `amount` and `maximum` are stored facts and the deploy does not write them. A leader at P stays at P; the next bid must reach P plus the new increment.
- Proxy resolution reads the second-highest maximum's increment at the moment of the new maximum (`resolveStandingMaxima`). It does not revisit earlier resolutions.
- Re-stand on an erasure and a lowered house maximum are existing re-pricing events. They read the schedule in force when they run. `restandLeader` takes the lesser of the old price and the schedule price, so it can lower a price and never raise one. `internalBids/commit` refuses a lowered maximum whose price would fall below `top_amount`; under new values the same lowered maximum may be refused or accepted differently than before. This follows the existing rule and needs no code.
- A page open at deploy shows the old minimum. A bid at it is refused with the existing "Minimum bid is" refusal, which is scenario `grade10-site-auction-bid-increments-SC-19`.

**Quick bids and presets.** The first chip is the backend's `minimumNextAmount`; the next two apply `nextBidAmount` to it (`quickBidAmounts.ts`). They need no change beyond their tests. For the window between a backend deploy and a collector-site deploy, chip two and three may follow the old values and a press on one is refused with the same refusal. Deploy them together to keep the window short.

**The admin preview.** `NextBids` in `ListingEditor.tsx` calls `openingPrice` and `nextBidAmount`; it follows the file with no change.

**Neighbouring capabilities.** No other capability's behaviour changes: each states that its increment is the one `bid-increments` selects. Their scenarios and worked examples that quote old-tier amounts are listed below. Whether they get deltas in this change is a Raised row in [decisions](decisions.md#raised); until it closes, they are a test-data rewrite.

| Capability | Where | Amount that follows the old tiers |
| --- | --- | --- |
| `auto-bidding` | Two-maximum table; `SC-30a`; house worked example; `SC-38`; the "Starting price 20000, increment 2500" example | 1100 after a maximum of 1000, 25500 and 40500, 53000, 52500 and 82500 |
| `bidding-history` | Boundary-case requirement, `SC-35`, `SC-36` | 1100 as one increment above a maximum of 1000 |
| `auction` | `SC-62`, `SC-89`, `SC-90`, the erasure worked example | 21000, 124000, 500 as the increment at 10000 to 20000 |
| `account-record` | `SC-71` | A minimum of 30500 at a current bid of 30000 |
| `grade10-admin/auction/internal-bid` | `SC-09`, `SC-44`, `SC-13` | A minimum of 53000 at 52000; 52000 at 51000 |

The domain suite `openspec/specs/grade10-site/auction/domain-tcs.md` quotes tier amounts too (increments of USD 25 and USD 50, and USD 10 steps). QA owns that suite; the walk rewrites its fixtures.

## Test data

- **Unit** - Contracts tests assert each configured boundary through the configuration (`incrementIn` at each `fromMinor` and at `fromMinor - 1`), the validator, the manual table equality, and the change cases through two schedules. Backend, frontend and demo tests that quote tier amounts compute them from the configuration, or, where the amount is the point, from the manual table's values.
- **Fixtures** - `packages/grade10-auction/frontend/src/core/api/listingFixtures.ts` and `packages/grade10-auction/admin-frontend/src/core/api/FixtureAuctionAdminProcedureClient.ts` hold literal `minimumNextAmount` values. Each is recomputed from its listing's current bid.
- **Backend DB lane** - `apps/backend/grade10/auction/test/db/bidding/{openingPrice,placeBid,autoBidding,resolveStandingMaxima}.spec.ts`, `listings/{live,schedule}.spec.ts` and `internalBids/commit.spec.ts` assert amounts. The change cases seed an open lot with a standing leader, take `bidFloor` under two schedules, and assert the stored rows are identical before and after.
- **E2E** - `apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts` holds `USD_FLOOR`, `USD_ABOVE_FLOOR`, `USD_BELOW_FLOOR`, the 10000 boundary row and the ceiling minimum as literals. The rewrite derives each from the configuration: one boundary case per configured tier through `plusIncrement`, and "above" and "below" as the minimum plus 100 and minus 1. E2E cannot swap values at run time, so it proves the wiring from the file to the page; the change cases belong to the unit and DB lanes. Other specs that call `plusIncrement` (`auction-bids`, `auction`, `account-record`, `internal-bid`, `phone`) compute through the helper and need an audit for literals, not a rewrite.

## Risks / Trade-offs

- [The manual table and the file drift] → The manual-equality test fails the grade10 build on any difference, and it keeps every published row so no normalisation hides one.
- [A bad edit reaches a deployed bundle] → The load-time validator throws, so the Worker and the collector bundle fail their tests and their start, never a bid.
- [Backend and collector site run different values for a short window] → The minimum shown and enforced is the backend's. A stale chip is refused with the existing refusal; nothing is mis-accepted.
- [Bidders who planned on the old steps see a new minimum on deploy] → This is the BREAKING note in the proposal and is intended; a deploy during a live close moves the minimum under bidders. Retunes belong outside the closing hours of lots. This is operations, not code.
- [A re-stand under new values can lower a price] → It follows the existing "never rise" rule. No stored price is rewritten by the deploy itself.
- [Tests quote literal amounts again] → The grep in the verification task finds tier numbers outside the contracts package and the manual-equality test.

## Migration Plan

1. Store: land the manual table and the delta; the submodule bump is the boundary.
2. grade10: bump the submodule, add the configuration file and validator, rewrite the lookups over it, rewrite tests and fixtures, merge.
3. Deploy backend and collector site together. No database migration, no backfill.
4. Rollback is a revert of the grade10 pull request and a redeploy. It moves the minimum back the same way, and standing bids stay untouched in both directions.
