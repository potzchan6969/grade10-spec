## 1. Auction Management Manual (grade10-spec)

- [ ] 1.1 Mark the delivered Watchers outcome on `docs/prds/products/grade10-admin/auction/management.md` as running (`grade10-admin-auction-listing-SC-81`, `grade10-admin-auction-listing-SC-82`, `grade10-admin-auction-listing-SC-83`)
- [ ] 1.2 Verify: `pnpm check:manual`

## 2. Listing Read Contract and Backend (grade10)

- [ ] 2.1 Add the non-negative list-item watcher-count contract and one batched explicit cross-brand watch aggregate to `listings.list`, defaulting a listing without a matching row to `0` (`grade10-admin-auction-listing-SC-81`, `grade10-admin-auction-listing-SC-82`, `grade10-admin-auction-listing-SC-83`)
- [ ] 2.2 Verify: `pnpm run typecheck && pnpm run test:backend`

## 3. Admin Listings Table (grade10)

Depends on group 2's additive list-item contract.

- [ ] 3.1 Carry the list-item watcher count through the admin listings model and fixture, and render an unsortable Watchers column for every listing without exposing watcher identity or bidder meaning (`grade10-admin-auction-listing-SC-81`, `grade10-admin-auction-listing-SC-82`, `grade10-admin-auction-listing-SC-83`)
- [ ] 3.2 Verify: `pnpm run typecheck && pnpm run test`
