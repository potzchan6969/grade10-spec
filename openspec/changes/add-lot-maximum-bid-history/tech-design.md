## Context

The settled requirements are linked from the [lot bidding-history delta](specs/grade10-site/auction/bidding-history/spec.md) and the [shared listing delta](specs/shared/ui/auction-listing/spec.md). The shared listing block already owns the accessory trigger, dialog shell, activity-time formatting, and two table panes from the predecessor lot-history work. Its maximum row currently still carries a `status`, and it chooses the maximums tab when no bid rows exist.

The Auction backend already retains accepted maximum and automatic-bid events and exposes them through the authenticated combined listing-history read. That read joins the owner's private rows with public rows; the lot view currently uses placeholder rows instead of consuming it. The change therefore has no new database fact or mutation to introduce.

## Goals / Non-Goals

**Goals:**

- Make the shared block match the settled two-tab contract, including its empty-bids default and maximum-row shape.
- Project the existing authenticated history read into the two owner-only lot lists without changing auction state.
- Keep the account chronology's existing route and ordering while making its three maximum outcomes explicit in every catalog.
- Preserve the public recent-bids list and the live maximum on the bid panel as separate surfaces.

**Non-Goals:**

- A new endpoint, database table, migration, pagination control, or auction service mutation.
- A second read path for maximums, maximum status labels on lot rows, or maximum history for ZZZ.

## Decisions

The specs govern the user-visible separation, privacy boundary, accepted-event inclusion, default tab, and catalog-owned copy. The implementation decisions below determine how those requirements land in the existing seams.

- **Reuse the combined history read.** The listing feature calls the existing authenticated `listCombinedBidHistory` hook for a signed-in listing owner. It requests the largest supported page and folds all returned pages into presentation rows; it does not add a wire shape or duplicate the action-log query. Anonymous views do not enable the read.
- **Filter at the presentation boundary.** The lot projection emits a maximum row for each `automatic_maximum` item, using its private amount and action time. It emits a bid row only for an `accepted_price` item whose actor is `you` and whose source is `automatic`. `bid_refused`, `bid_requested`, standing items, rival public prices, and legacy/manual accepted prices are excluded from both lot lists. The API's newest-first ordering is retained; row ids combine the history group, item kind, and amount to remain stable when a resolution group contains more than one public price.
- **Keep the shared block stateless about auction data.** `ListingUserBidHistory` continues to receive already formatted amount labels and activity timestamps through props. It always initializes the tabs to the bids value, including with an empty `bidRows` array, and the maximum row type contains only amount and time. The component keeps its existing link, dialog, fixed chrome, active-pane scroll, and no-rows behavior.
- **Keep labels in the account surface's vocabulary.** The four locale catalogs update the existing maximum configuration, raise, and refusal messages so `BiddingHistoryEvents` names them as maximum set, maximum raised, and maximum refused. The page remains the same combined chronology and does not gain a tab, filter, or route.
- **Use the submodule pointer as the contract boundary.** Shared UI and catalog changes land in `external/grade10-spec` first. The application then updates the pointer and consumes the settled exports; it does not copy shared components or strings into the application repository.
- **Test at public seams.** Shared behavior is covered by the existing Storybook interaction stories. The application adds a pure history-to-row projection test and listing-view tests that exercise signed-in, maximum-only, mixed, refused, rival, and signed-out cases. Account-page assertions verify the catalog labels through the rendered event list.

## Risks / Trade-offs

- **A large history can span multiple pages** → request the supported maximum page size and continue the existing infinite query until its cursor is exhausted before exposing the dialog rows.
- **Combined history contains public rival prices** → require both `actor.type === "you"` and `sourceType === "automatic"` for bid rows; maximum rows come only from the private `automatic_maximum` variant.
- **A signed-in non-participant can receive a not-found history response** → treat that read as an empty projection and keep the accessory absent; do not infer listing existence or expose an error in the lot card.
- **The submodule and application can drift** → land the shared package commit, update the application pointer, then run typecheck and the shared/frontend test lanes against the same checkout.

## Migration Plan

1. Land the shared UI type, behavior, story, and catalog changes in the `grade10-spec` submodule's main branch.
2. Update the application submodule pointer and implement the authenticated lot projection plus account-label tests in `grade10`.
3. Run the shared package and application validation lanes. No database migration or rollback step is required because the change reads existing action-log facts only.

## Open Questions

None.
