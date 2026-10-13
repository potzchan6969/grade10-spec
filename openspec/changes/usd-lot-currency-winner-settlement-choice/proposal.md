**Author:** @tangconst - 2026-10-12

**Extended by:** @tangconst - 2026-10-13 - the settlement choice and HKD settlement moved to [`add-hkd-settlement`](../add-hkd-settlement/proposal.md)

Product context: [Auction · Bidding](../../../docs/prds/products/grade10-site/auction/bidding.md), [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md), [Display](../../../docs/prds/products/grade10-site/auction/display.md), and [Admin · Auction Management](../../../docs/prds/products/grade10-admin/auction/management.md).

## Why

Auction prices show in USD (`US$`) on every auction surface, but the specs still
price lots in HKD and tie an order to the lot's currency. USD is the only base
currency for an item price and a bid, and an order settles in USD until
`add-hkd-settlement` lands.

**Metric:** TBC - ❓ awaiting PM.

## What Changes

- **Lot currency is USD** - new listings, bids, increments and the buyer's
  premium are USD; every auction surface shows `US$`. A display in another
  currency, if one comes, converts from USD and is not part of this change.
- **An order settles in USD** - the invoice, order total, fees, payments,
  refunds and order letters carry `USD`; no settlement choice is shown.
- **Methods in USD** - card, Hong Kong local bank transfer and SWIFT, each
  where Grade10 can take it; View Bank Details shows the Hong Kong local and
  SWIFT rails and no FPS.
- **JPY stays in Payment Settings** - dormant; USD and HKD rows are the active
  entries.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bid-increments` - new listings price in USD; ❓ the
  HKD and JPY schedules' fate is pending PM.
- `grade10-site/auction/winner-order` - an order settles in USD; methods and
  rails read the USD entries.
- `grade10-admin/auction/listing` - the operator's currency field is USD for
  new listings; ❓ whether HKD and JPY stay selectable for lots already priced
  is pending PM.

## Impact

- `apps/preview` and `packages/ui` auction fixtures already moved to US$ bid
  amounts ahead of this change (FE preparation).
- `apps/emails` auction letter previews show US$ bid amounts.
- `grade10-site` wires the USD lot currency when it consumes this change;
  `grade10-admin` drops the currency choice on listing create.
- `shared/ui/auction-listing` and `shared/money-amounts` contracts are
  unchanged - currency arrives on the view; the block picks no policy.
- `shared/ui/invoice-and-receipt-pdf` is unchanged; the invoice prints
  USD amounts.
