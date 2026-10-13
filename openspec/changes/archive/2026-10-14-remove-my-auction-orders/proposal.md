**Author:** @tangconst - 2026-10-12

## Why

My Auctions already lists every won lot, and each Won row opens its own
Winner Order — the detail page carries setup, invoice, payment and shipping
for that lot. A second page, My Auction Orders, lists the same won orders
with the same statuses and the same destinations. It duplicates My Auctions,
its list blocks contradict the page that already ships, and nothing on the
site reaches it: the account menu offers no orders item, and the link from
My Auctions was never built. Product settles that there is no separate
orders page (Q1).

**Metric:** None - a removed surface, held by the export contract and the
My Auctions page stories.

## What Changes

- **The capability goes** - `grade10-site/auction/auction-orders` is removed
  in full: list, ordering bands, per-status row actions, empty and failed
  reads, its journey and its suite.
- **The blocks go** - `shared/ui/auction-order` exports exactly
  `AuctionWinnerOrder` and `AuctionAddressForm`; `AuctionOrderList`,
  `AuctionOrderRow` and `AuctionOrderEmpty`, their props and copy types,
  their stories and their files leave `packages/ui`.
- **References settle** - a Won row on My Auctions opens the order per
  `grade10-site/auction/winner-order`, no longer `auction-orders`; the page
  shell's account menu drops the My Auction Orders name, since no such page
  exists.
- **Overlap** - `omit-profile-account-menu` carries a delta on
  `auction-orders` that drops its account-menu link; removing the capability
  makes that delta moot, and this change records the supersession.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/auction-orders`: the capability is removed in full.
- `shared/ui/auction-order`: the export contract drops `AuctionOrderList`,
  `AuctionOrderRow`, `AuctionOrderEmpty` and their types; the Order list
  feature and its scenarios go.
- `grade10-site/auction/account-record`: a Won row opens the order per
  `grade10-site/auction/winner-order`.
- `grade10-site/site/page-shell`: the account menu's not-offered list drops
  My Auction Orders.

## Impact

- **Removed exports** - `AuctionOrderList`, `AuctionOrderRow`,
  `AuctionOrderEmpty`, `AuctionOrderListProps`, `AuctionOrderRowProps`,
  `AuctionOrderRowCopy`, `AuctionOrderEmptyProps` leave `@grade10/ui`; a
  consumer importing them breaks at build time. No consumer exists in this
  repository.
- **Code** - `packages/ui/src/blocks/auction-order/` loses the list, row and
  empty files, their stories and their types; `public-exports.test.ts` and
  `src/index.ts` follow the contract.
- **Pages** - My Auctions and Winner Order stories are unchanged.

## References

- [Post-bidding · The Close](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-close)
- [Post-bidding · Product decisions](../../../docs/prds/products/grade10-site/auction/post-bidding.md)
- [Auction Order Blocks · The Blocks](../../../docs/prds/products/shared/ui/auction-order.md#the-blocks)
- [Page Shell · Product decisions](../../../docs/prds/products/grade10-site/site/page-shell.md)
