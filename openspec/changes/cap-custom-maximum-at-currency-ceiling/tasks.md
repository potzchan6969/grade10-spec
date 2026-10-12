## 1. Shared Ceiling Contract And Field (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Add failing helper and rendered component regressions for currency ceilings, cleaning, append restore, paste/replacement clamp, exact-ceiling set/raise callbacks and native DOM agreement; commit tests before code and tick last (`shared-ui-auction-listing-SC-38`, `shared-ui-auction-listing-SC-39`, `shared-ui-auction-listing-SC-40`, `shared-ui-auction-listing-SC-41`, `shared-ui-auction-listing-SC-42`, `shared-ui-auction-listing-SC-43`, `shared-ui-auction-listing-SC-53`, `shared-ui-auction-listing-SC-58`, `shared-ui-auction-listing-SC-59`, `shared-ui-auction-listing-SC-60`)
- [ ] 1.2 Require the consumer ceiling in the bid view, replace the universal cap with exact supplied-ceiling comparison, distinguish genuine single-digit append from multi-character replacement/paste, and align DOM/state/reviewed amounts in set and raise (`shared-ui-auction-listing-SC-38`, `shared-ui-auction-listing-SC-39`, `shared-ui-auction-listing-SC-40`, `shared-ui-auction-listing-SC-41`, `shared-ui-auction-listing-SC-42`, `shared-ui-auction-listing-SC-43`, `shared-ui-auction-listing-SC-53`, `shared-ui-auction-listing-SC-58`, `shared-ui-auction-listing-SC-59`, `shared-ui-auction-listing-SC-60`)
- [ ] 1.3 Update shared fixtures, preview and existing ceiling/leading stories with supplied ceilings and native interactions; align the existing customAmountPlaceholder catalog key with the agreed {amount} min. story treatment in English and equivalent short minimum wording in the other locales; preserve the numeric formatter and backend policy
- [ ] 1.4 Verify focused money/component tests, catalog validation, UI/preview type checks, browser story evidence and the rendered English placeholder against the owner's example, formatting and manual checks; prepare a reviewable shared-source PR with merge left to coordinator authorization

## 2. Collector Ceiling Wiring And Refusal Presentation (grade10) (owner: @htonyl)

Depends on group 1's authorized landing and shared submodule update.

- [ ] 2.1 Add failing adapter, mapper and ListingView regressions for supplied ceilings and silent AMOUNT_TOO_HIGH with/without ceiling data, unchanged draft, one mutation only and other refusal copy; commit tests before code and tick last (`shared-ui-auction-listing-SC-58`, `grade10-site-auction-auction-SC-91`, `grade10-site-auction-auction-SC-92`, `grade10-site-auction-auction-SC-103`)
- [ ] 2.2 Update the shared pin and collector bid-view consumers from bidCeiling(currency); return no copy for AMOUNT_TOO_HIGH and finish bid status without a message, reset props or retry (`shared-ui-auction-listing-SC-58`, `grade10-site-auction-auction-SC-91`, `grade10-site-auction-auction-SC-92`, `grade10-site-auction-auction-SC-103`)
- [ ] 2.3 Verify focused adapter/mapper/view tests, package/app type checks, required change-sensitive checks and unchanged floor/identity refusal behavior

## 3. Neighbor Ceiling Verification (grade10) (owner: @htonyl)

The backend contract stays unchanged.

- [ ] 3.1 Record existing passing backend ceiling evidence and the browser route that input limiting supersedes; plan authenticated API execution for the retained refusal assertions without requiring an artificial failing backend regression (`grade10-site-auction-bid-increments-SC-08`, `grade10-site-auction-bid-increments-SC-09`, `grade10-site-auction-bid-increments-SC-10`, `grade10-site-auction-bid-increments-SC-11`)
- [ ] 3.2 Adapt neighboring ceiling execution and trace support to direct authenticated oversized requests; retain refusal code/ceiling, no maximum, unchanged price/leader and operational-log assertions; keep eligible exact-ceiling acceptance through UI (`grade10-site-auction-bid-increments-SC-08`, `grade10-site-auction-bid-increments-SC-09`, `grade10-site-auction-bid-increments-SC-10`, `grade10-site-auction-bid-increments-SC-11`)
- [ ] 3.3 Verify neighboring ceiling tests and unchanged backend contract tests independently; record proof without changing validation or logs

## 4. The walk (grade10)

Uses draft capability suites as planning input after groups 1 to 3 land. QA integration supplies exact case identifiers.

- [ ] 4.1 Walk shared field behavior through native collector set/raise entry in USD/HKD/JPY: exact ceiling, genuine typed append, oversized fill/selection replacement, paste into empty/existing draft and fractions; assert DOM, reviewed amount and committed minor units agree without messages
- [ ] 4.2 Walk `grade10-site-auction-auction-US-14` through defensive above-ceiling and normal below-minimum refusals, proving no retry/reset or false records and unchanged other messages; walk `grade10-site-auction-bid-increments-US-02` through exact-ceiling UI entry and authenticated API refusal
- [ ] 4.3 Keep browser/API walks as the change's E2E suite; mark only decided cases automated with `pnpm run tcs:automated <case...> --decided-by grade10:<walk-path>` in their commit, naming remaining manual cases in the walk's rounds row
- [ ] 4.4 Verify focused E2E and neighboring ceiling execution together, attach before/after input evidence and record final journey outcomes
