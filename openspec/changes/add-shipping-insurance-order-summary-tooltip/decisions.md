## Goals

- Let a winner understand what Insurance covers from Order Summary without
  leaving the page.
- Keep pre-invoice Order Summary honest: Insurance appears as TBD with the
  other fee rows before send.
- Keep post-invoice Insurance optional — present with a value and tooltip when
  added, absent when none.

## Non-Goals

- Renaming the line to Shipping insurance — the durable line name stays
  Insurance.
- Hiding Payment Processing Fee when Free — zero still reads Free on every
  invoice.
- Changing how Insurance is priced, who adds it, or when it may be omitted
  after send.
- Changing Buyer’s Premium, Shipping & Handling or Payment Processing Fee
  tooltip copy.
- Showing a calculated Insurance amount before an operator sends the invoice.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What label does the winner see? | Insurance — the durable invoice line name (recommended) | Shipping insurance — rejected: renames a settled line for a tooltip-only change |
| Q2 | What happens to Payment Processing Fee when zero? | Keep showing the line as Free (recommended) | Hide the row when Free — rejected: **BREAKING** vs the durable fee-display rule; out of this change |
| Q3 | What does the Insurance tooltip say? | `0.9% of the order value during transit.` as durable copy for now (recommended) | Leaving 0.9% as a PRD ❓ — rejected: winners need a concrete tip beside the other fee tooltips; revise later if the rate changes |
| Q4 | Does Insurance appear before the invoice is sent? | Yes, as TBD with the other fee rows (recommended) | Omit Insurance until the operator quotes it — rejected: pre-invoice summary already lists the fee categories that may appear; knowing Insurance can vanish after send without a quote |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
