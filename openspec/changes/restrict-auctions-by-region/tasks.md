## 1. The Region Rule (grade10)

- [x] 1.1 Add `AUCTION_RESTRICTED_REGIONS`, `observedRegion` and `auctionsOfferedIn` to `@grade10/app-env`, with tests for the cf object, the header fallback and the fail-open signal (`grade10-site-auction-availability-SC-01`, `grade10-site-auction-availability-SC-03`)

## 2. Service Refusals (grade10)

- [x] 2.1 Carry `region` on the auction service's tRPC context; refuse the public catalogue, lot, campaign, category and featured reads, answer `public.availability`, and refuse a restricted live socket upgrade (`grade10-site-auction-availability-SC-02`, `grade10-site-auction-availability-SC-11a`)
- [x] 2.2 Carry `region` on the store's tRPC context; refuse lot reads, enrollment, bids, watches, standings and the bid record before the auction hears of them, keeping winner orders, unwatch and alert mutes open (`grade10-site-auction-availability-SC-10`, `grade10-site-auction-availability-SC-11`, `grade10-site-auction-availability-SC-11b`, `grade10-site-auction-availability-SC-08a`)

## 3. The Site (grade10)

- [x] 3.1 Add `readAvailability` to the catalogue port and `useAuctionAvailability` to `@grade10/auction-frontend/availability`, failing open (`grade10-site-auction-availability-SC-03`)
- [x] 3.2 Drop the Auction nav item, the My Auctions handler, the marketing and store-hero auction ways in for a restricted region (`grade10-site-auction-availability-SC-04`, `grade10-site-auction-availability-SC-05`, `grade10-site-auction-availability-SC-06`, `grade10-site-auction-availability-SC-12`)
- [x] 3.3 Answer the catalogue, a lot, My Auctions and the bidding history with `AuctionRestrictedPage` (`grade10-site-auction-availability-SC-07`, `grade10-site-auction-availability-SC-08`, `grade10-site-auction-availability-SC-09`, `grade10-site-auction-availability-SC-13`)

## 4. Shared Words And Drawing (grade10-spec)

- [x] 4.1 Add the shared `auctionAvailability` namespace - title, line and Browse the Store - in en, zh-Hant, zh-Hans and ko
- [x] 4.2 Draw the line under the title on the Auction Restricted story; `SiteHeader` already omits My Auctions without its handler (`shared-ui-site-chrome-SC-44`)

## 5. The Walk (grade10)

- [ ] 5.1 Walk a restricted request end to end on a deployed lane — blocked: the local E2E stack needs Docker, and the edge's region signal exists only behind Cloudflare - waived 2026-10-26 by @htonyl: deployed evidence is no longer needed; left unchecked and waived at archive by tasks_waived
- [ ] 5.2 Product and legal confirm the restricted list (decision Q9) — blocked: needs Product and legal
