## 1. Store Clock Blocks and Product Record (grade10-spec) (owner: @ecchochan)

- [x] 1.1 Pin the shared clock in Storybook scenario tests: one frame loop drives every countdown block, a countdown rounds up to whole seconds with no tenths, and a block reads its clock from `ClockProvider` (`grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-44`)
- [x] 1.2 Add `ClockProvider`, `createFrameClockStore`, `useRemainingSeconds` and `remainingSeconds` to `@grade10/ui`, and move the countdown, the Featured banner, bid history and user bid history onto them with their props unchanged, no new copy and whole seconds only (`grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-44`)
- [ ] 1.3 Keep the 🚧 lines this change delivers in `docs/prds/products/grade10-site/auction/bidding.md`, `display.md` and `docs/prds/platform/auction-service.md` matching the accepted contract, and lift them once implementation is verified
- [ ] 1.4 Keep the 🚧 lines on Auction Management · Listings and Bidding · Auction Logic matching the deltas while groups 10 to 12 land; the two unmarked lines they overturn - "positive" in Listings' Refused line (Q20) and "plus one increment" in Bidding's A first maximum line (Q27) - are rewritten when the 🚧 comes off
- [x] 1.5 Add `auctionListing.bidDidNotGoThrough` in en, ko, zh-Hans and zh-Hant, each holding that locale's existing first sentence of `authorizationProviderFailure`, which keeps its full string (Q13)
- [x] 1.6 Verify: `pnpm --filter @grade10/ui` story tests, `pnpm --filter @grade10/i18n test`, `pnpm run validate:changes relay-auction-live-state`, `pnpm check:manual`
- [x] 1.7 Tests, no behaviour change: the block already reads chip 1x as the opening price before any bid, and no test covers it - the `quickMaximumPresetAmount` cases in `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts` all have a bid. Add a non-leader case there with no bid - opening price 48000 as the floor and the current bid, increment 2000, chips 48000, 52000 and 56000 - and a `LiveNoBids` play in `listing-auction-bid-card.stories.tsx` asserting the "Min. bid" chip reads the opening price (Q28) (`shared-ui-auction-listing-SC-52`)

## 2. Clock Rule and Live Contracts (grade10) (owner: @ecchochan)

- [x] 2.1 Tests: the `liveClock` case table, its SQL twin over the same table, the round-up rule, and the frame codecs decoding a missing `version` as 0 (`grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`, `grade10-site-auction-auction-SC-76`)
- [x] 2.2 Add `liveClock`, `nextDeadlineAt` and the lot and catalogue frame codecs to `@grade10/auction-contracts`, and the additive payload fields `version`, `hasAcceptedBid`, `ledgerTotal`, `extensionSeconds`, `extensionCapSeconds` and `topAmountMinor` (`grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`)
- [x] 2.3 Map `published` to Upcoming or Active by `starts_at` alone, so no public read reports Ended before the close is recorded (`grade10-site-auction-auction-SC-71`)
- [x] 2.4 Verify: contracts unit tests, `pnpm run typecheck`, `pnpm run lint`

## 3. Listing Version (grade10) (owner: @ecchochan)

- [x] 3.1 Tests: a listing update, a bid insert and a bid state, amount or maximum change each raise the listing's version, and a no-op update does not (`grade10-site-auction-auction-SC-75`)
- [x] 3.2 Migration `0013_listing_version`: the `version` column and its triggers armed `ENABLE ALWAYS`, through the counter-trigger helper in `@grade10/postgres` (`grade10-site-auction-auction-SC-75`)
- [x] 3.3 Verify: migration checks, `pnpm run test:pg` for the auction schema

## 4. Close Rules (grade10) (owner: @ecchochan)

- [x] 4.1 Tests: the bounded late window, a cap of 0, a bid at exactly the scheduled close, a confirm after the effective close, a lone pending first bid, a bid with holds off counting when placed, a bid at or past the recorded close in extended bidding, and which bids extend (`grade10-site-auction-auction-SC-05`, `grade10-site-auction-auction-SC-67`, `grade10-site-auction-auction-SC-68`, `grade10-site-auction-auction-SC-69`, `grade10-site-auction-auction-SC-81`, `grade10-site-auction-auction-SC-82`, `grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`, `grade10-site-auction-auction-SC-85`, `grade10-site-auction-auction-SC-86`, `grade10-site-auction-auction-SC-87`)
- [x] 4.2 Bound the bid and confirm paths at the scheduled close plus the extension reach, count a bid at exactly the scheduled close, judge a bid with holds off when placed, refuse a bid at or past the effective close however late the close is recorded, and read a cap of 0 as extension off (`grade10-site-auction-auction-SC-05`, `grade10-site-auction-auction-SC-83`, `grade10-site-auction-auction-SC-84`, `grade10-site-auction-auction-SC-85`, `grade10-site-auction-auction-SC-86`, `grade10-site-auction-auction-SC-87`)
- [x] 4.3 Judge a hold confirm under the lock by the clock read after it: past the effective close it loses and releases its hold, and the close marks a still-pending bid lost (`grade10-site-auction-auction-SC-67`, `grade10-site-auction-auction-SC-68`, `grade10-site-auction-auction-SC-69`)
- [x] 4.4 Extend only on a price-moving bid, equal maxima at a higher price included (`grade10-site-auction-auction-SC-81`, `grade10-site-auction-auction-SC-82`)
- [x] 4.5 Verify: auction db and pg lanes, `pnpm run typecheck`, `pnpm run lint`

