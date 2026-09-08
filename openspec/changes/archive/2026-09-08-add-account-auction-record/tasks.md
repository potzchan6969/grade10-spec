## 1. Publish the record component contract (grade10-spec)

- [x] 1.1 Implement `AuctionRecordTabs`, `WatchingList`, `BiddingList`, `AuctionRecordRow`, `AuctionRecordEmpty`, and `WatchButton` with the exact public exports and controlled-prop behavior in `shared-ui-auction-record-SC-01` through `shared-ui-auction-record-SC-05`; add colocated stories and package tests.
- [x] 1.2 Add every collector-facing auction-record message to `@grade10/i18n` and assemble the shared blocks in the preview app without product state.
- [x] 1.3 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and the touched UI stories.

## 2. Migrate explicit watches (grade10)

- [x] 2.1 Make `grade10-site-auction-account-record-SC-06`, `grade10-site-auction-account-record-SC-07`, and `grade10-site-auction-account-record-SC-13` pass by adding the nullable explicit-watch stamp, its owner-scoped partial index, and the 1,000-watch transaction constraint while retaining bid/reminder membership.
- [x] 2.2 Generate the auction Drizzle migration and prove the existing watch rows, explicit-watch limit, concurrent writes, and unwatch/bid interaction against the migrated database.
- [x] 2.3 Verify with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run test:backend`.

## 3. Project the owner record (grade10)

- [x] 3.1 Make `grade10-site-auction-account-record-SC-08` through `grade10-site-auction-account-record-SC-27` pass by adding the bounded, keyset-paged Watching and Bidding projections, collector-state mapper, ordering, groups, bid marker, payment/shipment projection, and hold-release status.
- [x] 3.2 Make `grade10-site-auction-account-record-SC-28`, `grade10-site-auction-account-record-SC-29`, and `grade10-site-auction-account-record-SC-34` pass by adding the owner-only service interface, store tRPC procedures, typed contract codecs, invalid-cursor refusal, and refresh-status result.
- [x] 3.3 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run test:backend`.

## 4. Compose the Grade10 account surface (grade10)

Depends on group 1's landed shared UI and group 3's contract; use fixture clients for all frontend checks.

- [x] 4.1 Make `grade10-site-auction-account-record-SC-01` through `grade10-site-auction-account-record-SC-05` and `grade10-site-auction-listing-page-SC-10` through `grade10-site-auction-listing-page-SC-12` pass by wiring controlled watch actions, sign-in handling, optimistic refresh, and reversible unwatch on the listing page and catalogue.
- [x] 4.2 Make `grade10-site-auction-account-record-SC-08` through `grade10-site-auction-account-record-SC-24` pass by adding the account-auction-record feature slice, session route, tab landing rule, paged group reads, row navigation, and read-only winner display.
- [x] 4.3 Make `grade10-site-auction-account-record-SC-30` through `grade10-site-auction-account-record-SC-34` pass by rendering distinct loading, empty, failed, retry, and not-current states with catalogue links and translated copy.
- [x] 4.4 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.
