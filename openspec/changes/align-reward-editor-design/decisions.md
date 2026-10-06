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
- Whether a free item spent online ships free or is collection only:
  Product's ❓ on Rewards · Using a Reward.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does an operator author a free item? | Free item is its own choice: one variant at 100% off with no maximum discount, saved as the product coupon Money off saves - the proposal, @ecchochan, 2026-09-14. Stated on Operator Console · Authoring a Reward, the Free item line, and in "The console's reward form authors a reward's full definition" | `Everything (free)` under Money off, then Named variants, then a variant — four choices for the most common physical reward |
| Q2 | Which choice does a stored reward open on? | A product coupon at 100%, with no maximum discount, scoped to exactly one variant opens as Free item, when opened and when duplicated; any other product coupon opens as Money off - the proposal, @ecchochan, 2026-09-14. Stated on Operator Console · Authoring a Reward, the Free item line, and in "The console's reward form authors a reward's full definition" | Opening on the choice that authored it — the coupon does not record it, and both choices save the same coupon |
| Q3 | Must a percentage carry a maximum discount? | No: the maximum discount is optional, as the console already saves it - the proposal, @ecchochan, 2026-09-14. Stated on Rewards · Reward Types and in "A reward names a kind, a discount and a scope" | A percentage capped at a maximum discount, as the durable requirement read |
| Q4 | Where is a reward scoped to named products or a catalog filter good? | Online only, whatever channels the coupon names: a sale at the till names its goods by variant alone. The console saves such a reward for online alone (grade10 `packages/loyalty/admin-frontend/src/features/programme/rewards/presentation/rewardCouponDraft.ts:153-166`), and the till's panel shows it as online only (`packages/grade10-store/backend/src/services/pos/sale/sale.ts:606-609`), where staff cannot apply it (`integrations/shopify-pos/grade10/src/acts/view.ts:221`). The till also refuses it from the member's own phone, and the member's reward menu states it as online only before the points go; these two are still to build, since the programme's guard and the menu read the stored channels alone (`packages/loyalty/contracts/src/couponGuard.ts:14`) - the acceptance review, 2026-10-06, from what runs and from the page. Stated on Rewards · Reward Types and Reward Shop, Coupons · Validity and Applying One, Operator Console · Authoring a Reward, and in "A reward names a kind, a discount and a scope" | Those scopes at the till as well — the till cannot tell which lines they match |
| Q5 | What mark sits in front of a money field? | ❓ PM - recommended: `HKD`, as built (grade10 `packages/frontend-console/src/MoneyField.tsx:103-104`): fields and console tables name the currency one way, the accessible name stays `Amount HKD`, and no code changes | `HK$`, as the mock draws it, taken from `Intl.NumberFormat` `formatToParts`; the accessible name follows the mark, and `MoneyField` changes in grade10 |
| Q6 | Does the designer accept each departure from the mock in `ui-design.md`'s Differences From the Mock, the retired handover's note among them? | ❓ design - recommended: confirm each as written; the dark badge text stands either way, since the mock's status text on its tint reads 3.2:1 and 2.4:1 against the 4.5:1 small text needs | Overriding named items - each override is a new grade10 task under group 4, and US9-TC11 runs again |
| Q7 | Which channels does the form show for a reward scoped to named products or a catalog filter that is stored for the till as well, and what does saving it unchanged save? | Online chosen, with In store and Both unavailable; saving it unchanged saves it for online alone, and moving its scope to named variants or the whole order shows the channels it was stored with again. The form keeps the stored channels and shows the effective ones (grade10 `packages/loyalty/admin-frontend/src/features/programme/rewards/presentation/views/CouponTermsFields.tsx:62-63`, `rewardCouponDraft.ts:162-166`) - decided by the round at QA2, 2026-10-06, from what runs. Stated on Operator Console · Authoring a Reward, the Online only by product or filter line, and in "A reward names a kind, a discount and a scope" | Rewriting the channels to online when the reward opens, which loses the stored channels if the operator moves the scope back |
| Q8 | What does the form do with a reward stored with a handover the programme has retired - a manual handover or a counter collection? | It opens with no choice made and keeps that handover, unchanged, while the fields beside it are edited, and a duplicate of it opens as Money off (grade10 `packages/loyalty/admin-frontend/src/features/programme/rewards/presentation/rewardCouponDraft.ts:46-53`, `:193-201`) - decided by the round at the acceptance review of the rebased change, 2026-10-06, from what runs. Once the operator makes one of the three choices, it saves as that choice (`views/RewardEditor.tsx:275`, `rewardCouponDraft.ts:500-507`) - decided by the round at QA2 of the rebased change, 2026-10-06, from what runs. A kind is the coupon's, a product coupon or a gift; a handover is how the reward reaches the member (grade10 `packages/loyalty/contracts/src/schemas.ts`, `fulfillmentConfigSchema`). Stated on Operator Console · Authoring a Reward, the Retired handovers line, and in "The console's reward form authors a reward's full definition" | Opening it as Money off, which rewrites how the reward is handed over on its next save |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/loyalty/programme | Acceptance review: the console and the till hold a reward scoped to named products or a catalog filter to online only, and no page or requirement says so | Q4 |
| grade10-site/loyalty/programme | Acceptance review: the mock draws `HK$` in front of a money field, and the build draws `HKD` | ❓ Q5, for @ecchochan, and ❓ **Currency mark** on Operator Console · Authoring a Reward |
| grade10-site/loyalty/programme | Acceptance review: engineering decided the departures from the approved mock, and no designer has confirmed them | ❓ Q6, for the designer, and ❓ **Departures from the mock** on Operator Console · Authoring a Reward |
| grade10-site/loyalty/programme | Acceptance re-review: a coupon scoped to named products or a catalog filter and stored for the till passes the programme's guard when the member presents it from their own phone, since the guard reads its channels alone | Q4 |
| grade10-site/loyalty/programme | QA1 blind pass: a reward scoped to named products or a catalog filter can already name the till, saved through the admin API or before the online-only rule. Which channels does the form show when it reopens, and does saving it unchanged make it online only? | Q7 |
| grade10-site/loyalty/programme | Acceptance review of the rebased change: the member's reward menu names a coupon's channel only where its stored channels name one, so a reward scoped to named products and stored for both reads as good everywhere | Q4 |
| grade10-site/loyalty/programme | Acceptance review of the rebased change: "A redemption settles as a coupon" lets any coupon reach a counter sale, against the till refusing a scope it cannot match | Q4 |
| grade10-site/loyalty/programme | Acceptance review of the rebased change: the form keeps a reward stored with a retired handover, a manual handover or a counter collection, and no page or requirement says so | Q8 |
| grade10-site/loyalty/programme | QA2 of the rebased change: the form saves a reward stored with a retired handover as the choice the operator makes on it, and no page or requirement says so | Q8 |
| grade10-site/loyalty/programme | Third acceptance review: never-lock-a-coupon's *A coupon reaches the counter by the member presenting it* and *Staff apply a member's coupon from the till session* give a till sale the cut of any product coupon, against the till refusing a scope it cannot match | Q4 |
