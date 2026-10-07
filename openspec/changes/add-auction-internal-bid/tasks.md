# Tasks

Group 1 lands in this store first. Group 2 owns the table, the house bidder
and the contracts every later group consumes; once it lands, groups 3, 4 and
5 can be claimed in parallel, and group 6 builds against the contracts and
fixtures. The design is in [`tech-design.md`](tech-design.md).

## 1. Manual pages (grade10-spec)

- [ ] 1.1 Update `docs/prds/products/grade10-site/auction/bidding.md` (Auction Logic) and `docs/prds/products/grade10-admin/auction/management.md` (Listings, Grants) so the internal bid, Bought in and `auction:reserve` read as the accepted specs state them, and give `grade10-admin/auction/internal-bid` its page under the Auction Management section
- [ ] 1.2 Verify: `pnpm check:manual` and `openspec validate add-auction-internal-bid --strict`

## 2. Internal bid table, house bidder and contracts (grade10)

- [ ] 2.1 Add migration and contract tests: the internal bid table's state, amount and resolved checks, the widened stock release reason, the seeded house bidder, the admin internal-bid input and answer schemas, the additive `boughtIn` listing field, and the `auction:reserve` description (`grade10-admin-auction-internal-bid-SC-04`)
- [ ] 2.2 Add `auction_listing_internal_bids` with `idx_internal_bids_due`, widen `ck_auction_listings_stock_release` with `bought-in close`, and seed the `house` bidder, per tech-design Database Schema
- [ ] 2.3 Add `HOUSE_BIDDER`, `isHouseBid` and the shared house-exclusion SQL fragment to the backend schema module
- [ ] 2.4 Add the `listings.internalBid` input and answer schemas and `boughtIn` to the admin contracts, and change `auction:reserve`'s description to "Set and read a listing's internal bid."
- [ ] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:migrations`

## 3. House bidding in the auction service (grade10)

Needs group 2.

- [ ] 3.1 Add backend tests for the house's commitment, its order before later bids, not placed, raise and lower, and the unchanged collector rules (`grade10-site-auction-auto-bidding-SC-33`, `grade10-site-auction-auto-bidding-SC-34`, `grade10-site-auction-auto-bidding-SC-35`, `grade10-site-auction-auto-bidding-SC-36`, `grade10-site-auction-auto-bidding-SC-37`, `grade10-site-auction-auto-bidding-SC-38`, `grade10-site-auction-auto-bidding-SC-39`, `grade10-site-auction-auto-bidding-SC-40`, `grade10-site-auction-auto-bidding-SC-41`, `grade10-site-auction-auto-bidding-SC-42`, `grade10-site-auction-auto-bidding-SC-43`, `grade10-site-auction-auto-bidding-SC-44`, `grade10-site-auction-auto-bidding-SC-04`, `grade10-site-auction-auto-bidding-SC-24`)
- [ ] 3.2 Add `commitHouseMaximum` over `acceptBid` with the ceiling and minimum next bid checks only, and refuse `storefront 'house'` at `placeBid`'s entry (`grade10-site-auction-auto-bidding-SC-33`, `grade10-site-auction-auto-bidding-SC-34`, `grade10-site-auction-auto-bidding-SC-35`)
- [ ] 3.3 Add `commitDueHouseMaximum` and call it first in `placeBid`, `settleIfDue`, the erasure re-stand and the internal-bid writers, with the house bid accepted at its set time and a short amount recorded as not placed (`grade10-site-auction-auto-bidding-SC-36`, `grade10-site-auction-auto-bidding-SC-37`, `grade10-site-auction-auto-bidding-SC-38`, `grade10-site-auction-auto-bidding-SC-39`)
- [ ] 3.4 Fold the commit time into `nextDeadlineAt`, report the clock deadline from the room's `inspect`, add `sweeps/internalBids.ts` to the five-minute pass, and emit `auction.internal_bid.commit_lag_ms` (`grade10-admin-auction-internal-bid-SC-08`)
- [ ] 3.5 Add `raiseHouseMaximum` and `lowerHouseMaximum`: a raise is a new commitment with the existing extension rule, a lower is a superseding row accepted only when the in-memory resolution keeps the leader's bid and `top_amount` and the amount is at least every house bid (`grade10-site-auction-auto-bidding-SC-40`, `grade10-site-auction-auto-bidding-SC-41`, `grade10-site-auction-auto-bidding-SC-42`, `grade10-site-auction-auto-bidding-SC-43`, `grade10-site-auction-auto-bidding-SC-44`)
- [ ] 3.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 4. Bought-in close, stock and mail (grade10)

Needs group 2.

- [ ] 4.1 Add backend tests for a house win's public read, no order, a double settle, the stock release, the letters collectors get and the house never gets (`grade10-site-auction-auction-SC-103`, `grade10-site-auction-auction-SC-104`, `grade10-site-auction-auction-SC-105`, `grade10-site-auction-auction-SC-02`, `grade10-admin-auction-listing-SC-147`, `grade10-admin-auction-listing-SC-132`, `grade10-site-auction-notifications-SC-49`, `grade10-site-auction-notifications-SC-50`, `grade10-site-auction-notifications-SC-51`, `grade10-site-auction-notifications-SC-52`)
- [ ] 4.2 In `applyClose`, move a house top bid to `won` and skip `issueWinnerOrder`, its order mail and Auction Won analytics (`grade10-site-auction-auction-SC-103`, `grade10-site-auction-auction-SC-104`, `grade10-site-auction-auction-SC-105`, `grade10-site-auction-auction-SC-02`)
- [ ] 4.3 Widen `isUnsoldForRelease` to a house `won` bid with reason `bought-in close` and remark "Released by bought-in listing" (`grade10-admin-auction-listing-SC-147`, `grade10-admin-auction-listing-SC-132`)
- [ ] 4.4 Apply the house-exclusion fragment to every mail and push claim, stamp house bid rows as notified on insert, and make the mail dispatcher throw on a house recipient (`grade10-site-auction-notifications-SC-49`, `grade10-site-auction-notifications-SC-50`, `grade10-site-auction-notifications-SC-51`, `grade10-site-auction-notifications-SC-52`)
- [ ] 4.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 5. Admin internal-bid door and redaction (grade10)

Needs group 2. The commit and raise paths it calls are group 3's.

- [ ] 5.1 Add tRPC and service tests for setting, changing, removing and reading an internal bid by state, the refusals, the audit row without amount or time, staff refusal and redaction, call-off, and Bought in on the listing reads (`grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-02`, `grade10-admin-auction-internal-bid-SC-03`, `grade10-admin-auction-internal-bid-SC-05`, `grade10-admin-auction-internal-bid-SC-06`, `grade10-admin-auction-internal-bid-SC-07`, `grade10-admin-auction-internal-bid-SC-09`, `grade10-admin-auction-internal-bid-SC-10`, `grade10-admin-auction-internal-bid-SC-11`, `grade10-admin-auction-internal-bid-SC-12`, `grade10-admin-auction-internal-bid-SC-13`, `grade10-admin-auction-internal-bid-SC-14`, `grade10-admin-auction-internal-bid-SC-15`, `grade10-admin-auction-internal-bid-SC-16`, `grade10-admin-auction-internal-bid-SC-17`, `grade10-admin-auction-internal-bid-SC-19`, `grade10-admin-auction-internal-bid-SC-20`, `grade10-admin-auction-internal-bid-SC-21`, `grade10-admin-auction-listing-SC-150`)
- [ ] 5.2 Add `saveInternalBid`, `removeInternalBid` and `readInternalBid`, routed by state, and the `listings.internalBid.{get,save,remove}` procedures under `auction:reserve` with `auditDetails` of `{ listingId, act }` (`grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-02`, `grade10-admin-auction-internal-bid-SC-03`, `grade10-admin-auction-internal-bid-SC-05`, `grade10-admin-auction-internal-bid-SC-06`, `grade10-admin-auction-internal-bid-SC-07`, `grade10-admin-auction-internal-bid-SC-09`, `grade10-admin-auction-internal-bid-SC-10`, `grade10-admin-auction-internal-bid-SC-11`, `grade10-admin-auction-internal-bid-SC-12`, `grade10-admin-auction-internal-bid-SC-13`, `grade10-admin-auction-internal-bid-SC-14`, `grade10-admin-auction-internal-bid-SC-15`, `grade10-admin-auction-internal-bid-SC-16`, `grade10-admin-auction-internal-bid-SC-19`, `grade10-admin-auction-internal-bid-SC-20`)
- [ ] 5.3 Mark the internal bid `dropped` in the call-off transaction (`grade10-admin-auction-internal-bid-SC-21`)
- [ ] 5.4 Add `boughtIn` to the admin listing item and record, keep bought-in lots out of the Won and Unsold views, and accept a Bought in source in Relist's checks (`grade10-admin-auction-internal-bid-SC-17`, `grade10-admin-auction-listing-SC-150`, `grade10-admin-auction-listing-SC-145`)
- [ ] 5.5 Add `redactHouse(caller)` to the Listings table, listing record, bid ledger, bidder summaries, lot activity, Stats and bidders list reads, and an audit walker test refusing an `auction:reserve` procedure without `auditDetails`
- [ ] 5.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 6. Admin listing editor and Listings table (grade10)

Needs group 2; built against the contracts and fixtures.

- [ ] 6.1 Add admin frontend tests for the internal bid section by state and grant, its refusals, the Bought in badge, and Relist on a Bought in row (`grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-06`, `grade10-admin-auction-internal-bid-SC-09`, `grade10-admin-auction-internal-bid-SC-12`, `grade10-admin-auction-internal-bid-SC-18`, `grade10-admin-auction-listing-SC-148`, `grade10-admin-auction-listing-SC-149`, `grade10-admin-auction-listing-SC-151`, `grade10-admin-auction-listing-SC-137`)
- [ ] 6.2 Add the internal bid section to the listing editor, rendered and fetched only under `auction:reserve`: amount, time, state, the minimum next bid when Not placed, the time locked once it has arrived, and each refusal inline (`grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-06`, `grade10-admin-auction-internal-bid-SC-09`, `grade10-admin-auction-internal-bid-SC-12`, `grade10-admin-auction-internal-bid-SC-18`)
- [ ] 6.3 Show the Bought in badge under Closed in `ListingStatusCell`, no order link on a bought-in row, and Relist on a released Bought in row (`grade10-admin-auction-listing-SC-148`, `grade10-admin-auction-listing-SC-149`, `grade10-admin-auction-listing-SC-151`, `grade10-admin-auction-listing-SC-137`)
- [ ] 6.4 Add the section's labels and refusal copy in every Grade10 admin locale
- [ ] 6.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the focused admin listing E2E journey

## 7. The walk (grade10)

Needs groups 3 to 6. Uses the draft `feature-tcs.md` as its input; human QA reviews the cases after deployment (`/tcs-review add-auction-internal-bid`), and `/tcs-run-sheet` executes manual cases when needed.

- [ ] 7.1 Walk `grade10-admin-auction-internal-bid-US-01` to `grade10-admin-auction-internal-bid-US-07` in the admin console on a sandbox lot: set, change and remove before the time; watch it commit; raise and lower after it; let one come too late and raise it; close one the house leads; and open each as `staff`
- [ ] 7.2 Walk `grade10-site-auction-auto-bidding-US-03`, `grade10-site-auction-auto-bidding-US-04`, `grade10-site-auction-auction-US-11`, `grade10-site-auction-auction-US-12`, `grade10-site-auction-notifications-US-06` and `grade10-site-auction-notifications-US-07` as collectors on the same lots: bid against the house, read the lot and its history, and read the outbid, did-not-win and watched sold letters
- [ ] 7.3 Walk `grade10-admin-auction-listing-US-09`: find the bought-in lot's stock released and Relist it, confirming the draft carries no internal bid
- [ ] 7.4 Keep the walks as the change's end-to-end suite and flip the cases they decide with `pnpm run tcs:automated <case…> --decided-by grade10:<walk path>` in the walks' own commit; name the cases that stay manual in the walk's `rounds.md` row
- [ ] 7.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and the walk suite
