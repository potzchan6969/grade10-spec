# Tasks: watching a lot

## 1. Watch records and contracts (grade10)

- [ ] 1.1 Store a watch as the collector's user id, the lot, and Watched At, beside the lot in the auction service, making *A watch belongs to one collector* pass.
- [ ] 1.2 Make *A collector watches a lot*, *A collector unwatches a lot*, and *Watching twice leaves one watch* pass through idempotent watch and unwatch actions.
- [ ] 1.3 Make *A watch follows the collector, not the browser* and *A watch belongs to one collector* pass, with no watch state held in the browser.
- [ ] 1.4 Add the viewer's watching state to authenticated listing facts and keep it off public facts, making *A watch count is not public* and *One collector cannot see another's watch* pass.
- [ ] 1.5 Add a watched-lots read ordered by Watched At descending, carrying each lot's identity, current bid, and close, making *The list is ordered by when each watch was made* and *An entry carries the facts needed to act* pass.
- [ ] 1.6 Make *Watching does not change the sale* pass by proving a watch alters no bid, leader, or close, and verify every scenario in this group through auction backend feature tests.

## 2. Grade10 lot page and catalogue (grade10)

Claimable against the contracts and fixtures from group 1; it does not need a running backend.

- [ ] 2.1 Produce the bid-panel and catalogue-tile Figma frames named in `ui.md` and link them there.
- [ ] 2.2 Fill `ListingBidPanel`'s existing `watchAction` and `watching` props on the lot page, making *A collector watches a lot* and *A collector unwatches a lot* pass there.
- [ ] 2.3 Add a watch control to the catalogue tile, so watching is available wherever a lot is shown.
- [ ] 2.4 Make *A signed-out viewer is offered sign-in* pass on both surfaces, offering sign-in rather than hiding the control.
- [ ] 2.5 Add watch and unwatch copy to the `@grade10/i18n` catalogs for every locale the site answers, keeping it free of words that imply the lot is held or reserved.
- [ ] 2.6 Verify the lot-page and catalogue feature lanes against the contract fixtures.

## 3. Watched lots surface (grade10)

Claimable against the contracts and fixtures from group 1.

- [ ] 3.1 Produce the watched-lots Figma frame named in `ui.md` and link it there.
- [ ] 3.2 Make *The list is ordered by when each watch was made*, *An entry carries the facts needed to act*, and *An entry leads to its lot* pass, rendering the close with its time zone.
- [ ] 3.3 Make *A collector watching nothing* pass as an explained empty state, not an error.
- [ ] 3.4 Make *A closed lot stays in the list*, *A called-off lot is shown as called off*, and *A collector unwatches a closed lot* pass.
- [ ] 3.5 Verify the watched-lots feature lane, including the empty, closed, and called-off states.

## 4. ZZZ auction surface (grade10)

Claimable against the contracts from group 1, independently of groups 2 and 3.

- [ ] 4.1 Fill the watch control on the ZZZ lot page and catalogue tile, making *A watch belongs to one collector* pass with a ZZZ collector.
- [ ] 4.2 Add the watched-lots surface to ZZZ, with its copy in the locales that site answers.
- [ ] 4.3 Verify the ZZZ auction feature lane.

## 5. Operator watch count (grade10)

- [ ] 5.1 Make *An operator counts every watch on a lot* pass, counting watches from both brands on one lot, presented as watchers rather than expected bidders.
- [ ] 5.2 Verify the admin auction feature lane.

## 6. Review (grade10)

- [ ] 6.1 Run the application repository's full check suite once every group above is green.
- [ ] 6.2 Verify every scenario in this change, then run `openspec validate add-auction-watchlist --strict` and `openspec validate --specs`.
- [ ] 6.3 Review that no public listing fact carries a watch, a watcher, or a count, per *A watch count is not public*.
- [ ] 6.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/` and archive this change.
