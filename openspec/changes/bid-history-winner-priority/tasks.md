## 1. Spec and product record (grade10-spec) (owner: @tangconst)

- [x] 1.1 Keep the auction-listing delta, journeys, feature suite, and
      decisions aligned with winner crown and equal-max tip.
- [x] 1.2 Confirm Bidding Auction Panel and Listing Page Blocks Bid History
      🚧 lines name closed winner crown and equal-max tip.
- [x] 1.3 Verify — `pnpm run validate:changes bid-history-winner-priority`
      and `pnpm check:manual`.

## 2. Shared UI public bid history (grade10-spec) (owner: @tangconst)

- [x] 2.1 Add `isWinner` on `ListingBidHistoryRow`, primary crown and tip
      copy on `ListingBidHistoryList` / bid-card copy, and i18n
      `bidHistoryWinner` plus earlier-leads `samePricePriorityTip`.
      `shared-ui-auction-listing-SC-50`, `shared-ui-auction-listing-SC-51`
- [x] 2.2 Storybook `ListingAuctionBidCard` → ClosedSoldEqualMax covers
      winner crown and equal-max tip; preview closed history sets
      `isWinner` when sold.
- [x] 2.3 Verify — `pnpm run typecheck` as needed.
- [ ] 2.4 Draw the crown only where `copy.winner` is supplied, with no
      built-in name, and correct the `isWinner` doc comment in `types.ts`
      from badge to crown; the Default and ClosedSoldEqualMax plays still
      pass. `shared-ui-auction-listing-SC-50`

## 3. The walk (grade10-spec) (owner: @tangconst)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review bid-history-winner-priority`), and `/tcs-run-sheet` executes manual cases when needed.

- [x] 3.1 Walk ClosedSoldEqualMax and Default: Winner after close, tip on
      equal-max non-leader, no Winner on live Default.
      `shared-ui-auction-listing-US1-TC27-1`,
      `shared-ui-auction-listing-US1-TC28-1`
- [x] 3.2 Verify — leave the walk as the change's end-to-end evidence;
      story play decides the automated cases.

## 4. Lot page flags (grade10) (owner: @tangconst)

- [x] 4.1 `listingBidHistory` sets `isWinner` on the won row of a lot in its
      sold panel and `samePricePriority` on a public row ranked below another
      of the same amount; `ListingView` threads `bidHistoryWinner` and
      `samePricePriorityTip`. Built and tested in `listingLotExtras.test.ts`
      (`684cdc9`). `grade10-site-auction-listing-page-SC-48`,
      `grade10-site-auction-listing-page-SC-49`
- [ ] 4.2 Bump `external/grade10-spec` to the commit carrying task 2.4.
- [ ] 4.3 Walk the lot page on the isolated stack: no crown while live, the
      crown on the won row once the close is recorded, and the tip on a tied
      maximum that came second.
      `grade10-site-auction-listing-page-US14-TC7-1`,
      `grade10-site-auction-listing-page-US12-TC7-1`
