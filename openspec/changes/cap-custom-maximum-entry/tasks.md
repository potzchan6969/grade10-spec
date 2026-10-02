## 1. Spec and product record (grade10-spec) (owner: @mason5991)

- [x] 1.1 Keep the auction-listing delta, journeys, feature suite, and
      decisions aligned with the custom maximum ceiling.
- [x] 1.2 Confirm the Custom Maximum 🚧 ceiling line and the bidding Auction
      Panel / decisions row name 9,999,999,999 with restore-on-overshoot.
- [x] 1.3 Verify — `pnpm run validate:changes cap-custom-maximum-entry` and
      `pnpm run tcs:validate`.

## 2. Shared UI custom maximum ceiling (grade10-spec) (owner: @mason5991)

- [x] 2.1 Add unit tests that the custom maximum draft accepts
      `9999999999`, restores on typed and pasted overshoot (including empty
      and fractional-after-clean), and shares the rule on set and raise.
      `shared-ui-auction-listing-SC-38`, `shared-ui-auction-listing-SC-39`,
      `shared-ui-auction-listing-SC-40`, `shared-ui-auction-listing-SC-41`,
      `shared-ui-auction-listing-SC-42`, `shared-ui-auction-listing-SC-43`
- [x] 2.2 Wire `sanitizeCustomMaximumDraft` and
      `CUSTOM_MAXIMUM_MAJOR_CEILING` through the custom maximum field on
      `ListingQuickMaximumBidActions` for set and raise, with silent restore
      and no dedicated too-large status.
- [x] 2.3 Keep Storybook `ListingAuctionBidCard` → CustomMaximumCeiling
      covering paste restore and digit-by-digit restore.
- [x] 2.4 Verify — `pnpm --dir packages/ui test` for listing-bid-money and
      related bid-card coverage; `pnpm run typecheck` as needed.

## 3. The walk (grade10-spec) (owner: @mason5991)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review cap-custom-maximum-entry`), and `/tcs-run-sheet` executes manual cases when needed.

- [x] 3.1 Walk the Custom maximum ceiling cases on Storybook
      CustomMaximumCeiling and Leading (raise): at-ceiling accept, typed
      restore, paste from empty, paste restore, fractional paste, silent
      refuse. `shared-ui-auction-listing-US1-TC3-1`,
      `shared-ui-auction-listing-US1-TC4-1`,
      `shared-ui-auction-listing-US1-TC5-1`,
      `shared-ui-auction-listing-US1-TC6-1`,
      `shared-ui-auction-listing-US1-TC7-1`,
      `shared-ui-auction-listing-US1-TC8-1`,
      `shared-ui-auction-listing-US1-TC9-1`
- [x] 3.2 Verify — leave the walk as the change's end-to-end evidence; flip
      automated only the cases unit tests already decide with
      `pnpm run tcs:automated`, and name any that stay manual in the round
      row.
