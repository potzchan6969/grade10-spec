# Tasks: Grade10 Auction

## 1. Auction and Stripe contracts (owner: @htonyl)

- [x] 1.1 Make `Auction listing facts are available`, `A closed listing is absolute`, `Money facts use minor units and currency`, and `A consumer reads a listing contract` pass by migrating public contracts from auction-item/lot and anti-snipe terms to listing and extension terms.
- [x] 1.2 Make `Stripe configuration is incomplete` and `A missed authorization webhook is repaired` pass by defining server-only bid authorization, asynchronous release, webhook, and reconciliation outcomes.
- [x] 1.3 Verify the Auction and Stripe contract fixtures preserve provider failures as typed, credential-safe outcomes.

## 2. Auction persistence and bidding backend (owner: @htonyl)

- [x] 2.1 Make `A collector browses Auction listings` and `A closed listing is absolute` pass with Grade10-owned listing persistence, reserve removal, category reads, and immutable policy snapshots.
- [x] 2.2 Make `A bid must meet the next increment`, `A bid outside the window is refused`, and `A late valid bid extends the close` pass through a serialized listing decision, optional extension cap, and controllable clock.
- [x] 2.3 Make `Concurrent bids keep the highest valid outcome`, `An outbid authorization is released`, and `A delayed lower authorization cannot land` pass through idempotent bid attempts and Stripe outcomes.
- [x] 2.4 Verify every listing, bidding, authorization, extension, reserve-removal, and reconciliation scenario in this group through Auction backend feature tests.

## 3. Customer Auction frontend (owner: @htonyl)

Task 3.4 depends on the contracts in group 1; it uses fixtures rather than a running backend.

- [x] 3.1 Make `A collector browses Auction listings` and `A consumer reads a listing contract` pass in `apps/frontend/grade10` while preserving its current Auction UI composition.
- [x] 3.2 Verify the current Auction frontend feature lane against renamed listing and extension contracts.

## 4. Review (owner: @htonyl)

- [x] 4.1 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build` after the relevant Auction and Stripe feature lanes pass.
- [x] 4.2 Verify every scenario in this change, run `openspec validate add-grade10-auction`, and run `openspec validate --specs`.
- [x] 4.3 Review Stripe webhook secret provisioning, idempotency, reconciliation, reserve removal, extension-cap behavior, and public-contract migration before staging deployment.
- [x] 4.4 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/`, update the Auction PRD if its decision changed, and archive this change. — Done: the delta was folded into `openspec/specs/grade10-site/auction/` and the change archived on 2026-09-05.
