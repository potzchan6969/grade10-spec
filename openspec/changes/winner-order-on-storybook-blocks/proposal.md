**Author:** @ecchochan - 2026-09-30

Product context: [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order), built from [Auction Order Blocks](../../../docs/prds/products/shared/ui/auction-order.md).

## Why

The site's Winner Order page is not its Storybook design. It rebuilt the
design's progress card, lot card and sidebar inside the page, then added
`AuctionOrderDetail` above the lot, so the winner reads the lot twice and the
status four times. Every design change since has had to be copied by hand,
and ten differences slipped through: labels, alert placement, badge tones,
breakpoints, the lot image.

**Metric:** differences between a Winner Order story and the site page in the
same state, from ten to none, with no copy of the page body left to drift.

## What Changes

- **One page body, two consumers** - the design's page body becomes
  `AuctionWinnerOrder` in `@grade10/ui`; the Winner Order stories and the site
  both render it, each from its own data
- **The old sections go** - Order Information, Collection Method, the Order
  Status list and Lots leave the page, and `AuctionOrderDetail`, which only
  this page rendered, leaves `@grade10/ui`
- **What the design did not draw reads as an alert** - suspension, a returned
  proof and a card checkout's return show as alerts under the lot, as the
  design's outcome alert does

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` - the page is the design's page body in
  place of its four sections.
- `shared/ui/auction-order` - `AuctionWinnerOrder` in place of
  `AuctionOrderDetail`.

## Impact

| Consumer | Change |
| --- | --- |
| `@grade10/ui` | Exports `AuctionWinnerOrder`; drops `AuctionOrderDetail` |
| `apps/preview` | The Winner Order page renders the block; its stories keep their play functions, with the settle helper on the block's root |
| `apps/frontend/grade10` | `AuctionWinnerOrderPage` maps its read into the block; its own progress, lot card and sidebar are deleted; the dialogs stay as they are |

## Ordering and Dependencies

- **After `add-my-auction-orders`**, declared. Its four-sections requirement
  and `AuctionOrderDetail` are what this change replaces
- **After `winner-order-tracking-link`**, declared. The block draws its
  tracking link; this change restates none of it
- **Dialogs are later changes**, one per dialog. Each design dialog keeps its
  own state today and needs a data seam before the site can render it

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Auction Order Blocks · The Blocks](../../../docs/prds/products/shared/ui/auction-order.md#the-blocks)
