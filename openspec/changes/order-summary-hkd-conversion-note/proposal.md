**Author:** @tangconst - 2026-10-15

> The HKD Order Summary reads HKD only and names the conversion once — one
> muted note under the Order Total, "Converted from US$131.21 at 1 USD =
> 7.85 HKD". This replaces the display half of the Q8 call in
> `usd-lot-currency-winner-settlement-choice`, and retracts the unaccepted
> `collapse-order-summary-usd-recap` change that drew an HKD | USD switch
> instead.

## Why

The settled HKD Order Summary draws each line twice — the HKD amount the
winner pays, then its USD figure beneath it — up to eight small amounts
stacked inside the lines a winner checks before paying. A switch to swap
the whole column was tried next, but the question the USD answers is not
"what is each line in USD" — it is "where did this HKD total come from".
One note under the total answers that: the USD figure converted and the
fixed rate. The lines stay the invoice's lines, one currency on screen, and
the note sits where a reader finishes the column.

## What Changes

- **The summary reads one currency** — for an HKD order every line and the
  Order Total read HKD. No USD amount sits on a line, no USD total, no
  currency switch.
- **One note names the conversion** — beneath the Order Total the summary
  names the USD figure converted and the fixed rate, "Converted from
  US$131.21 at 1 USD = 7.85 HKD". A card fee computed in HKD adds nothing
  to that figure; a bank fee typed in USD counts.
- **The rate rule keeps its edge** — the conversion note is the one surface
  that names the rate; every other page, invoice, receipt and letter still
  names none.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — the HKD Order Summary drops the
  per-line USD recap for a conversion note under the Order Total, and the
  rate-naming rule carves out that note as its one surface.

## Impact

- `packages/ui` `AuctionWinnerOrder` needs no contract change: the note
  rides the summary total's existing `footnote`. The uncommitted contract
  surface `summary.currencyToggle`, added for the retracted change, is
  removed from the block.
- `grade10` supplies HKD line amounts and the note text on the Order Total
  for an HKD order's summary. `apps/preview`'s winner-order screens carry
  the same fixtures. The component export that changes is
  `AuctionWinnerOrder`'s `summary` — `currencyToggle` out, `footnote` in
  use.

## References

- [Post-Bidding · Settling in HKD](../../../docs/prds/products/grade10-site/auction/post-bidding.md#settling-in-hkd)
- [Auction Order Blocks · The Blocks](../../../docs/prds/products/shared/ui/auction-order.md#the-blocks)
