**Author:** @tangconst - 2026-10-15

> The HKD Order Summary swaps between its HKD lines and the lot's USD figures
> behind an HKD | USD control in the heading, Order Total included. This
> revises the display half of the Q8 call in
> `usd-lot-currency-winner-settlement-choice`; everything else that change
> settled stands.

## Why

The settled HKD Order Summary draws each line twice: the HKD amount the
winner pays, then its USD figure beneath it. Up to eight small amounts sit
inside the lines a winner checks before paying, as two similar `$`-signed
strings stacked in one column. The USD figures are a reference the winner
may want, not a second price list — the invoice, receipt and letters print
HKD only, and the summary is the one surface that still shows both. One
currency at a time keeps the summary clean and keeps every read internally
consistent: the amounts a winner sees always sum to the total they see.

## What Changes

- **The summary swaps currencies** — an HKD | USD control in the Order
  Summary heading switches every amount between the HKD invoice lines and
  the lot's USD figures, Order Total included. HKD is the view an order
  opens on.
- **The card fee stays HKD** — computed in HKD from the HKD card rule, it has
  no USD figure and reads HK$ in both views. A USD-typed bank fee swaps with
  the other lines.
- **Everything else holds** — the HKD view's Order Total is the invoice's
  Order Total; the invoice, receipt and letters are untouched.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — the HKD Order Summary swaps all
  amounts behind an HKD | USD control instead of recapping USD beneath each
  line.
- `shared/ui/auction-order` — `AuctionWinnerOrder` gains
  `summary.currencyToggle`; a line's `subtext` becomes the row's amount in
  the control's secondary view.

## Impact

- `packages/ui` `AuctionWinnerOrder` gains the optional
  `summary.currencyToggle` prop. The Order Summary stories draw both views
  and are the design reference, as the parent change settled its own
  (ui-design waived).
- `grade10` supplies the toggle labels, each line's USD `subtext` and the
  Order Total's USD `subtext` for an HKD order's summary when it consumes
  this. The component export that changes is `AuctionWinnerOrder`'s
  `summary`; `apps/preview`'s winner-order screens carry no second-currency
  amounts today and supply them with an HKD fixture when they adopt it.

## References

- [Post-Bidding · Settling in HKD](../../../docs/prds/products/grade10-site/auction/post-bidding.md#settling-in-hkd)
- [Auction Order Blocks · The Blocks](../../../docs/prds/products/shared/ui/auction-order.md#the-blocks)
