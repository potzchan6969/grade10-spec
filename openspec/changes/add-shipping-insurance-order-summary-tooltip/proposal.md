**Author:** @tangconst - 2026-09-21

Product context: [Post-Bidding · The Invoice](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-invoice).

## Why

A winner who reads Order Summary before or after the invoice is sent cannot
tell what Insurance covers. Buyer’s Premium, Shipping & Handling and Payment
Processing Fee already carry brief info tooltips; Insurance does not, so the
optional transit fee looks unexplained beside them.

**Metric:** share of Winner Order sessions where Insurance is shown with an
info tooltip when the line is present (target: 100% of those sessions).

## What Changes

- **Insurance carries a brief info tooltip** on Winner Order's Order Summary
  when the line is shown — `0.9% of the order value during transit`.
- **Before the invoice is sent**, Order Summary shows Insurance as TBD with
  the other fee rows (Winning Bid stays the known amount; fees and Order Total
  stay TBD).
- **After send**, Insurance stays optional and greater than zero when added,
  and stays absent when the operator added none — unchanged omission rule.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — Insurance joins the fee-tooltip set on
  Order Summary; pre-invoice Order Summary includes Insurance as TBD.

## Impact

- Winner Order Order Summary copy and tooltip coverage in `grade10-site`
  (preview fixtures under `apps/preview` already demonstrate the row).
- No new `@grade10/ui` export; Summary row tooltips stay page composition of
  design-system `Tooltip` / `Info`.
- No change to invoice PDF line rules beyond the tooltip the on-page summary
  already mirrors for the other fee lines.

## Open Questions

None.

## References

- [Post-Bidding · The Invoice](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-invoice)
