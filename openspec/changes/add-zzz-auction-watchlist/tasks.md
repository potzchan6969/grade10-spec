## 1. ZZZ Watching (grade10)

- [x] 1.1 Answer the auction package's procedure port from ZZZ's store client, watching only, and load the auction core and watches modules in ZZZ's container
- [x] 1.2 Add `/auction/listings/<listing id>` with title, standing, close and Watch; a signed-out Watch opens sign-in (`zzz-site-auction-watchlist-SC-01`, `zzz-site-auction-watchlist-SC-02`)
- [x] 1.3 Add `/auction/watching` composing `AuctionRecord` with Unwatch on every row, linked from the profile (`zzz-site-auction-watchlist-SC-03`)
- [x] 1.4 Cover the three scenarios with site tests on the fixture auction

## 2. Walk And Page (grade10)

- [ ] 2.1 Walk watch, unwatch and the watched list on a ZZZ lane — blocked: the local E2E stack needs Docker, and no ZZZ lane carries a seeded listing
- [ ] 2.2 Draft the ZZZ auction page and fold this delta onto it — blocked: Product owes the ZZZ auction PRD (`page_waived`)
