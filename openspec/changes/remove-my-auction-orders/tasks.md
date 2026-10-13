# Tasks: Remove My Auction Orders and its list blocks

## 1. The store's blocks (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Update `packages/ui/src/blocks/auction-order/public-exports.test.ts` in its own commit so it expects exactly `AuctionWinnerOrder` and `AuctionAddressForm` with their types, and none of `AuctionOrderList`, `AuctionOrderRow`, `AuctionOrderEmpty` (`shared-ui-auction-order-SC-15`, `shared-ui-auction-order-SC-16`)
- [ ] 1.2 Remove `auction-order-list.tsx`, `auction-order-row.tsx` and `auction-order-empty.tsx` with their stories, remove `AuctionOrderListProps`, `AuctionOrderRowProps`, `AuctionOrderRowCopy` and `AuctionOrderEmptyProps` from `types.ts`, and drop the exports from `packages/ui/src/index.ts` (`shared-ui-auction-order-SC-16`)
- [ ] 1.3 Verify: `pnpm --filter @grade10/ui test`, its typecheck, and `pnpm run validate:changes remove-my-auction-orders`

## 2. The walk

- [ ] 2.1 My Auctions' Won rows still open their Winner Order stories, and the `Auction Order/` group is gone: `AuctionWinnerOrder` sits under `Auction/Post Bidding/Blocks/AuctionWinnerOrder`, `AuctionAddressForm` under `Auction/Post Bidding/Blocks/AuctionAddressForm` (`grade10-site-auction-account-record-SC-55`)
