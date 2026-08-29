## 1. Bidding-history catalog (grade10-spec) (owner: @htonyl)

- [x] 1.1 Make `A signed-in collector opens active bids`, `An empty filter is explicit`, `Initial loading reserves the bidding list`, and `An index failure is retryable` pass by adding the shared `auctionBiddingHistory` namespace to every supported language and catalog assembly.
- [x] 1.2 Make `A competing bid visibly causes an outbid state`, `An automatic response is attributed to You`, `A failed attempt sits beside the unchanged auction state`, and `An automatic maximum is configured and raised` pass with complete standing, event, safe-failure, amount, time, loading, retry, and action vocabulary, with catalog-layer tests proving no brand answers the shared keys twice.
- [x] 1.3 Verify the catalog group with `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test` in grade10-spec.

## 2. Shared bidding-history contracts (grade10) (owner: @htonyl)

Implementation starts only after automatic bidding and its authoritative
action-group facts have landed. After group 1 lands, update the
`external/grade10-spec` pin before editing its consumers.

- [ ] 2.1 Make `Repeated activity is grouped under one listing`, `A failed-only listing remains explainable`, `Active and completed activity separate cleanly`, and `An account with no bidding activity has an empty index` pass by defining the storefront-neutral filter, standing, summary, money, image, cursor-page, and refusal schemas in `@grade10/auction-contracts`.
- [ ] 2.2 Make `A manual bid is accepted`, `A server-evaluated bid fails`, `An automatic maximum is configured and raised`, `The engine bids for the collector`, `A competing bid visibly causes an outbid state`, and `An automatic response is attributed to You` pass by defining a closed discriminated history-item and safe-failure vocabulary that cannot represent private values on a public item.
- [ ] 2.3 Make `A storefront account reads its own history`, `The same account id on another storefront is unrelated`, and `An anonymous reader cannot read private history` pass by extending the pinned Auction RPC contract with account-index and combined-listing-history page outcomes whose browser inputs cannot name an account or storefront.
- [ ] 2.4 Verify the shared-contract group with `pnpm run typecheck` and `pnpm run test:backend`.

## 3. Additive history persistence (grade10) (owner: @htonyl)

This group depends on group 2's closed event and standing vocabularies.

- [ ] 3.1 Make `A manual bid is accepted`, `A server-evaluated bid fails`, `An automatic maximum is configured and raised`, and `The engine bids for the collector` representable by adding append-only `bid_action_logs` and per-account/listing `bid_bidder_status` schema with field-combination checks, group uniqueness, storefront identity keys, and keyset-order indexes.
- [ ] 3.2 Make `Repeated activity is grouped under one listing`, `Paging does not repeat or skip a listing`, and `Full retained history remains pageable` pass in migration fixtures by backfilling only authoritative retained bid and automatic-maximum facts and rebuilding one `bid_bidder_status` row per storefront account and listing without inventing historical failures.
- [ ] 3.3 Make idempotent replay and rollback safe by proving the migration is additive, generated from the shared schema, repeatably rebuilds bidder status, and leaves existing bid and automatic-bid authority independent of the projection.
- [ ] 3.4 Verify the persistence group with `pnpm run db:drizzle:generate`, `pnpm run check:migrations`, `pnpm run typecheck`, and `pnpm run test:backend`; commit the generated Auction migration and metadata.

## 4. Record authoritative bidding activity (grade10) (owner: @htonyl)

This group depends on group 3's additive tables. It extends the already-landed
automatic-bidding paths without changing their policy.

- [ ] 4.1 Make `A manual bid is accepted`, `A server-evaluated bid fails`, and `Browser-only validation creates no Auction event` pass through the fixed `processBidActionGroup` input/output contract, assigning one stable group per authoritative transition and deduplicating complete-group replays inside the listing transaction.
- [ ] 4.2 Make `An automatic maximum is configured and raised` and `The engine bids for the collector` pass by sending closed maximum and automatic-bid action variants through `processBidActionGroup` beside the existing automatic-bidding transitions, with no new bidding or payment decision in the processor.
- [ ] 4.3 Make `A competing bid visibly causes an outbid state`, `A failed attempt sits beside the unchanged auction state`, and the pending/leading/outbid/won/lost/canceled standings in `Repeated activity is grouped under one listing` pass by grouping public movements and private transitions from one decision and returning the complete `bid_bidder_status` after-state on bid, provider, close, and cancellation paths.
- [ ] 4.4 Verify every manual, automatic, refusal, provider, close, cancellation, and replay scenario in this group with `pnpm run typecheck` and `pnpm run test:backend`.

