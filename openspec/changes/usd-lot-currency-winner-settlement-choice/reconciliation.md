# Cluster Reconciliation - HKD Settlement Requirements

Written 2026-10-22 for `convert-hkd-order-at-subtotal`. No validator reads this sheet and acceptance does not hash it.

## Ownership

| Requirement | Owner | What the others say |
| --- | --- | --- |
| winner-order "The winner chooses a settlement currency at order setup" | `usd-lot-currency-winner-settlement-choice` (accepted) | `preselect-first-currency-payment-method` modifies the preselection; `convert-hkd-order-at-subtotal` does not modify it; durable SC-301 (the replaced invoice's amounts) is restated by a follow-up amendment after `preselect-first-currency-payment-method` lands |
| winner-order HKD conversion, Order Summary, Invoice fields, documents | `usd-lot-currency-winner-settlement-choice` (accepted) | `convert-hkd-order-at-subtotal` replaces the per-line rule, the all-HKD summary and the HKD-only documents rule |
| post-sale "The quote is typed in USD and read in the settlement currency", reissue, invoice history | `usd-lot-currency-winner-settlement-choice` (accepted) | `convert-hkd-order-at-subtotal` changes the preview, the reissue preview and the history lines; `add-winner-order-tax-line` and `complete-auction-post-sale` (both accepted) share the quote and fee text |
| internal-bid "An internal bidder wins a lot the house leads at its close" | `add-auction-internal-bid` (accepted) | `convert-hkd-order-at-subtotal` moves one scenario's total from 103100 to 103000 |
| notifications-order "Order letters read the currency the winner pays in" | `usd-lot-currency-winner-settlement-choice` (accepted) | `convert-hkd-order-at-subtotal` lets a letter that lists lines list them as the invoice does; branch `plan/usd-amounts-rebased` adds a US$ paragraph |

## Decisions

- `order-summary-hkd-conversion-note` is retracted (`8c72436d7`); its one surviving rule, that the note under the Subtotal is the only place that names the rate, is stated in the winner-order delta of `convert-hkd-order-at-subtotal`.
- `convert-hkd-order-at-subtotal` leaves "The winner chooses a settlement currency at order setup" to `preselect-first-currency-payment-method`; SC-301's stale HKD amounts wait for a follow-up amendment.
- `plan/usd-amounts-rebased` states HK$1,031.00 in one scenario; it restates it as HK$1,030.00 after this change is accepted.

## Order

1. `preselect-first-currency-payment-method` (unaccepted, independent of the subtotal rule)
2. `convert-hkd-order-at-subtotal`
3. `plan/usd-amounts-rebased`
