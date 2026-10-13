**Author:** @ecchochan - 2026-09-14

## Why

The reward editor on staging (`admin.grade10-stg.com/rewards/new`) does
everything the approved design mock ([`mock.html`](mock.html)) does, but it
looks and reads differently. The kind is a radio list with two options, short
choices are radio rows, money fields put the currency after the amount, and
the preview rail is one flat card. A free item, the most common physical
reward, has no choice of its own: the operator finds `Everything (free)` under
Money off, then Named variants, then picks one.

## What Changes

- **Kind** - three cards: Money off, Free item, Gift with a purchase. A free
  item is one variant at 100% off, saved as the same coupon Money off saves,
  and a stored reward of that shape opens as a free item
- **Short choices** - discount, scope, channels, stock and window are
  segmented controls, on every admin page that lays a choice across the line
- **Money fields** - the currency, `HKD`, sits in front of the amount, on
  every admin page
- **Grade10 admin theme** - the mock's type, heading sizes, corner radii and
  status tints, on every Grade10 admin page
- **Preview rail** - the menu card with its points and Redeem pill, the coupon
  sentence with its values in bold, and the basket check as a foldable section
  with a tinted verdict
- **Page** - a `← Rewards` link above the title and a save bar pinned to the
  bottom
- **Copy** - the mock's words, except where staging's carry a rule the mock
  lacks: a coupon never adds the item to the basket, and named products are
  online-only too
- **Online only by product or filter** - the till refuses such a coupon from
  the member's own phone, as it already does from the panel, and the member's
  reward menu says online only before the points go
- **Stored rewards** - the requirement states what staging already does: a
  reward stored with a retired handover keeps it until the operator makes one
  of the three choices

Everything staging already does stays: the searchable facet picker, adding
basket lines by search, Duplicate and Archive on the edit page, and
`Everything (free)` on any scope.

## Non-Goals

The goals, the non-goals and the decisions behind them are in
[`decisions.md`](decisions.md).

## Capabilities

### Modified Capabilities

- `grade10-site/loyalty/programme`:
  - "A reward names a kind, a discount and a scope" states the maximum
    discount as optional, as the console already saves it, and a scope of
    named products or a catalog filter as good online only, whatever channels
    the coupon names: the console and the till's panel already hold it, the
    member's reward menu now states it before the points go, and the till now
    refuses such a coupon however it reaches the sale, by either of the two
    ways "A redemption settles as a coupon" lets a coupon reach a counter sale
  - "The console's reward form authors a reward's full definition" offers a
    free item as its own choice, and reopens a stored reward of that shape as
    one; it also states what the form already does: it saves nothing with a
    part missing, checks a coupon against a basket, and keeps a reward stored
    with a retired handover, a manual handover or a counter collection, as it
    is
  - The feature set states settlement as a coupon, the till scope and the
    reward form

## Impact

- **Console package** (`packages/frontend-console`, grade10) - `ChoiceList`
  draws segmented and card appearances and drops `horizontal`; `MoneyField`
  puts the currency first; headings, panels, the rail layout and a
  `Disclosure` word change. `Filter` is removed; its eight callers move to a
  segmented `ChoiceList` with a hidden label. No `@grade10/design-system` or
  `@grade10/ui` export changes
- **Admin theme and root** (`packages/frontend-admin-theme`,
  `apps/admin/grade10`, grade10) - type, sizes, radii and tints; the font is
  loaded
- **Reward editor** (`packages/loyalty/admin-frontend`, grade10) - choices,
  the free item draft, the rail, the save bar and the copy
- **Online only at the till** (`packages/loyalty/contracts`,
  `packages/loyalty/backend`, `packages/grade10-store/backend`, grade10) - the
  programme's channel guard refuses the till for a scope it cannot match, and
  the console form, the till panel and the member's reward menu read the same
  rule
- **Call sites** - appointment dialogs, loyalty views and the admin test pages
  move off `horizontal`; the ZZZ admin's shared headings follow
- **End-to-end suite** - `apps/frontend/grade10/e2e/tests/loyalty/rewards.spec.ts`
  creates and reopens a free item, and reads a product-scoped reward online
  only on the member's menu; `e2e/tests/pos/presented-coupon.spec.ts` refuses
  that coupon from the member's own phone
- **Depends on never-lock-a-coupon** - never-lock modifies "A redemption
  settles as a coupon", so this change leaves that requirement alone, since
  the store refuses two in-flight changes folding one requirement. Its
  scenarios *A coupon reaches the counter by the member presenting it* and
  *Staff apply a member's coupon from the till session* name any product
  coupon, and this change's "A reward names a kind, a discount and a scope"
  takes a coupon scoped to named products or a catalog filter out of both
  ways into a counter sale. It is accepted after never-lock with no edit to
  it. Rebased onto it, the till row on Coupons · Applying One keeps both
  facts: a scope the till can match, and a gift going on as its own line

## Success

- An operator creating a free item makes two choices (Free item, one
  variant), where staging takes four
- No member spends points on a reward scoped to named products or a catalog
  filter without reading it as online only, and no till sale takes its coupon

## Follow-on Changes

- **Choices announced as one** - a form's choices are announced as one
  choice, whatever their appearance
- **Console export list** - "The console package exports" on
  `shared/console/blocks` names what the package exports, `ChoiceList` and
  `Disclosure` included, and no longer `Filter`
- **Reward editor structure** - one catalogue picks object, a rail that takes
  its words and a basket slot, and the editor emitting its own save command
- **Console words in their own files** - `vocabulary.tsx` split at its seams,
  with the Select create-option note corrected
- **Fields that take an id and a read-only form** - in place of wrapper divs
  and a `disabled` on every control
- **Button `outline`** - kept or dropped, now that the Grade10 secondary button
  draws the same
- **Admin end-to-end pages on the page fixture** - so every admin spec keeps a
  capture per step
- **Presenting only what the till takes** - the member's coupon list offers a
  counter only the coupons good in store; today it offers every coupon, and
  the till answers an online-only one with a bare refusal

## Bugs Found

Each is a `fix` commit through `/fix-bug`, not a change.

- **A pinned rail taller than the screen** - its bottom cannot be reached
  before the form ends
- **The checkout test bench's gift** - loses the product handle it was picked
  with
- **The users directory on a phone** - an open account panel runs past the
  screen's edge, because its column keeps a 28rem minimum
- **A reward whose handover issues no coupon** - one created with no
  handover named, which the admin API saves as a manual handover, or one
  already stored as a manual handover, redeems with nothing to spend, against
  "A redemption settles as a coupon, whatever the reward" (grade10
  `packages/loyalty/backend/src/services/rewards/catalog.ts:182`,
  `fulfiller.ts:46`, `:61-62`). The fix refuses a create with no coupon
  definition and refuses redeeming a stored manual handover until it is given
  a coupon definition, with a regression test for each. A counter collection
  is not affected, since its redemption mints a 100% coupon for its variant

## Archive

@ecchochan archives once grade10 deploys this to production.

## References

- [Rewards · Reward Types](../../../docs/prds/products/grade10-site/loyalty/rewards.md#reward-types)
- [Operator Console · Authoring a Reward](../../../docs/prds/products/grade10-site/loyalty/operator-console.md#authoring-a-reward)
- [Coupons · Validity](../../../docs/prds/products/grade10-site/loyalty/coupons.md#validity)
- [Rewards · Reward Shop](../../../docs/prds/products/grade10-site/loyalty/rewards.md#reward-shop)
- [Coupons · Refusals](../../../docs/prds/products/grade10-site/loyalty/coupons.md#refusals)