## 5. Settle and the Change Signal (grade10) (owner: @ecchochan)

- [x] 5.1 Tests: `settleIfDue` from the alarm, a deferred read and the sweep, two settles racing, a bid refused past the close while the close fails, and every writer signalling after commit (`grade10-site-auction-auction-SC-70`, `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72`, `grade10-site-auction-auction-SC-73`, `grade10-site-auction-auction-SC-74`)
- [x] 5.2 Add `settleIfDue`, `settleDepsOf` and the deferred settle, and turn the sweep's close and publish into settle loops counted as repairs (`grade10-site-auction-auction-SC-70`, `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72`, `grade10-site-auction-auction-SC-73`)
- [x] 5.3 Refuse a bid or confirm on a lot past its effective close without settling inside it (`grade10-site-auction-auction-SC-74`)
- [x] 5.4 Make `withListingLock` the only listing lock, with `events` required on every writer and the signal sent after commit when the version rose; add the `check-listing-lock` script (`grade10-site-auction-auction-SC-75`)
- [x] 5.5 Verify: auction db, pg and workers lanes, `close.lag_ms` and repair metrics emitted, `pnpm run typecheck`, `pnpm run lint`

## 6. Rooms and Routes (grade10) (owner: @ecchochan)

- [x] 6.1 Tests: the time route, `Origin` and rate refusals, `hello`, `state` and `gone` frames, the alarm settling through `AuctionRoomWork`, and frames carrying only public facts (`grade10-site-auction-auction-SC-75`, `grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-79`, `grade10-site-auction-auction-SC-80`)
- [x] 6.2 Add `GET /auction/api/public/time` (`grade10-site-auction-auction-SC-80`)
- [x] 6.3 Add the `AuctionRoom` class for lots and the catalogue, `AuctionRoomWork`, the `/live/lot/<id>` and `/live/catalogue` routes, and the writers' signal after commit (`grade10-site-auction-auction-SC-75`, `grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-79`)
- [x] 6.4 Bind `AUCTION_ROOM`, `ROOM_WORK` and `LIVE_CONNECT_LIMITER` per environment with the room's class migration, and document the deploy order and monitors in `docs/deployment.md` and `docs/operations.md`
- [ ] 6.5 Verify: auction workers lane, the room load script against staging, `pnpm run typecheck`, `pnpm run lint`

## 7. Lot Page (grade10) (owner: @ecchochan)

