# Tasks: watching a listing

## 1. Watch records and contracts (grade10) (owner: @mason5991)

- [x] 1.1 Store a watch as the collector's user id, the listing, and Watched At, beside the listing in the auction service, making `grade10-site-auction-watchlist-SC-06` pass.
- [x] 1.2 Make `grade10-site-auction-watchlist-SC-01`, `grade10-site-auction-watchlist-SC-02`, and `grade10-site-auction-watchlist-SC-03` pass through idempotent `watchListing` and `unwatchListing`.
- [x] 1.3 Make `grade10-site-auction-watchlist-SC-05` and `grade10-site-auction-watchlist-SC-06` pass, with no watch state held in the browser.
- [x] 1.4 Add the viewer's watching state to authenticated listing facts and keep it off public facts, making `grade10-site-auction-watchlist-SC-07` and `grade10-site-auction-watchlist-SC-08` pass.
- [x] 1.5 Add a `listMyWatches` read ordered by Watched At descending, carrying each listing's identity, current bid, and close, making `grade10-site-auction-watchlist-SC-11` and `grade10-site-auction-watchlist-SC-15` pass.
- [x] 1.6 Make `grade10-site-auction-watchlist-SC-09` pass by proving a watch alters no bid, leader, or close, and verify every scenario in this group through auction backend feature tests.

## 2. Grade10 listing page and catalogue (grade10) (owner: @mason5991)

Claimable against the contracts and fixtures from group 1; it does not need a running backend.

- [x] 2.1 Preview listing-header and catalogue-tile watch controls in Storybook or the application surfaces named in `ui-design.md` (no Figma).
- [x] 2.2 Fill `ListingLotHeader`'s existing `watched` and `onWatchToggle` props on the listing page, making `grade10-site-auction-watchlist-SC-01` and `grade10-site-auction-watchlist-SC-02` pass there.
- [x] 2.3 Add a watch control to the catalogue tile, so watching is available wherever a listing is shown.
- [x] 2.4 Make `grade10-site-auction-watchlist-SC-04` pass on both surfaces, offering sign-in rather than hiding the control.
- [x] 2.5 Add watch and unwatch copy to the `@grade10/i18n` catalogs for every locale the site answers, keeping it free of words that imply the listing is held or reserved. Lot remains the label for a listing (`lotLabel` / `listingLabel`), not a separate entity.
- [x] 2.6 Verify the listing-page and catalogue feature lanes against the contract fixtures.

## 3. Watched listings surface (grade10) (owner: @mason5991)

Claimable against the contracts and fixtures from group 1.

- [x] 3.1 Extend `@grade10/ui` `AuctionRecordRow` / `WatchingList` for list unwatch, per-row email alerts, bid-on mark, current bid / close slots, and unavailable rows; cover watching + alerts on/muted, master-off, and unwatch side-effect states in Storybook and link them in `ui-design.md`.
- [x] 3.2 Make `grade10-site-auction-watchlist-SC-11`, `grade10-site-auction-watchlist-SC-15`, and `grade10-site-auction-watchlist-SC-13` pass, rendering the close with its time zone.
- [x] 3.3 Make `grade10-site-auction-watchlist-SC-12` pass as an explained empty state, not an error.
- [x] 3.4 Make `grade10-site-auction-watchlist-SC-16`, `grade10-site-auction-watchlist-SC-17`, and `grade10-site-auction-watchlist-SC-14` pass.
- [x] 3.5 Make `grade10-site-auction-watchlist-SC-18` pass: unwatch from the watched list without opening the listing.
- [ ] 3.6 Verify the watched-listings feature lane, including the empty, closed, called-off, and list-unwatch states.

## 4. Operator watch count (grade10) (owner: @mason5991)

- [x] 4.1 Make `grade10-site-auction-watchlist-SC-10` pass, counting watches from both brands on one listing via `countListingWatches`, presented as watchers rather than expected bidders.
- [x] 4.2 Verify the admin auction feature lane.

## 5. Review (grade10) (owner: @mason5991)

- [ ] 5.1 Run the application repository's full check suite once every group above is green.
- [ ] 5.2 Verify every scenario in this change, then run `openspec validate add-auction-watchlist --strict` and `openspec validate --specs`.
- [x] 5.3 Review that no public listing fact carries a watch, a watcher, or a count, per `grade10-site-auction-watchlist-SC-07`.
- [ ] 5.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/` and archive this change.
