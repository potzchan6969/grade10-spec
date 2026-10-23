**Author:** @tangconst - 2026-10-19

> Winner order setup opens with the payment step already filled: the first
> offered currency is selected where more than one is offered — and named,
> `Pay in {currency}`, where only one is — and the first payment method
> that currency offers is selected. This supersedes the "nothing preselected" call in
> `usd-lot-currency-winner-settlement-choice` Q2, which left the winner an
> empty picker before any rail showed.

## Why

An empty Pay in picker reads like an error state — no currency selected,
no payment options drawn — and hides every payment method behind a pick.
Preselecting the first offered currency shows the rails on open, and
preselecting the first offered method — card where a card fee rule
applies — lets a winner confirm the ordinary path without touching the
step at all. A winner paying another way still changes the selection; a
currency switch still clears a method the new currency does not offer.

## What Changes

- **The first offered currency is the default settlement currency** —
  where USD and HKD are both offered, USD is selected when the step
  opens; where one currency is offered, it is fixed and the choice names
  it, `Pay in {currency}`, with no picker.
- **The first offered method is preselected** — card where the currency
  has a card fee rule, else the first bank rail the currency offers. The
  winner still confirms explicitly; preselection is not confirmation.
- **A confirmation with no currency or no method is still refused** —
  preselection changes the opening state, not the validation.
- **Bank rails read no fee line at the choice** — `Bank fee set on your
  invoice` is removed; no fee is required for those options. Card keeps
  its configured fee wording.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — the settlement currency and
  payment method choices open preselected.
- `grade10-admin/auction/test-winners` — a test winner's order opens setup
  with the first offered currency and its first offered method
  preselected.

## Impact

- `apps/preview`'s Complete Order Setup dialog already draws this:
  `Pay in` preselects the first offered currency, a single offered
  currency reads `Pay in {currency}` with no picker, and the first
  offered method is checked.
- `grade10` applies the same defaults where the real Winner Order opens
  setup. No `AuctionWinnerOrder` contract change: the dialog is preview
  and application code, not the shared block.

## References

- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
- [Post-Bidding · Payment Methods by Currency](../../../docs/prds/products/grade10-site/auction/post-bidding.md#payment-methods-by-currency)
