# Tasks

Group 1 is this store's. Groups 2, 3 and 4 are `grade10`'s and independent
of each other: group 4 runs against the contracts and fixtures, never a
running backend. Group 5 walks what 2 to 4 build. Each group's tests land in
their own commit before its code, so its test task is written first and
ticked last. Deploy order is `tech-design.md`'s: the backend before the admin
frontend.

## 1. The pages (grade10-spec)

- [ ] 1.1 Keep the 🚧 lines on Auction Management · Listings and Bidding · Auction Logic matching the deltas while groups 2 to 4 land; the two unmarked lines they overturn - "positive" in Listings' Refused line (Q5) and "plus one increment" in Bidding's A first maximum line (Q12) - are rewritten when the 🚧 comes off
- [ ] 1.2 Verify: `pnpm check:manual` and `pnpm run validate:changes allow-zero-starting-price`

## 2. Listing writes accept 0 (grade10)

- [ ] 2.1 Tests in `apps/backend/grade10/auction/test/db/listings/` and `packages/grade10-auction/backend/test/services/listings/`: a draft saves 0 and reads back 0, not null; a draft refuses -1 and 0.5; create takes 0 in `USD`, `HKD` and `JPY`; an API create refuses -1, and an absent, null or empty price, leaving the draft's price empty; a created listing lowers to 0 and stays created; a created listing at 0 publishes and its slug opens it - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`, `grade10-admin-auction-listing-SC-126`, `grade10-admin-auction-listing-SC-127`, `grade10-admin-auction-listing-SC-128`, `grade10-admin-auction-listing-SC-129`
- [ ] 2.2 Take the router's existing `nonNegativeInt` for `startingPrice` alone on the draft, update and create inputs in `backend/src/trpc/routers/listings.ts`, the create input staying non-nullable; regenerate `packages/api-docs/generated/auction.json` - `grade10-admin-auction-listing-SC-126`, `grade10-admin-auction-listing-SC-127`
- [ ] 2.3 One local starting-price check in `services/listings/` - a safe integer, 0 or more - used by `draft.ts` and `schedule.ts`, with the refusal "starting price must be whole minor units, 0 or more" under `INVALID_PRICING`, and an empty price kept null through both - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`, `grade10-admin-auction-listing-SC-128`, `grade10-admin-auction-listing-SC-129`
- [ ] 2.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` for auction

## 3. The opening price (grade10)

- [ ] 3.1 Tests: `openingPrice` returns a positive starting price unchanged and 100 `USD`, 1000 `HKD`, 100 `JPY` for 0; in `apps/backend/grade10/auction/test/db/bidding/`, a first bid at an `HKD` starting price of 20000 is accepted and the next minimum is 21000, a first bid of 19999 is refused naming 20000, the published minimum before any bid on an `HKD` 0 start is 1000, a first bid of 1 minor unit on a `USD` 0 start is refused naming 100, a lone maximum on a 0 start stands at the opening price and writes one public bid there, never 0, a lone bidder on a 0 start closes as winner at the opening price, and a sandbox test bid runs on a 0 start - `grade10-site-auction-auction-SC-62`, `grade10-site-auction-auction-SC-63`, `grade10-site-auction-auction-SC-64`, `grade10-site-auction-bid-increments-SC-01`, `grade10-site-auction-bid-increments-SC-12`, `grade10-site-auction-auto-bidding-SC-30`, `grade10-site-auction-auto-bidding-SC-31`
- [ ] 3.2 Add `openingPrice(currency, startingPriceMinor)` beside `nextBidAmount` in `packages/grade10-auction/contracts/src/bidIncrements.ts`, and call it in `bidFloor`'s no-bid branch, in `resolveStandingMaxima`'s lone-leader `resolvedAmountMinor` and its public record, and in the demo's `FakeAuctionService` - `grade10-site-auction-auction-SC-63`, `grade10-site-auction-bid-increments-SC-12`, `grade10-site-auction-auto-bidding-SC-30`, `grade10-site-auction-auto-bidding-SC-31`
- [ ] 3.3 Drop `startingPrice > 0` from `isEligibleTestListing` in `services/bidding/testBids.ts`, and take the existing `nonNegativeMinorUnits` for the test-bid listing's `startingPrice` in `contracts/src/admin.ts`
- [ ] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` for auction, the `placeBid`, `autoBidding` and `resolveStandingMaxima` specs among them

## 4. The listing editor accepts 0 (grade10)

- [ ] 4.1 Tests beside `ListingEditor.tsx`: an entered 0 shows no error and a formatted zero amount in each currency, and saves and creates as 0; an empty field stays empty and create refuses it; -1 is refused with "Starting price must be a whole amount, 0 or more." - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`
- [ ] 4.2 `priceError` accepts `amountMinor >= 0` for the starting price, refuses null only where the price is required, and reads "Starting price must be a whole amount, 0 or more." - `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`
- [ ] 4.3 Verify: `pnpm run typecheck`, `pnpm run lint`, and the admin-frontend listings tests

## 5. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review allow-zero-starting-price`) as its input, and groups 2 to 4 landed.

- [ ] 5.1 Walk `grade10-admin-auction-listing-US-01`, `grade10-admin-auction-listing-US-03` and `grade10-admin-auction-listing-US-04` through the admin listing editor, and `grade10-site-auction-auto-bidding-US-01`, `grade10-site-auction-auction-US-02` and `grade10-site-auction-bid-increments-US-01` through the collector's bid panel on a 0-start lot and a positive-start lot with no bid, end to end, kept as the change's end-to-end suite under `apps/frontend/grade10/e2e/tests/auction/`
- [ ] 5.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walks' own commit; the ones that stay manual are named in the suite and named in the walk's `rounds.md` row
- [ ] 5.3 Verify: the walks pass against a deployed staging, and `pnpm run tcs:validate` in `grade10-spec`
