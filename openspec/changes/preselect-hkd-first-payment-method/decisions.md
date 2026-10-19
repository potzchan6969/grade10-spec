## Goals

- The payment step opens with a real selection the ordinary winner can
  confirm as-is: HKD where both currencies are offered, and the first
  method that currency offers.
- A single-currency order reads `Pay in {currency}` and shows no picker.

## Non-Goals

- Confirming for the winner; the winner still confirms the address, the
  currency and the method together.
- Changing what each currency offers, the fee wording at the choice, or
  the currency-switch rule — a switch still keeps only a method the new
  currency offers.
- The account address book; only the payment step's opening selection
  changes.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What is selected when the payment step opens? | HKD and the first method it offers — decided by @tangconst, 2026-10-19, superseding `usd-lot-currency-winner-settlement-choice` Q2's "nothing preselected" | Nothing selected, which hid every rail behind a currency pick; USD preselected, which is not the settlement currency Grade10 uses |
| Q2 | Which method is preselected? | The first the settlement currency offers — card where a card fee rule applies, else the first offered bank rail | Card always, even where the currency cannot take it |
| Q3 | What does a single-currency order show? | `Pay in {currency}` beside the label, no picker; the first offered method is preselected the same way | A one-entry picker, or the picker removed with the currency unnamed |
| Q4 | Does a currency switch re-preselect? | No — the keep-or-clear rule stands: a method the new currency offers stays; otherwise the choice clears and a confirmation with no method is refused | Re-preselecting on every switch, which would silently re-arm a method the winner just moved away from |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | Which currency opens selected? | Q1 |
| grade10-site/auction/winner-order | Which method opens selected? | Q2 |
