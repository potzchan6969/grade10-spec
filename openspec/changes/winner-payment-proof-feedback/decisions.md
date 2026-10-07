## Goals

- Give the winner a clear success acknowledgement when proof upload lands:
  toast plus Payment Verifying surface.
- Keep a failed upload recoverable: nothing stored, draft kept, dialog open.
- Stop leave from racing submit or HEIC conversion.

## Non-Goals

- A second confirm screen or nested confirm dialog for irreversible submit.
- Replacing dirty-leave `window.confirm` in preview with an in-product dialog.
- Changing file-reject toast copy (too many / too large / type / HEIC).
- Folding this into `add-winner-how-to-pay-rails` (bank-rail chrome, not proof
  acknowledgement).
- Disabling Submit until the form is valid (validate on attempt stays).

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Scope of the interaction gap? | Whole modal journey (open → done or abandon) | Toast-only leaf |
| Q2 | What must success feel like? | Toast and Payment Verifying surface | Toast only, or surface only |
| Q3 | Who fires the success toast? | Shared preview helper; page owns status flip | Page-only or dialog-only toast |
| Q4 | Confirm step shape? | Inline irreversible microcopy | Two-step review, or post-click confirm dialog |
| Q5 | Submit fails part-way? | Stay open, keep draft, error toast | Close and error, or clear draft |
| Q6 | Leave while submitting? | Block leave until the beat finishes | Confirm-and-cancel in flight |
| Q7 | Success toast copy? | **Proof submitted** / **We'll verify your payment shortly.** | Rewrite |
| Q8 | Product truth for the toast? | PRD + OpenSpec delta | Preview-only |
| Q9 | Invalid form + Submit? | Stay enabled; validate on attempt | Disable until ready |
| Q10 | HEIC converting? | Lock the whole form | Fields editable while converting |
| Q11 | Failure toast copy? | **Proof not submitted** / **Nothing was saved. Try again.** | Connection-only wording |
| Q12 | Leave while converting? | Block leave (same as submit) | Leave with dirty confirm |
| Q13 | File-reject toasts? | Keep current | Reopen copy |
| Q14 | OpenSpec vehicle? | New change `winner-payment-proof-feedback` | Fold into how-to-pay rails |
| Q15 | Preview submit failure? | Story that forces failure | Spec-only until app |
| Q16 | Dirty leave (not busy)? | Keep preview `window.confirm` | In-product confirm now |
| Q17 | Proof toast localization? | Add localized entries for English, Simplified Chinese and Traditional Chinese | Keep consumer copy English-only |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/winner-order` | Who fires the success toast — page, dialog, or shared helper? | Q3 |
| `grade10-site/auction/winner-order` | Confirm as second screen or inline microcopy? | Q4 |
| `grade10-site/auction/winner-order` | Leave while submitting? | Q6 |
| `grade10-site/auction/winner-order` | Leave while converting HEIC? | Q12 |
| `grade10-site/auction/winner-order` | Failure toast copy and stay-open behaviour? | Q5 |
| `grade10-site/auction/winner-order` | Failure toast wording | Q11 |
| `grade10-site/auction/winner-order` | Localize proof success and failure toasts? | Q17 |
