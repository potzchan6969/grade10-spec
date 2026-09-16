## 1. Product record and acceptance suites (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Update the Auction, Auto-Bidding, Bid Panel Enrollment and Payment Method manual pages so the standard path states that bid-time authorization is disabled by default and hold outcomes apply only when the feature is enabled.
- [ ] 1.2 Reconcile the related in-flight deltas for increment, winner close, My Auctions and called-off lots with the actual-hold condition, then verify `openspec validate default-auction-bid-holds-off --strict` and `pnpm check:manual`.
- [ ] 1.3 Add or update the feature and auction-domain cases for `grade10-site-auction-auction-SC-23`, `grade10-site-auction-auto-bidding-SC-25`, `grade10-site-auction-bid-panel-enrollment-SC-15` and `SC-16`; retain the enabled hold cases as separate coverage and run `pnpm run tcs:validate`.

## 2. Flag resolution and bid service mode (grade10) (owner: @htonyl)

- [ ] 2.1 Make the auction environment resolver treat only `AUCTION_AUTHORIZATION_HOLD_ENABLED="1"` as enabled, covering missing, `"0"` and unknown values in unit tests; keep the worker deployments explicit and type-safe.
- [ ] 2.2 Make the bid service default `authorizationHoldEnabled` to false and audit every storefront and RPC caller so the effective mode is passed once without changing public bid inputs or results.
- [ ] 2.3 Make `grade10-site-auction-auction-SC-23` and `grade10-site-auction-auto-bidding-SC-25` pass by accepting bids and maximum resolutions without a PaymentIntent, while keeping `SC-09`, `SC-11`, `SC-14`, `SC-15`, `SC-19`, `SC-20` and `SC-21` on the explicit enabled path; verify the focused auction backend tests and package typechecks.

## 3. Bid-panel state integration (grade10)

- [ ] 3.1 Keep the existing Grade10 bid-panel states and authorized handling; verify that the backend response leaves a successfully linked collector ready to bid and moves an accepted first bid directly to `enrolled`, without adding a client-side hold flag or panel state.

## 4. Cross-feature verification (grade10)

- [ ] 4.1 Run the auction database and frontend lanes covering first bids, maximum raises, automatic bids, enrollment, outbid release, close and winner payment; confirm no-hold bids do not require Stripe while existing enabled holds still release, capture or reconcile through their current paths.
- [ ] 4.2 Run the repository typecheck, lint and `git diff --check`, then review the application diff against every scenario named by this change before the change is handed off for implementation and later archive.
