# Tasks: Transfer Relist listing slug

Groups carry no owners at planning time; engineers claim them at pickup.

## 1. Tests before Relist slug transfer (grade10) (owner: @mason5991)

- [x] 1.1 Add failing backend tests for Relist Save transfer, operator slug replace, cleared Relist slug generating title-and-code while freeing the source, mid-window public not found, Publish opens the successor, activity naming the slug and the other listing by code and English title on both listings, source no longer reserving after Save, field-exit `relistOf` availability, and form slug surviving over `generatedListingSlug` (`grade10-admin-auction-listing-SC-209`, `grade10-admin-auction-listing-SC-210`, `grade10-admin-auction-listing-SC-211`, `grade10-admin-auction-listing-SC-212`, `grade10-admin-auction-listing-SC-213`, `grade10-admin-auction-listing-SC-214`, `grade10-admin-auction-listing-SC-215`, `grade10-admin-auction-listing-SC-216`, `grade10-admin-auction-listing-SC-217`)
- [x] 1.2 Add failing admin tests for Relist editor prefill of the source slug and field-exit available on that slug (`grade10-admin-auction-listing-SC-135`, `grade10-admin-auction-listing-SC-215`)
- [x] 1.3 Verify: the new tests fail for the missing transfer behaviour before implementation commits

## 2. Auction Relist Save transfers the slug (grade10) (owner: @mason5991)

Needs group 1's failing tests.

- [x] 2.1 In the Relist new-listing Save transaction, clear the Unsold source slug, store the form slug on the new draft (or generate only when the form slug is empty), keep a distinct listing code, and refuse collisions held by any listing other than that source (`grade10-admin-auction-listing-SC-209`, `grade10-admin-auction-listing-SC-210`, `grade10-admin-auction-listing-SC-214`, `grade10-admin-auction-listing-SC-216`, `grade10-admin-auction-listing-SC-217`)
- [x] 2.2 Extend slug availability with optional `relistOf` so the source's current slug reports available to that unsaved Relist draft (`grade10-admin-auction-listing-SC-215`)
- [x] 2.3 Enrich Relist lifecycle activity so source `relistedAs` and successor `created` name the successor slug and the other listing by listing code and English title when present, else the listing id; update admin activity labels (`grade10-admin-auction-listing-SC-213`)
- [x] 2.4 Verify: `pnpm run typecheck`, package lint and the Relist / slug / activity backend tests in grade10 (`grade10-admin-auction-listing-SC-209`, `grade10-admin-auction-listing-SC-210`, `grade10-admin-auction-listing-SC-211`, `grade10-admin-auction-listing-SC-212`, `grade10-admin-auction-listing-SC-213`, `grade10-admin-auction-listing-SC-214`, `grade10-admin-auction-listing-SC-215`, `grade10-admin-auction-listing-SC-216`, `grade10-admin-auction-listing-SC-217`)

## 3. Admin Relist prefill, activity copy and Relisted badge (grade10) (owner: @mason5991)

Needs group 2's API fields.

- [x] 3.1 Prefill Relist Web address from the Unsold source slug and pass `relistOf` on field-exit availability; update SC-135 expectations (`grade10-admin-auction-listing-SC-135`, `grade10-admin-auction-listing-SC-215`)
- [x] 3.2 Show activity copy that names the transferred slug and the other listing by listing code and English title when present, else the listing id, on both lots (`grade10-admin-auction-listing-SC-213`)
- [x] 3.3 Show a Relisted badge beside Unsold on the Unsold source's listing detail header and Listings table Status column once Relist Save linked a successor (`grade10-admin-auction-listing-SC-218`)
- [x] 3.4 Verify: `pnpm run typecheck`, package lint and the admin Relist / activity / Relisted-badge tests in grade10

## 4. The walk (grade10) (owner: @mason5991)

Needs groups 2 and 3 landed. Human TCS review of `feature-tcs.md` happens after deployment and is not a walk dependency.

- [ ] 4.1 Walk Relist Save keeping the shared slug, an operator replace before Save, a cleared Relist slug that generates title-and-code while freeing the source, not found between Save and Publish, Publish opening the successor, activity on both listings, and Relisted beside Unsold on the source detail and Listings Status column - kept as the change's end-to-end proof (`grade10-admin-auction-listing-SC-209`, `grade10-admin-auction-listing-SC-210`, `grade10-admin-auction-listing-SC-211`, `grade10-admin-auction-listing-SC-212`, `grade10-admin-auction-listing-SC-213`, `grade10-admin-auction-listing-SC-217`, `grade10-admin-auction-listing-SC-218`)
- [ ] 4.2 Verify: the walk's automated coverage and `pnpm run build` in grade10
