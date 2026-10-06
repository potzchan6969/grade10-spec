## Goals

- An operator creates a free item in two choices: Free item, then one variant.
- The reward editor, the rewards list and every Grade10 admin page take the
  approved mock's controls, type and words.
- Nothing staging's editor can do is lost.

## Non-Goals

- What a coupon takes off, or what saving sends to the backend.
- A new theme for the ZZZ admin: it keeps Stone, and the shared controls take
  their new shape wherever it renders them.
- How a table cell writes an amount.
- A dark admin: the brand states light only.
- Thumbnails in the picked list: the catalogue search carries no image.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does an operator author a free item? | Free item is its own choice: one variant at 100% off with no maximum discount, saved as the product coupon Money off saves - the proposal, @ecchochan, 2026-09-14 | `Everything (free)` under Money off, then Named variants, then a variant — four choices for the most common physical reward |
| Q2 | Which choice does a stored reward open on? | A product coupon at 100%, with no maximum discount, scoped to exactly one variant opens as Free item, when opened and when duplicated; any other product coupon opens as Money off - the proposal, @ecchochan, 2026-09-14 | Opening on the choice that authored it — the coupon does not record it, and both choices save the same coupon |
| Q3 | Must a percentage carry a maximum discount? | No: the maximum discount is optional, as the console already saves it - the proposal, @ecchochan, 2026-09-14 | A percentage capped at a maximum discount, as the durable requirement read |
| Q4 | Where is a reward scoped to named products or a catalog filter good? | Online only: a sale at the till names its goods by variant alone. The console saves such a reward for online alone (grade10 `packages/loyalty/admin-frontend/src/features/programme/rewards/presentation/rewardCouponDraft.ts:153-166`), and the till shows the coupon as online only (`packages/grade10-store/backend/src/services/pos/sale/sale.ts:606-609`) - decided by the round at the acceptance review, 2026-10-06, from what runs. Whatever channels the coupon names, the till refuses it however it reaches the sale, from the panel or from the member's own phone - decided by the round at the acceptance re-review, 2026-10-06, from the page | Those scopes at the till as well — the till cannot tell which lines they match |
| Q5 | What mark sits in front of a money field? | ❓ PM - recommended: `HKD`, as built (grade10 `packages/frontend-console/src/MoneyField.tsx:103-104`): fields and console tables name the currency one way, the accessible name stays `Amount HKD`, and no code changes | `HK$`, as the mock draws it, taken from `Intl.NumberFormat` `formatToParts`; the accessible name follows the mark, and `MoneyField` changes in grade10 |
| Q6 | Does the designer accept the departures from the mock in `ui-design.md`'s Differences From the Mock? | ❓ design - recommended: confirm each as written; the dark badge text stands either way, since the mock's status text on its tint reads 3.2:1 and 2.4:1 against the 4.5:1 small text needs | Overriding any item — each is built, and reversing one is grade10 work |
| Q7 | Which channels does the form show for a reward scoped to named products or a catalog filter that is stored for the till as well, and what does saving it unchanged save? | Online chosen, with In store and Both unavailable; saving it unchanged saves it for online alone, and moving its scope to named variants or the whole order shows the channels it was stored with again. The form keeps the stored channels and shows the effective ones (grade10 `packages/loyalty/admin-frontend/src/features/programme/rewards/presentation/views/CouponTermsFields.tsx:62-63`, `rewardCouponDraft.ts:162-166`) - decided by the round at QA2, 2026-10-06, from what runs | Rewriting the channels to online when the reward opens, which loses the stored channels if the operator moves the scope back |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | Acceptance review: the console and the till hold a reward scoped to named products or a catalog filter to online only, and no page or requirement says so | Q4 |
| grade10-site/loyalty/programme | Acceptance review: the mock draws `HK$` in front of a money field, and the build draws `HKD` | ❓ Q5, for @ecchochan |
| grade10-site/loyalty/programme | Acceptance review: engineering decided the departures from the approved mock, and no designer has confirmed them | ❓ Q6, for the designer |
| grade10-site/loyalty/programme | Acceptance re-review: a coupon scoped to named products or a catalog filter and stored for the till passes the programme's guard when the member presents it from their own phone, since the guard reads its channels alone | Q4 |
| grade10-site/loyalty/programme | QA1 blind pass: a reward scoped to named products or a catalog filter can already name the till, saved through the admin API or before the online-only rule. Which channels does the form show when it reopens, and does saving it unchanged make it online only? | Q7 |
