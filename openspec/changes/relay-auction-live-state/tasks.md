## 1. Store Clock Blocks and Product Record (grade10-spec)

- [ ] 1.1 Pin the shared clock in Storybook scenario tests: one frame loop drives every countdown block, a countdown rounds up, and a block reads its clock from `ClockProvider` (`grade10-site-auction-listing-page-SC-34`)
- [ ] 1.2 Add `ClockProvider`, `createFrameClockStore`, `useRemainingSeconds` and `remainingSeconds` to `@grade10/ui`, and move the countdown, the Featured banner, bid history and user bid history onto them with their props unchanged and no new copy (`grade10-site-auction-listing-page-SC-34`)
- [ ] 1.3 Keep the 🚧 lines this change delivers in `docs/prds/products/grade10-site/auction/bidding.md`, `display.md` and `docs/prds/platform/auction-service.md` matching the accepted contract, and lift them once implementation is verified
- [ ] 1.4 Verify: `pnpm --filter @grade10/ui` story tests, `pnpm run validate:changes relay-auction-live-state`, `pnpm check:manual`

## 2. Clock Rule and Live Contracts (grade10)

- [ ] 2.1 Tests: the `liveClock` case table, its SQL twin over the same table, the round-up rule, and the frame codecs decoding a missing `version` as 0 (`grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`, `grade10-site-auction-auction-SC-76`)
- [ ] 2.2 Add `liveClock`, `nextDeadlineAt` and the lot and catalogue frame codecs to `@grade10/auction-contracts`, and the additive payload fields `version`, `hasAcceptedBid`, `ledgerTotal`, `extensionSeconds`, `extensionCapSeconds` and `topAmountMinor` (`grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`)
- [ ] 2.3 Map `published` to Upcoming or Active by `starts_at` alone, so no public read reports Ended before the close is recorded (`grade10-site-auction-auction-SC-71`)
- [ ] 2.4 Verify: contracts unit tests, `pnpm run typecheck`, `pnpm run lint`

## 3. Listing Version (grade10)

- [ ] 3.1 Tests: a listing update, a bid insert and a bid state, amount or maximum change each raise the listing's version, and a no-op update does not (`grade10-site-auction-auction-SC-75`)
- [ ] 3.2 Migration `0013_listing_version`: the `version` column and its triggers armed `ENABLE ALWAYS`, through the counter-trigger helper in `@grade10/postgres` (`grade10-site-auction-auction-SC-75`)
- [ ] 3.3 Verify: migration checks, `pnpm run test:pg` for the auction schema

## 4. Close Rules (grade10)

- [ ] 4.1 Tests: the bounded late window, a cap of 0, a bid at exactly the scheduled close, a confirm after the effective close, a lone pending first bid, and which bids extend (`grade10-site-auction-auction-SC-67`, `grade10-site-auction-auction-SC-68`, `grade10-site-auction-auction-SC-69`, `grade10-site-auction-auction-SC-81`, `grade10-site-auction-auction-SC-82`, `grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`, `grade10-site-auction-auction-SC-85`)
- [ ] 4.2 Bound the bid and confirm paths at the scheduled close plus the extension reach, count a bid at exactly the scheduled close, and read a cap of 0 as extension off (`grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`, `grade10-site-auction-auction-SC-85`)
- [ ] 4.3 Judge a hold confirm under the lock by the clock read after it: past the effective close it loses and releases its hold, and the close marks a still-pending bid lost (`grade10-site-auction-auction-SC-67`, `grade10-site-auction-auction-SC-68`, `grade10-site-auction-auction-SC-69`)
- [ ] 4.4 Extend only on a price-moving bid, equal maxima at a higher price included (`grade10-site-auction-auction-SC-81`, `grade10-site-auction-auction-SC-82`)
- [ ] 4.5 Verify: auction db and pg lanes, `pnpm run typecheck`, `pnpm run lint`

## 5. Settle and the Change Signal (grade10)

- [ ] 5.1 Tests: `settleIfDue` from the alarm, a deferred read and the sweep, two settles racing, a bid refused past the close while the close fails, and every writer signalling after commit (`grade10-site-auction-auction-SC-70`, `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72`, `grade10-site-auction-auction-SC-73`, `grade10-site-auction-auction-SC-74`)
- [ ] 5.2 Add `settleIfDue`, `settleDepsOf` and the deferred settle, and turn the sweep's close and publish into settle loops counted as repairs (`grade10-site-auction-auction-SC-70`, `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72`, `grade10-site-auction-auction-SC-73`)
- [ ] 5.3 Refuse a bid or confirm on a lot past its effective close without settling inside it (`grade10-site-auction-auction-SC-74`)
- [ ] 5.4 Make `withListingLock` the only listing lock, with `events` required on every writer and the signal sent after commit when the version rose; add the `check-listing-lock` script (`grade10-site-auction-auction-SC-75`)
- [ ] 5.5 Verify: auction db, pg and workers lanes, `close.lag_ms` and repair metrics emitted, `pnpm run typecheck`, `pnpm run lint`