## 5. Private history reads and storefront APIs (grade10) (owner: @htonyl)

This group depends on group 3's tables and can use seeded history facts while
group 4 is implemented in parallel.

- [ ] 5.1 Make `Repeated activity is grouped under one listing`, `A failed-only listing remains explainable`, `Active and completed activity separate cleanly`, `Paging does not repeat or skip a listing`, and `An account with no bidding activity has an empty index` pass through the fixed `listBidderBidStatuses` input/output contract and an index-backed read that joins current listing display facts.
- [ ] 5.2 Make `A competing bid visibly causes an outbid state`, `An automatic response is attributed to You`, `A failed attempt sits beside the unchanged auction state`, and `Full retained history remains pageable` pass through the fixed `listCombinedBidHistory` contract by merging public and account rows, folding complete groups, mapping the caller to **You**, and keyset-paging the stable chronology.
- [ ] 5.3 Make `A storefront account reads its own history`, `The same account id on another storefront is unrelated`, `An anonymous reader cannot read private history`, and `Reading history is inert` pass through the named Auction entrypoints and authenticated Grade10 and ZZZ Store procedure proxies, with public-contract tests proving the anonymous payload is unchanged.
- [ ] 5.4 Verify the Auction service, both storefront bindings, Store routers, paging, privacy, and inert-read scenarios with `pnpm run typecheck` and `pnpm run test:backend`.

## 6. Auction history frontend slice (grade10) (owner: @htonyl)

This group depends on group 2 only and uses fixture procedures; it does not
need a running backend or groups 3–5.

- [ ] 6.1 Make the page data for `A signed-in collector opens active bids`, `Active and completed activity separate cleanly`, and `Loading more preserves entries already shown` available by extending the structural Auction procedure client, decoding the shared page schemas in a `features/bidding/history` datasource, and exposing a shallow repository through its own DI module.
- [ ] 6.2 Make `Expanding history preserves its summary while loading`, `A history failure preserves the listing summary`, `A competing bid visibly causes an outbid state`, `An automatic response is attributed to You`, and `A failed attempt sits beside the unchanged auction state` available through separate index and per-listing query hooks whose fixture tests load the real decode, repository, and DI graph.
- [ ] 6.3 Make the history slice reachable without per-app wiring by publishing `@grade10/auction-frontend/history`, joining its module to `auctionModules`, and proving every token resolves with the package test harness.
- [ ] 6.4 Verify the frontend-slice group with `pnpm run typecheck` and `pnpm run test`.

## 7. Grade10 bidding-history page (grade10)

This group depends on groups 1, 2, and 6. Fixture procedures keep its unit
tests independent from the backend delivery groups.

- [ ] 7.1 Make `A signed-in collector opens active bids`, `A signed-out visitor preserves the destination`, and `ZZZ receives no bidding-history page` pass by adding the Grade10-only `bids` session surface, `/bids` route, `SessionDecided` return flow, localized surface copy, and no corresponding ZZZ route.
- [ ] 7.2 Make `Repeated activity is grouped under one listing`, `A failed-only listing remains explainable`, `Active and completed activity separate cleanly`, `Initial loading reserves the bidding list`, `An empty filter is explicit`, `An index failure is retryable`, and `Loading more preserves entries already shown` pass in the Grade10 page with the existing components and standing treatments named in `ui.md`, localized money/dates, controlled filter/expansion state, and accessible role-based tests.
- [ ] 7.3 Make `An outbid summary leads to its explanation and listing`, `Expanding history preserves its summary while loading`, `A history failure preserves the listing summary`, `A competing bid visibly causes an outbid state`, `An automatic response is attributed to You`, `A failed attempt sits beside the unchanged auction state`, and `An automatic maximum is configured and raised` pass in the expandable event list without a document reload or loss of already-rendered summaries.
- [ ] 7.4 Prove the signed-out return, Active/Completed navigation, outbid explanation, open-listing route, and responsive narrow layout through the Grade10 route/page integration suite and one seeded local-stack E2E flow.
- [ ] 7.5 Verify the completed frontend with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and `pnpm --dir apps/frontend/grade10 run e2e`.
