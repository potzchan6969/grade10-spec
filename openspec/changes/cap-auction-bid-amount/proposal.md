**Author:** @jeffffej0909 - 2026-09-14

## Why

A bid has no upper limit today. The top tier of each currency's schedule has no
upper bound, so a collector can commit any amount, including a mistyped one
many times the card's worth, and an auto-bid maximum can carry the same error
into every later bid. One ceiling per currency, on every lot, stops an amount
Grade10 would never want to settle.

**Metric:** refused-above-ceiling bids — bids and maximums refused for going
above the ceiling, per week. It should be near zero; a rise means the ceiling
sits too low for the lots on sale.

## What Changes

- **A bid ceiling per currency.** USD 10,000,000, HKD 80,000,000 and
  JPY 150,000,000,000, the same on every lot.
- **Above the ceiling is refused.** A manual bid or an auto-bid maximum above
  it is refused and the refusal names the ceiling. An amount equal to it is
  accepted.
- **The ceiling caps the minimum.** A lot whose next minimum would pass the
  ceiling takes no further bid.

## Non-Goals

- **A per-lot or operator-set ceiling.** Operators do not edit it.
- **Currency conversion.** Each ceiling is set in its own currency.
- **A ceiling on the starting price** or any operator listing field.
- **Changes to the payment hold** for a maximum; a maximum at the ceiling is
  held as any other.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/bid-increments`: a per-currency bid ceiling refused
  above, for manual bids and auto-bid maximums.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | The bid panel refuses an amount above the ceiling and shows the refusal naming it. |
| Auction service | Refuses a bid or maximum above the ceiling; stops the minimum at it. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. The refusal copy is catalog work for the engineer. |

## Assumptions

- **The ceiling is inclusive.** An amount equal to it is accepted.
- **Quick bid presets** above the ceiling are not offered, as a consequence of
  the refusal; the preset rules themselves do not change.

## References

- [Bid Increments · Bid pricing](../../../docs/prds/products/grade10-site/auction/bid-increments.md#bid-pricing)
