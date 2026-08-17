# Tasks: Grade10 Auction

## 1. Auction and Stripe contracts

- [ ] 1.1 Make `Auction listing facts are available` and `Money facts use minor units and currency` pass by defining the Auction listing, bid, price-breakdown, order, and provider-neutral outcome contracts.
- [ ] 1.2 Make `A customer can select a saved or recent card` and `Stripe configuration is incomplete` pass by defining the server-only card authorization, release, capture, invoice, webhook, and reconciliation outcomes.
- [ ] 1.3 Verify the Auction and Stripe contract fixtures preserve provider failures as typed, credential-safe outcomes.

## 2. Auction persistence and bidding backend

- [ ] 2.1 Make `A collector browses Auction listings` and `A listing identifies its card facts` pass with Grade10-owned listing persistence, category reads, and immutable policy snapshots.
- [ ] 2.2 Make `A bid must meet the next increment`, `A bid outside the window is refused`, and `A late valid bid extends the close` pass through a serialized listing decision and controllable clock.
- [ ] 2.3 Make `Concurrent bids keep the highest valid outcome`, `An outbid authorization is released`, and `A delayed lower authorization cannot land` pass through idempotent bid attempts and Stripe outcomes.
- [ ] 2.4 Make `A closed listing creates its winner order` and `A winner payment becomes paid once` pass through verified, deduplicated Stripe events and on-read/scheduled reconciliation.
- [ ] 2.5 Verify every listing, bidding, authorization, close, payment, and reconciliation scenario in this group through Auction backend feature tests.

## 3. Customer Auction frontend

Task 3.4 depends on the contracts in group 1; it uses fixtures rather than a running backend.

- [ ] 3.1 Make `A collector browses Auction listings` and `A listing identifies its card facts` pass in the Grade10 Auction SPA from Auction contracts and fixtures.
- [ ] 3.2 Make `A bidder sees live bid facts` and `A bidder sees the bidding window` pass in the Auction listing detail experience.
- [ ] 3.3 Make `A winner sees a complete checkout breakdown` and `A customer can select a saved or recent card` pass without placing Stripe credentials, card details, or total-authority in the browser.
- [ ] 3.4 Make `A winner sees their order state` and `A customer cannot read another customer's order` pass in the Auction SPA against authenticated contract fixtures.
- [ ] 3.5 Verify every customer catalogue, listing, bid, checkout, and order-read scenario in this group through the Auction frontend feature lane.

## 4. Manual fulfilment and review

- [ ] 4.1 Make `An authorized operator advances manual shipping` and `An unauthorized user cannot update an Auction order` pass in the Grade10 admin portal and Auction admin feature module.
- [ ] 4.2 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, and `pnpm run build` after the relevant Auction and Stripe feature lanes pass.
- [ ] 4.3 Verify every scenario in this change, run `openspec validate add-grade10-auction`, and run `openspec validate --specs`.
- [ ] 4.4 Review Stripe authorization/capture capability, webhook secret provisioning, idempotency, reconciliation, policy-snapshot integrity, and manual-order authorization before staging deployment.
- [ ] 4.5 After rollout is confirmed, fold the accepted delta into `openspec/specs/grade10-auction/`, update the Auction PRD if its decision changed, and archive this change.
