**Author:** @tangconst - 2026-10-19

> Winner order setup opens with the payment step already filled: **Pay in
> HKD** is selected where both currencies are offered — and named, `Pay in
> HKD`, where only one is — and the first payment method that currency
> offers is selected. This supersedes the "nothing preselected" call in
> `usd-lot-currency-winner-settlement-choice` Q2, which left the winner an
> empty picker before any rail showed.

## Why

Grade10 settles in HKD today, so an empty Pay in picker asks the winner a
question whose answer is almost always the same, and hides every payment
method behind it. Preselecting HKD shows the rails on open, and
preselecting the first offered method — card where a card fee rule
applies — lets a winner confirm the ordinary path without touching the
step at all. A winner paying another way still changes the selection; a
currency switch still clears a method the new currency does not offer.

## What Changes

- **HKD is the default settlement currency** — where USD and HKD are both
  offered, HKD is selected when the step opens; where one currency is
  offered, it is fixed and the choice names it, `Pay in HKD`, with no
  picker.
- **The first offered method is preselected** — card where the currency
  has a card fee rule, else the first bank rail the currency offers. The
  winner still confirms explicitly; preselection is not confirmation.
- **A confirmation with no currency or no method is still refused** —
  preselection changes the opening state, not the validation.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — the settlement currency and
  payment method choices open preselected.
- `grade10-admin/auction/test-winners` — a test winner's order opens setup
  with HKD and its first offered method preselected.

## Impact

- `apps/preview`'s Complete Order Setup dialog already draws this:
  `Pay in` preselects HKD, a single offered currency reads `Pay in
  {currency}` with no picker, and the first offered method is checked.
- `grade10` applies the same defaults where the real Winner Order opens
  setup. No `AuctionWinnerOrder` contract change: the dialog is preview
  and application code, not the shared block.

## References

- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
- [Post-Bidding · Payment Methods by Currency](../../../docs/prds/products/grade10-site/auction/post-bidding.md#payment-methods-by-currency)
