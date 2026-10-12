**Author:** @tangconst - 2026-10-12

Product context: [Auction · Bidding](../../../docs/prds/products/grade10-site/auction/bidding.md), [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md), [Display](../../../docs/prds/products/grade10-site/auction/display.md), and [Admin · Auction Management](../../../docs/prds/products/grade10-admin/auction/management.md).

> ❓ Draft for PM confirmation. The display/settlement split below is the
> agreed direction; the conversion mechanics and the fate of HKD/JPY lot
> pricing are still open.

## Why

Auction lots price and display in HKD today. The product shows auction prices
in USD — `US$` on every auction surface — while a winner settles in the
currency that suits them. Lots are denominated in USD; the winner chooses USD
or HKD settlement at order setup.

**Metric:** TBC - ❓ awaiting PM.

## What Changes

- **Lot currency is USD** — new auction listings are denominated in USD; every
  auction surface (catalogue, listing page, bid panel, My Auctions, bid
  history, market comps, letters' bid amounts) shows `US$` amounts.
- **Settlement currency is the winner's choice** — at order setup the winner
  picks USD or HKD. The invoice, order total, fees, payments, refunds and
  order letters carry the settlement currency.
- **The two amounts diverge** — a winning bid is a USD fact; an invoice total
  is a settlement-currency fact. Order surfaces can show both. ❓ Conversion
  rate source, lock point and rounding are pending PM/Finance.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bid-increments` — new listings price in USD; the HKD
  and JPY schedules' fate is ❓ pending PM (retire, or keep for existing lots
  already live in those currencies).
- `grade10-site/auction/winner-order` — order setup gains a settlement
  currency choice (USD or HKD); payment-method availability, invoice totals
  and the order letters key off the settlement currency.
- `grade10-admin/auction/listing` — the operator's currency field drops to
  USD-only / defaults to USD; ❓ whether HKD/JPY stay selectable is pending PM.

## Impact

- `apps/preview` and `packages/ui` auction fixtures already moved to US$ bid
  amounts ahead of this change (FE preparation); invoice/order fixtures stay
  HK$ to exercise an HKD-settled order.
- `apps/emails` auction letter previews show US$ bid amounts and an HK$ order
  total.
- `grade10-site` wires the USD lot currency and the setup-time settlement
  picker when it consumes this change; `grade10-admin` drops the currency
  choice on listing create.
- `shared/ui/auction-listing` and `shared/money-amounts` contracts are
  unchanged — currency arrives on the view; the block picks no policy.
- `shared/ui/invoice-and-receipt-pdf` is unchanged; the invoice prints
  settlement-currency amounts. ❓ Whether it also discloses the USD winning
  bid or the applied rate is pending PM.