- [x] 7.1 Tests: the server clock's probes and anchor, re-probing, the no-raise correction, the frame loop, `higherVersion` against a racing fetch, the polling fallback, a reconnect's catch-up, a `gone` frame, the standing re-read on a newer version, the refusal words, the closing panel and its return to Extended bidding on a later close (`grade10-site-auction-auction-SC-79`, `grade10-site-auction-listing-page-SC-29`, `grade10-site-auction-listing-page-SC-30`, `grade10-site-auction-listing-page-SC-31`, `grade10-site-auction-listing-page-SC-32`, `grade10-site-auction-listing-page-SC-33`, `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-35`, `grade10-site-auction-listing-page-SC-36`, `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-39`, `grade10-site-auction-listing-page-SC-40`, `grade10-site-auction-listing-page-SC-41`, `grade10-site-auction-listing-page-SC-42`, `grade10-site-auction-listing-page-SC-43`, `grade10-site-auction-listing-page-SC-44`, `grade10-site-auction-listing-page-SC-45`, `grade10-site-auction-listing-page-SC-46`)
- [x] 7.2 Count the lot page down on the server clock through the store's `ClockProvider` (`grade10-site-auction-listing-page-SC-33`, `grade10-site-auction-listing-page-SC-34`, `grade10-site-auction-listing-page-SC-35`, `grade10-site-auction-listing-page-SC-36`, `grade10-site-auction-listing-page-SC-44`)
- [x] 7.3 Open the lot socket in the browser only, write frames into the lot query by version, re-read the lot on `gone`, and poll when the socket cannot open (`grade10-site-auction-auction-SC-79`, `grade10-site-auction-listing-page-SC-29`, `grade10-site-auction-listing-page-SC-30`, `grade10-site-auction-listing-page-SC-31`, `grade10-site-auction-listing-page-SC-32`, `grade10-site-auction-listing-page-SC-41`)
- [x] 7.4 Show Closed with no result past the effective close, the recorded result once it arrives - Ended with No bids for no winner - and Extended bidding again on a later close (`grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-listing-page-SC-40`, `grade10-site-auction-listing-page-SC-42`, `grade10-site-auction-listing-page-SC-46`)
- [x] 7.5 Re-read the signed-in viewer's standing whenever the lot's version rises, so Outbid and the minimum next bid show live from the viewer's own read (`grade10-site-auction-listing-page-SC-43`)
- [x] 7.6 Show `auctionListing.bidDidNotGoThrough` alone for a `NOT_BIDDABLE` refusal and for a confirming bid the standing re-read finds lost past the close; a card that failed to authorize keeps `authorizationProviderFailure` (`grade10-site-auction-listing-page-SC-39`, `grade10-site-auction-listing-page-SC-45`)
- [x] 7.7 Verify: auction-frontend and grade10 frontend tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`

## 8. Catalogue and Featured (grade10) (owner: @ecchochan)

- [x] 8.1 Tests: the catalogue live hook applying frames by version, card countdowns on the server clock, a card past its close showing no result until it is recorded, and the polling fallback (`grade10-site-auction-auction-SC-65`, `grade10-site-auction-auction-SC-66`, `grade10-site-auction-auction-SC-77`, `grade10-site-auction-auction-SC-88`)
- [x] 8.2 Move catalogue cards and Featured onto the catalogue room and the shared clock, showing the existing closed state with no result until the close is recorded (`grade10-site-auction-auction-SC-65`, `grade10-site-auction-auction-SC-66`, `grade10-site-auction-auction-SC-77`, `grade10-site-auction-auction-SC-88`)
- [x] 8.3 Verify: auction-frontend tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`

## 9. My Auctions (grade10) (owner: @ecchochan)

- [x] 9.1 Tests: a bidding row's auction price, a lot past its close keeping its standing in Active, and Won or Didn't win only from the recorded close (`grade10-site-auction-account-record-SC-64`, `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-67`)
- [x] 9.2 Carry `topAmountMinor` on bidding rows and read each row's phase from the clock rule (`grade10-site-auction-account-record-SC-64`, `grade10-site-auction-account-record-SC-65`, `grade10-site-auction-account-record-SC-66`, `grade10-site-auction-account-record-SC-67`)
- [x] 9.3 Verify: auction db lane, account-record frontend tests, `pnpm run typecheck`, `pnpm run lint`

## 10. Listing Writes Accept 0 (grade10) (owner: @ecchochan)

Groups 10 to 12 are built in grade10 #667, from `allow-zero-starting-price`; each is ticked once its tests are verified against this change.

- [x] 10.1 Tests in `apps/backend/grade10/auction/test/db/listings/` and `packages/grade10-auction/backend/test/services/listings/`: a draft saves 0 and reads back 0, not null; a draft refuses -1 and 0.5; create takes 0 in `USD`, `HKD` and `JPY`; an API create refuses -1, and an absent, null or empty price, leaving the draft's price empty; a created listing lowers to 0 and stays created; a created listing at 0 publishes and its slug opens it - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`, `grade10-admin-auction-listing-SC-125a`, `grade10-admin-auction-listing-SC-126`, `grade10-admin-auction-listing-SC-127`, `grade10-admin-auction-listing-SC-128`, `grade10-admin-auction-listing-SC-129`
- [x] 10.2 Take the router's existing `nonNegativeInt` for `startingPrice` alone on the draft, update and create inputs in `backend/src/trpc/routers/listings.ts`, the create input staying non-nullable; regenerate `packages/api-docs/generated/auction.json` - `grade10-admin-auction-listing-SC-125a`, `grade10-admin-auction-listing-SC-126`, `grade10-admin-auction-listing-SC-127`
- [x] 10.3 One local starting-price check in `services/listings/` - a safe integer, 0 or more - used by `draft.ts` and `schedule.ts`, with the refusal "starting price must be whole minor units, 0 or more" under `INVALID_PRICING`, and an empty price kept null through both - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`, `grade10-admin-auction-listing-SC-128`, `grade10-admin-auction-listing-SC-129`
- [x] 10.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` for auction

