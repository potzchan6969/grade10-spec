## 1. Spec and product record (grade10-spec) (owner: @tangconst)

- [x] 1.1 Keep the auction-listing delta, journeys, feature suite, and
      decisions aligned with winner crown and equal-max tip.
- [x] 1.2 Confirm Bidding Auction Panel and Listing Page Blocks Bid History
      🚧 lines name closed winner crown and equal-max tip.
- [x] 1.3 Verify — `pnpm run validate:changes bid-history-winner-priority`
      and `pnpm check:manual`.

## 2. Shared UI public bid history (grade10-spec) (owner: @htonyl)

- [x] 2.1 Add `isWinner` on `ListingBidHistoryRow`, primary crown and tip
      copy on `ListingBidHistoryList` / bid-card copy, and i18n
      `bidHistoryWinner` plus earlier-leads `samePricePriorityTip`; the
      ClosedSoldEqualMax story names the scenarios its play proves.
      `shared-ui-auction-listing-SC-50`, `shared-ui-auction-listing-SC-51`
- [x] 2.2 Storybook `ListingAuctionBidCard` → ClosedSoldEqualMax covers
      winner crown and equal-max tip; preview closed history sets
      `isWinner` when sold.
- [x] 2.3 Verify — `pnpm run typecheck` as needed.
- [x] 2.4 Draw the crown only where `copy.winner` is supplied, with no
      built-in name, and correct the `isWinner` and `samePricePriority` doc
      comments in `types.ts` (a crown, not a badge; any tied row listed
      below another, not only at the leading price); the Default and ClosedSoldEqualMax plays still
      pass, and a story renders ClosedSoldEqualMax with `winner` copy unset
      for the walk. `shared-ui-auction-listing-SC-50`,
      `shared-ui-auction-listing-SC-54`

## 3. The walk (grade10-spec) (owner: @htonyl)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review bid-history-winner-priority`), and `/tcs-run-sheet` executes manual cases when needed.

- [x] 3.1 Walk ClosedSoldEqualMax and Default: Winner after close, tip on
      equal-max non-leader, no Winner on live Default.
      `shared-ui-auction-listing-US1-TC27-1`,
      `shared-ui-auction-listing-US1-TC28-1`
- [x] 3.2 Verify — leave the walk as the change's end-to-end evidence; every
      case stays manual until task 2.4's plays assert the crown's place and
      colour and the tip's tone, then flip them with `pnpm run tcs:automated`.
- [ ] 3.3 Walk the story task 2.4 adds, with `winner` copy unset: no row
      shows a crown or the name Winner.
      `shared-ui-auction-listing-US1-TC29-1`

## 4. Lot page flags (grade10) (owner: @htonyl)

- [x] 4.1 `listingBidHistory` sets `isWinner` on the won row of a lot in its
      sold panel; `ListingView` threads `bidHistoryWinner` and
      `samePricePriorityTip`. Built in `684cdc9`.
- [x] 4.2 Name in the test titles every scenario they prove: the mapper's
      in `listingLotExtras.test.ts` for the crown and the tip, and the
      backend's `autoBidding.spec.ts` for a tie listing the earlier maximum
      first once both are outbid, which the one-ms answer stamp in
      `resolveStandingMaxima.ts` keeps. For two rows equal on standing and
      time, the mapper keeps the ledger's order rather than ranking by
      pseudonym, with a test.
      `grade10-site-auction-listing-page-SC-48`,
      `grade10-site-auction-listing-page-SC-49`,
      `grade10-site-auction-listing-page-SC-50`,
      `grade10-site-auction-listing-page-SC-51`
- [x] 4.3 Bump `external/grade10-spec` to the commit carrying task 2.4.
- [ ] 4.4 Walk the lot page on the isolated stack: no crown while live, the
      crown on the won row once the close is recorded, and the tip on a tied
      maximum that came second, at the current price and at an older tie
      lower down; no crown on a lot without a winner.
      `grade10-site-auction-listing-page-US14-TC7-1`,
      `grade10-site-auction-listing-page-US12-TC7-1`,
      `grade10-site-auction-listing-page-US14-TC8-1`,
      `grade10-site-auction-listing-page-US12-TC8-1`
