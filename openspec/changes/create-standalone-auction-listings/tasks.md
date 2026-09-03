# Tasks: Create standalone auction listings

`campaign_id` is already nullable and contracts already carry `NullOr`.
No schema migration. No contract shape change.

The `grade10-spec` group is documentation only; groups 2 and 3 can proceed in
parallel once group 1 lands. Frontend builds against fixtures, not a running
backend.

## 1. Update the listing manual page (grade10-spec) (owner: @mason5991)

- [x] 1.1 Update `docs/prds/products/grade10-admin/auction/listing.md` to
  record that an operator can create a listing from the Listings section with
  no campaign, and that the Test panel's Listings tab seeds standalone fixtures.
- [ ] 1.2 At archive time, copy `## Feature set` and `## User journeys`
  (`grade10-admin-auction-listing-US-06`, `grade10-admin-auction-listing-US-07`) from this delta into the
  durable `grade10-admin/auction/listing` spec beside the existing journeys.
- [x] 1.3 Verify with `pnpm check:manual` and
  `openspec validate create-standalone-auction-listings --strict`.

## 2. Standalone fixture seed and drop on the auction service (grade10) (owner: @mason5991)

- [x] 2.1 Make `grade10-admin-auction-listing-SC-65` pass on the backend — extend
  `seedDevListing` to accept `campaignId: null` (skip `createSeedCampaign`,
  feed `null` to `createFixtureListing`); use slug prefix
  `dev-fixture-standalone-<id>-<n>` for the new listings.
- [x] 2.2 Make `grade10-admin-auction-listing-SC-67` (backend half) pass — add a
  `dropStandaloneFixtureListings(db, listingId)` helper that matches
  `slug ~ '^dev-fixture-standalone-'` AND `campaign_id IS NULL`, calls
  `releaseListingInventoryHold`, and deletes the row.
- [x] 2.3 Wire two new procedures behind `assertDevEndpointsAllowed`:
  - `dev.fixtures.listings.listStandalone` — queries listings by the
    standalone slug pattern with null campaign and returns id, title, slug,
    status, and instance counts.
  - `dev.fixtures.listings.dropStandalone` — accepts a listing id, calls
    the drop helper from 2.2, and returns dropped count and released holds.
- [x] 2.4 Make `grade10-admin-auction-listing-SC-58`, `grade10-admin-auction-listing-SC-59`,
  `grade10-admin-auction-listing-SC-60`, and `grade10-admin-auction-listing-SC-61` pass on the backend
  — confirm null-campaign draft, create, publish, and public slug lookup
  paths work (add tests if coverage is thin).
- [x] 2.5 Verify with `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run test:backend` focused on dev fixtures and null-campaign listing
  writes.

## 3. Listings create control and Test panel Listings tab (grade10) (owner: @mason5991)

Depends on group 2's new procedures for the Test tab.
Frontend builds against fixtures for the Listings editor path.

- [x] 3.1 Make `grade10-admin-auction-listing-SC-68`, `grade10-admin-auction-listing-SC-69`, and
  `grade10-admin-auction-listing-SC-63` pass — add a Plus `IconButton` labeled "Create
  listing" to `ListingsPanel`'s heading row, shown when `mayOperate` is true;
  activate opens `ListingEditor` with no `defaultCampaignId`.
- [x] 3.2 Make `grade10-admin-auction-listing-SC-58`, `grade10-admin-auction-listing-SC-59`,
  `grade10-admin-auction-listing-SC-60` pass on admin-frontend fixtures — draft, create, and
  publish from that editor with campaign empty.
- [x] 3.3 Make `grade10-admin-auction-listing-SC-62` pass — confirm `campaignLabel` renders
  "on its own" for null-campaign rows in the Listings table.
- [x] 3.4 Add `listStandaloneFixtureListings` and
  `dropStandaloneFixtureListing` to `AuctionAdminDevFixturesClient`,
  `DevListingFixturesApiService`, and `DevListingFixturesRepository`.
- [x] 3.5 Add `listStandalone` and `dropStandalone` mutations to
  `useDevListingFixtures` hook.
- [x] 3.6 Make `grade10-admin-auction-listing-SC-64` and `grade10-admin-auction-listing-SC-65` pass — add a
  Listings tab to `TestFixturesPanel` with a fixture checklist (same ids,
  same instance counter) and an Add listings button that calls the null-
  campaign seed path.
- [x] 3.7 Make `grade10-admin-auction-listing-SC-66` pass — confirm seeded standalone
  listings show in `ListingsPanel` with no campaign label (covered by 3.3
  once the table re-fetches).
- [x] 3.8 Make `grade10-admin-auction-listing-SC-67` pass — add a Drop listing section to
  the Listings tab with a select of existing standalone fixtures and a
  destructive Drop listing button with a confirm dialog.
- [x] 3.9 Verify with `pnpm run typecheck`, `pnpm run lint`, focused
  `@grade10/auction-admin-frontend` module tests, and `pnpm run build`.
