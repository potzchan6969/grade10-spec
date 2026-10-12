## Goals

- Show auction prices in USD on every collector-facing auction surface.
- Let a winner choose USD or HKD settlement at order setup.

## Non-Goals

- ❓ The conversion rate's owner, lock point and rounding — pending PM/Finance.
- ❓ Whether HKD and JPY lot schedules are retired or kept for lots already
  live in those currencies — pending PM.
- ❓ The verified-bidder bar restated in USD (today HKD 120,000) — pending PM.
- ❓ Whether the invoice and letters disclose the USD bid beside converted
  totals — pending PM.
- Multi-currency lot pricing, FX display conversion on bid surfaces, or a
  settlement currency beyond USD/HKD.
- Changes to `shared/money-amounts` or `shared/ui/auction-listing` contracts.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How do lots price? | Denominated in USD; collectors see `US$` | USD display conversion over a non-USD lot currency |
| Q2 | Who picks settlement currency? | The winner, at order setup — USD or HKD | Order currency fixed to the lot currency; a fixed HKD order |
| Q3 | ❓ Rate source and lock? | Pending PM/Finance | — |
| Q4 | ❓ HKD/JPY schedules? | Pending PM — retire or keep for live lots | — |
| Q5 | ❓ Verified-bidder bar in USD? | Pending PM (today HKD 120,000) | — |
| Q6 | ❓ Invoice discloses USD bid / rate? | Pending PM | — |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
