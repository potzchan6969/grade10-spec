## 1. Bidding Rules page (grade10-spec)

- [ ] 1.1 Keep the Bidding History line and the "Story order" decision row on the Bidding Rules page in step with the accepted delta (`grade10-site-auction-bidding-history-SC-12`, `grade10-site-auction-bidding-history-SC-54`, `grade10-site-auction-bidding-history-SC-55`, `grade10-site-auction-bidding-history-SC-56`)
- [ ] 1.2 Verify: `pnpm check:manual`, `pnpm run validate:changes`

## 2. Bid-amount order in the combined history (grade10)

Depends on group 1's landing and the submodule bump.

- [ ] 2.1 Add the failing ordering tests and flip the end-to-end expectation for the challenger-and-response step: the automatic response above the challenger's bid, a maximum set below the bid it causes, a higher amount above a lower; check that no expectation reads a maximum set above its later raise; commit tests before code and tick last (`grade10-site-auction-bidding-history-SC-12`, `grade10-site-auction-bidding-history-SC-54`, `grade10-site-auction-bidding-history-SC-55`, `grade10-site-auction-bidding-history-SC-56`, `grade10-site-auction-bidding-history-SC-14`, `grade10-site-auction-bidding-history-SC-48`)
- [ ] 2.2 Change the ordering comparison in `combinedHistory.ts` so the history reads by bid amount, higher first, with the same-timestamp rule, before the cursor is cut; the admin Bids tab is left alone (`grade10-site-auction-bidding-history-SC-12`, `grade10-site-auction-bidding-history-SC-54`, `grade10-site-auction-bidding-history-SC-55`, `grade10-site-auction-bidding-history-SC-56`, `grade10-site-auction-bidding-history-SC-14`, `grade10-site-auction-bidding-history-SC-48`)
- [ ] 2.3 Verify: focused unit tests, type check, lint

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and group 2 landed.

- [ ] 3.1 Walk `grade10-site-auction-bidding-history-US-03` end to end on `/bids` in `apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts`, kept as the change's end-to-end suite
- [ ] 3.2 Flip the cases the walk decides with `pnpm run tcs:automated <case…> --decided-by grade10:apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts` in the walk's own commit; the cases that stay manual are named in the walk's `rounds.md` row
- [ ] 3.3 Verify: the focused end-to-end pass
