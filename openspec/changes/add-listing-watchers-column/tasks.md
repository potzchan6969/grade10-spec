## 1. Auction Management Manual (grade10-spec) (owner: @htonyl)

- [x] 1.1 Mark Watchers on `docs/prds/products/grade10-admin/auction/management.md` as the Stats dialog outcome, and record placement as Stats rather than a Listings-table column (`grade10-admin-auction-listing-SC-81`, `grade10-admin-auction-listing-SC-82`, `grade10-admin-auction-listing-SC-83`, `grade10-admin-auction-listing-SC-86`)
- [x] 1.2 Verify: `pnpm check:manual`

## 2. Listing List Contract and Backend (grade10) (owner: @htonyl)

- [x] 2.1 Remove `watcherCount` from the `listings.list` item contract and stop the page-scoped watch aggregate on the list read; keep `listings.stats.watcherCount` as the watch-count surface (`grade10-admin-auction-listing-SC-81`, `grade10-admin-auction-listing-SC-82`, `grade10-admin-auction-listing-SC-83`, `grade10-admin-auction-listing-SC-86`)
- [x] 2.2 Verify: `pnpm run typecheck && pnpm run test:backend`

## 3. Admin Listings Table and Stats (grade10) (owner: @htonyl)

Depends on group 2's list-contract removal.

- [x] 3.1 Drop the Watchers column and list-row watcher projection from the admin listings model, fixture, and table; keep Stats showing the on-demand watcher count without naming watchers or bidder meaning (`grade10-admin-auction-listing-SC-81`, `grade10-admin-auction-listing-SC-82`, `grade10-admin-auction-listing-SC-83`, `grade10-admin-auction-listing-SC-86`)
- [x] 3.2 Verify: `pnpm run typecheck && pnpm run test`
