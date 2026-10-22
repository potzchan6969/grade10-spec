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

# Cluster Reconciliation - Bid Increments

Written 2026-10-22 for `configure-auction-bid-increments`. The cluster is the two open changes that edit `grade10-site/auction/bid-increments`; this change is the first accepted, so the sheet sits here. No validator reads this sheet and acceptance does not hash it.

## Ownership

| Requirement | Owner | What the others say |
| --- | --- | --- |
| bid-increments "Grade10 owns the supported-currency schedules" | `configure-auction-bid-increments` owns the rule-and-configuration text: the schedule is configuration, a tier from 0, ascending tiers, positive increments, an unbounded last tier, and no literal tier table | `usd-lot-currency-winner-settlement-choice` (accepted) modified it with a six-row USD table; its sentence "Grade10 SHALL price Auction listings only in `USD`", the removal of the HKD and JPY schedules and the `SC-01` title note are copied unchanged into ours |
| bid-increments "The minimum uses the amount being beaten" | `configure-auction-bid-increments` owns the rule text and `SC-07`, `SC-12` (value-free, `rev` 3), and `SC-27` (new) | `usd-lot-currency-winner-settlement-choice` quotes `SC-07` as 805000 at 800000 and `SC-12` as 100 minor units; ours rewrites both and bumps `rev` |
| bid-increments scenarios `SC-01`, `SC-02`, `SC-03`, `SC-04` | `configure-auction-bid-increments` (value-free text, `rev` 3) | `usd-lot-currency-winner-settlement-choice` carries `SC-01` at `rev` 2 and quotes 10000 to 10500 and 12000 in `SC-02` to `SC-04` at `rev` 1; ours is above each |
| bid-increments "Every lot is bid in USD and no other currency stays" and its USD-only settlement content | `usd-lot-currency-winner-settlement-choice` (ADDED) | `configure-auction-bid-increments` restates the requirement with its text copied, keeps `SC-14` unchanged, and rewrites only `SC-13`, whose 805000 follows the old tiers (`rev` 2) |
| `SC-05` | both, one text | The same text in both; no `rev` bump (`rev` 2) |
| grade10-admin/auction/listing "Prices and window are writable before publish" | `configure-auction-bid-increments` edits the starting-price line only (Q17: a draft save, create or update with cents is refused) and adds `SC-221` and `SC-222` | `usd-lot-currency-winner-settlement-choice` (accepted) also modifies the requirement; ours copies its text and edits one line, so it states against the folded text. No other open change edits this requirement |
| feature-tcs cases `TC-2ed`, `TC-0lh`, `TC-sze` | `configure-auction-bid-increments` at `rev` 2 | `usd-lot-currency-winner-settlement-choice` carries `TC-2ed` and `TC-sze` at `rev` 1; `TC-0lh` is not in its suite |
| feature-tcs cases `TC-kyx`, `TC-y0l`, `TC-fdc`, `TC-pn8` | `usd-lot-currency-winner-settlement-choice` | `configure-auction-bid-increments` no longer reuses these ids for other cases; its new cases take `US1-TC9` to `US1-TC20` and `US3-TC5` to `US3-TC7` |
| feature-tcs cases `TC-5ez`, `TC-n6d`, `TC-9do` (durable `US1-TC4`, `US1-TC6`, `US1-TC7`) | `configure-auction-bid-increments` at `rev` 2, 4 and 5 | Restyled to whole dollars (Q9) above the durable `rev` 1, 3 and 4, which the sibling's fold carries for `TC-n6d` and `TC-9do`; back to `draft` |

## Decisions

- Q15 of `configure-auction-bid-increments`: ours `depends_on` this change, so this one archives first and ours states MODIFIED against its folded text. The product manager asked for this order.
- The two changes are reconciled, not merged: each keeps its own scope, acceptance and verdict.
- This change's six-row USD table is replaced by the configuration in ours. Until ours archives, the durable text carries this table; the product manager accepted that order.
- Ours leaves `auto-bidding`, `bidding-history`, `auction`, `account-record` and `internal-bid` without a delta (Q14); this change's deltas to `auto-bidding` and `internal-bid` quote the same example amounts and are not touched.
- Open ❓ and conflicts: none.

## Order

1. `usd-lot-currency-winner-settlement-choice` (accepted)
2. `configure-auction-bid-increments`
