## 1. Drop AuctionCard; the catalogue tile carries the deadline rule (grade10-spec)

- [x] 1.1 `AuctionLotCard`, `FeaturedAuctions` and `FeaturedAuctionsPair` require `locale` and `timeZone`; a closed tile draws `formatCollectorDeadline` with an `Ended` prefix and an open tile reads the zoned deadline to a screen reader under its countdown `shared-ui-auction-listing-SC-55`
- [x] 1.2 Pass `locale` and `timeZone` at every call site: the catalogue page, the all-auctions grid and the featured-archived and lot-card stories `shared-ui-auction-listing-SC-55`
- [x] 1.3 Delete `auction-card.tsx`, its story and its test; drop `AuctionCard`, `AuctionCardProps` and `AuctionCardWhen` from `src/index.ts` `shared-ui-auction-listing-SC-01`
