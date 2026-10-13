**Author:** @tangconst - 2026-10-13

Product context: [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup) and [Admin · Auction Management](../../../docs/prds/products/grade10-admin/auction/management.md).

Builds on [`usd-lot-currency-winner-settlement-choice`](../usd-lot-currency-winner-settlement-choice/proposal.md), which makes USD the base currency and settles an order in USD.

## Why

Winners who hold Hong Kong dollars pay by FPS or a local transfer today only
by converting themselves. Grade10 wants to take payment in HKD as well as USD.
Lots and bids stay in USD.

**Metric:** TBC - ❓ awaiting PM.

## What Changes

- **The winner chooses a settlement currency** - at order setup, before the
  payment method, from `USD` and `HKD`; `HKD` is preselected with card, and changing it
  restores the method last chosen for it.
- **Methods follow the currency** - USD: card, Hong Kong bank transfer, SWIFT.
  HKD: card, FPS, Hong Kong bank transfer.
- **The operator issues the invoice in the chosen currency** - for an HKD
  order the operator enters the HKD amounts. Grade10 holds no exchange rate.
- **Payment Settings and bank details key off the settlement currency** - the
  card fee rule, the buyer's premium minimum and the bank details are read for
  the order's currency.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` - the settlement choice, HKD methods and
  rails, and an order that carries its settlement currency.
- `grade10-admin/auction/payment-settings` - card rules and bank details are
  read per settlement currency, USD and HKD.
- `grade10-admin/auction/post-sale` - the operator sends the invoice in the
  order's settlement currency.

## Impact

- `apps/preview` setup dialog and How to Pay dialog gain the choice and the
  per-currency rails; stories draw both currencies.
- `grade10-site` reads the winner's currency when it builds the order;
  `grade10-admin` sends the invoice in it.
- `shared/ui/invoice-and-receipt-pdf` is unchanged; the invoice prints the
  settlement currency's amounts.
