---
title: Auction Order Blocks
spec: shared/ui/auction-order
order: 10
---

🚧 Blocks make a winner's auction orders, composed by every application that
shows them: the My Auction Orders list, its row and empty state, the order
detail, and the delivery address form. What an order means is [My Auction
Orders](/p/grade10-site/auction/post-bidding#winner-order) and [Winner
Order](/p/grade10-site/auction/post-bidding#winner-order); this capability is the
component contract underneath them.

## The Blocks

- 🚧 **Order list** — the page body with its rows, or the empty state
- 🚧 **Order row** — the lot, the auction, the winning bid and the order
  status as supplied, a **View lot** action, and exactly one next action
  whose label the application supplies; the row reports which action was
  chosen and never picks it from the status itself
- 🚧 **Order detail** — Order Information, Collection Method, Order Status
  and Lots, in that order; Collection Method shows whichever of an address
  form, a read-only address, or nothing the application supplies, and an
  invoice with Pay Now only when one is supplied
- 🚧 **Address form** — the fields [Winner
  Order](/p/grade10-site/auction/post-bidding#winner-order) names, the required ones
  marked, an application-supplied error beside each field it names, and
  Confirm with the entered values or Cancel; it checks no phone number's
  format
- 🚧 **Billing address** — a Use same details for billing address box,
  ticked by default; unticked, a second address with the same fields. It
  follows the form, which first ships without one
- 🚧 **On their own** — the row and the address form each render alone

## Ownership

- **Every status, amount and string** belongs to the application and arrives
  through props
- **Reports, never acts** — a press is reported through its callback; the
  writes stay the application's

:::detail{title="Code map" for="engineer"}
- **Blocks** — `AuctionOrderList`, `AuctionOrderRow`, `AuctionOrderEmpty`,
  `AuctionOrderDetail` and `AuctionAddressForm`, in `packages/ui`
:::