## 6. Rooms and Routes (grade10)

- [ ] 6.1 Tests: the time route, the socket routes' 404 with the flag off, `Origin` and rate refusals, `hello`, `state` and `gone` frames, the alarm settling through `AuctionRoomWork`, and frames carrying only public facts (`grade10-site-auction-auction-SC-75`, `grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-78`, `grade10-site-auction-auction-SC-79`, `grade10-site-auction-auction-SC-80`)
- [ ] 6.2 Add `GET /auction/api/public/time` (`grade10-site-auction-auction-SC-80`)
- [ ] 6.3 Add the `AuctionRoom` class for lots and the catalogue, `AuctionRoomWork`, the `/live/lot/<id>` and `/live/catalogue` routes, and the `auction.realtime` flag gating routes and signals (`grade10-site-auction-auction-SC-75`, `grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-78`, `grade10-site-auction-auction-SC-79`)
- [ ] 6.4 Bind `AUCTION_ROOM`, `ROOM_WORK` and `LIVE_CONNECT_LIMITER` per environment with the room's class migration, and document the deploy order and monitors in `docs/deployment.md` and `docs/operations.md`
- [ ] 6.5 Verify: auction workers lane, the room load script against staging, `pnpm run typecheck`, `pnpm run lint`

## 7. Lot Page (grade10)

- [ ] 7.1 Tests: the server clock's probes and anchor, re-probing, the no-raise correction, the frame loop, `higherVersion` against a racing fetch, the polling fallback, and the closing panel (`grade10-site-auction-listing-page-SC-29`, `grade10-site-auction-listing-page-SC-30`, `grade10-site-auction-listing-page-SC-31`, `grade10-site-auction-listing-page-SC-32`, `grade10-site-auction-listing-page-SC-33`, `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-35`, `grade10-site-auction-listing-page-SC-36`, `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-39`, `grade10-site-auction-listing-page-SC-40`)
- [ ] 7.2 Count the lot page down on the server clock through the store's `ClockProvider` (`grade10-site-auction-listing-page-SC-33`, `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-35`, `grade10-site-auction-listing-page-SC-36`)
- [ ] 7.3 Open the lot socket in the browser only, write frames into the lot query by version, and poll when the socket cannot open (`grade10-site-auction-listing-page-SC-29`, `grade10-site-auction-listing-page-SC-30`, `grade10-site-auction-listing-page-SC-31`, `grade10-site-auction-listing-page-SC-32`)
- [ ] 7.4 Show Closed with no result past the effective close, the recorded result once it arrives, and the existing refusal words for a bid that did not count (`grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-39`, `grade10-site-auction-listing-page-SC-40`)
- [ ] 7.5 Verify: auction-frontend and grade10 frontend tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`

## 8. Catalogue and Featured (grade10)

- [ ] 8.1 Tests: the catalogue live hook applying frames by version, card countdowns on the server clock, and the polling fallback (`grade10-site-auction-auction-SC-65`, `grade10-site-auction-auction-SC-66`, `grade10-site-auction-auction-SC-77`)
- [ ] 8.2 Move catalogue cards and Featured onto the catalogue room and the shared clock (`grade10-site-auction-auction-SC-65`, `grade10-site-auction-auction-SC-66`, `grade10-site-auction-auction-SC-77`)
- [ ] 8.3 Verify: auction-frontend tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`

## 9. My Auctions (grade10)

- [ ] 9.1 Tests: a bidding row's auction price, a lot past its close keeping its standing in Active, and Won or Didn't win only from the recorded close (`grade10-site-auction-account-record-SC-64`, `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-67`)
- [ ] 9.2 Carry `topAmountMinor` on bidding rows and read each row's phase from the clock rule (`grade10-site-auction-account-record-SC-64`, `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-67`)
- [ ] 9.3 Verify: auction db lane, account-record frontend tests, `pnpm run typecheck`, `pnpm run lint`

## 10. The Walk (grade10)

Uses the `feature-tcs.md` suites as its input, reviewed with `/tcs-review relay-auction-live-state`; `/tcs-run-sheet` executes manual cases when needed. Groups 2 to 9 have landed.

- [ ] 10.1 One browser walk per journey, end to end through the storefront with `auction.realtime` on, kept in `apps/frontend/grade10/e2e/tests/auction/`: two bidders on one lot see each bid, the extension at the scheduled close, Closed then the result without a reload; a leader's raise does not extend; a late confirmation does not go through; My Auctions shows the final price to winner and loser (`grade10-site-auction-auction-US-11`, `grade10-site-auction-auction-US-12`, `grade10-site-auction-listing-page-US-12`, `grade10-site-auction-listing-page-US-13`, `grade10-site-auction-listing-page-US-14`, `grade10-site-auction-account-record-US-10`)
- [ ] 10.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks' own commit; the cases that stay manual are named in the walk's `rounds.md` row
- [ ] 10.3 Verify: the auction e2e suite, `pnpm run tcs:validate`
