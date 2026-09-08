## 1. Specification and copy (owner: @constancetang)

- [x] 1.1 Record `ListingUserBidHistory` export contract and bid-card accessory slot in the auction-listing spec delta.
- [x] 1.2 Add shared `auctionListing` keys for dialog title, link, column headers, and bid-type labels in every supported locale.

## 2. Shared UI block (owner: @constancetang)

- [x] 2.1 Add `ListingUserBidHistoryRow` to auction-listing types and export from `@grade10/ui`.
- [x] 2.2 Implement `ListingUserBidHistory` (link, scrollable dialog, amount/time table, same-price priority note).
- [x] 2.3 Add `recentBidsAccessory` to `ListingAuctionBidCard` and `ListingAuctionCardSidebar`.

## 3. Preview and stories (owner: @constancetang)

- [x] 3.1 Add `userBidHistoryForState` fixtures and compose the block on the lot-details preview page.
- [x] 3.2 Add block stories (default, empty, long history) and extend the page story play test.

## 4. Validation (owner: @constancetang)

- [x] 4.1 Run `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test`.
