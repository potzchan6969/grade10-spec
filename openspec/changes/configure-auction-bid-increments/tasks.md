## 1. Manual table and PRD (grade10-spec)

Lands first: the submodule bump is the boundary for the grade10 groups. It lands after `usd-lot-currency-winner-settlement-choice` archives (`depends_on`, Q15), so this delta states against that change's folded text.

- [ ] 1.1 Check the table under `### Bid Increments` in `docs/prds/products/grade10-site/auction/bidding.md` is the shape the grade10 drift test parses: one table headed From and Increment, every published row kept, ascending, and that the page and the delta state no tier amount as a rule (`grade10-site-auction-bid-increments-SC-02`, `grade10-site-auction-bid-increments-SC-07`)
- [ ] 1.2 Update the Bidding PRD page for the capability: the 🚧 line on the configured schedule stays until the walk is verified, and the page names the configuration file's path; the 🚧 whole-dollar line stays beside it (Q9), and the starting price joins it (Q16); the ❓ on a starting price with cents is gone
- [ ] 1.3 Verify: `pnpm check:manual` and `pnpm plan:review-preflight configure-auction-bid-increments`

## 2. Configuration and lookups (grade10)

- [ ] 2.1 Tests first, in their own commit: contracts tests for the boundary at every configured tier and one whole dollar below it, the lookup for 0 and for an amount above every lower bound, the shared schedule on every lot, the change cases through two schedules, and the manual-table equality test (`g10.auction-bid-increments.SC-mn9`, `g10.auction-bid-increments.SC-xjw`, `g10.auction-bid-increments.SC-w8f`, `g10.auction-bid-increments.SC-a64`, `g10.auction-bid-increments.SC-bj0`, `g10.auction-bid-increments.SC-ywg`, `g10.auction-bid-increments.SC-p50`, `g10.auction-bid-increments.SC-bs0`)
- [ ] 2.2 Validity test first, in the same commit as 2.1: `test/bidIncrementScheduleValid.test.ts` asserts on the configured constant that it has a tier from 0, rows ascending with no shared lower bound, whole-dollar `fromMinor` and `incrementMinor` values (each a multiple of the major unit that `@grade10/utils/money` derives from `currencyExponent("USD")`, with no literal 100 in the assertion), positive increments, a non-empty list and an unbounded last tier, and names no increment value; it runs in the contracts CI (Q12, Q13)
- [ ] 2.3 Add `bidIncrementSchedule.ts` in the contracts package with Goldin's rows in USD minor units and no validator code; rewrite `bidIncrements.ts` to read it and add the pure `incrementIn` and `nextAmountIn` lookups, keeping every existing export (`g10.auction-bid-increments.SC-mn9`, `g10.auction-bid-increments.SC-xjw`, `g10.auction-bid-increments.SC-a64`)
- [ ] 2.4 Add `test/bidIncrementsManual.test.ts`: read the Bidding page from `external/grade10-spec`, parse the first From and Increment table, and assert it equals the configuration row for row
- [ ] 2.5 Make `isStartingPrice` in the contracts `bidIncrements.ts` also require a multiple of the USD major unit, derived from the money module's USD exponent, with its unit test written first in the 2.1 commit: a whole-dollar price and 0 pass, a price one minor unit above a whole dollar fails (Q16, `g10.auction-bid-increments.SC-kc7`)
- [ ] 2.6 Verify: the contracts package `typecheck` and `test`, including the validity test, then a grep that finds no tier amount outside the contracts package and that test

## 3. Backend (grade10)

Needs group 2 landed.

