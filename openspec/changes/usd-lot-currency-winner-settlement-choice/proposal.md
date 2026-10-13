**Author:** @tangconst - 2026-10-12

Product context: the auction chapters and Admin · Auction Management, linked under References.

> The bid and settlement split is agreed, with the conversion mechanics and
> the fate of HKD and JPY lot pricing settled in
> [Decisions](decisions.md#decisions). One launch dependency remains: Finance
> saves a USD card fee rule.

## Why

A lot prices in USD, HKD or JPY today, one per lot, and the winner pays in the
lot's currency. Three jobs share one word. The **bid currency** is the unit
every auction is bid in. The **preferred currency** is a reference price in a
collector's own money. The **settlement currency** is what a winner pays in.
Splitting them lets every lot bid in one unit, USD, and lets a winner pay in
the money they hold.

**Metric:** TBC - ❓ awaiting PM.

## What Changes

- **The bid currency is USD** — every lot prices and bids in USD; a collector
  always types USD. Every auction surface (catalogue, listing page, bid panel,
  My Auctions, bid history, market comps, letters' bid amounts) shows `US$`.
  One schedule and one ceiling remain; the HKD and JPY ones retire.
- **The winner picks the settlement currency** — at order setup, USD or HKD,
  nothing preselected. The invoice, order total, fees, payments, refunds and
  order letters carry it.
- **HKD converts at one fixed rate** — 7.85 HKD to 1 USD, rounded up, shown
  nowhere. An HKD invoice and receipt print no USD winning bid.
- **The Order Summary stays USD** — under HKD its Order Total splits into a USD
  total line, then the converted HKD total line.
- **Methods follow the currency** — HKD offers Card, FPS and HK Local; USD
  offers Card, HK Local and International via SWIFT. Each rail is a choice at
  setup.
- **The operator has no currency to choose** — the listing form is USD only,
  and HKD and JPY leave it and Payment Settings.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bid-increments` — one USD schedule and ceiling; the
  HKD and JPY schedules and ceilings retire.
- `grade10-site/auction/winner-order` — order setup gains the settlement
  currency; payment methods by rail follow it; HKD conversion, the Order
  Summary's two total lines and the invoice's disclosure follow it.
- `grade10-admin/auction/listing` — the currency field is USD only and
  defaults to USD; HKD and JPY are refused.
- `grade10-admin/auction/post-sale` — the operator quote types USD, converts it
  to the settlement currency and names the rail picked.
- `grade10-site/auction/notifications-order` — letters after the winner picks
  carry the settlement currency and no USD winning bid.
- `grade10-site/auction/auction` — the verified-bidder bar is US$15,000.
- `shared/ui/auction-order` — the new setup and summary props the winner-order
  block takes.
- `shared/ui/auction-listing` — the HKD and JPY custom-maximum caps retire.
- `grade10-admin/auction/payment-settings` — a card fee rule per settlement
  currency, USD and HKD; JPY dropped, and the premium minimum one USD amount.

## Impact

- `apps/preview` and `packages/ui` auction fixtures already moved to US$ bid
  amounts ahead of this change (FE preparation); invoice/order fixtures stay
  HK$ to exercise an HKD-settled order.
- `apps/emails` auction letter previews show US$ bid amounts and an HK$ order
  total.
- `grade10-site` wires the USD lot currency and the setup-time settlement
  picker when it consumes this change; `grade10-admin` drops the currency
  choice on listing create.
- `shared/money-amounts` contract is
  unchanged — currency arrives on the view; the block picks no policy.
- `shared/ui/invoice-and-receipt-pdf` is unchanged; the invoice prints
  settlement-currency amounts and, under HKD, no USD winning bid and no rate.
- The verified-bidder bar becomes US$15,000; the storefront check reads it.
- Existing lots are test data: their currency is overwritten to USD, amounts
  unchanged, so no lot needs a retired schedule.

## References

- [Auction · Chapters](../../../docs/prds/products/grade10-site/auction/index.md#chapters)
- [Bidding · Currencies](../../../docs/prds/products/grade10-site/auction/bidding.md#currencies)
- [Bidding · Bid Increments](../../../docs/prds/products/grade10-site/auction/bidding.md#bid-increments)
- [Display](../../../docs/prds/products/grade10-site/auction/display.md)
- [Account · Verified Identity](../../../docs/prds/products/grade10-site/auction/account.md#verified-identity)
- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
- [Post-Bidding · Payment Methods by Currency](../../../docs/prds/products/grade10-site/auction/post-bidding.md#payment-methods-by-currency)
- [Post-Bidding · Settling in HKD](../../../docs/prds/products/grade10-site/auction/post-bidding.md#settling-in-hkd)
- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Auction Management · Payment Settings](../../../docs/prds/products/grade10-admin/auction/management.md#payment-settings)
