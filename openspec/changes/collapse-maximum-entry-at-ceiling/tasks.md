## 1. Ceiling-Aware Floor And Chips (grade10-spec)

- [x] 1.1 Add failing helper regressions for the null floor and the clamped, merged chip amounts, and a rendered component regression for the collapsed row - no chips, no field, no bid action, the amount and limit line shown, the fee line intact - in both collapse readings and under the needs-card lock; commit tests before code and tick last (`shared-ui-auction-listing-SC-61`, `shared-ui-auction-listing-SC-62`, `shared-ui-auction-listing-SC-63`, `shared-ui-auction-listing-SC-64`, `shared-ui-auction-listing-SC-65`, `shared-ui-auction-listing-SC-66`)
- [x] 1.2 Pass `ceilingMinor` into `resolveMaximumFloor` (returning `null` above the ceiling) and `quickMaximumPresetAmount` (returning the clamped amount with a `clamped` flag); collapse the entry group in `ListingQuickMaximumBidActions` before presets and before the enrollment lock; dedupe merged chips and caption the clamped chip with the new `ceilingChip` key (`shared-ui-auction-listing-SC-61`, `shared-ui-auction-listing-SC-62`, `shared-ui-auction-listing-SC-63`, `shared-ui-auction-listing-SC-64`, `shared-ui-auction-listing-SC-65`, `shared-ui-auction-listing-SC-66`)
- [x] 1.3 Add `maximumAtCeiling`, `biddingAtCeiling` and `ceilingChip` to the copy type and the shared `auctionListing` catalog in all four locales; update the story copy map, the preview fixtures with at-ceiling and near-ceiling views, and the `MaximumAtCeiling`, `LotAtCeilingWithoutMaximum` and `ChipsClampedAtCeiling` stories; update the Listing Page Blocks and Bidding Rules pages
- [ ] 1.4 Verify focused helper/component tests, catalog validation, UI/preview type checks, lint, story tests and browser evidence that no amount above HK$80,000,000 renders; prepare a reviewable shared-source PR with merge left to coordinator authorization

## 2. Collector Copy Supply (grade10)

Depends on group 1's authorized landing and shared submodule update.

- [ ] 2.1 Add a failing view/copy regression asserting the three keys reach the bid card - a collapsed panel at the ceiling and a clamped chip caption - before wiring; commit tests before code and tick last (`shared-ui-auction-listing-SC-64`, `shared-ui-auction-listing-SC-65`, `shared-ui-auction-listing-SC-61`)
- [ ] 2.2 Move the submodule pin and supply `maximumAtCeiling`, `biddingAtCeiling` and `ceilingChip` from the catalog through the existing copy prop; no view or adapter change is needed - `ceilingMinor` is already supplied
- [ ] 2.3 Verify focused view tests and package/app type checks on the new required copy keys

## 3. The walk (grade10)

Uses draft capability suites as planning input after groups 1 and 2 land. QA integration supplies exact case identifiers.

- [ ] 3.1 Walk the bid panel through native collector entry: a leader at the ceiling collapses to the status row, a near-ceiling leader sees a clamped limit chip, and a lot priced past the ceiling offers no entry - asserting no amount above the ceiling renders
- [ ] 3.2 Keep browser walks as the change's E2E suite; mark only decided cases automated with `pnpm run tcs:automated <case...> --decided-by grade10:<walk-path>` in their commit, naming remaining manual cases in the walk's rounds row
- [ ] 3.3 Verify the focused E2E pass and record final journey outcomes
