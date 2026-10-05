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
      `listing-bid-money.test.ts` names each scenario it proves in its
      titles. `shared-ui-auction-listing-SC-38`,
      `shared-ui-auction-listing-SC-39`, `shared-ui-auction-listing-SC-40`,
      `shared-ui-auction-listing-SC-41`, `shared-ui-auction-listing-SC-42`,
      `shared-ui-auction-listing-SC-53`
- [x] 2.2 Wire `sanitizeCustomMaximumDraft` and
      `CUSTOM_MAXIMUM_MAJOR_CEILING` through the custom maximum field on
      `ListingQuickMaximumBidActions` for set and raise, with silent restore
      and no dedicated too-large status; the raise path is walked, not
      unit-tested (`shared-ui-auction-listing-US1-TC24-1`).
- [x] 2.3 Keep Storybook `ListingAuctionBidCard` → CustomMaximumCeiling
      covering paste restore and digit-by-digit restore.
- [x] 2.4 Verify — `pnpm --dir packages/ui test` for listing-bid-money and
      related bid-card coverage; `pnpm run typecheck` as needed.

## 3. The walk (grade10-spec) (owner: @mason5991)

Uses draft `feature-tcs.md` as its input; human QA reviews cases after deployment (`/tcs-review cap-custom-maximum-entry`), and `/tcs-run-sheet` executes manual cases when needed.

- [x] 3.1 Walk the Custom maximum ceiling cases on Storybook
      CustomMaximumCeiling and Leading (raise): at-ceiling accept, typed
      restore, paste from empty, paste restore, fractional paste, silent
      refuse. `shared-ui-auction-listing-US1-TC19-1`,
      `shared-ui-auction-listing-US1-TC20-1`,
      `shared-ui-auction-listing-US1-TC21-1`,
      `shared-ui-auction-listing-US1-TC22-1`,
      `shared-ui-auction-listing-US1-TC23-1`,
      `shared-ui-auction-listing-US1-TC24-1`,
      `shared-ui-auction-listing-US1-TC25-1`
- [x] 3.2 Verify — leave the walk as the change's end-to-end evidence; flip
      automated only the cases unit tests already decide with
      `pnpm run tcs:automated`, and name any that stay manual in the round
      row.
- [ ] 3.3 Walk the fractional paste at the ceiling on CustomMaximumCeiling:
      seeded `500`, paste `9999999999.99`, the draft reads `9999999999`.
      `shared-ui-auction-listing-US1-TC26-1`

## 4. JPY bid ceiling (grade10) (owner: @htonyl)

- [ ] 4.1 Tests first, in their own commit: `bidIncrements.test.ts` pins
      `bidCeiling("JPY")` at `5_000_000_000`; `placeBid.spec.ts` refuses a
      JPY maximum of `5_000_000_001` naming `5_000_000_000`; every test
      and fixture amount the old ceiling named moves under the new one,
      `quickBidAmounts.test.ts` included; the e2e
      `custom-maximum-ceiling.spec.ts` cites the ceiling cases it drives,
      `TC19` to `TC25`.
      `grade10-site-auction-bid-increments-SC-08`,
      `grade10-site-auction-bid-increments-SC-10`
- [ ] 4.2 Set `AUCTION_BID_CEILINGS.JPY` to `5_000_000_000` in
      `packages/grade10-auction/contracts/src/bidIncrements.ts`.
- [ ] 4.3 Verify - `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
      and the auction backend lane.

## 5. Bid ceiling walk (grade10)

- [ ] 5.1 Walk the JPY rows against the deployed service: a lot starting at
      JPY 5,000,000,000 takes one first bid there, and a maximum of
      5,000,000,001 sent to the service is refused naming the ceiling.
      `grade10-site-auction-bid-increments-US1-TC8-2`,
      `grade10-site-auction-bid-increments-US2-TC3-2`
