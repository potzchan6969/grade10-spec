## 1. Lot status product record (grade10-spec) (owner: @htonyl)

- [ ] 1.1 State the hidden-lot rule where each page owns it: the watched list drops a called-off lot rather than labelling it in place (`docs/prds/products/grade10-site/auction/watchlist.md`), and a hidden lot's address is one of the addresses that answer not found (`docs/prds/products/grade10-site/auction/listing-page.md`), leaving the mapping itself on the lot-status page (`grade10-site-auction-lot-status-SC-08`, `grade10-site-auction-lot-status-SC-09`, `grade10-site-auction-listing-page-SC-19`)
- [ ] 1.2 Verify the manual and the change artifacts with `pnpm check:manual` and `pnpm run validate:changes add-collector-lot-status`, both from the grade10-spec clone

## 2. Auction contracts (grade10) (owner: @htonyl)

- [ ] 2.1 Add `deriveExternalLotStatus` and the `externalStatus` field to the public listing summary, the listing state and their procedure twins in `packages/grade10-auction/contracts`, exhaustive over the listing status vocabulary and returning Hidden as `null` (`grade10-site-auction-lot-status-SC-01`, `grade10-site-auction-lot-status-SC-02`, `grade10-site-auction-lot-status-SC-03`, `grade10-site-auction-lot-status-SC-04`, `grade10-site-auction-lot-status-SC-12`, `grade10-site-auction-lot-status-SC-10`)
- [ ] 2.2 Carry the external lot status on `MyWatch` and the account record's watching item, deleting the `draft`, `canceled` and `unavailable` variants the hidden-lot filter makes unreachable (`grade10-site-auction-lot-status-SC-08`)
- [ ] 2.3 Verify the contracts with `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend`

## 3. Auction service reads (grade10)

Needs group 2 landed: every read here publishes the contracts' field and calls
its derivation.

- [ ] 3.1 Publish the external lot status from the catalogue page, the campaign page and the lot state in `packages/grade10-auction/backend`, with one db-lane test walking every arm of the mapping table so the catalogue's SQL rank and the contracts' derivation cannot disagree (`grade10-site-auction-lot-status-SC-01`, `grade10-site-auction-lot-status-SC-02`, `grade10-site-auction-lot-status-SC-03`, `grade10-site-auction-lot-status-SC-04`, `grade10-site-auction-lot-status-SC-12`, `grade10-site-auction-lot-status-SC-10`)
- [ ] 3.2 Derive the collector-visible status list from the one status map and filter hidden lots out of both watch reads — `buildListMyWatchesQuery` and `readAccountWatchRows` — while the catalogue keeps taking its filter from the same list (`grade10-site-auction-lot-status-SC-06`, `grade10-site-auction-lot-status-SC-07`, `grade10-site-auction-lot-status-SC-08`, `grade10-site-auction-lot-status-SC-11`)
- [ ] 3.3 Pin that a hidden lot's address answers not found from the listing state, at its original address and at the rewritten one a call-off leaves behind, and that a published lot still answers (`grade10-site-auction-listing-page-SC-19`, `grade10-site-auction-listing-page-SC-04`, `grade10-site-auction-listing-page-SC-05`)
- [ ] 3.4 Pin that a called-off lot still reaches the collector who bid on it, with the released-hold note, and reaches nobody else — `readAccountStatusRows` takes no hidden-lot filter (`grade10-site-auction-lot-status-SC-09`)
- [ ] 3.5 Verify the worker and the service with `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend`

## 4. Grade10 site auction surfaces (grade10)

Needs group 2 landed, and nothing from group 3: the site is verified against
the contracts and its own fixtures.

- [ ] 4.1 Read the external lot status from the listing model in `packages/grade10-auction/frontend` instead of re-deriving it per surface, keeping today's catalogue buckets and labels (`grade10-site-auction-lot-status-SC-01`, `grade10-site-auction-lot-status-SC-02`, `grade10-site-auction-lot-status-SC-03`, `grade10-site-auction-lot-status-SC-04`, `grade10-site-auction-lot-status-SC-12`)
- [ ] 4.2 Drop the watching row's unreachable statuses from the account record feature and `apps/frontend/grade10`'s My Auctions page, leaving the bidding rows, their released-hold note and the winner's separate order status as they are (`grade10-site-auction-lot-status-SC-08`, `grade10-site-auction-lot-status-SC-09`, `grade10-site-auction-lot-status-SC-05`)
- [ ] 4.3 Pin that the lot route shows the site's Page not found screen for a hidden lot, the same as an address with no published lot (`grade10-site-auction-listing-page-SC-19`)
- [ ] 4.4 Carry the external lot status through the site fixtures, the fixture procedure clients and the auction demo's fake service, including a called-off lot the fixtures leave out of every collector read (`grade10-site-auction-lot-status-SC-10`, `grade10-site-auction-lot-status-SC-11`)
- [ ] 4.5 Verify the site packages with `pnpm run typecheck`, `pnpm run lint` and `pnpm run test`

## 5. Integrated auction verification (grade10)

Needs groups 3 and 4 landed.

- [ ] 5.1 Walk a called-off lot end to end against the built worker and site — catalogue search, its saved address, the watchlist, and the bidder's My Auctions — and reconcile any contract or fixture drift the two halves left (`grade10-site-auction-e2e-US11-TC01-1`)
- [ ] 5.2 Verify the repository gates with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend` and `pnpm run build`