- [ ] 3.1 Tests first, in their own commit: rewrite the DB-lane amounts in `openingPrice`, `placeBid`, `autoBidding` and `resolveStandingMaxima` specs, `listings/live`, `listings/schedule`, `internalBids/commit` and the `resolveAutomaticMaximumOutcome` test from the configuration; add the change cases that seed an open lot with a standing leader, read `bidFloor` under two schedules and assert the stored rows are unchanged (`g10.auction-bid-increments.SC-a64`, `g10.auction-bid-increments.SC-bj0`, `g10.auction-bid-increments.SC-w3o`, `g10.auction-bid-increments.SC-ywg`, `g10.auction-bid-increments.SC-tke`), and add a failing case that bids the minimum plus one minor unit through the API and asserts the refusal names the whole-dollar rule and the price, leader and maximum are unchanged (`g10.auction-bid-increments.SC-cx4`), and failing cases that create and save a draft with a starting price of a whole-dollar amount plus one minor unit and assert the refusal names the rule and the stored price is unchanged (`g10.auction-bid-increments.SC-kc7`)
- [ ] 3.2 Give `bidFloor` the optional schedule argument and confirm every backend caller reads the schedule through the contracts package, with no stored increment or minimum (`g10.auction-bid-increments.SC-a64`, `g10.auction-bid-increments.SC-w3o`)
- [ ] 3.3 Add the whole-dollar check beside `isMinorAmount` in `placeBid.ts`, and on the house path in `internalBids/commit.ts` and the test-bid path: refuse an amount that is not a multiple of the USD major unit with `INVALID_AMOUNT` and a message naming the rule, writing nothing; derive the unit from the money module's USD exponent (Q9, `g10.auction-bid-increments.SC-cx4`)
- [ ] 3.4 Reword the `INVALID_PRICING` messages that say "whole minor units" in `services/listings/draft.ts` and `services/listings/schedule.ts` to name the whole-dollar rule; `devFixtures/seedDevDraftListing.ts` and the admin form's `priceError` in `listingForm.ts` call `isStartingPrice`, so they follow, and `priceError`'s text changes with it (Q16, `g10.auction-bid-increments.SC-kc7`)
- [ ] 3.5 Before deploy, count existing listings whose `starting_price` is not a multiple of the USD major unit (consigned listings take `startingPrice` from the consignment ask's `priceMinor`, in `services/consigned/sync.ts`) and record the count and the owner's disposition in the landing summary; the rule is not applied to a stored row, and no migration is added unless the count is above 0 and the product manager decides one (Q16)
- [ ] 3.6 Verify: the backend unit and DB-lane suites for the auction package, and its typecheck

## 4. Collector site, admin preview and demo (grade10)

Needs groups 2 and 3 landed; verified against contracts and fixtures, not a running backend.

- [ ] 4.1 Tests first, in their own commit: rewrite `quickBidAmounts.test.ts`, `ListingView.test.tsx` and the demo `refusals.test.tsx` from the configuration, recompute the literal `minimumNextAmount` in `listingFixtures.ts` and `FixtureAuctionAdminProcedureClient.ts`, add a stale-minimum refusal case (`g10.auction-bid-increments.SC-w3o`, `g10.auction-bid-increments.SC-xjw`), and add a `ListingEditor` case that enters a starting price with cents and asserts the field shows the whole-dollar refusal and nothing is saved (`g10.auction-bid-increments.SC-kc7`)
- [ ] 4.2 Confirm the quick-bid chips, the view's `incrementMinor`, the `NextBids` admin preview and `FakeAuctionService` follow the configuration with no local copy, and change only what a failing test shows; the editor's starting-price refusal comes from `priceError` in `listingForm.ts`, changed in 3.4 (`g10.auction-bid-increments.SC-xjw`, `g10.auction-bid-increments.SC-kc7`)
- [ ] 4.3 Verify: the frontend, admin-frontend and demo package tests and typechecks

## 5. End-to-end cases (grade10)

Needs groups 2 and 3 landed.

- [ ] 5.1 Tests first, in their own commit: rewrite `tests/auction/bid-increments.spec.ts` to derive the lowest-tier, above and below amounts and the 10000 boundary row from the configuration, with one boundary case per configured tier through `plusIncrement`, "below" being the minimum minus one whole dollar, add one case that enters a starting price with cents in the listing editor and asserts the refusal (`g10.auction-bid-increments.SC-kc7`), and replace the cents literals (`BELOW_OPENING_ROWS`, `USD_BOUNDARY_ROWS`, the 10499 note on `USD_BELOW_FLOOR`) with whole-dollar amounts (`g10.auction-bid-increments.SC-mn9`, `g10.auction-bid-increments.SC-u6t`, `g10.auction-bid-increments.SC-b2w`, `g10.auction-bid-increments.SC-xjw`, `g10.auction-bid-increments.SC-p50`)
- [ ] 5.2 Audit `opening-price`, `auction-bids`, `auction`, `account-record`, `bidding-history`, `internal-bid` and `phone` specs for literal tier-derived amounts, and move each to `plusIncrement` or the configuration (`g10.auction-bid-increments.SC-xjw`, `g10.auction-bid-increments.SC-w8f`)
- [ ] 5.3 Verify: the local e2e lane for the auction specs

## 6. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and groups 1 to 5 landed.

- [ ] 6.1 Walk each journey of `grade10-site-auction-bid-increments` end to end through the collector site: a bid across a tier boundary and the next minimum on the bid form (`grade10-site-auction-bid-increments-US-01`), and a bid in USD on a lot that carried another currency (`grade10-site-auction-bid-increments-US-03`); keep the walks as the change's end-to-end suite
- [ ] 6.2 Flip the cases the walks decide with `pnpm run tcs:automated <case...> --decided-by <walk path>`, a walk in grade10 named `grade10:<path>`, in the walks' own commit; name the cases that stay manual in the suite and in the walk's `rounds.md` row
- [ ] 6.3 Verify: the walk specs pass in the local lane and the manual's `pnpm check:manual` passes in `grade10-spec`