## 11. The Opening Price (grade10) (owner: @ecchochan)

- [x] 11.1 Tests: `openingPrice` returns a positive starting price unchanged and 100 `USD`, 1000 `HKD`, 100 `JPY` for 0; in `apps/backend/grade10/auction/test/db/bidding/`, a first bid at an `HKD` starting price of 20000 is accepted and the next minimum is 21000, a first bid of 19999 is refused naming 20000, the published minimum before any bid on an `HKD` 0 start is 1000, a first bid of 1 minor unit on a `USD` 0 start is refused naming 100, a lone maximum on a 0 start stands at the opening price and writes one public bid there, never 0, a lone bidder on a 0 start closes as winner at the opening price, and a sandbox test bid runs on a 0 start - `grade10-site-auction-auction-SC-62`, `grade10-site-auction-auction-SC-63`, `grade10-site-auction-auction-SC-64`, `grade10-site-auction-bid-increments-SC-01`, `grade10-site-auction-bid-increments-SC-12`, `grade10-site-auction-auto-bidding-SC-30`, `grade10-site-auction-auto-bidding-SC-30a`, `grade10-site-auction-auto-bidding-SC-31`
- [x] 11.2 Add `openingPrice(currency, startingPriceMinor)` beside `nextBidAmount` in `packages/grade10-auction/contracts/src/bidIncrements.ts`, and call it in `bidFloor`'s no-bid branch, in `resolveStandingMaxima`'s lone-leader `resolvedAmountMinor` and its public record, and in the demo's `FakeAuctionService` - `grade10-site-auction-auction-SC-63`, `grade10-site-auction-bid-increments-SC-12`, `grade10-site-auction-auto-bidding-SC-30`, `grade10-site-auction-auto-bidding-SC-30a`, `grade10-site-auction-auto-bidding-SC-31`
- [x] 11.3 Drop `startingPrice > 0` from `isEligibleTestListing` in `services/bidding/testBids.ts`, and take the existing `nonNegativeMinorUnits` for the test-bid listing's `startingPrice` in `contracts/src/admin.ts`
- [x] 11.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` for auction, the `placeBid`, `autoBidding` and `resolveStandingMaxima` specs among them

## 12. The Listing Editor Accepts 0 (grade10) (owner: @ecchochan)

- [x] 12.1 Tests beside `ListingEditor.tsx`: an entered 0 shows no error and a formatted zero amount in each currency, and saves and creates as 0; an empty field stays empty and create refuses it; -1 is refused with "Starting price must be a whole amount, 0 or more." - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`
- [x] 12.2 `priceError` accepts `amountMinor >= 0` for the starting price, refuses null only where the price is required, and reads "Starting price must be a whole amount, 0 or more." - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`
- [x] 12.3 Verify: `pnpm run typecheck`, `pnpm run lint`, and the admin-frontend listings tests

## 13. The Walk (grade10) (owner: @ecchochan)

Uses the `feature-tcs.md` suites as its input, reviewed with `/tcs-review relay-auction-live-state`; `/tcs-run-sheet` executes manual cases when needed. Groups 2 to 12 have landed.

- [x] 13.1 One browser walk per journey, end to end through the storefront, kept in `apps/frontend/grade10/e2e/tests/auction/`: two bidders on one lot see each bid and the outbid one reads Outbid, the extension at the scheduled close, Closed then the result without a reload; a leader's raise does not extend; a late confirmation does not go through; My Auctions shows the final price to winner and loser (`grade10-site-auction-auction-US-11`, `grade10-site-auction-auction-US-12`, `grade10-site-auction-listing-page-US-12`, `grade10-site-auction-listing-page-US-13`, `grade10-site-auction-listing-page-US-14`, `grade10-site-auction-account-record-US-10`)
- [x] 13.2 Walk `grade10-admin-auction-listing-US-01`, `grade10-admin-auction-listing-US-03` and `grade10-admin-auction-listing-US-04` through the admin listing editor, and `grade10-site-auction-auto-bidding-US-01`, `grade10-site-auction-auction-US-02` and `grade10-site-auction-bid-increments-US-01` through the collector's bid panel on a 0-start lot and a positive-start lot with no bid, end to end, kept as the change's end-to-end suite under `apps/frontend/grade10/e2e/tests/auction/`
- [ ] 13.3 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks' own commit; the cases that stay manual are named in the walk's `rounds.md` row
- [x] 13.4 Verify: the auction e2e suite, `pnpm run tcs:validate`
