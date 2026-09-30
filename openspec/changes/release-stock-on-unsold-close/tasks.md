# Tasks: Release stock on an Unsold close

The reserve-miss scenario, SC-131, is retired: no listing carries a
reserve price, so a top bid under one cannot arise. The Relist, remarks and
history decisions in `tech-design.md` move scenarios the deltas still state
otherwise; both wait on the PM under `awaiting: specs` in `.openspec.yaml`.
A task below names a scenario id only where the delta already holds it.

## 1. Manual pages (grade10-spec)

- [ ] 1.1 Add an engineer code map to the Listings section of `docs/prds/products/grade10-admin/auction/management.md` and the Intake section of `docs/prds/products/grade10-admin/inventory/catalog.md`: `sweeps/stockRelease.ts`, `sweeps/close.ts`, `services/listings/draft.ts`, the Inventory `release` input, `ReservationGroup.tsx`, `ChangeHistoryDialog.tsx`.
- [ ] 1.2 Once the change is deployed, take 🚧 off the Unsold close, Stock already held and Relist lines on the Auction Management page, and the Unsold auction stock and History lines on the Products and Stock page.
- [ ] 1.3 Verify: `pnpm check:manual`, `pnpm run validate:changes release-stock-on-unsold-close` and `pnpm run lint` in grade10-spec.

## 2. Inventory remarks and holder label (grade10)

- [ ] 2.1 Tests for the release remarks and the holder label, in their own commit before the code (`grade10-admin-inventory-catalog-SC-136`, `grade10-admin-inventory-catalog-SC-137`, `grade10-admin-inventory-catalog-SC-138`)
- [ ] 2.2 Add `holder_label` to `inventory.reservations`; add optional `holderLabel` to the reserve, adjust, change-product and release inputs, and optional `remarks` to release, through the service and the Auction binding. The changelog records the remarks as its reason; a release with none records null (`grade10-admin-inventory-catalog-SC-136`, `grade10-admin-inventory-catalog-SC-137`, `grade10-admin-inventory-catalog-SC-138`)
- [ ] 2.3 Verify: `pnpm run db:drizzle:generate`, `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 3. Unsold close releases the hold (grade10)

Needs group 2's inputs landed.

- [ ] 3.1 Tests for the Unsold predicate, the close's due state and the release work list, in their own commit before the code (`grade10-admin-auction-listing-SC-130`, `grade10-admin-auction-listing-SC-132`, `grade10-admin-auction-listing-SC-133`)
- [ ] 3.2 Add `isUnsoldForRelease` - closed with no winner: no `won` bid and no current top bid - and the `stock_release_*` columns; write `due` with `unsold close` in `closeOne`'s no-winner branch, and nothing on a close with a winner (`grade10-admin-auction-listing-SC-130`, `grade10-admin-auction-listing-SC-132`)
- [ ] 3.3 Add `sweeps/stockRelease.ts` to the pass after the close list: re-check the predicate and park a failing row as `refused` with an error log, release the active hold with its remarks and label, stamp a lost answer from the post-close reservation, back off without a cap, and alarm on the oldest due age (`grade10-admin-auction-listing-SC-133`)
- [ ] 3.4 Send `holderLabel` from the listing's code and title on every Auction reserve, adjust, change-product and release.
- [ ] 3.5 Verify: `pnpm run db:drizzle:generate`, `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 4. Relist save and the released date (grade10)

Needs group 3's columns landed.

- [ ] 4.1 Tests for `stockReleasedAt` and the relist save, in their own commit before the code: each refusal, the copied fields and gallery, the fresh hold, a second save, and the source listing, its media and its reservation left unchanged (`grade10-admin-auction-listing-SC-134`, `grade10-admin-auction-listing-SC-135`, `grade10-admin-auction-listing-SC-136`)
- [ ] 4.2 Add `stockReleaseState`, `stockReleasedAt` and `relistedListingId` to `adminListingFields` (`grade10-admin-auction-listing-SC-134`)
- [ ] 4.3 Add `relisted_from_listing_id` with its unique index, and accept `relistOf` on a new listing's `save`: refuse a source that is not Unsold, sits in a campaign, has no released stock or was relisted, then store the draft and copy the source's media rows by object key in the insert's transaction (`grade10-admin-auction-listing-SC-135`, `grade10-admin-auction-listing-SC-136`)
- [ ] 4.4 Verify: `pnpm run db:drizzle:generate`, `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend` in grade10.

## 5. Released note and Relist (grade10)

Built against the contract's fixtures, not a running backend.

- [ ] 5.1 Tests for the note, the Relist button's visibility and the filled editor, in their own commit before the code (`grade10-admin-auction-listing-SC-134`, `grade10-admin-auction-listing-SC-135`, `grade10-admin-auction-listing-SC-136`, `grade10-admin-auction-listing-SC-138`)
- [ ] 5.2 Show the released note with its date and time on an Unsold listing's page (`grade10-admin-auction-listing-SC-134`)
- [ ] 5.3 Show Relist on a Listings table row that is Unsold, in no campaign, with its stock released and not yet relisted, to an operator holding `auction:operate` only (`grade10-admin-auction-listing-SC-138`)
- [ ] 5.4 Open the new listing editor from Relist filled with the source's product, Cert ID choice, quantity, title, copy, price, currency and gallery, with no window, slug or listing code; store nothing until Save, which sends `relistOf` and shows a refusal inline (`grade10-admin-auction-listing-SC-135`, `grade10-admin-auction-listing-SC-136`)
- [ ] 5.5 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test` in grade10.

## 6. Product page and history name the holder (grade10)

Built against the contract's fixtures, not a running backend.

- [ ] 6.1 Tests for the Reference cell and the history's Holder and Remarks columns, in their own commit before the code (`grade10-admin-inventory-catalog-SC-139`)
- [ ] 6.2 Show `holderLabel` in the reservations table's Reference cell when set, else the holder reference (`grade10-admin-inventory-catalog-SC-139`)
- [ ] 6.3 Add Holder and Remarks columns to the change history, read from the entry's reservation snapshot and reason, with When showing date and time
- [ ] 6.4 Verify: `pnpm run typecheck`, `pnpm run lint` and `pnpm run test` in grade10.

## 7. Clean-up of earlier Unsold holds (grade10)

Lands in its own PR once group 3 runs in every environment: migrations apply
before a deploy, so an earlier landing misses listings the old close handles.

- [ ] 7.1 Tests for the clean-up migration against seeded won, live, called-off and settled listings beside Unsold ones with no bids and with only `outbid` bids, and for a second run, in their own commit before the migration (`grade10-admin-auction-listing-SC-139`, `grade10-admin-auction-listing-SC-140`)
- [ ] 7.2 Add the data migration that marks every listing `isUnsoldForRelease` accepts, with a product and no release state, as `due` with `unsold clean-up` (`grade10-admin-auction-listing-SC-139`, `grade10-admin-auction-listing-SC-140`)
- [ ] 7.3 Verify: `pnpm run db:drizzle:generate`, `pnpm run typecheck` and `pnpm run test:backend` in grade10.

## 8. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review release-stock-on-unsold-close`)
as its input, and groups 2 to 7 landed.

- [ ] 8.1 Walk each journey end to end through the admin, kept as the change's end-to-end suite (`grade10-admin-auction-listing-US-09`, `grade10-admin-inventory-catalog-US-09`)
- [ ] 8.2 Flip the cases the walks decide with `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks' own commit; name the cases that stay manual in the suite and in the walk's `rounds.md` row
- [ ] 8.3 Verify: `pnpm run test:e2e` for the walks and `pnpm run build` in grade10.
