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

## 3. The walk (grade10-spec) (owner: @tangconst)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review bid-history-winner-priority`), and `/tcs-run-sheet` executes manual cases when needed.

- [x] 3.1 Walk ClosedSoldEqualMax and Default: Winner after close, tip on
      equal-max non-leader, no Winner on live Default.
      `shared-ui-auction-listing-US1-TC13-1`,
      `shared-ui-auction-listing-US1-TC14-1`
- [x] 3.2 Verify — leave the walk as the change's end-to-end evidence;
      story play decides the automated cases.
