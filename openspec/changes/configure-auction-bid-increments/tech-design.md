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

## Dependency

This change `depends_on` the accepted open change `usd-lot-currency-winner-settlement-choice` (Q15), which also modifies `grade10-site/auction/bid-increments`. It archives first, so this delta's MODIFIED blocks state against its folded text.
- **Ours** - the rule-and-configuration text of "Grade10 owns the supported-currency schedules" and "The minimum uses the amount being beaten", with no literal tier table.
- **Theirs** - the ADDED "Every lot is bid in USD" requirement and the USD-only settlement content. This delta restates that requirement with its text copied, and rewrites only `SC-13`, whose quoted amount follows the old tiers.
- **Ids** - scenarios `SC-01` to `SC-05`, `SC-07` and `SC-12`, and cases `TC-2ed`, `TC-0lh` and `TC-sze`, appear in both changes. Where the text differs, this change carries the higher `rev`.
- **Sheet** - the cluster sheet is `reconciliation.md` in their change directory.

## Goals / Non-Goals

**Goals:**
- One configuration file holds the values; backend, collector site, admin preview, demo and e2e read it.
- A retune is one pull request that edits the configuration and the manual table, with a test that fails when they differ.
- A bad file fails a test in CI, so it never merges and never ships (Q12).

**Non-Goals:**
- A runtime store, screen or API for the values, per [decisions Q1](decisions.md#decisions).
- A per-listing schedule or a stored minimum.
- A currency other than USD.

## Decisions

**Where the values live.** The spec governs the lookup rule; the implementation choice is a typed module `packages/grade10-auction/contracts/src/bidIncrementSchedule.ts` that exports one constant: the currency, and an ordered list of `{ fromMinor, incrementMinor }` rows in integer USD minor units. `bidIncrements.ts` imports it and keeps its exported functions and signatures. The lowest tier is the first row and holds no fixed value: `openingPrice` on a 0 start is `incrementIn(schedule, 0)`, the lowest configured increment (Q13).
- Alternative - a JSON file: rejected because the e2e helper and the demo import contract sources as `.ts` directly, and a typed module gives the type check and the validity test one place without import attributes in each loader.
- Alternative - the file in the spec store, read as the i18n catalogs are: rejected because a retune would then need a store change, a submodule bump and a deploy, and the manual could not tell the deploy which values are in force. Decision Q1 names pull request and deploy.
- Alternative - a database row or an environment variable: rejected by Q1.

**One source for every reader.** `@grade10/auction-contracts` stays the only import path. The backend, the collector site, the admin preview and the demo already import it, so none of them changes its import. The e2e helper keeps its relative import of `bidIncrements.ts`. No file outside the contracts package may hold a tier amount; the verification task greps for this.

**Validity is a test.** Per Q12, the product manager's own answer, nothing validates the constant when it loads. A contracts test, `test/bidIncrementScheduleValid.test.ts`, runs in CI and asserts on the configured constant: the first row is from 0; rows ascend strictly by `fromMinor`, so no two rows share a lower bound and none overlap; every `fromMinor` and every `incrementMinor` is a whole-dollar multiple, tested as a multiple of the USD major unit that `@grade10/utils/money` derives from `currencyExponent("USD")`, with no literal 100 in the assertion (Q9); every increment is positive; the list is not empty; and the last tier is unbounded, which the lookup shows by selecting the last row for an amount above every `fromMinor`. Equal increments on adjacent rows are allowed, so the table can keep every published Goldin row. The test names no increment value, so the lowest tier is retuned like any other (Q13).
- A failing test blocks the pull request, so the bad file does not merge and the last deployed schedule stays in force.
- A merge that skips CI is not guarded at run time. This is the cost of Q12's answer; the spec states the rule and the test enforces it.
- Rejected, by Q12: a validator that throws when the module loads, with a test per broken shape.

**Whole-dollar bids (Q9).** The product manager accepts whole-dollar bids, maxima and configuration only. Amounts stay integer minor units; a whole dollar is a multiple of `10 ** currencyExponent("USD")`, taken from `@grade10/utils/money`, so no module states 100 as the rule. Checked against the grade10 code at `claude/bid-increments-alignment-99505e`, read only:
- **Exists - the bid form.** The custom field keeps whole major units: `sanitizeMoneyDraft` in `external/grade10-spec/packages/ui/src/blocks/auction-listing/listing-bid-money.ts` drops a decimal mark and everything after it, and `wholeMajorDraftFromMinor` ceils a floor with cents to the next whole major unit. The e2e spec comments say the same ("the custom field only keeps whole majors"). A collector cannot type cents.
- **Exists - the server's integer check.** `placeBid.ts` (`lockAndPlace`) answers `INVALID_AMOUNT` through `isMinorAmount`, which tests only a positive safe integer. The request schemas use `Schema.Int`.
- **Missing - the server's whole-dollar check.** A direct API call with M plus one minor unit passes both checks and is accepted. The house path, `internalBids/commit.ts` and the test-bid path, has the same gap. A task adds a whole-dollar test beside the integer test in `placeBid.ts`, answering `INVALID_AMOUNT` with a message naming the whole-dollar rule and writing nothing, and the same test on the house and test-bid paths. It derives the major unit from the money module's USD exponent.
- **Held - a starting price with cents.** `isStartingPrice` in `bidIncrements.ts` accepts any whole minor-unit starting price from 0, so a start of 10050 opens at a minimum no whole-dollar bid can match. The rule is held as a question for the product manager (decisions `## Raised`, ❓ on the Bidding page); this design adds no rule for it.
- **Not touched - the durable `auction` refusal row.** It says the request schema refuses an amount that is not a whole count of minor units, so the form never shows `INVALID_AMOUNT`. The new check answers that code for a cents amount, and the row's wording would need a durable edit outside this change (Q14); it is held for the product manager and not edited here.

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

**Neighbouring capabilities.** No other capability's behaviour changes: each states that its increment is the one `bid-increments` selects. Their scenarios and worked examples that quote old-tier amounts are listed below. Per Q14, the product manager's own answer, they get no delta in this change: the application repository's tests and fixtures are rewritten, and each durable spec's worked amount is read as an example under a different set of configuration values, so it does not contradict the configured schedule. These specs are example-only.

| Capability (example-only, no delta) | Where | Amount that follows the old tiers, read as an example |
| --- | --- | --- |
| `auto-bidding` | Two-maximum table; `SC-30a`; house worked example; `SC-38`; the "Starting price 20000, increment 2500" example | 1100 after a maximum of 1000, 25500 and 40500, 53000, 52500 and 82500 |
| `bidding-history` | Boundary-case requirement, `SC-35`, `SC-36` | 1100 as one increment above a maximum of 1000 |
| `auction` | `SC-62`, `SC-89`, `SC-90`, the erasure worked example | 21000, 124000, 500 as the increment at 10000 to 20000 |
| `account-record` | `SC-71` | A minimum of 30500 at a current bid of 30000 |
| `grade10-admin/auction/internal-bid` | `SC-09`, `SC-44`, `SC-13` | A minimum of 53000 at 52000; 52000 at 51000 |

The domain suite `openspec/specs/grade10-site/auction/domain-tcs.md` quotes tier amounts too (increments of USD 25 and USD 50, and USD 10 steps). The same reading applies: they are examples. QA owns that suite; the walk rewrites its fixtures.

## Test data

- **Unit** - Contracts tests assert each configured boundary through the configuration (`incrementIn` at each `fromMinor` and at one whole dollar below it, `fromMinor` minus the USD major unit), the validity test, the manual table equality, and the change cases through two schedules. Backend, frontend and demo tests that quote tier amounts compute them from the configuration, or, where the amount is the point, from the manual table's values.
- **Fixtures** - `packages/grade10-auction/frontend/src/core/api/listingFixtures.ts` and `packages/grade10-auction/admin-frontend/src/core/api/FixtureAuctionAdminProcedureClient.ts` hold literal `minimumNextAmount` values. Each is recomputed from its listing's current bid.
- **Backend DB lane** - `apps/backend/grade10/auction/test/db/bidding/{openingPrice,placeBid,autoBidding,resolveStandingMaxima}.spec.ts`, `listings/{live,schedule}.spec.ts` and `internalBids/commit.spec.ts` assert amounts. The change cases seed an open lot with a standing leader, take `bidFloor` under two schedules, and assert the stored rows are identical before and after.
- **E2E** - `apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts` holds `USD_FLOOR`, `USD_ABOVE_FLOOR`, `USD_BELOW_FLOOR`, the 10000 boundary row and the ceiling minimum as literals. The rewrite derives each from the configuration: one boundary case per configured tier through `plusIncrement`, and "above" as the minimum plus one major unit and "below" as the minimum minus one whole dollar. The cents literals are rewritten or removed: `BELOW_OPENING_ROWS` (`opening: 100, bid: 99`, `opening: 10_500, bid: 10_499`), `USD_BOUNDARY_ROWS` (`currentPublicPrice: 9_999`, `minimumNextAmount: 10_099`) and the 10499 comment on `USD_BELOW_FLOOR` move to whole-dollar amounts one dollar below the minimum or the bound. A bid with cents is a server refusal, so it belongs to the DB lane through the API and not to the page, whose field cannot type one. E2E cannot swap values at run time, so it proves the wiring from the file to the page; the change cases belong to the unit and DB lanes. Other specs that call `plusIncrement` (`auction-bids`, `auction`, `account-record`, `internal-bid`, `phone`) compute through the helper and need an audit for literals, not a rewrite.

## Risks / Trade-offs

- [The manual table and the file drift] → The manual-equality test fails the grade10 build on any difference, and it keeps every published row so no normalisation hides one.
- [A bad edit reaches a deployed bundle] → The validity test fails the contracts CI, so the pull request cannot merge and the last deployed schedule stays in force. A merge that bypasses CI is not guarded at run time; Q12 accepts this.
- [Backend and collector site run different values for a short window] → The minimum shown and enforced is the backend's. A stale chip is refused with the existing refusal; nothing is mis-accepted.
- [Bidders who planned on the old steps see a new minimum on deploy] → This is the BREAKING note in the proposal and is intended; a deploy during a live close moves the minimum under bidders. Retunes belong outside the closing hours of lots. This is operations, not code.
- [A re-stand under new values can lower a price] → It follows the existing "never rise" rule. No stored price is rewritten by the deploy itself.
- [Tests quote literal amounts again] → The grep in the verification task finds tier numbers outside the contracts package and the manual-equality test.

## Migration Plan

1. Store: land the manual table and the delta; the submodule bump is the boundary.
2. grade10: bump the submodule, add the configuration file and its validity test, rewrite the lookups over it, rewrite tests and fixtures, merge.
3. Deploy backend and collector site together. No database migration, no backfill.
4. Rollback is a revert of the grade10 pull request and a redeploy. It moves the minimum back the same way, and standing bids stay untouched in both directions.
